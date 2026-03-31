import { useRef, useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { getCurrentWindow, LogicalSize, PhysicalPosition } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioEngine } from '../hooks/useAudioEngine';
import type { AudioEngineState } from '../hooks/useAudioEngine';
import { usePermissionAlerts } from '../hooks/usePermissionAlerts';
import { useOrb } from '../hooks/useOrb';
import { useWaveform } from '../hooks/useWaveform';
import { ErrorBoundary } from './ErrorBoundary';
import { getStoredTheme, getWidgetAlwaysOnTop, getWidgetCompactMode, getWidgetOpacity, getWidgetPosition, setWidgetCompactMode, setWidgetPosition, WIDGET_POSITION_RESET_KEY, WIDGET_POSITION_X_KEY, WIDGET_POSITION_Y_KEY } from '../lib/widgetPreferences';

/**
 * Interface for the Floating Widget context.
 * Provides the shared audio state and UI state to all child components.
 */
interface WidgetContextProps extends AudioEngineState {
    compact: boolean;
    transcript: string;
    isProcessing: boolean;
    handleToggle: () => Promise<void>;
    handleModeSwitch: () => Promise<void>;
}

type TranscriptPayload = {
    text: string;
};

const WidgetContext = createContext<WidgetContextProps | undefined>(undefined);

/**
 * Custom hook to consume the WidgetContext.
 * @returns {WidgetContextProps} The widget context.
 * @throws Will throw an error if used outside of a WidgetProvider.
 */
const useWidgetContext = () => {
    const context = useContext(WidgetContext);
    if (!context) throw new Error("Component must be used within FloatingWidget");
    return context;
};

/**
 * Root Component for the Floating Widget.
 * Implements the Provider for the Compound Component pattern.
 * 
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child compound components
 * @returns {React.ReactElement} The rendered Provider wrapper.
 */
const FloatingWidgetRoot = ({ children }: { children: ReactNode }) => {
    const audioEngine = useAudioEngine();
    const [compact, setCompact] = useState(() => getWidgetCompactMode());
    const [transcript, setTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const resettingPositionRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    usePermissionAlerts({ enableToast: false });

    const getWidgetDimensions = useCallback((nextCompact: boolean) => {
        return nextCompact ? { width: 64, height: 64 } : { width: 264, height: 60 };
    }, []);

    const syncWindowSize = useCallback(async (nextCompact: boolean) => {
        const dimensions = getWidgetDimensions(nextCompact);
        await getCurrentWindow().setSize(new LogicalSize(dimensions.width, dimensions.height));
    }, [getWidgetDimensions]);

    const restoreStoredPosition = useCallback(async () => {
        const savedPosition = getWidgetPosition();
        if (!savedPosition) {
            return;
        }
        try {
            resettingPositionRef.current = true;
            await getCurrentWindow().setPosition(new PhysicalPosition(savedPosition.x, savedPosition.y));
        } catch (error) {
            console.warn('Failed to restore floating widget position:', error);
        } finally {
            resettingPositionRef.current = false;
        }
    }, []);

    const moveWidgetToSafeArea = useCallback(async (nextCompact: boolean) => {
        const dimensions = getWidgetDimensions(nextCompact);
        const scale = window.devicePixelRatio || 1;
        const margin = Math.round(24 * scale);
        const screenWidth = Math.max(Math.round(window.screen.availWidth * scale), margin + Math.round(dimensions.width * scale));
        const screenHeight = Math.max(Math.round(window.screen.availHeight * scale), margin + Math.round(dimensions.height * scale));
        resettingPositionRef.current = true;
        const nextPosition = setWidgetPosition({
            x: Math.max(margin, screenWidth - Math.round(dimensions.width * scale) - margin * 2),
            y: Math.max(margin, screenHeight - Math.round(dimensions.height * scale) - margin * 2),
        });

        try {
            await getCurrentWindow().setPosition(new PhysicalPosition(nextPosition.x, nextPosition.y));
        } catch (error) {
            console.warn('Failed to reset floating widget position:', error);
        } finally {
            resettingPositionRef.current = false;
        }
    }, [getWidgetDimensions]);

    const syncCompactState = useCallback(async (nextCompact: boolean) => {
        setCompact(nextCompact);
        setWidgetCompactMode(nextCompact);
        try {
            await syncWindowSize(nextCompact);
        } catch (error) {
            console.warn('Failed to sync floating widget compact state:', error);
        }
    }, [syncWindowSize]);

    const { isRecording, isProcessingFinal, startRecording, stopRecording } = audioEngine;

    const handleToggle = useCallback(async () => {
        setIsProcessing(false);
        if (isRecording) {
            const recording = await stopRecording();
            await syncCompactState(recording);
        } else {
            setTranscript("");
            const recording = await startRecording();
            await syncCompactState(recording);
        }
    }, [isRecording, startRecording, stopRecording, syncCompactState]);

    const handleModeSwitch = useCallback(async () => {
        const next = !compact;
        await syncCompactState(next);
    }, [compact, syncCompactState]);

    // Native DOM mousedown handler for window dragging
    // Bypasses React synthetic events and framer-motion to guarantee startDragging works
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;
            if ((e.target as HTMLElement).closest('.click-zone')) return;
            e.preventDefault();
            e.stopPropagation();
            console.log('[SLOERVOICE-WIDGET] Native mousedown → startDragging()');
            getCurrentWindow().startDragging().catch((err: unknown) =>
                console.error('[SLOERVOICE-WIDGET] startDragging failed:', err)
            );
        };

        el.addEventListener('mousedown', onMouseDown, true);
        return () => el.removeEventListener('mousedown', onMouseDown, true);
    }, []);

    // Keep widget in orb mode during processing, switch back to pill when done
    useEffect(() => {
        if (!isProcessingFinal && !isRecording) {
            // Processing finished and not recording — switch to pill mode
            const timeout = setTimeout(() => {
                void syncCompactState(false);
            }, 600);
            return () => clearTimeout(timeout);
        }
    }, [isProcessingFinal, isRecording, syncCompactState]);

    // Sync shortcuts from widget window on mount (don't depend on main window)
    useEffect(() => {
        const syncShortcuts = async () => {
            try {
                const { invoke } = await import('@tauri-apps/api/core');
                const saved = localStorage.getItem('sloervoice_shortcuts');
                let keys = ['Control', 'Space'];
                if (saved) {
                    try {
                        const shortcuts = JSON.parse(saved) as Array<{ id: string; keys: string[] }>;
                        const ptt = shortcuts.find(s => s.id === 'ptt');
                        if (ptt?.keys?.length) keys = ptt.keys;
                    } catch { /* use defaults */ }
                }
                await invoke('update_shortcuts', { keys });
                console.log('[SLOERVOICE-WIDGET] Shortcuts synced:', keys);
            } catch (e) {
                console.warn('[SLOERVOICE-WIDGET] Failed to sync shortcuts:', e);
            }
        };
        void syncShortcuts();
    }, []);

    // Global listeners and settings synchronization
    useEffect(() => {
        let disposed = false;
        let cleanupFns: Array<() => void> = [];

        const setup = async () => {
            const listeners = await Promise.all([
                listen('global_shortcut_pressed', async () => {
                    console.log('[SLOERVOICE-WIDGET] global_shortcut_pressed received');
                    setIsProcessing(false);
                    setTranscript("");
                    const recording = await startRecording();
                    console.log('[SLOERVOICE-WIDGET] Recording started:', recording);
                    // Always switch to orb mode when recording starts
                    await syncCompactState(true);
                }),
                listen('global_shortcut_released', async () => {
                    console.log('[SLOERVOICE-WIDGET] global_shortcut_released received');
                    // Stop recording — backend will process and paste
                    // Don't switch to pill yet — let the processing effect handle it
                    await stopRecording();
                }),
                listen<TranscriptPayload>('partial_transcript', (e) => setTranscript(e.payload.text)),
                listen<boolean>('processing_final', (e) => {
                    setIsProcessing(e.payload);
                    if (!e.payload) setTimeout(() => setTranscript(""), 2500);
                })
            ]);

            if (disposed) {
                listeners.forEach((cleanup) => cleanup());
                return;
            }

            cleanupFns = listeners;
            console.log('[SLOERVOICE-WIDGET] All event listeners registered successfully');
        };

        void setup();

        return () => {
            disposed = true;
            cleanupFns.forEach((cleanup) => cleanup());
        };
    }, [startRecording, stopRecording, syncCompactState]);

    useEffect(() => {
        let disposed = false;
        let unlistenMoved: (() => void) | undefined;

        const applySettings = async (nextCompact = getWidgetCompactMode()) => {
            document.body.style.opacity = `${getWidgetOpacity().toFixed(2)}`;
            document.documentElement.setAttribute('data-theme', getStoredTheme());
            setCompact(nextCompact);
            try {
                await getCurrentWindow().setAlwaysOnTop(getWidgetAlwaysOnTop());
            } catch (error) {
                console.warn('Failed to apply widget always-on-top preference:', error);
            }
            try {
                await syncWindowSize(nextCompact);
            } catch (error) {
                console.warn('Failed to apply widget size preference:', error);
            }
        };

        const handleStorageSync = (event: Event) => {
            const storageEvent = event instanceof StorageEvent ? event : null;

            void (async () => {
                if (storageEvent?.key === WIDGET_POSITION_RESET_KEY) {
                    if (resettingPositionRef.current) {
                        return;
                    }

                    await moveWidgetToSafeArea(getWidgetCompactMode());
                    return;
                }

                if (storageEvent?.key === WIDGET_POSITION_X_KEY || storageEvent?.key === WIDGET_POSITION_Y_KEY) {
                    if (resettingPositionRef.current) {
                        return;
                    }

                    await restoreStoredPosition();
                    return;
                }

                await applySettings();
            })();
        };

        const setup = async () => {
            await applySettings();
            await restoreStoredPosition();

            const win = getCurrentWindow();
            if (typeof win.onMoved === 'function') {
                const cleanup = await win.onMoved(({ payload }) => {
                    if (!payload || resettingPositionRef.current) {
                        return;
                    }

                    window.localStorage.setItem(WIDGET_POSITION_X_KEY, `${Math.round(payload.x)}`);
                    window.localStorage.setItem(WIDGET_POSITION_Y_KEY, `${Math.round(payload.y)}`);
                });

                if (disposed) {
                    cleanup();
                    return;
                }

                unlistenMoved = cleanup;
            }
        };

        void setup();
        window.addEventListener('storage', handleStorageSync);
        window.addEventListener('sloervoice_theme_changed', handleStorageSync as EventListener);
        return () => {
            disposed = true;
            unlistenMoved?.();
            window.removeEventListener('storage', handleStorageSync);
            window.removeEventListener('sloervoice_theme_changed', handleStorageSync as EventListener);
        };
    }, [moveWidgetToSafeArea, restoreStoredPosition, syncWindowSize]);

    const contextValue: WidgetContextProps = {
        ...audioEngine,
        compact,
        transcript,
        isProcessing,
        handleToggle,
        handleModeSwitch
    };

    return (
        <WidgetContext.Provider value={contextValue}>
            <div
                ref={containerRef}
                data-audit-id="floating-widget-root"
                className="w-full h-full select-none flex items-center justify-center bg-transparent"
                onDoubleClick={handleModeSwitch}
            >
                <AnimatePresence initial={false}>
                    {children}
                </AnimatePresence>
            </div>
        </WidgetContext.Provider>
    );
};

/* ═══════════════════════════════════════════════════════════
   COMPOUND COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/**
 * Animated gradient border — uses box-shadow for glow (no layout overflow = no rectangle).
 * The conic-gradient background shows through as a 2px border around the pill/orb.
 */
const AnimatedBorder = ({ children, isRecording }: { children: ReactNode; isRecording: boolean }) => {
    return (
        <div
            className="rounded-full"
            style={{
                padding: 2,
                background: 'conic-gradient(from 90deg, #63f3ff, #f6c15f, #a855f7, #ec4899, #3b82f6, #10b981, #63f3ff)',
                animation: isRecording
                    ? 'sloervoice-hue-cycle 1.8s linear infinite'
                    : 'sloervoice-hue-cycle 5s linear infinite',
            }}
        >
            <div className="relative rounded-full overflow-hidden">
                {children}
            </div>
        </div>
    );
};

/**
 * Compact Mode wrapper (68x68 Orb).
 */
const CompactMode = ({ children }: { children: ReactNode }) => {
    const { compact, isRecording, handleToggle } = useWidgetContext();
    if (!compact) return null;
    return (
        <motion.div
            key="compact"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
        >
            <AnimatedBorder isRecording={isRecording}>
                <div
                    className="relative flex items-center justify-center"
                    style={{
                        width: 60, height: 60,
                        cursor: 'grab',
                        background: isRecording
                            ? 'linear-gradient(145deg, #101a28, #060a10)'
                            : 'linear-gradient(145deg, #14181f, #0a0d14)',
                    }}
                >
                    {/* Inner highlight ring */}
                    <div className="absolute inset-[2px] rounded-full pointer-events-none" style={{
                        border: isRecording ? '1px solid rgba(99,243,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
                    }} />
                    {/* Accent radial glow */}
                    <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                        background: isRecording
                            ? 'radial-gradient(circle at 50% 30%, rgba(99,243,255,0.12), transparent 60%)'
                            : 'radial-gradient(circle at 50% 25%, rgba(255,255,255,0.04), transparent 50%)',
                    }} />
                    {children}
                    <div
                        data-audit-id="widget-compact-toggle"
                        role="button"
                        tabIndex={0}
                        aria-label="Toggle Recording"
                        aria-pressed={isRecording}
                        onClick={handleToggle}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggle(); }}
                        className="click-zone absolute inset-[12px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </AnimatedBorder>
        </motion.div>
    );
};

/**
 * Normal Mode wrapper (268x64 Pill).
 */
const NormalMode = ({ children }: { children: ReactNode }) => {
    const { compact, isRecording } = useWidgetContext();
    if (compact) return null;
    return (
        <motion.div
            key="normal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
        >
            <AnimatedBorder isRecording={isRecording}>
                <div
                    className="relative overflow-hidden flex items-center"
                    style={{
                        width: 260, height: 56, cursor: 'grab',
                        borderRadius: 28,
                        background: isRecording
                            ? 'linear-gradient(135deg, #101a28, #060a10)'
                            : 'linear-gradient(135deg, #12161f, #0a0d14)',
                    }}
                >
                    {/* Inner highlight ring */}
                    <div className="absolute inset-[1px] pointer-events-none" style={{
                        borderRadius: 27,
                        border: isRecording ? '1px solid rgba(99,243,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
                    }} />
                    {/* Accent radial glows */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        borderRadius: 28,
                        background: isRecording
                            ? 'radial-gradient(ellipse at 15% 50%, rgba(99,243,255,0.1), transparent 40%), radial-gradient(ellipse at 85% 50%, rgba(246,193,95,0.08), transparent 40%)'
                            : 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03), transparent 50%)',
                    }} />
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-12 right-12 h-px pointer-events-none" style={{
                        background: isRecording
                            ? 'linear-gradient(90deg, transparent, rgba(99,243,255,0.3), rgba(246,193,95,0.25), transparent)'
                            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                    }} />
                    {children}
                </div>
            </AnimatedBorder>
        </motion.div>
    );
};

/**
 * Renders the pulsating SloerVoice Logo. Highly optimized for transparency.
 */
const Logo = () => {
    const { isRecording } = useWidgetContext();
    return (
        <div className="w-[46px] h-[46px] rounded-full overflow-hidden flex items-center justify-center z-10 pointer-events-none relative">
            <motion.div
                className="absolute inset-0 rounded-full"
                animate={isRecording ? { scale: [1, 1.18, 1], opacity: [0.28, 0.6, 0.28] } : { opacity: 0.2, scale: 1 }}
                transition={isRecording ? { repeat: Infinity, duration: 1.35, ease: 'easeInOut' } : { duration: 0.4 }}
                style={{ background: 'radial-gradient(circle, rgba(246,193,95,0.34) 0%, rgba(99,243,255,0.12) 45%, transparent 72%)' }}
            />
            <motion.img
                src="/logo.png"
                alt="SloerVoice Logo"
                className="w-full h-full object-contain pointer-events-none p-[5px] drop-shadow-md relative"
                animate={isRecording ? { scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] } : { scale: 1 }}
                transition={isRecording ? { repeat: Infinity, duration: 1.6 } : {}}
                style={{ filter: isRecording ? 'drop-shadow(0 0 12px rgba(99,243,255,0.72)) drop-shadow(0 0 18px rgba(246,193,95,0.42)) contrast(1.28) brightness(1.12)' : 'drop-shadow(0 0 8px rgba(246,193,95,0.22)) contrast(1.12) brightness(1.08)' }}
            />
        </div>
    );
};

/**
 * Renders the WebGL Orb visualizer in Compact Mode.
 */
const OrbVisualizer = () => {
    const { isRecording, isSpeaking, isProcessing, audioDataRef } = useWidgetContext();
    const orbCanvasRef = useOrb({ isRecording, isSpeaking, isProcessing, audioDataRef });
    return <canvas ref={orbCanvasRef} width={64} height={64} className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(0)' }} />;
};

/**
 * Renders the Waveform visualizer in Normal Mode.
 */
const WaveformVisualizer = () => {
    const { isRecording, isSpeaking, isProcessing, audioDataRef } = useWidgetContext();
    const waveCanvasRef = useWaveform({ isRecording, isSpeaking, isProcessing, audioDataRef });
    return <canvas ref={waveCanvasRef} width={168} height={36} className="pointer-events-none mt-1" style={{ transform: 'translateZ(0)' }} />;
};

/**
 * Renders the live Transcription text in Normal Mode.
 */
const Transcript = () => {
    const { transcript, isProcessing } = useWidgetContext();
    return (
        <div className="h-[18px] w-full flex items-center justify-center overflow-hidden mb-1 px-2">
            <AnimatePresence mode="wait">
                {(transcript || isProcessing) && (
                    <motion.span
                        key={transcript || "processing"}
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis px-3 py-1 rounded-full font-semibold opacity-90 text-white max-w-[170px]"
                        style={{
                            background: isProcessing ? 'rgba(246,193,95,0.14)' : 'rgba(99,243,255,0.1)',
                            border: isProcessing ? '1px solid rgba(246,193,95,0.18)' : '1px solid rgba(99,243,255,0.16)'
                        }}
                    >
                        {isProcessing ? "Finalizing transcript..." : transcript}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
};

/**
 * Renders the Timer or Status label in Normal Mode.
 */
const TimerPanel = () => {
    const { isRecording, elapsed } = useWidgetContext();
    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60); const secs = Math.floor(s % 60); const ms = Math.floor((s % 1) * 10);
        return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}.${ms}` : `${secs}.${ms}s`;
    };
    return (
        <div className="flex items-center justify-end w-24 pr-4 h-full pointer-events-none">
            <AnimatePresence mode="wait">
                {isRecording ? (
                    <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-end px-3 py-2 rounded-[18px] border"
                        style={{ background: 'rgba(99,243,255,0.08)', borderColor: 'rgba(99,243,255,0.16)' }}>
                        <div className="text-[12px] font-mono font-bold tracking-tight text-white tabular-nums">{formatTime(elapsed)}</div>
                        <motion.div animate={{ opacity: [1, 0.45, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-[8.5px] font-bold uppercase tracking-[0.18em] mt-0.5" style={{ color: '#63f3ff' }}>VOICE LIVE</motion.div>
                    </motion.div>
                ) : (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-end px-3 py-2 rounded-[18px] border"
                        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="text-[11px] font-bold tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.74)' }}>SloerVoice</div>
                        <div className="text-[8.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'rgba(246,193,95,0.72)' }}>Ready</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Export the Compound Component structure
export default function FloatingWidget() {
    return (
        <FloatingWidgetRoot>
            <CompactMode key="compact-mode">
                <ErrorBoundary>
                    <OrbVisualizer />
                </ErrorBoundary>
                <Logo />
            </CompactMode>
            <NormalMode key="normal-mode">
                <ToggleZone />
                <div className="flex-1 flex flex-col items-center justify-center gap-1 h-full pointer-events-none px-2 overflow-hidden">
                    <ErrorBoundary>
                        <WaveformVisualizer />
                    </ErrorBoundary>
                    <Transcript />
                </div>
                <TimerPanel />
            </NormalMode>
        </FloatingWidgetRoot>
    );
}

/**
 * Interactive toggle zone for Normal Mode
 */
const ToggleZone = () => {
    const { handleToggle, isRecording } = useWidgetContext();
    return (
        <div
            className="flex items-center justify-center h-full aspect-square transition-colors relative z-10 rounded-full click-zone outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            style={{
                cursor: 'pointer',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                background: isRecording ? 'radial-gradient(circle at 50% 38%, rgba(99,243,255,0.14), rgba(246,193,95,0.08) 52%, transparent 78%)' : 'radial-gradient(circle at 50% 38%, rgba(255,255,255,0.08), transparent 72%)'
            }}
            onClick={handleToggle}
            data-audit-id="widget-normal-toggle"
            role="button"
            tabIndex={0}
            aria-label="Toggle Recording"
            aria-pressed={isRecording}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggle(); }}
        >
            <Logo />
        </div>
    );
};

// Attach sub-components to the default export for the Compound Component pattern
FloatingWidget.Root = FloatingWidgetRoot;
FloatingWidget.Compact = CompactMode;
FloatingWidget.Normal = NormalMode;
FloatingWidget.Logo = Logo;
FloatingWidget.OrbVisualizer = OrbVisualizer;
FloatingWidget.WaveformVisualizer = WaveformVisualizer;
FloatingWidget.Transcript = Transcript;
FloatingWidget.TimerPanel = TimerPanel;

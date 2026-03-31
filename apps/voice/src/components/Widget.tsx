import { useState, useEffect, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   SloerVoice Dashboard Widget
   Connected to real audio telemetry + shortcuts
   ═══════════════════════════════════════════════════ */

const BAR_COUNT = 24;

type AudioTelemetryPayload = {
    volume?: number;
    is_speaking?: boolean;
};

type TranscriptPayload = {
    text: string;
};

/**
 * The standard Dashboard Widget component used in primary browser contexts.
 * Binds to real audio telemetry via Tauri to render a stylized waveform.
 * Supports recording state interactions, elapsed time formatting, and dynamic
 * transcript updates from backend models.
 * 
 * @returns {React.ReactElement} The rendered Widget interface.
 */
export default function Widget() {
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [barLevels, setBarLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0));
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleToggle = useCallback(async () => {
        try {
            const newState: boolean = await invoke('set_recording_state', { targetState: null });
            setIsRecording(newState);
            if (newState) {
                setElapsed(0);
                setTranscript("");
                timerRef.current = setInterval(() => setElapsed(p => p + 0.1), 100);
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
                setBarLevels(Array(BAR_COUNT).fill(0));
            }
        } catch {
            setIsRecording(prev => {
                const next = !prev;
                if (next) {
                    setElapsed(0);
                    setTranscript("");
                    timerRef.current = setInterval(() => setElapsed(p => p + 0.1), 100);
                } else {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setBarLevels(Array(BAR_COUNT).fill(0));
                }
                return next;
            });
        }
    }, []);

    // Listen to shortcut events — sync recording state from the floating widget
    useEffect(() => {
        const unlistenPress = listen('global_shortcut_pressed', () => handleToggle());
        return () => { unlistenPress.then(f => f()); };
    }, [handleToggle]);

    // Listen to real audio telemetry from the Rust backend
    useEffect(() => {
        let unlistenTelemetry: (() => void) | undefined;
        let unlistenTranscript: (() => void) | undefined;
        let unlistenFinal: (() => void) | undefined;

        const setup = async () => {
            unlistenTelemetry = await listen<AudioTelemetryPayload>('audio_telemetry', (event) => {
                const { volume = 0, is_speaking = false } = event.payload;
                setIsSpeaking(is_speaking);
                // Populate audioLevels array for the waveform bars
                const nextLevels = Array(BAR_COUNT).fill(0);
                for (let i = 0; i < BAR_COUNT; i++) {
                    const center = BAR_COUNT / 2;
                    const dist = Math.abs(i - center) / center;
                    nextLevels[i] = (volume * (1 - dist * 0.7)) + (Math.random() * volume * 0.3);
                }
                setBarLevels(nextLevels);
            });

            unlistenTranscript = await listen<TranscriptPayload>('partial_transcript', (event) => {
                setTranscript(event.payload.text);
            });

            unlistenFinal = await listen<boolean>('processing_final', (event) => {
                if (!event.payload) {
                    setTimeout(() => setTranscript(""), 3000);
                }
            });
        };

        setup();
        return () => {
            if (unlistenTelemetry) unlistenTelemetry();
            if (unlistenTranscript) unlistenTranscript();
            if (unlistenFinal) unlistenFinal();
        };
    }, []);

    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = Math.floor(s % 60);
        const ms = Math.floor((s % 1) * 10);
        return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}.${ms}` : `${secs}.${ms}s`;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            void handleToggle();
        }
    };

    // Dynamic bar heights based on real audio telemetry
    const getBarHeight = (i: number): string => {
        if (!isRecording) {
            // Idle breathing
            const center = BAR_COUNT / 2;
            const dist = Math.abs(i - center) / center;
            const base = 0.15 + (1 - dist) * 0.35;
            return `${base * 100}%`;
        }
        // Live audio
        const level = barLevels[i] || 0;
        const pct = Math.max(10, level * 100);
        return `${pct}%`;
    };

    return (
        <motion.div
            className="fixed bottom-5 right-5 z-50 select-none"
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20, delay: 0.5 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            {/* Outer Glow Ring */}
            <motion.div
                className="absolute -inset-3 rounded-[28px] pointer-events-none"
                animate={isRecording
                    ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }
                    : hovered ? { opacity: 0.4, scale: 1.02 } : { opacity: 0, scale: 1 }
                }
                transition={isRecording ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : { duration: 0.3 }}
                style={{
                    background: isRecording
                        ? 'radial-gradient(ellipse, rgba(255,60,20,0.4) 0%, rgba(255,0,80,0.15) 50%, transparent 70%)'
                        : 'radial-gradient(ellipse, rgba(255,120,0,0.3) 0%, transparent 70%)',
                }}
            />

            {/* Main Container */}
            <motion.div
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative cursor-pointer overflow-hidden rounded-2xl border"
                role="button"
                tabIndex={0}
                aria-label="Toggle Recording"
                aria-pressed={isRecording}
                data-audit-id="dashboard-widget-toggle"
                style={{
                    background: isRecording
                        ? 'linear-gradient(135deg, rgba(180,20,0,0.2) 0%, rgba(20,0,0,0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(40,20,0,0.3) 0%, rgba(10,5,0,0.95) 100%)',
                    borderColor: isRecording ? 'rgba(255,80,20,0.4)' : 'rgba(255,120,0,0.15)',
                    boxShadow: isRecording
                        ? '0 0 40px rgba(255,50,0,0.2), inset 0 1px 0 rgba(255,120,0,0.1)'
                        : '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,120,0,0.05)',
                }}
            >
                {/* Inner noise texture */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/bg-noise.png)', mixBlendMode: 'overlay' }} />

                <div className="relative flex items-center gap-3 px-4 py-3">
                    {/* Logo with nuclear glow */}
                    <motion.div
                        className="relative flex-shrink-0"
                        animate={isRecording
                            ? { rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }
                            : hovered ? { scale: 1.1 } : { scale: 1 }
                        }
                        transition={isRecording
                            ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                            : { type: "spring" as const, stiffness: 400, damping: 20 }
                        }
                    >
                        <img
                            src="/logo.png"
                            alt="SloerVoice"
                            className="w-7 h-7 object-contain relative z-10"
                            style={{
                                filter: isRecording
                                    ? 'drop-shadow(0 0 12px rgba(255,50,0,1)) drop-shadow(0 0 25px rgba(255,0,60,0.6))'
                                    : 'drop-shadow(0 0 8px rgba(255,100,0,0.7))',
                            }}
                        />
                        {/* Pulsing ring behind logo */}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={isRecording ? { scale: [1, 2.5], opacity: [0.5, 0] } : {}}
                            transition={isRecording ? { repeat: Infinity, duration: 1.2, ease: "easeOut" } : {}}
                            style={{ background: 'radial-gradient(circle, rgba(255,60,0,0.6) 0%, transparent 70%)' }}
                        />
                    </motion.div>

                    {/* ═══ Waveform Visualizer ═══ */}
                    <div className="flex items-center h-8 gap-[2px]">
                        {Array.from({ length: BAR_COUNT }).map((_, i) => {
                            const center = BAR_COUNT / 2;
                            const dist = Math.abs(i - center) / center;
                            const activeHeight = `${Math.max(15, (barLevels[i] || 0.1) * 100 + (1 - dist) * 18)}%`;
                            const activeDuration = 0.32 + (i % 5) * 0.05;
                            const idleDuration = 2 + (i % 6) * 0.22;

                            // Color gradient: orange center → magenta edges
                            const hue = 15 + dist * 30;
                            const sat = isRecording ? 100 : 80;
                            const light = isRecording ? 55 + (1 - dist) * 15 : 35 + (1 - dist) * 10;

                            return (
                                <motion.div
                                    key={i}
                                    className="rounded-full"
                                    style={{
                                        width: '2.5px',
                                        background: isRecording
                                            ? `hsl(${hue - dist * 25}, ${sat}%, ${light}%)`
                                            : `hsl(25, 60%, ${25 + (1 - dist) * 15}%)`,
                                        boxShadow: isRecording
                                            ? `0 0 6px hsla(${hue}, 100%, 50%, 0.5)`
                                            : 'none',
                                    }}
                                    animate={{
                                        height: isRecording && isSpeaking
                                            ? [getBarHeight(i), activeHeight, getBarHeight(i)]
                                            : [getBarHeight(i), getBarHeight(i), getBarHeight(i)],
                                    }}
                                    transition={isRecording && isSpeaking
                                        ? {
                                            repeat: Infinity,
                                            duration: activeDuration,
                                            ease: "easeInOut",
                                            delay: i * 0.01,
                                        }
                                        : {
                                            repeat: Infinity,
                                            duration: idleDuration,
                                            ease: "easeInOut",
                                            delay: i * 0.08,
                                        }
                                    }
                                />
                            );
                        })}
                    </div>

                    {/* ═══ Timer / Status ═══ */}
                    <AnimatePresence mode="wait">
                        {isRecording ? (
                            <motion.div
                                key="recording"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col items-end pl-1"
                            >
                                <span className="text-[13px] font-mono font-extrabold tabular-nums" style={{ color: '#ff4420', textShadow: '0 0 10px rgba(255,68,32,0.5)' }}>
                                    {formatTime(elapsed)}
                                </span>
                                <motion.span
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="text-[9px] font-bold uppercase tracking-widest"
                                    style={{ color: '#ff6030' }}
                                >
                                    ● REC
                                </motion.span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col items-end pl-1"
                            >
                                <span className="text-[11px] font-bold" style={{ color: 'rgba(255,140,40,0.6)' }}>
                                    SloerVoice
                                </span>
                                <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,140,40,0.3)' }}>
                                    Ready
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Transcript Display */}
                <AnimatePresence>
                    {transcript && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-2 overflow-hidden"
                        >
                            <div className="text-[11px] text-white/80 truncate max-w-[200px]">
                                {transcript}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom fire gradient line */}
                <motion.div
                    className="h-[2px] w-full"
                    animate={isRecording
                        ? { opacity: [0.6, 1, 0.6] }
                        : { opacity: hovered ? 0.5 : 0.2 }
                    }
                    transition={isRecording ? { repeat: Infinity, duration: 0.8 } : { duration: 0.3 }}
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,80,0,0.8), rgba(255,0,80,0.6), rgba(255,80,0,0.8), transparent)',
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

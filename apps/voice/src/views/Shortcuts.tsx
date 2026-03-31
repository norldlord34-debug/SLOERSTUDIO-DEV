import { motion } from 'framer-motion';
import { Mic, MicOff, Command, X, Shield, Sparkles, Activity, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

type ShortcutIconName = 'Mic' | 'MicOff' | 'Command' | 'X';

type ShortcutItem = {
    id: string;
    icon: ShortcutIconName;
    name: string;
    description: string;
    keys: string[];
    color: string;
    tier: string;
};

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
    { id: 'ptt', icon: 'Command', name: 'Global Widget Power', description: 'Hold to dictate through the floating widget and release to inject.', keys: ['Control', 'Space'], color: 'var(--status-info)', tier: 'Primary' },
    { id: 'cancel', icon: 'MicOff', name: 'Quick Cancel', description: 'Abort the current dictation before text is pasted into the target application.', keys: ['Escape'], color: 'var(--status-error)', tier: 'Safety' },
    { id: 'undo', icon: 'X', name: 'Undo Injection', description: 'Recover from the last paste event when a dictated command should be reverted.', keys: ['Alt', 'Z'], color: 'var(--status-warning)', tier: 'Recovery' },
];

const shortcutIcons: Record<ShortcutIconName, LucideIcon> = {
    Mic,
    MicOff,
    Command,
    X,
};

const KeyCap = ({ children }: { children: string }) => <span className="keycap">{children}</span>;

export default function Shortcuts() {
    const [recording, setRecording] = useState<string | null>(null);
    const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() => {
        const saved = localStorage.getItem('sloervoice_shortcuts');
        if (!saved) return DEFAULT_SHORTCUTS;

        try {
            const parsed = JSON.parse(saved) as Array<Partial<ShortcutItem> & { id: string }>;
            return DEFAULT_SHORTCUTS.map((defaultShortcut) => {
                const storedShortcut = parsed.find((shortcut) => shortcut.id === defaultShortcut.id);
                return storedShortcut ? { ...defaultShortcut, ...storedShortcut } : defaultShortcut;
            });
        } catch (error) {
            console.error('Failed to parse stored shortcuts:', error);
            return DEFAULT_SHORTCUTS;
        }
    });

    useEffect(() => {
        localStorage.setItem('sloervoice_shortcuts', JSON.stringify(shortcuts));
        const activeShortcut = shortcuts.find((s) => s.id === 'ptt');
        if (activeShortcut) {
            invoke('update_shortcuts', { keys: activeShortcut.keys }).catch(console.error);
        }
    }, [shortcuts]);

    useEffect(() => {
        if (!recording) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const keys: string[] = [];
            if (e.ctrlKey) keys.push('Control');
            if (e.shiftKey) keys.push('Shift');
            if (e.altKey) keys.push('Alt');
            if (e.metaKey) keys.push('Meta');

            if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
                let primaryKey = e.key.toUpperCase();
                if (e.key === ' ') primaryKey = 'Space';
                keys.push(primaryKey);

                setShortcuts(prev => prev.map(s => s.id === recording ? { ...s, keys } : s));
                setRecording(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [recording]);

    const handleRestore = () => {
        setShortcuts(DEFAULT_SHORTCUTS);
    };

    return (
        <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>

            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="premium-section-eyebrow mb-3">Global Command Grid</div>
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <h1 className="text-[28px] leading-tight font-black tracking-[-0.03em]">Shortcut orchestration built for a premium enterprise workflow.</h1>
                        <p className="text-[13px] mt-3 max-w-2xl leading-6" style={{ color: 'var(--text-secondary)' }}>
                            Configure OS-level hotkeys for dictation, cancellation and recovery. Every binding is synchronized into the native Rust backend so the widget remains fast and globally responsive.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="premium-chip" data-tone="success"><Shield size={12} /> Native backend sync</span>
                        <span className="premium-chip" data-tone="info"><Activity size={12} /> Global capture</span>
                        <span className="premium-chip" data-tone="warning"><Sparkles size={12} /> VIP workflow</span>
                    </div>
                </div>
            </motion.section>

            <div className="grid gap-4 xl:grid-cols-[0.85fr,1.15fr]">
                <motion.section variants={itemV} className="premium-panel px-5 py-5 space-y-4">
                    <div>
                        <div className="premium-section-eyebrow mb-2">Binding Protocol</div>
                        <h2 className="text-[18px] font-bold">Command capture is live across the whole desktop.</h2>
                    </div>
                    <div className="grid gap-3">
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Primary trigger</div>
                            <div className="mt-2 flex items-center gap-1">
                                <KeyCap>Control</KeyCap>
                                <span className="text-[10px] premium-muted">+</span>
                                <KeyCap>Space</KeyCap>
                            </div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">State</div>
                            <div className="text-[14px] font-semibold mt-2">{recording ? 'Listening for a new combination…' : 'Ready to rebind safely.'}</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Recommendation</div>
                            <div className="text-[13px] font-semibold mt-2 leading-6">Use one modifier plus one primary key to avoid collisions with browser or editor shortcuts.</div>
                        </div>
                    </div>
                    <button onClick={handleRestore} className="premium-button-secondary w-full">
                        <Sparkles size={14} /> Restore executive defaults
                    </button>
                </motion.section>

                <div className="space-y-3">
                    {shortcuts.map((shortcut) => {
                        const IconComp = shortcutIcons[shortcut.icon];
                        const isCapturing = recording === shortcut.id;

                        return (
                            <motion.section key={shortcut.id} variants={itemV} className="premium-panel px-5 py-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] flex-shrink-0">
                                            <IconComp size={18} style={{ color: shortcut.color }} />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-[16px] font-bold">{shortcut.name}</h3>
                                                <span className="premium-chip" data-tone={shortcut.id === 'cancel' ? 'danger' : shortcut.id === 'undo' ? 'warning' : 'info'}>{shortcut.tier}</span>
                                            </div>
                                            <p className="text-[13px] mt-2 leading-6 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>{shortcut.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 lg:items-end">
                                        {isCapturing ? (
                                            <motion.div
                                                animate={{ opacity: [1, 0.55, 1] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className="px-4 py-2 rounded-xl text-[12px] font-semibold border"
                                                style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', background: 'var(--accent-surface)' }}
                                            >
                                                Press the new shortcut…
                                            </motion.div>
                                        ) : (
                                            <div className="flex flex-wrap items-center gap-1.5 justify-end">
                                                {shortcut.keys.map((key, index) => (
                                                    <span key={`${shortcut.id}-${key}-${index}`} className="contents">
                                                        <KeyCap>{key}</KeyCap>
                                                        {index < shortcut.keys.length - 1 && <span className="text-[10px] mx-0.5" style={{ color: 'var(--text-quaternary)' }}>+</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setRecording(isCapturing ? null : shortcut.id)}
                                            className={isCapturing ? 'premium-button-secondary' : 'premium-button-primary'}
                                        >
                                            {isCapturing ? 'Cancel rebind' : 'Rebind shortcut'}
                                        </button>
                                    </div>
                                </div>
                            </motion.section>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

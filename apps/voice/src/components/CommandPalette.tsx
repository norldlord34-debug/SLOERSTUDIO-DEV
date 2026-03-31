import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Moon, Download, BookOpen, Clock, Settings, Keyboard, Home, CreditCard, ArrowRight, type LucideIcon } from 'lucide-react';

type CommandAction = {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    tone: 'info' | 'warning' | 'success';
    lane: string;
    shortcut?: string;
    action: () => void;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: string) => void;
};

export default function CommandPalette({ isOpen, onClose, onNavigate }: Props) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const actions: CommandAction[] = useMemo(() => [
        { id: 'nav-overview', label: 'Go to Overview', description: 'Analytics dashboard', icon: Home, tone: 'info', lane: 'Navigation', action: () => { onNavigate('overview'); onClose(); } },
        { id: 'nav-history', label: 'Go to History', description: 'Transcription timeline', icon: Clock, tone: 'info', lane: 'Navigation', action: () => { onNavigate('history'); onClose(); } },
        { id: 'nav-dictionary', label: 'Go to Dictionary', description: 'Context profiles', icon: BookOpen, tone: 'info', lane: 'Navigation', action: () => { onNavigate('dictionary'); onClose(); } },
        { id: 'nav-shortcuts', label: 'Go to Shortcuts', description: 'Global hotkeys', icon: Keyboard, tone: 'info', lane: 'Navigation', action: () => { onNavigate('shortcuts'); onClose(); } },
        { id: 'nav-subscription', label: 'Go to Enterprise', description: 'Plans and commercial posture', icon: CreditCard, tone: 'warning', lane: 'Navigation', action: () => { onNavigate('subscription'); onClose(); } },
        { id: 'nav-settings', label: 'Go to Settings', description: 'System options', icon: Settings, tone: 'info', lane: 'Navigation', action: () => { onNavigate('settings'); onClose(); } },
        { id: 'action-record', label: 'Start Recording', description: 'Begin voice capture', icon: Mic, tone: 'success', lane: 'Actions', shortcut: 'Alt+Space', action: () => onClose() },
        { id: 'action-export', label: 'Export History', description: 'Download transcriptions', icon: Download, tone: 'success', lane: 'Actions', action: () => onClose() },
        { id: 'action-theme', label: 'Switch Theme', description: 'Change visual identity', icon: Moon, tone: 'warning', lane: 'System', action: () => { onNavigate('settings'); onClose(); } },
    ], [onClose, onNavigate]);

    const filtered = useMemo(() => actions.filter((action) =>
        action.label.toLowerCase().includes(query.toLowerCase()) ||
        action.description.toLowerCase().includes(query.toLowerCase()) ||
        action.lane.toLowerCase().includes(query.toLowerCase())
    ), [actions, query]);

    useEffect(() => {
        let frameId: number | undefined;
        let timeoutId: number | undefined;
        if (isOpen) {
            frameId = window.requestAnimationFrame(() => setQuery(''));
            timeoutId = window.setTimeout(() => inputRef.current?.focus(), 50);
        }
        return () => {
            if (frameId) window.cancelAnimationFrame(frameId);
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                        className="premium-overlay-panel relative w-full max-w-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="relative z-10 px-5 pt-5 pb-4 border-b border-white/5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <div className="premium-section-eyebrow mb-2">Command Layer</div>
                                    <div className="text-[18px] font-bold">Search routes, actions and system controls.</div>
                                    <div className="text-[12px] mt-2" style={{ color: 'var(--text-tertiary)' }}>Fast access to premium views and operational actions.</div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="premium-chip" data-tone="info"><Search size={12} /> {filtered.length} results</span>
                                    <span className="premium-chip" data-tone="warning"><Keyboard size={12} /> ⌘K</span>
                                </div>
                            </div>

                            <div className="premium-stat-card flex items-center gap-3 px-4 py-3 mt-4">
                                <Search size={16} className="flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Type a command or search..."
                                    className="flex-1 bg-transparent border-none text-sm outline-none focus:ring-0 focus:shadow-none"
                                    style={{ color: 'var(--text-primary)', boxShadow: 'none' }}
                                />
                                <span className="keycap text-[10px]">ESC</span>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="relative z-10 max-h-[420px] overflow-y-auto p-3 custom-scrollbar">
                            {filtered.length === 0 && (
                                <div className="premium-stat-card px-4 py-10 text-center text-sm">
                                    <div className="font-semibold">No results found</div>
                                    <div className="text-[12px] mt-2" style={{ color: 'var(--text-tertiary)' }}>Try a view name, action keyword or system lane.</div>
                                </div>
                            )}
                            <div className="space-y-2">
                                {filtered.map((action, index) => (
                                <motion.button
                                    key={action.id}
                                    onClick={action.action}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.995 }}
                                    className="premium-command-item w-full flex items-center gap-3 px-4 py-3 text-left rounded-2xl group"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                                        <action.icon size={15} style={{ color: action.tone === 'warning' ? 'var(--accent-premium)' : action.tone === 'success' ? 'var(--status-success)' : 'var(--accent-primary)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{action.label}</div>
                                            <span className="premium-chip" data-tone={action.tone}>{action.lane}</span>
                                        </div>
                                        <div className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{action.description}</div>
                                    </div>
                                    {action.shortcut && (
                                        <div className="flex items-center gap-1">
                                            {action.shortcut.split('+').map((k, i) => (
                                                <span key={i} className="keycap">{k}</span>
                                            ))}
                                        </div>
                                    )}
                                    {!action.shortcut && <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />}
                                </motion.button>
                            ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

import { motion } from 'framer-motion';
import { BrainCircuit, Type, Database, Zap, ShieldCheck, Mail, List, FileCode2, Mic, Globe, Trash2, Info, Crown, Sparkles, SlidersHorizontal, Volume2, BookOpen, Wand2, Eye, Monitor, Cloud, Accessibility, MousePointer2, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getWidgetAlwaysOnTop, getWidgetOpacity, getWidgetPosition, resetWidgetPosition, setWidgetAlwaysOnTop, setWidgetOpacity } from '../lib/widgetPreferences';

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

const readWidgetPositionLabel = () => {
    const position = getWidgetPosition();
    return position ? `${position.x}, ${position.y}` : 'Auto dock';
};

type SettingsProps = { theme: string; setTheme: (t: string) => void };
type AudioDevice = { name: string; is_default: boolean };

const PREF_KEYS = {
    soundEffects: 'sloervoice_sound_effects',
    autoAddDict: 'sloervoice_auto_add_dict',
    smartFormatting: 'sloervoice_smart_formatting',
    creatorMode: 'sloervoice_creator_mode',
    showWidgetAlways: 'sloervoice_show_widget_always',
} as const;

const getPref = (key: string, fallback = true) => {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === 'true';
};

const setPref = (key: string, value: boolean) => {
    localStorage.setItem(key, String(value));
};

const ToggleRow = ({ icon: Icon, label, description, checked, onChange }: {
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <label className="premium-stat-card flex items-center gap-3 px-4 py-4 cursor-pointer">
        <Icon size={15} style={{ color: checked ? 'var(--accent-premium)' : 'var(--text-tertiary)' }} />
        <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium">{label}</div>
            {description && <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{description}</div>}
        </div>
        <div
            role="switch"
            aria-checked={checked}
            tabIndex={0}
            onClick={(e) => { e.preventDefault(); onChange(!checked); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!checked); } }}
            className="relative w-[42px] h-[24px] rounded-full flex-shrink-0 transition-colors duration-200"
            style={{
                background: checked ? 'var(--accent-primary)' : 'var(--bg-input)',
                border: `1px solid ${checked ? 'var(--accent-primary)' : 'var(--border-default)'}`,
            }}
        >
            <div
                className="absolute top-[2px] w-[18px] h-[18px] rounded-full transition-transform duration-200"
                style={{
                    background: checked ? '#fff' : 'var(--text-tertiary)',
                    transform: checked ? 'translateX(20px)' : 'translateX(2px)',
                }}
            />
        </div>
    </label>
);

export default function Settings({ theme, setTheme }: SettingsProps) {
    const [activeModel, setActiveModel] = useState('tiny');
    const [nlp, setNlp] = useState({ cap: true, punct: true, email: false, bullets: false, code: false });
    const [language, setLanguage] = useState('en');
    const [soundEffects, setSoundEffects] = useState(() => getPref(PREF_KEYS.soundEffects));
    const [autoAddDict, setAutoAddDict] = useState(() => getPref(PREF_KEYS.autoAddDict));
    const [smartFormatting, setSmartFormatting] = useState(() => getPref(PREF_KEYS.smartFormatting));
    const [creatorMode, setCreatorMode] = useState(() => getPref(PREF_KEYS.creatorMode, false));
    const [showWidgetAlways, setShowWidgetAlways] = useState(() => getPref(PREF_KEYS.showWidgetAlways));
    const [devices, setDevices] = useState<AudioDevice[]>([]);
    const [activeDevice, setActiveDevice] = useState<string>('');
    const [widgetOpacity, setWidgetOpacityValue] = useState(() => getWidgetOpacity().toFixed(2));
    const [widgetAlwaysOnTop, setWidgetAlwaysOnTopValue] = useState(() => getWidgetAlwaysOnTop());
    const [widgetPositionLabel, setWidgetPositionLabel] = useState(() => readWidgetPositionLabel());

    useEffect(() => {
        invoke<AudioDevice[]>('get_audio_devices').then((devs) => {
            setDevices(devs);
            const saved = localStorage.getItem('sloervoice_device');
            if (saved && devs.some((d) => d.name === saved)) {
                setActiveDevice(saved);
                invoke('set_audio_device', { deviceName: saved }).catch(console.error);
            } else {
                const def = devs.find((d) => d.is_default);
                if (def) setActiveDevice(def.name);
            }
        }).catch(console.error);
    }, []);

    useEffect(() => {
        const syncWidgetState = () => {
            setWidgetOpacityValue(getWidgetOpacity().toFixed(2));
            setWidgetAlwaysOnTopValue(getWidgetAlwaysOnTop());
            setWidgetPositionLabel(readWidgetPositionLabel());
        };

        window.addEventListener('storage', syncWidgetState);
        return () => window.removeEventListener('storage', syncWidgetState);
    }, []);

    const handleClearHistory = async () => {
        if (!window.confirm('Clear all transcription history? This cannot be undone.')) return;
        try {
            await invoke('clear_history');
        } catch (e) { console.error('Failed to clear history:', e); }
    };

    const handleResetDictionary = async () => {
        if (!window.confirm('Reset the entire dictionary? All custom replacements will be lost.')) return;
        try {
            const items = await invoke<Array<{ id: number }>>('get_dictionary');
            for (const item of items) {
                await invoke('delete_history_item', { id: item.id }).catch(() => {});
            }
        } catch (e) { console.error('Failed to reset dictionary:', e); }
    };

    const handleFactoryReset = async () => {
        if (!window.confirm('FACTORY RESET: This will clear ALL data including history, dictionary, and preferences. Continue?')) return;
        if (!window.confirm('Are you absolutely sure? This is irreversible.')) return;
        try {
            await invoke('clear_history');
            localStorage.clear();
            window.location.reload();
        } catch (e) { console.error('Failed to factory reset:', e); }
    };

    const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setActiveDevice(val);
        localStorage.setItem('sloervoice_device', val);
        invoke('set_audio_device', { deviceName: val }).catch(console.error);
    };

    const themes = [
        { id: 'void', name: 'Void', desc: 'Pure obsidian black' },
        { id: 'light', name: 'Light', desc: 'Paper white premium UI' },
        { id: 'bridgemind', name: 'BridgeMind', desc: 'Cyan flagship' },
        { id: 'carbon', name: 'Carbon', desc: 'Industrial charcoal' },
        { id: 'midnight', name: 'Midnight', desc: 'Deep space violet' },
        { id: 'nord', name: 'Nord', desc: 'Arctic blue' },
        { id: 'dracula', name: 'Dracula', desc: 'Classic purple' },
        { id: 'solarized', name: 'Solarized', desc: 'Warm solar amber' },
        { id: 'emerald', name: 'Emerald', desc: 'Forest green' },
        { id: 'high-contrast', name: 'High Contrast', desc: 'Max accessibility WCAG AAA' },
    ];

    const models = [
        { id: 'tiny', name: 'Tiny.en', speed: 'Blazing', accuracy: 'Good', size: '75 MB', icon: Zap },
        { id: 'base', name: 'Base.en', speed: 'Fast', accuracy: 'High', size: '142 MB', icon: Database },
        { id: 'large-v3', name: 'Large v3', speed: 'Slow', accuracy: 'SOTA', size: '2.9 GB', icon: BrainCircuit },
    ];

    const nlpOptions = [
        { key: 'cap' as const, label: 'Auto Capitalize', desc: 'Sentence casing', icon: Type },
        { key: 'punct' as const, label: 'Smart Punctuation', desc: 'Infer periods, commas', icon: Type },
        { key: 'email' as const, label: 'Email Format', desc: 'Professional paragraphs', icon: Mail },
        { key: 'bullets' as const, label: 'Bullet Points', desc: 'Pauses → list items', icon: List },
        { key: 'code' as const, label: 'Code Comments', desc: 'Wrap in /* */', icon: FileCode2 },
    ];

    const activeThemeMeta = themes.find((item) => item.id === theme) ?? themes[0];
    const activeModelMeta = models.find((model) => model.id === activeModel) ?? models[0];

    return (
        <motion.div className="space-y-6 pb-8" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>

            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="premium-section-eyebrow mb-3">Executive System Control</div>
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <h1 className="text-[28px] leading-tight font-black tracking-[-0.03em]">Premium control for models, widget behavior, themes and output formatting.</h1>
                        <p className="text-[13px] mt-3 max-w-2xl leading-6" style={{ color: 'var(--text-secondary)' }}>
                            Tune the local inference stack, widget behavior and transcription presentation from a luxury-grade control center built for serious daily operators.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="premium-chip" data-tone="warning"><Crown size={12} /> Enterprise Core</span>
                        <span className="premium-chip" data-tone="info"><BrainCircuit size={12} /> {activeModelMeta.name}</span>
                        <span className="premium-chip" data-tone="success"><Sparkles size={12} /> {activeThemeMeta.name}</span>
                    </div>
                </div>
            </motion.section>

            <motion.section variants={itemV} className="grid gap-3 md:grid-cols-4">
                <div className="premium-stat-card px-4 py-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Active model</div>
                    <div className="text-[17px] font-black mt-2">{activeModelMeta.name}</div>
                </div>
                <div className="premium-stat-card px-4 py-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Input route</div>
                    <div className="text-[14px] font-bold mt-2 truncate">{activeDevice || 'Default device'}</div>
                </div>
                <div className="premium-stat-card px-4 py-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Theme vault</div>
                    <div className="text-[14px] font-bold mt-2">{activeThemeMeta.name}</div>
                </div>
                <div className="premium-stat-card px-4 py-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Widget opacity</div>
                    <div className="text-[14px] font-bold mt-2">{widgetOpacity}</div>
                </div>
            </motion.section>

            {/* System Settings */}
            <div className="grid gap-4 xl:grid-cols-2">
                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-1 flex items-center gap-2"><Monitor size={15} style={{ color: 'var(--accent-premium)' }} /> App Settings</h3>
                    <p className="text-[12px] mb-4" style={{ color: 'var(--text-tertiary)' }}>Control system behavior and widget visibility.</p>
                    <div className="space-y-2">
                        <ToggleRow icon={Eye} label="Show widget at all times" description="Keep SloerVoice widget visible on screen" checked={showWidgetAlways} onChange={(v) => { setShowWidgetAlways(v); setPref(PREF_KEYS.showWidgetAlways, v); }} />
                        <ToggleRow icon={Volume2} label="Dictation sound effects" description="Play audio cues when recording starts/stops" checked={soundEffects} onChange={(v) => { setSoundEffects(v); setPref(PREF_KEYS.soundEffects, v); }} />
                    </div>
                </motion.div>

                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-1 flex items-center gap-2"><Wand2 size={15} style={{ color: 'var(--accent-premium)' }} /> Extras</h3>
                    <p className="text-[12px] mb-4" style={{ color: 'var(--text-tertiary)' }}>Advanced dictation and formatting features.</p>
                    <div className="space-y-2">
                        <ToggleRow icon={BookOpen} label="Auto-add to dictionary" description="Adds corrected words automatically" checked={autoAddDict} onChange={(v) => { setAutoAddDict(v); setPref(PREF_KEYS.autoAddDict, v); }} />
                        <ToggleRow icon={Type} label="Smart Formatting" description="Automatically formats your dictation" checked={smartFormatting} onChange={(v) => { setSmartFormatting(v); setPref(PREF_KEYS.smartFormatting, v); }} />
                        <ToggleRow icon={Sparkles} label="Creator mode" description='Show "Dictating with SloerVoice" when dictating' checked={creatorMode} onChange={(v) => { setCreatorMode(v); setPref(PREF_KEYS.creatorMode, v); }} />
                    </div>
                </motion.div>
            </div>

            {/* AI Model */}
            <motion.div variants={itemV} className="premium-panel px-5 py-5">
                <h3 className="text-[15px] font-bold mb-1 flex items-center gap-2"><BrainCircuit size={15} style={{ color: 'var(--accent-premium)' }} /> AI Model</h3>
                <p className="text-[12px] mb-4" style={{ color: 'var(--text-tertiary)' }}>Choose the local Whisper tier that balances speed, quality and executive-grade throughput.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {models.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setActiveModel(m.id)}
                            className="premium-stat-card p-4 text-left transition-all group"
                            style={activeModel === m.id ? { borderColor: 'rgba(246, 193, 95, 0.22)', background: 'linear-gradient(180deg, rgba(246,193,95,0.08), rgba(255,255,255,0.02))' } : undefined}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <m.icon size={18} className="mb-2" style={{ color: activeModel === m.id ? 'var(--accent-premium)' : 'var(--text-tertiary)' }} />
                                {activeModel === m.id && <span className="premium-chip" data-tone="warning">Active</span>}
                            </div>
                            <div className="text-[14px] font-bold mt-2">{m.name}</div>
                            <div className="text-[11px] mt-3 space-y-1" style={{ color: 'var(--text-tertiary)' }}>
                                <div>Speed: {m.speed}</div>
                                <div>Accuracy: {m.accuracy}</div>
                                <div>{m.size}</div>
                            </div>
                            {activeModel === m.id && (
                                <div className="flex items-center gap-1 mt-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-premium)' }}>
                                    <ShieldCheck size={10} /> Active
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="grid gap-4 xl:grid-cols-2">
                {/* Audio & Language */}
                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2"><Mic size={15} style={{ color: 'var(--accent-premium)' }} /> Audio & Language</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="premium-stat-card px-4 py-4">
                            <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block premium-muted">Input Device</label>
                            <select className="text-[13px] w-full" value={activeDevice} onChange={handleDeviceChange}>
                                {devices.length === 0 && <option>Loading devices...</option>}
                                {devices.map((d, i) => (
                                    <option key={i} value={d.name}>
                                        {d.name.length > 35 ? d.name.substring(0, 35) + '...' : d.name} {d.is_default ? '(Default)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block premium-muted">Whisper Language</label>
                            <select className="text-[13px] w-full" value={language} onChange={e => setLanguage(e.target.value)}>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                                <option value="ja">日本語</option>
                                <option value="zh">中文</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Widget Preferences */}
                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2"><SlidersHorizontal size={15} style={{ color: 'var(--accent-premium)' }} /> Widget Preferences</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="premium-stat-card px-4 py-4">
                            <label className="text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center justify-between premium-muted">
                                Opacity <span>{widgetOpacity}</span>
                            </label>
                            <input
                                type="range"
                                min="0.7"
                                max="1.0"
                                step="0.05"
                                value={widgetOpacity}
                                aria-label="Widget opacity"
                                onChange={(e) => {
                                    const nextValue = setWidgetOpacity(Number(e.target.value)).toFixed(2);
                                    setWidgetOpacityValue(nextValue);
                                }}
                                className="w-full accent-[var(--accent-primary)]"
                            />
                        </div>
                        <label className="premium-stat-card flex items-center gap-3 px-4 py-4 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={widgetAlwaysOnTop}
                                aria-label="Always on top"
                                onChange={(e) => {
                                    const nextValue = setWidgetAlwaysOnTop(e.target.checked);
                                    setWidgetAlwaysOnTopValue(nextValue);
                                }}
                                className="w-4 h-4 rounded accent-[var(--accent-primary)]"
                            />
                            <div>
                                <div className="text-[13px] font-medium">Always On Top</div>
                                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Keep widget above apps</div>
                            </div>
                        </label>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider premium-muted">Placement memory</div>
                                    <div className="text-[13px] font-semibold mt-2">{widgetPositionLabel}</div>
                                    <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>The widget now remembers its last desktop position and can be re-docked instantly.</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetWidgetPosition();
                                        setWidgetPositionLabel(readWidgetPositionLabel());
                                    }}
                                    className="premium-button-secondary whitespace-nowrap"
                                >
                                    Reset widget dock
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* NLP Engine */}
            <div className="grid gap-4 xl:grid-cols-[1.02fr,0.98fr]">
                {/* NLP Engine */}
                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-1 flex items-center gap-2"><Type size={15} style={{ color: 'var(--accent-premium)' }} /> NLP Formatting</h3>
                    <p className="text-[12px] mb-4" style={{ color: 'var(--text-tertiary)' }}>Control post-processing rules before text is injected into your target application.</p>
                    <div className="space-y-2">
                        {nlpOptions.map(opt => (
                            <label key={opt.key} className="premium-stat-card flex items-center gap-3 px-4 py-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={nlp[opt.key]}
                                    onChange={() => setNlp(p => ({ ...p, [opt.key]: !p[opt.key] }))}
                                    className="w-4 h-4 rounded accent-[var(--accent-primary)]"
                                />
                                <opt.icon size={14} style={{ color: nlp[opt.key] ? 'var(--accent-premium)' : 'var(--text-tertiary)' }} />
                                <div>
                                    <div className="text-[13px] font-medium">{opt.label}</div>
                                    <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{opt.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </motion.div>

                {/* Themes */}
                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2"><Globe size={15} style={{ color: 'var(--accent-premium)' }} /> Visual Theme</h3>
                    <div className="premium-stat-card px-4 py-4 mb-4">
                        <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Current theme</div>
                        <div className="text-[16px] font-bold mt-2">{activeThemeMeta.name}</div>
                        <div className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>{activeThemeMeta.desc}</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {themes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className="premium-stat-card p-3 text-left transition-all"
                                style={theme === t.id ? { borderColor: 'rgba(246, 193, 95, 0.22)', background: 'linear-gradient(180deg, rgba(246,193,95,0.08), rgba(255,255,255,0.02))' } : undefined}
                            >
                                <div className="text-[13px] font-semibold">{t.name}</div>
                                <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{t.desc}</div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Cloud Sync & Accessibility */}
            <div className="grid gap-4 xl:grid-cols-2">
                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-1 flex items-center gap-2"><Cloud size={15} style={{ color: 'var(--accent-primary)' }} /> Cloud Sync</h3>
                    <p className="text-[12px] mb-4" style={{ color: 'var(--text-tertiary)' }}>Your dictionary, snippets and settings sync across all devices.</p>
                    <div className="space-y-2">
                        <div className="premium-stat-card px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Cloud size={14} style={{ color: 'var(--status-success)' }} />
                                <div>
                                    <div className="text-[13px] font-medium">Dictionary sync</div>
                                    <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Last synced: just now</div>
                                </div>
                            </div>
                            <span className="premium-chip" data-tone="success">Active</span>
                        </div>
                        <div className="premium-stat-card px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Cloud size={14} style={{ color: 'var(--status-success)' }} />
                                <div>
                                    <div className="text-[13px] font-medium">Snippets sync</div>
                                    <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Last synced: just now</div>
                                </div>
                            </div>
                            <span className="premium-chip" data-tone="success">Active</span>
                        </div>
                        <div className="premium-stat-card px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Cloud size={14} style={{ color: 'var(--status-success)' }} />
                                <div>
                                    <div className="text-[13px] font-medium">Preferences sync</div>
                                    <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Last synced: just now</div>
                                </div>
                            </div>
                            <span className="premium-chip" data-tone="success">Active</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-1 flex items-center gap-2"><Accessibility size={15} style={{ color: 'var(--accent-primary)' }} /> Accessibility</h3>
                    <p className="text-[12px] mb-4" style={{ color: 'var(--text-tertiary)' }}>Designed to reduce visual fatigue and support assistive technologies.</p>
                    <div className="space-y-2">
                        <div className="premium-stat-card px-4 py-4 flex items-center gap-3">
                            <MousePointer2 size={14} style={{ color: 'var(--accent-primary)' }} />
                            <div>
                                <div className="text-[13px] font-medium">Keyboard navigation</div>
                                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Full Tab/Enter/Space support across all controls</div>
                            </div>
                        </div>
                        <div className="premium-stat-card px-4 py-4 flex items-center gap-3">
                            <EyeOff size={14} style={{ color: 'var(--accent-primary)' }} />
                            <div>
                                <div className="text-[13px] font-medium">Reduced motion</div>
                                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Respects prefers-reduced-motion OS setting</div>
                            </div>
                        </div>
                        <div className="premium-stat-card px-4 py-4 flex items-center gap-3">
                            <Eye size={14} style={{ color: 'var(--accent-primary)' }} />
                            <div>
                                <div className="text-[13px] font-medium">Screen reader compatible</div>
                                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>ARIA labels on all interactive elements</div>
                            </div>
                        </div>
                        <div className="premium-stat-card px-4 py-4 flex items-center gap-3">
                            <Globe size={14} style={{ color: 'var(--accent-primary)' }} />
                            <div>
                                <div className="text-[13px] font-medium">High contrast theme</div>
                                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>WCAG AAA compliant option in theme selector</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Data Management */}
            <div className="grid gap-4 xl:grid-cols-[0.86fr,1.14fr]">
                {/* Data Management */}
                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2"><Trash2 size={15} style={{ color: 'var(--status-error)' }} /> Data Management</h3>
                    <div className="premium-stat-card px-4 py-4 mb-4">
                        <div className="text-[12px] leading-6" style={{ color: 'var(--text-secondary)' }}>Local history and dictionary state stay on-device. These controls are your hard reset layer for maintenance and cleanup.</div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={handleClearHistory} className="premium-button-secondary justify-start"><Trash2 size={14} /> Clear History</button>
                        <button onClick={handleResetDictionary} className="premium-button-secondary justify-start"><Database size={14} /> Reset Dictionary</button>
                        <button onClick={handleFactoryReset} className="premium-button-secondary justify-start" style={{ borderColor: 'rgba(239, 68, 68, 0.18)', color: 'var(--status-error)' }}><Trash2 size={14} /> Factory Reset</button>
                    </div>
                </motion.div>

                {/* About */}
                <motion.div variants={itemV} className="premium-panel px-5 py-5">
                    <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2"><Info size={15} style={{ color: 'var(--accent-premium)' }} /> About</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                            <img src="/logo.png" alt="SloerVoice" className="w-9 h-9 object-contain" style={{ filter: 'drop-shadow(0 0 10px rgba(246,193,95,0.35))' }} />
                        </div>
                        <div>
                            <div className="text-[16px] font-bold">SloerVoice-VOICE</div>
                            <div className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>v0.1.0 • Enterprise Core • Tauri 2.0 + Rust</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Framework</div>
                            <div className="text-[13px] font-bold mt-2">Tauri + React</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Runtime</div>
                            <div className="text-[13px] font-bold mt-2">Rust local</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Tier</div>
                            <div className="text-[13px] font-bold mt-2">Premium</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

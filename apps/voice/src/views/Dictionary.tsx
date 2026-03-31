import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw, Search, Briefcase, Gamepad2, Code2, Trash2, Edit3, Shield, Sparkles, AudioLines, Layers3, ArrowRight, type LucideIcon } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

type ProfileId = 'work' | 'gaming' | 'coding';

type DictionaryEntry = {
    id?: number;
    original: string;
    replacement: string;
    category?: string | null;
};

type DictionaryProfile = {
    id: ProfileId;
    name: string;
    icon: LucideIcon;
    description: string;
    tone: 'info' | 'warning' | 'success';
};

const profiles: DictionaryProfile[] = [
    { id: 'work', name: 'Corporate', icon: Briefcase, description: 'Boardroom phrasing, acronyms and executive shorthand.', tone: 'warning' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, description: 'Fast comms, meta terms and live session vocabulary.', tone: 'info' },
    { id: 'coding', name: 'Development', icon: Code2, description: 'APIs, infrastructure terms and code language normalization.', tone: 'success' },
];

export default function Dictionary() {
    const [activeProfile, setActiveProfile] = useState<ProfileId>('work');
    const [allEntries, setAllEntries] = useState<DictionaryEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [draftOriginal, setDraftOriginal] = useState('');
    const [draftReplacement, setDraftReplacement] = useState('');

    const loadEntries = useCallback(async () => {
        try {
            const data = await invoke<DictionaryEntry[]>('get_dictionary');
            setAllEntries(data);
        } catch (e) {
            console.error('Failed to load dictionary:', e);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await invoke<DictionaryEntry[]>('get_dictionary');
                if (!cancelled) setAllEntries(data);
            } catch (e) {
                console.error('Failed to load dictionary:', e);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const entriesByProfile: Record<ProfileId, DictionaryEntry[]> = {
        work: allEntries.filter(e => !e.category || e.category === 'work'),
        gaming: allEntries.filter(e => e.category === 'gaming'),
        coding: allEntries.filter(e => e.category === 'coding'),
    };

    const activeProfileMeta = profiles.find((profile) => profile.id === activeProfile) ?? profiles[0];
    const entries = entriesByProfile[activeProfile] || [];
    const filteredEntries = entries.filter((entry) =>
        `${entry.original} ${entry.replacement}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalRules = allEntries.length;

    const handleAddRule = async () => {
        const original = draftOriginal.trim();
        const replacement = draftReplacement.trim();
        if (!original || !replacement) return;

        try {
            await invoke('add_dictionary_item', { original, replacement, category: activeProfile });
            await loadEntries();
            setDraftOriginal('');
            setDraftReplacement('');
        } catch (e) {
            console.error('Failed to add dictionary item:', e);
        }
    };

    const handleDeleteRule = async (original: string) => {
        try {
            // Re-add without this entry (SQLite uses REPLACE on original)
            // For now, add with empty replacement to effectively remove
            await invoke('add_dictionary_item', { original, replacement: original, category: activeProfile });
            await loadEntries();
        } catch (e) {
            console.error('Failed to delete dictionary item:', e);
        }
    };

    return (
        <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>

            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="premium-section-eyebrow mb-3">Context Rule Engine</div>
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <h1 className="text-[28px] leading-tight font-black tracking-[-0.03em]">Premium context control for every vocabulary domain you operate in.</h1>
                        <p className="text-[13px] mt-3 max-w-2xl leading-6" style={{ color: 'var(--text-secondary)' }}>
                            Build profile-specific replacements for executive comms, gaming calls or development language and force the voice engine to speak your exact operational dialect.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="premium-chip" data-tone="success"><Shield size={12} /> Controlled output</span>
                        <span className="premium-chip" data-tone="info"><AudioLines size={12} /> Voice normalization</span>
                        <span className="premium-chip" data-tone="warning"><Sparkles size={12} /> Premium language profiles</span>
                    </div>
                </div>
            </motion.section>

            <motion.section variants={itemV} className="grid gap-3 md:grid-cols-3">
                {profiles.map((profile) => {
                    const Icon = profile.icon;
                    const isActive = activeProfile === profile.id;
                    return (
                        <button
                            key={profile.id}
                            onClick={() => setActiveProfile(profile.id)}
                            className="premium-panel px-5 py-5 text-left"
                            style={isActive ? { borderColor: 'rgba(246, 193, 95, 0.22)' } : undefined}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                                    <Icon size={18} style={{ color: isActive ? 'var(--accent-premium)' : 'var(--text-secondary)' }} />
                                </div>
                                <span className="premium-chip" data-tone={profile.tone}>{entriesByProfile[profile.id].length} rules</span>
                            </div>
                            <div className="mt-4">
                                <h2 className="text-[16px] font-bold">{profile.name}</h2>
                                <p className="text-[12px] mt-2 leading-6" style={{ color: 'var(--text-secondary)' }}>{profile.description}</p>
                            </div>
                        </button>
                    );
                })}
            </motion.section>

            <div className="grid gap-4 xl:grid-cols-[0.82fr,1.18fr]">
                <motion.section variants={itemV} className="premium-panel px-5 py-5 space-y-4">
                    <div>
                        <div className="premium-section-eyebrow mb-2">Rule Composer</div>
                        <h2 className="text-[18px] font-bold">{activeProfileMeta.name} output profile</h2>
                        <p className="text-[12px] mt-2 leading-6" style={{ color: 'var(--text-secondary)' }}>{activeProfileMeta.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Active rules</div>
                            <div className="text-[20px] font-black mt-2">{entries.length}</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Total library</div>
                            <div className="text-[20px] font-black mt-2">{totalRules}</div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block premium-muted">Audio Pattern</label>
                        <input type="text" value={draftOriginal} onChange={(e) => setDraftOriginal(e.target.value)} placeholder='e.g. "j son"' className="text-[13px]" />
                    </div>

                    <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block premium-muted">Output</label>
                        <input type="text" value={draftReplacement} onChange={(e) => setDraftReplacement(e.target.value)} placeholder="e.g. JSON" className="text-[13px] font-mono" />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleAddRule} className="premium-button-primary flex-1">
                            <Plus size={14} /> Save rule
                        </button>
                        <button onClick={() => { setDraftOriginal(''); setDraftReplacement(''); }} className="premium-button-secondary">
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </motion.section>

                <motion.section variants={itemV} className="premium-panel px-5 py-5 min-h-[420px] flex flex-col">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div>
                            <div className="premium-section-eyebrow mb-2">Rule Vault</div>
                            <h3 className="text-[18px] font-bold">{activeProfileMeta.name} dictionary</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={13} style={{ color: 'var(--text-quaternary)' }} />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search rules..." className="pl-9 pr-3 py-2 text-[12px] w-52" />
                            </div>
                            <button onClick={() => setSearchQuery('')} className="premium-button-secondary">
                                <RefreshCw size={13} /> Reset
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeProfile}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="flex-1"
                        >
                            {filteredEntries.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 premium-stat-card">
                                    <Layers3 size={24} style={{ color: 'var(--accent-premium)' }} />
                                    <p className="text-[14px] font-semibold mt-3">No rules found for this query.</p>
                                    <p className="text-[12px] mt-2 leading-6" style={{ color: 'var(--text-secondary)' }}>Adjust the search or add a new premium dictionary rule to shape transcription output.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredEntries.map((entry) => (
                                        <div key={`${entry.original}-${entry.replacement}`} className="premium-stat-card px-4 py-4 group">
                                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex items-center gap-3 text-[13px] flex-wrap">
                                                    <code className="px-3 py-1 rounded-full text-[12px]" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{entry.original}</code>
                                                    <ArrowRight size={13} style={{ color: 'var(--text-quaternary)' }} />
                                                    <code className="px-3 py-1 rounded-full text-[12px] font-semibold" style={{ background: 'rgba(246,193,95,0.14)', color: 'var(--accent-premium)', fontFamily: 'var(--font-mono)' }}>{entry.replacement}</code>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setDraftOriginal(entry.original); setDraftReplacement(entry.replacement); }} className="flex h-9 w-9 items-center justify-center rounded-lg surface-interactive"><Edit3 size={12} style={{ color: 'var(--text-tertiary)' }} /></button>
                                                    <button onClick={() => handleDeleteRule(entry.original)} className="flex h-9 w-9 items-center justify-center rounded-lg surface-interactive"><Trash2 size={12} style={{ color: 'var(--status-error)' }} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.section>
            </div>
        </motion.div>
    );
}

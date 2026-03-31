import { motion } from 'framer-motion';
import { Scissors, Plus, Trash2, Search, ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

type Snippet = {
    id: string;
    trigger: string;
    expansion: string;
};

const STORAGE_KEY = 'sloervoice_snippets';

const loadSnippets = (): Snippet[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveSnippets = (snippets: Snippet[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
};

export default function Snippets() {
    const [snippets, setSnippets] = useState<Snippet[]>(loadSnippets);
    const [search, setSearch] = useState('');
    const [newTrigger, setNewTrigger] = useState('');
    const [newExpansion, setNewExpansion] = useState('');

    useEffect(() => {
        saveSnippets(snippets);
        // Sync snippets to Rust backend for voice expansion during transcription
        invoke('sync_snippets', { json: JSON.stringify(snippets) }).catch(console.error);
    }, [snippets]);

    const addSnippet = useCallback(() => {
        if (!newTrigger.trim() || !newExpansion.trim()) return;
        const snippet: Snippet = {
            id: `snip_${Date.now()}`,
            trigger: newTrigger.trim(),
            expansion: newExpansion.trim(),
        };
        setSnippets(prev => [snippet, ...prev]);
        setNewTrigger('');
        setNewExpansion('');
    }, [newTrigger, newExpansion]);

    const deleteSnippet = useCallback((id: string) => {
        setSnippets(prev => prev.filter(s => s.id !== id));
    }, []);

    const filtered = search
        ? snippets.filter(s => s.trigger.toLowerCase().includes(search.toLowerCase()) || s.expansion.toLowerCase().includes(search.toLowerCase()))
        : snippets;

    return (
        <motion.div className="space-y-6 pb-8" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>

            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="premium-section-eyebrow mb-2">Voice Snippets</div>
                        <h1 className="text-[28px] leading-tight font-black tracking-[-0.03em]">The stuff you shouldn't have to re-type.</h1>
                        <p className="text-[13px] mt-3 max-w-2xl leading-6" style={{ color: 'var(--text-secondary)' }}>
                            Save shortcuts to speak the things you type all the time — emails, links, addresses, bios — anything. Just speak and SloerVoice expands them instantly.
                        </p>
                    </div>
                    <span className="premium-chip flex-shrink-0" data-tone="info"><Scissors size={12} /> {snippets.length} snippets</span>
                </div>
            </motion.section>

            {/* Add new snippet */}
            <motion.div variants={itemV} className="premium-panel px-5 py-5">
                <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2"><Plus size={15} style={{ color: 'var(--accent-premium)' }} /> Add new snippet</h3>
                <div className="flex flex-col gap-3 md:flex-row md:items-end">
                    <div className="flex-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block premium-muted">Trigger phrase</label>
                        <input
                            type="text"
                            value={newTrigger}
                            onChange={e => setNewTrigger(e.target.value)}
                            placeholder='"my email address"'
                            className="w-full px-4 py-3 rounded-xl text-[13px] font-medium"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                            onKeyDown={e => { if (e.key === 'Enter') addSnippet(); }}
                        />
                    </div>
                    <div className="flex items-center justify-center px-2">
                        <ArrowRight size={18} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                    <div className="flex-[2]">
                        <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block premium-muted">Expands to</label>
                        <input
                            type="text"
                            value={newExpansion}
                            onChange={e => setNewExpansion(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full px-4 py-3 rounded-xl text-[13px] font-medium"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                            onKeyDown={e => { if (e.key === 'Enter') addSnippet(); }}
                        />
                    </div>
                    <button
                        onClick={addSnippet}
                        disabled={!newTrigger.trim() || !newExpansion.trim()}
                        className="premium-button-secondary whitespace-nowrap disabled:opacity-40"
                    >
                        <Plus size={14} /> Add snippet
                    </button>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div variants={itemV} className="premium-panel px-5 py-4">
                <div className="flex items-center gap-3">
                    <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search snippets..."
                        className="flex-1 bg-transparent text-[13px] outline-none"
                        style={{ color: 'var(--text-primary)' }}
                    />
                    {search && (
                        <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{filtered.length} results</span>
                    )}
                </div>
            </motion.div>

            {/* Snippet list */}
            <motion.div variants={itemV} className="space-y-2">
                {filtered.length === 0 && (
                    <div className="premium-panel px-6 py-12 text-center">
                        <Scissors size={32} className="mx-auto mb-3" style={{ color: 'var(--text-quaternary)' }} />
                        <div className="text-[14px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            {snippets.length === 0 ? 'No snippets yet. Add your first one above!' : 'No snippets match your search.'}
                        </div>
                    </div>
                )}
                {filtered.map(snippet => (
                    <motion.div
                        key={snippet.id}
                        layout
                        className="premium-panel px-5 py-4 flex items-center gap-4 group"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold flex-shrink-0" style={{
                                background: 'var(--accent-surface)',
                                color: 'var(--accent-primary)',
                                border: '1px solid var(--accent-glow)',
                            }}>
                                {snippet.trigger}
                            </span>
                            <ArrowRight size={14} className="flex-shrink-0" style={{ color: 'var(--text-quaternary)' }} />
                            <span className="text-[13px] truncate" style={{ color: 'var(--text-secondary)' }}>
                                {snippet.expansion}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteSnippet(snippet.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/10"
                            style={{ color: 'var(--status-error)' }}
                            aria-label={`Delete snippet ${snippet.trigger}`}
                        >
                            <Trash2 size={14} />
                        </button>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

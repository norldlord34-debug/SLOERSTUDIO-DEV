import { motion } from 'framer-motion';
import { StickyNote, Plus, Trash2, Search, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

type Note = {
    id: string;
    text: string;
    createdAt: number;
};

const STORAGE_KEY = 'sloervoice_scratchpad';

const loadNotes = (): Note[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveNotes = (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

const formatDate = (ts: number) => {
    const d = new Date(ts);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
};

const formatTime = (ts: number) => {
    const d = new Date(ts);
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m} ${ampm}`;
};

export default function Scratchpad() {
    const [notes, setNotes] = useState<Note[]>(loadNotes);
    const [search, setSearch] = useState('');
    const [newText, setNewText] = useState('');

    useEffect(() => {
        saveNotes(notes);
    }, [notes]);

    const addNote = useCallback(() => {
        if (!newText.trim()) return;
        const note: Note = {
            id: `note_${Date.now()}`,
            text: newText.trim(),
            createdAt: Date.now(),
        };
        setNotes(prev => [note, ...prev]);
        setNewText('');
    }, [newText]);

    const deleteNote = useCallback((id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    }, []);

    const filtered = search
        ? notes.filter(n => n.text.toLowerCase().includes(search.toLowerCase()))
        : notes;

    return (
        <motion.div className="space-y-6 pb-8" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>

            <motion.section variants={itemV}>
                <h1 className="text-[28px] leading-tight font-black tracking-[-0.03em] mb-6" style={{ fontFamily: 'Georgia, serif' }}>Scratchpad</h1>
            </motion.section>

            {/* Add note */}
            <motion.div variants={itemV} className="premium-panel px-5 py-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newText}
                        onChange={e => setNewText(e.target.value)}
                        placeholder="Write a quick note..."
                        className="flex-1 px-4 py-3 rounded-xl text-[13px] font-medium"
                        style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                        onKeyDown={e => { if (e.key === 'Enter') addNote(); }}
                    />
                    <button
                        onClick={addNote}
                        disabled={!newText.trim()}
                        className="premium-button-secondary whitespace-nowrap disabled:opacity-40"
                    >
                        <Plus size={14} /> Add
                    </button>
                </div>
            </motion.div>

            {/* Header with search */}
            <motion.div variants={itemV} className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-quaternary)' }}>
                    RECENTS
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                        <Search size={13} style={{ color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="bg-transparent text-[12px] outline-none w-24"
                            style={{ color: 'var(--text-primary)' }}
                        />
                    </div>
                    <button onClick={addNote} className="p-1.5 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
                        <Plus size={15} />
                    </button>
                    <button onClick={() => setNotes(loadNotes())} className="p-1.5 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
                        <RefreshCw size={15} />
                    </button>
                </div>
            </motion.div>

            {/* Notes list */}
            <motion.div variants={itemV} className="space-y-2">
                {filtered.length === 0 && (
                    <div className="premium-panel px-6 py-12 text-center">
                        <StickyNote size={32} className="mx-auto mb-3" style={{ color: 'var(--text-quaternary)' }} />
                        <div className="text-[14px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            {notes.length === 0 ? 'No notes yet. Start typing above!' : 'No notes match your search.'}
                        </div>
                    </div>
                )}
                {filtered.map(note => (
                    <motion.div
                        key={note.id}
                        layout
                        className="premium-panel px-5 py-4 group cursor-default"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-[14px] font-medium leading-6" style={{ color: 'var(--text-primary)' }}>
                                    {note.text}
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[12px]" style={{ color: 'var(--accent-primary)' }}>{formatDate(note.createdAt)}</span>
                                    <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{formatTime(note.createdAt)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteNote(note.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/10 flex-shrink-0"
                                style={{ color: 'var(--status-error)' }}
                                aria-label="Delete note"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

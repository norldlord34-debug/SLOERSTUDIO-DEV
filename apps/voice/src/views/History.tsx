import { motion } from 'framer-motion';
import { Download, Search, Trash2, Clock, Copy, ChevronDown, Volume2, Shield, Sparkles, AudioLines, TimerReset } from 'lucide-react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { showToast } from '../lib/toastBus';
import { createExportFilename, downloadTextFile } from '../lib/desktopMedia';

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

interface HistoryItem {
    id: number;
    text: string;
    duration_ms: number;
    speaking_ms: number;
    silence_ms: number;
    effective_duration_ms: number;
    raw_word_count: number;
    clean_word_count: number;
    avg_wpm: number;
    time_saved_ms: number;
    sentiment_label: string;
    sentiment_compound: number;
    sentiment_confidence: number;
    timestamp: string;
}

type Tone = 'success' | 'warning' | 'danger' | 'info';

export default function History() {
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const loadHistory = useCallback(async () => {
        try {
            const data: HistoryItem[] = await invoke('get_history');
            setHistory(data);
        } catch (e) {
            console.error('Failed to load history:', e);
        }
    }, []);

    useEffect(() => {
        let unlistenHistoryUpdated: (() => void) | undefined;

        const setup = async () => {
            await loadHistory();
            unlistenHistoryUpdated = await listen('history_updated', loadHistory);
        };

        setup();
        return () => {
            unlistenHistoryUpdated?.();
        };
    }, [loadHistory]);

    const handleClear = async () => {
        try {
            await invoke('clear_history');
            setHistory([]);
            showToast('success', 'History cleared');
        } catch (e) {
            console.error(e);
            showToast('error', 'Clear failed', 'History could not be cleared.');
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        try {
            await invoke('delete_history_item', { id });
            setHistory(prev => prev.filter(item => item.id !== id));
            showToast('success', 'Entry deleted');
        } catch (e) {
            console.error(e);
            showToast('error', 'Delete failed', 'The selected entry could not be deleted.');
        }
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const csv = await invoke<string>('export_history_csv');
            downloadTextFile(createExportFilename('SloerVoice-history', 'csv'), csv, 'text/csv;charset=utf-8');
            showToast('success', 'History CSV exported');
        } catch (e) {
            console.error('Failed to export history CSV', e);
            showToast('error', 'Export failed', 'History CSV could not be generated.');
        } finally {
            setIsExporting(false);
        }
    };

    const formatTimestamp = (isoString: string) => {
        try {
            const date = new Date(isoString + "Z");
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString();
        } catch {
            return isoString;
        }
    };

    const getWordCount = (item: HistoryItem) => item.clean_word_count || item.text.trim().split(/\s+/).filter(w => w.length > 0).length;

    const now = new Date();
    const filteredByRange = history.filter((item) => {
        if (filter === 'all') {
            return true;
        }
        const date = new Date(`${item.timestamp.replace(' ', 'T')}Z`);
        if (Number.isNaN(date.getTime())) {
            return true;
        }
        const diffMs = now.getTime() - date.getTime();
        if (filter === 'today') {
            return diffMs <= 24 * 60 * 60 * 1000;
        }
        if (filter === 'week') {
            return diffMs <= 7 * 24 * 60 * 60 * 1000;
        }
        return true;
    });

    const filteredHistory = filteredByRange.filter(item =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalWords = useMemo(() => history.reduce((acc, curr) => acc + getWordCount(curr), 0), [history]);
    const totalSavedMinutes = useMemo(() => history.reduce((acc, curr) => acc + (curr.time_saved_ms / 60000), 0), [history]);
    const averageDurationSeconds = useMemo(() => history.length > 0 ? history.reduce((acc, curr) => acc + curr.duration_ms, 0) / history.length / 1000 : 0, [history]);
    const longestSessionSeconds = useMemo(() => history.length > 0 ? Math.max(...history.map((item) => item.duration_ms)) / 1000 : 0, [history]);

    const getSentimentTone = (label: string): Tone => {
        if (label === 'positive') return 'success';
        if (label === 'negative') return 'danger';
        if (label === 'mixed') return 'warning';
        return 'info';
    };


    return (
        <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>

            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="premium-section-eyebrow mb-3">Transcription Vault</div>
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <h1 className="text-[28px] leading-tight font-black tracking-[-0.03em]">A premium operational archive for every dictated session.</h1>
                        <p className="text-[13px] mt-3 max-w-2xl leading-6" style={{ color: 'var(--text-secondary)' }}>
                            Search, audit, export and review every transcript in a vault designed for serious voice workflows, fast context recovery and executive-grade traceability.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="premium-chip" data-tone="success"><Shield size={12} /> Local encrypted history</span>
                        <span className="premium-chip" data-tone="info"><AudioLines size={12} /> Live transcript archive</span>
                        <span className="premium-chip" data-tone="warning"><Sparkles size={12} /> Premium evidence trail</span>
                    </div>
                </div>
            </motion.section>

            <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
                <motion.section variants={itemV} className="premium-panel px-5 py-5">
                    <div className="premium-section-eyebrow mb-3">Vault Summary</div>
                    <div className="grid gap-3 md:grid-cols-4">
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Records</div>
                            <div className="text-[22px] font-black mt-2">{history.length}</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Clean words</div>
                            <div className="text-[22px] font-black mt-2">{totalWords}</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Time saved</div>
                            <div className="text-[22px] font-black mt-2">{totalSavedMinutes.toFixed(1)}m</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Longest session</div>
                            <div className="text-[22px] font-black mt-2">{longestSessionSeconds.toFixed(1)}s</div>
                        </div>
                    </div>
                </motion.section>

                <motion.section variants={itemV} className="premium-panel px-5 py-5 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="premium-section-eyebrow mb-2">Search & Export</div>
                            <h2 className="text-[18px] font-bold">Filter the vault instantly.</h2>
                        </div>
                        <div className="premium-chip" data-tone="info"><TimerReset size={12} /> Avg {averageDurationSeconds.toFixed(1)}s</div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--text-quaternary)' }} />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search transcripts, phrases, or vocabulary..." className="pl-10 pr-4 py-3 text-[13px] w-full" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {['all', 'today', 'week'].map((value) => (
                            <button
                                key={value}
                                onClick={() => setFilter(value)}
                                className={filter === value ? 'premium-button-primary' : 'premium-button-secondary'}
                            >
                                {value === 'all' ? 'All sessions' : value.charAt(0).toUpperCase() + value.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button onClick={handleExport} disabled={isExporting} className="premium-button-secondary">
                            <Download size={13} /> {isExporting ? 'Exporting...' : 'Export CSV'}
                        </button>
                        <button onClick={handleClear} className="premium-button-secondary" style={{ borderColor: 'rgba(239, 68, 68, 0.18)', color: 'var(--status-error)' }}>
                            <Trash2 size={13} /> Clear vault
                        </button>
                    </div>
                </motion.section>
            </div>

            <div className="space-y-3">
                {filteredHistory.length === 0 && (
                    <motion.div variants={itemV} className="premium-panel px-6 py-12 text-center text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                        No history found. Start dictating to build your premium transcript vault.
                    </motion.div>
                )}

                {filteredHistory.map((t, index) => (
                    <motion.section
                        key={t.id}
                        variants={itemV}
                        className="premium-panel px-5 py-5 cursor-pointer"
                        onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[13px] font-black flex-shrink-0" style={{ color: 'var(--accent-premium)' }}>
                                {(index + 1).toString().padStart(2, '0')}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="premium-chip" data-tone="info"><Clock size={12} /> {formatTimestamp(t.timestamp)}</span>
                                    <span className="premium-chip" data-tone="success">{getWordCount(t)} words</span>
                                    <span className="premium-chip" data-tone="warning">{(t.time_saved_ms / 60000).toFixed(1)}m saved</span>
                                    <span className="premium-chip" data-tone={getSentimentTone(t.sentiment_label || 'neutral')}>{t.sentiment_label || 'neutral'}</span>
                                </div>

                                <p className={`text-[13px] leading-7 ${expandedId === t.id ? '' : 'line-clamp-2'}`} style={{ color: 'var(--text-primary)' }}>{t.text}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                    <div className="premium-stat-card px-3 py-3">
                                        <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Duration</div>
                                        <div className="text-[14px] font-bold mt-2">{(t.duration_ms / 1000).toFixed(1)}s</div>
                                    </div>
                                    <div className="premium-stat-card px-3 py-3">
                                        <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Pace</div>
                                        <div className="text-[14px] font-bold mt-2">{t.avg_wpm.toFixed(1)} wpm</div>
                                    </div>
                                    <div className="premium-stat-card px-3 py-3">
                                        <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Speaking</div>
                                        <div className="text-[14px] font-bold mt-2">{(t.speaking_ms / 1000).toFixed(1)}s</div>
                                    </div>
                                    <div className="premium-stat-card px-3 py-3">
                                        <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Effective</div>
                                        <div className="text-[14px] font-bold mt-2">{(t.effective_duration_ms / 1000).toFixed(1)}s</div>
                                    </div>
                                </div>

                                {expandedId === t.id && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-[11px]">
                                        <div className="premium-stat-card px-3 py-3">
                                            <div className="premium-muted">Silence</div>
                                            <div className="font-semibold mt-1">{(t.silence_ms / 1000).toFixed(1)}s</div>
                                        </div>
                                        <div className="premium-stat-card px-3 py-3">
                                            <div className="premium-muted">Raw words</div>
                                            <div className="font-semibold mt-1">{t.raw_word_count}</div>
                                        </div>
                                        <div className="premium-stat-card px-3 py-3">
                                            <div className="premium-muted">Confidence</div>
                                            <div className="font-semibold mt-1">{t.sentiment_confidence.toFixed(1)}%</div>
                                        </div>
                                        <div className="premium-stat-card px-3 py-3">
                                            <div className="premium-muted">Compound</div>
                                            <div className="font-semibold mt-1">{t.sentiment_compound.toFixed(2)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 self-end lg:self-start">
                                <button
                                    className="flex h-10 w-10 items-center justify-center rounded-xl surface-interactive"
                                    title="Copy"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                            await writeText(t.text);
                                            const btn = e.currentTarget;
                                            btn.style.color = 'var(--status-success)';
                                            setTimeout(() => btn.style.color = '', 1000);
                                        } catch (err) {
                                            console.error('Failed to copy', err);
                                        }
                                    }}
                                >
                                    <Copy size={14} style={{ color: 'inherit' }} />
                                </button>
                                <button
                                    className="flex h-10 w-10 items-center justify-center rounded-xl surface-interactive"
                                    title="Play TTS"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.speechSynthesis.cancel();
                                        const utterance = new SpeechSynthesisUtterance(t.text);
                                        window.speechSynthesis.speak(utterance);
                                    }}
                                >
                                    <Volume2 size={14} style={{ color: 'var(--accent-primary)' }} />
                                </button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-xl surface-interactive" title="Delete" onClick={(e) => handleDelete(e, t.id)}>
                                    <Trash2 size={14} style={{ color: 'var(--status-error)' }} />
                                </button>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                                    <ChevronDown size={14} className={`transition-transform ${expandedId === t.id ? 'rotate-180' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
                                </div>
                            </div>
                        </div>
                    </motion.section>
                ))}
            </div>
        </motion.div>
    );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Activity, AlertTriangle, Award, Clock, Download, Flame, Mic, ShieldAlert, Sparkles, TimerReset, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { createExportFilename, downloadBinaryFile, downloadTextFile } from '../lib/desktopMedia';
import { showToast } from '../lib/toastBus';

type SentimentResult = {
    positive: number;
    neutral: number;
    negative: number;
    average_compound: number;
    average_confidence: number;
    dominant_label: string;
};

type HourlyActivity = {
    hour: string;
    words: number;
    sessions: number;
    intensity: number;
};

type YearlyActivity = {
    date: string;
    label: string;
    month: string;
    week_index: number;
    weekday: number;
    words: number;
    sessions: number;
    intensity: number;
};

type WordFreq = {
    word: string;
    count: number;
    percentage: number;
};

type DailyProductivity = {
    date: string;
    label: string;
    words: number;
    saved_min: number;
    sessions: number;
};

type SentimentTrendPoint = {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
    compound: number;
};

type PermissionAlertSummary = {
    permission_key: string;
    count: number;
    last_event_type: string;
    last_message: string;
    last_seen: string;
};

type StreakSummary = {
    current: number;
    longest: number;
    last_active_date: string | null;
    next_milestone: number;
    reward_label: string;
};

type AnalyticsOverview = {
    total_words: number;
    total_raw_words: number;
    time_saved_min: number;
    total_sessions: number;
    avg_wpm: number;
    current_streak: number;
    longest_streak: number;
    avg_time_saved_per_session_min: number;
    projected_monthly_saved_min: number;
    projected_yearly_saved_min: number;
    filler_filtered_words: number;
    total_speaking_min: number;
    total_silence_min: number;
    total_permission_alerts: number;
    sentiment: SentimentResult;
    top_words: WordFreq[];
    word_cloud: WordFreq[];
    hourly_heatmap: HourlyActivity[];
    yearly_heatmap: YearlyActivity[];
    recent_productivity: DailyProductivity[];
    sentiment_trend: SentimentTrendPoint[];
    permission_alerts: PermissionAlertSummary[];
    streak: StreakSummary;
};

type HeatmapColumn = {
    month: string;
    days: YearlyActivity[];
};

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } },
};

const SENTIMENT_COLORS = ['#22c55e', '#64748b', '#ef4444'];
const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function AnimatedNumber({ value, suffix = '', digits = 0 }: { value: number; suffix?: string; digits?: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        let frameId: number | undefined;
        if (value === 0) {
            frameId = window.requestAnimationFrame(() => setDisplay(0));
            return () => {
                if (frameId) window.cancelAnimationFrame(frameId);
            };
        }
        const step = value / 30;
        const intervalId = window.setInterval(() => {
            start += step;
            if (start >= value) {
                setDisplay(value);
                window.clearInterval(intervalId);
            } else {
                setDisplay(start);
            }
        }, 20);
        return () => {
            window.clearInterval(intervalId);
            if (frameId) window.cancelAnimationFrame(frameId);
        };
    }, [value]);

    return <>{display.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })}{suffix}</>;
}

function formatDateTime(value: string) {
    const date = new Date(`${value.replace(' ', 'T')}Z`);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString();
}

function formatMinutes(value: number) {
    if (value >= 60) {
        return `${(value / 60).toFixed(1)}h`;
    }
    return `${value}m`;
}

function intensityToBackground(intensity: number) {
    const alpha = Math.max(0.08, Math.min(0.95, intensity / 100));
    return `rgba(99, 243, 255, ${alpha})`;
}

export default function OverviewDashboard() {
    const [data, setData] = useState<AnalyticsOverview | null>(null);
    const [isExportingCsv, setIsExportingCsv] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const loadAnalytics = useCallback(async () => {
        try {
            const response = await invoke<AnalyticsOverview>('get_analytics_dashboard_data');
            setData(response);
        } catch (error) {
            console.error('Failed to load analytics dashboard', error);
            showToast('error', 'Analytics unavailable', 'The dashboard data could not be loaded.');
        }
    }, []);

    useEffect(() => {
        let unlisten: (() => void) | undefined;
        const setup = async () => {
            await loadAnalytics();
            unlisten = await listen('history_updated', loadAnalytics);
        };
        setup();
        return () => {
            unlisten?.();
        };
    }, [loadAnalytics]);

    const handleExportAnalyticsCsv = useCallback(async () => {
        try {
            setIsExportingCsv(true);
            const csv = await invoke<string>('export_analytics_csv');
            downloadTextFile(createExportFilename('SloerVoice-analytics', 'csv'), csv, 'text/csv;charset=utf-8');
            showToast('success', 'Analytics CSV exported');
        } catch (error) {
            console.error('Failed to export analytics CSV', error);
            showToast('error', 'CSV export failed', 'Analytics CSV could not be generated.');
        } finally {
            setIsExportingCsv(false);
        }
    }, []);

    const handleExportAnalyticsPdf = useCallback(async () => {
        try {
            setIsExportingPdf(true);
            const pdf = await invoke<number[]>('export_analytics_pdf');
            downloadBinaryFile(createExportFilename('SloerVoice-analytics', 'pdf'), pdf, 'application/pdf');
            showToast('success', 'Analytics PDF exported');
        } catch (error) {
            console.error('Failed to export analytics PDF', error);
            showToast('error', 'PDF export failed', 'Analytics PDF could not be generated.');
        } finally {
            setIsExportingPdf(false);
        }
    }, []);

    const stats = useMemo(() => [
        { label: 'Clean Words', value: data?.total_words ?? 0, suffix: '', icon: Zap },
        { label: 'Time Saved', value: data?.time_saved_min ?? 0, suffix: ' min', icon: Clock },
        { label: 'Sessions', value: data?.total_sessions ?? 0, suffix: '', icon: Mic },
        { label: 'Avg Pace', value: data?.avg_wpm ?? 0, suffix: ' wpm', icon: Activity },
    ], [data]);

    const summaryStats = useMemo(() => [
        { label: 'Filtered fillers', value: data?.filler_filtered_words ?? 0, icon: TimerReset },
        { label: 'Speaking time', value: data?.total_speaking_min ?? 0, icon: Flame, formatter: formatMinutes },
        { label: 'Silence time', value: data?.total_silence_min ?? 0, icon: Clock, formatter: formatMinutes },
        { label: 'Permission alerts', value: data?.total_permission_alerts ?? 0, icon: ShieldAlert },
    ], [data]);

    const sentimentData = useMemo(() => data ? [
        { name: 'Positive', value: data.sentiment.positive },
        { name: 'Neutral', value: data.sentiment.neutral },
        { name: 'Negative', value: data.sentiment.negative },
    ].filter((item) => item.value > 0) : [], [data]);

    const yearlyColumns = useMemo<HeatmapColumn[]>(() => {
        if (!data?.yearly_heatmap?.length) {
            return [];
        }
        const grouped = new Map<number, HeatmapColumn>();
        for (const cell of data.yearly_heatmap) {
            const existing = grouped.get(cell.week_index);
            if (existing) {
                existing.days.push(cell);
            } else {
                grouped.set(cell.week_index, { month: cell.month, days: [cell] });
            }
        }
        return Array.from(grouped.entries())
            .sort((left, right) => left[0] - right[0])
            .map(([, column]) => column);
    }, [data]);

    const milestoneProgress = useMemo(() => {
        if (!data?.streak) {
            return 0;
        }
        return Math.min(100, Math.round((data.streak.current / Math.max(1, data.streak.next_milestone)) * 100));
    }, [data]);

    const executiveSignals = useMemo(() => [
        {
            label: 'Projected savings',
            value: `${data?.projected_monthly_saved_min ?? 0}m / month`,
            detail: `${data?.projected_yearly_saved_min ?? 0}m yearly equivalent`,
            tone: 'warning' as const,
        },
        {
            label: 'Runtime posture',
            value: `${data?.total_permission_alerts ?? 0} alerts`,
            detail: `${data?.total_sessions ?? 0} tracked sessions`,
            tone: (data?.total_permission_alerts ?? 0) > 0 ? 'danger' as const : 'success' as const,
        },
        {
            label: 'Vocabulary map',
            value: `${data?.word_cloud.length ?? 0} tracked terms`,
            detail: `${data?.top_words.length ?? 0} top-ranked insights`,
            tone: 'info' as const,
        },
    ], [data]);

    if (!data) {
        return (
            <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
                <motion.div variants={itemV} className="premium-panel px-6 py-10 text-center text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                    <div className="premium-section-eyebrow mb-3">Analytics Core</div>
                    Loading analytics dashboard...
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="premium-section-eyebrow mb-3">Analytics Command Center</div>
                <div className="grid gap-5 xl:grid-cols-[1.35fr,0.8fr]">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="premium-chip" data-tone="success"><Activity size={12} /> Live telemetry</span>
                            <span className="premium-chip" data-tone="info"><Sparkles size={12} /> Executive metrics</span>
                            <span className="premium-chip" data-tone="warning"><Award size={12} /> {data.streak.reward_label}</span>
                        </div>
                        <h1 className="text-[30px] leading-tight font-black tracking-[-0.03em]">Voice intelligence with premium analytics, reliability insight and executive-level clarity.</h1>
                        <p className="text-[13px] mt-3 max-w-2xl leading-6" style={{ color: 'var(--text-secondary)' }}>
                            Monitor productivity, pace, sentiment, permission reliability and long-term dictation performance through a flagship command surface built for a premium local AI workflow.
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-5">
                            <button onClick={handleExportAnalyticsCsv} disabled={isExportingCsv} className="premium-button-secondary">
                                <Download size={13} /> {isExportingCsv ? 'Exporting CSV...' : 'Export CSV'}
                            </button>
                            <button onClick={handleExportAnalyticsPdf} disabled={isExportingPdf} className="premium-button-primary">
                                <Download size={13} /> {isExportingPdf ? 'Exporting PDF...' : 'Export PDF'}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {executiveSignals.map((signal) => (
                            <div key={signal.label} className="premium-stat-card px-4 py-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">{signal.label}</div>
                                    <span className="premium-chip" data-tone={signal.tone}>{signal.tone === 'warning' ? 'Forecast' : signal.tone === 'danger' ? 'Attention' : signal.tone === 'success' ? 'Stable' : 'Signal'}</span>
                                </div>
                                <div className="text-[20px] font-black mt-3 tracking-[-0.03em]">{signal.value}</div>
                                <div className="text-[12px] mt-2" style={{ color: 'var(--text-secondary)' }}>{signal.detail}</div>
                            </div>
                        ))}
                        <div className="premium-stat-card px-4 py-4">
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Milestone rail</div>
                                    <div className="text-[14px] font-bold mt-1">{data.streak.reward_label}</div>
                                </div>
                                <span className="premium-chip" data-tone="warning">{milestoneProgress}%</span>
                            </div>
                            <div className="premium-progress-track">
                                <div className="premium-progress-bar" style={{ width: `${milestoneProgress}%` }} />
                            </div>
                            <div className="text-[12px] mt-3" style={{ color: 'var(--text-secondary)' }}>
                                {data.streak.current}/{data.streak.next_milestone} days to the next streak milestone.
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((stat) => (
                    <motion.div key={stat.label} variants={itemV} className="premium-stat-card p-4 group cursor-default">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</span>
                            <stat.icon size={14} style={{ color: 'var(--accent-premium)' }} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold tabular-nums"><AnimatedNumber value={stat.value} suffix={stat.suffix} /></span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                {summaryStats.map((stat) => (
                    <motion.div key={stat.label} variants={itemV} className="premium-stat-card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</span>
                            <stat.icon size={14} style={{ color: 'var(--accent-primary)' }} />
                        </div>
                        <div className="text-xl font-bold tabular-nums">{stat.formatter ? stat.formatter(stat.value) : stat.value.toLocaleString()}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                <motion.div variants={itemV} className="lg:col-span-3 premium-panel px-5 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="premium-section-eyebrow mb-2">Operational Trend</div>
                            <h3 className="text-[15px] font-bold">Daily Productivity</h3>
                            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Words and time saved during the last 14 days.</p>
                        </div>
                        <div className="text-right text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                            <div>{data.projected_monthly_saved_min}m projected / month</div>
                            <div>{data.projected_yearly_saved_min}m projected / year</div>
                        </div>
                    </div>
                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.recent_productivity} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="productivityWords" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="productivitySaved" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--status-info)" stopOpacity={0.28} />
                                        <stop offset="95%" stopColor="var(--status-info)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                                <XAxis dataKey="label" stroke="var(--text-quaternary)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-quaternary)" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '12px' }} />
                                <Area type="monotone" dataKey="words" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#productivityWords)" />
                                <Area type="monotone" dataKey="saved_min" stroke="var(--status-info)" strokeWidth={2} fillOpacity={1} fill="url(#productivitySaved)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemV} className="lg:col-span-2 premium-panel px-5 py-5">
                    <div className="mb-4">
                        <div className="premium-section-eyebrow mb-2">Consistency Engine</div>
                        <h3 className="text-[15px] font-bold">Streak & Savings</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{data.streak.reward_label}</p>
                    </div>
                    <div className="space-y-4">
                        <div className="premium-stat-card flex items-center justify-between px-4 py-4" style={{ background: 'linear-gradient(180deg, rgba(246, 193, 95, 0.12), rgba(255, 255, 255, 0.02))' }}>
                            <div>
                                <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Current streak</div>
                                <div className="text-2xl font-bold">{data.streak.current} days</div>
                            </div>
                            <Flame size={18} style={{ color: 'var(--status-warning)' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="premium-stat-card px-4 py-4">
                                <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Longest</div>
                                <div className="text-lg font-bold">{data.streak.longest} days</div>
                            </div>
                            <div className="premium-stat-card px-4 py-4">
                                <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>Avg saved</div>
                                <div className="text-lg font-bold"><AnimatedNumber value={data.avg_time_saved_per_session_min} suffix="m" digits={1} /></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between text-[11px] mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                <span>Next milestone</span>
                                <span>{data.streak.current}/{data.streak.next_milestone} days</span>
                            </div>
                            <div className="premium-progress-track">
                                <div className="premium-progress-bar" style={{ width: `${milestoneProgress}%` }} />
                            </div>
                        </div>
                        <div className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                            Last active day: {data.streak.last_active_date ?? 'No activity yet'}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                <motion.div variants={itemV} className="lg:col-span-2 premium-panel px-5 py-5 flex flex-col">
                    <div className="mb-2">
                        <div className="premium-section-eyebrow mb-2">Emotional Layer</div>
                        <h3 className="text-[15px] font-bold flex items-center gap-2">Sentiment Analysis</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>VADER polarity with confidence and compound trend.</p>
                    </div>
                    {sentimentData.length > 0 ? (
                        <div className="flex-1 flex items-center">
                            <div className="w-1/2 h-[160px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                                            {sentimentData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '12px' }} formatter={((value: number | undefined) => `${value ?? 0}%`) as any} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 space-y-3 pl-4">
                                <div className="flex items-center justify-between text-[12px]"><span>Positive</span><span>{data.sentiment.positive}%</span></div>
                                <div className="flex items-center justify-between text-[12px]"><span>Neutral</span><span>{data.sentiment.neutral}%</span></div>
                                <div className="flex items-center justify-between text-[12px]"><span>Negative</span><span>{data.sentiment.negative}%</span></div>
                                <div className="pt-2 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                    <div>Dominant: {data.sentiment.dominant_label}</div>
                                    <div>Compound: {data.sentiment.average_compound}</div>
                                    <div>Confidence: {data.sentiment.average_confidence}%</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[12px] premium-muted">VADER is awaiting input data.</div>
                    )}
                </motion.div>

                <motion.div variants={itemV} className="lg:col-span-3 premium-panel px-5 py-5">
                    <div className="mb-4">
                        <div className="premium-section-eyebrow mb-2">Compound Drift</div>
                        <h3 className="text-[15px] font-bold">Sentiment Trend</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Daily compound score during the last 14 days.</p>
                    </div>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.sentiment_trend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                                <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} stroke="var(--text-quaternary)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-quaternary)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '12px' }} />
                                <Bar dataKey="compound" radius={[3, 3, 0, 0]}>
                                    {data.sentiment_trend.map((entry) => (
                                        <Cell key={entry.date} fill={entry.compound >= 0 ? 'var(--status-success)' : 'var(--status-error)'} opacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                <motion.div variants={itemV} className="lg:col-span-2 premium-panel px-5 py-5">
                    <div className="mb-4">
                        <div className="premium-section-eyebrow mb-2">Lexicon Pressure</div>
                        <h3 className="text-[15px] font-bold">Top Words</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Most frequent non-stop words with distribution.</p>
                    </div>
                    <div className="space-y-3">
                        {data.top_words.length > 0 ? data.top_words.map((word) => (
                            <div key={word.word} className="premium-stat-card px-3 py-3">
                                <div className="flex items-center justify-between text-[12px] mb-1">
                                    <span className="font-medium">{word.word}</span>
                                    <span style={{ color: 'var(--text-tertiary)' }}>{word.count} · {word.percentage}%</span>
                                </div>
                                <div className="premium-progress-track">
                                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, word.percentage * 2.4)}%`, background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))' }} />
                                </div>
                            </div>
                        )) : (
                            <div className="text-[12px] premium-muted">No words analyzed yet.</div>
                        )}
                    </div>
                </motion.div>

                <motion.div variants={itemV} className="lg:col-span-3 premium-panel px-5 py-5">
                    <div className="mb-4">
                        <div className="premium-section-eyebrow mb-2">Activity Density</div>
                        <h3 className="text-[15px] font-bold">Hourly Activity Heatmap</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>When do you dictate the most?</p>
                    </div>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.hourly_heatmap} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                                <XAxis dataKey="hour" stroke="var(--text-quaternary)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-quaternary)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '12px' }} />
                                <Bar dataKey="words" radius={[3, 3, 0, 0]}>
                                    {data.hourly_heatmap.map((entry) => (
                                        <Cell key={entry.hour} fill="var(--status-info)" opacity={0.25 + entry.intensity * 0.75} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                <motion.div variants={itemV} className="lg:col-span-3 premium-panel px-5 py-5">
                    <div className="mb-4">
                        <div className="premium-section-eyebrow mb-2">Long Horizon</div>
                        <h3 className="text-[15px] font-bold">Yearly Activity Heatmap</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Activity density across the last 365 days.</p>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar pb-2">
                        <div className="flex gap-1 min-w-max">
                            <div className="flex flex-col justify-end gap-1 pr-2 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                                {WEEKDAY_LABELS.map((label) => <span key={label} className="h-3 leading-3">{label}</span>)}
                            </div>
                            {yearlyColumns.map((column, columnIndex) => (
                                <div key={`${column.month}-${columnIndex}`} className="flex flex-col gap-1">
                                    {column.days.map((cell) => (
                                        <div
                                            key={cell.date}
                                            title={`${cell.label} · ${cell.words} words · ${cell.sessions} sessions`}
                                            className="w-3 h-3 rounded-[3px]"
                                            style={{ background: cell.words > 0 ? intensityToBackground(cell.intensity) : 'rgba(148, 163, 184, 0.1)' }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemV} className="lg:col-span-2 premium-panel px-5 py-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <div className="premium-section-eyebrow mb-2">Risk Monitor</div>
                            <h3 className="text-[15px] font-bold">Permission Alerts</h3>
                            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Persisted microphone incidents and their latest message.</p>
                        </div>
                        <AlertTriangle size={16} style={{ color: 'var(--status-warning)' }} />
                    </div>
                    <div className="space-y-3 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
                        {data.permission_alerts.length > 0 ? data.permission_alerts.map((alert) => (
                            <div key={alert.permission_key} className="premium-stat-card p-3" style={{ borderColor: 'rgba(239, 68, 68, 0.18)', background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.08), rgba(255, 255, 255, 0.02))' }}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-[12px] font-semibold">{alert.permission_key.replace(/_/g, ' ')}</div>
                                    <div className="text-[11px] font-bold" style={{ color: 'var(--status-error)' }}>{alert.count} events</div>
                                </div>
                                <div className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>{alert.last_message}</div>
                                <div className="text-[10px] mt-2" style={{ color: 'var(--text-quaternary)' }}>{formatDateTime(alert.last_seen)}</div>
                            </div>
                        )) : (
                            <div className="text-[12px] premium-muted">No permission issues logged.</div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                <motion.div variants={itemV} className="lg:col-span-3 premium-panel px-5 py-5">
                    <div className="mb-4">
                        <div className="premium-section-eyebrow mb-2">Vocabulary Mesh</div>
                        <h3 className="text-[15px] font-bold">Word Cloud Table</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Expanded vocabulary list filtered from fillers and stop words.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                        {data.word_cloud.length > 0 ? data.word_cloud.map((word) => (
                            <div key={word.word} className="premium-stat-card px-3 py-3">
                                <div className="font-semibold text-[12px]">{word.word}</div>
                                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{word.count} uses · {word.percentage}%</div>
                            </div>
                        )) : (
                            <div className="text-[12px] premium-muted">Vocabulary heatmap will appear here once sessions are stored.</div>
                        )}
                    </div>
                </motion.div>

                <motion.div variants={itemV} className="lg:col-span-2 premium-panel px-5 py-5">
                    <div className="mb-4">
                        <div className="premium-section-eyebrow mb-2">Signal Integrity</div>
                        <h3 className="text-[15px] font-bold">Runtime Quality</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>How runtime capture is affecting productivity metrics.</p>
                    </div>
                    <div className="space-y-3 text-[12px]">
                        <div className="premium-stat-card flex items-center justify-between px-4 py-4">
                            <span>Raw words</span>
                            <span className="font-bold">{data.total_raw_words}</span>
                        </div>
                        <div className="premium-stat-card flex items-center justify-between px-4 py-4">
                            <span>Clean words</span>
                            <span className="font-bold">{data.total_words}</span>
                        </div>
                        <div className="premium-stat-card flex items-center justify-between px-4 py-4">
                            <span>Avg saved / session</span>
                            <span className="font-bold">{data.avg_time_saved_per_session_min.toFixed(1)} min</span>
                        </div>
                        <div className="premium-stat-card flex items-center justify-between px-4 py-4">
                            <span>Dominant mood</span>
                            <span className="font-bold capitalize">{data.sentiment.dominant_label}</span>
                        </div>
                        <div className="premium-stat-card px-4 py-4" style={{ background: 'linear-gradient(180deg, rgba(99, 243, 255, 0.08), rgba(255, 255, 255, 0.02))' }}>
                            <div className="flex items-center gap-2 font-semibold mb-1"><Sparkles size={14} /> Session insight</div>
                            <div style={{ color: 'var(--text-tertiary)' }}>
                                {data.total_sessions > 0
                                    ? `Your average dictation speed is ${data.avg_wpm} WPM and has already saved ${data.time_saved_min} minutes compared to typing at 40 WPM.`
                                    : 'Start a session to unlock productivity insights.'}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

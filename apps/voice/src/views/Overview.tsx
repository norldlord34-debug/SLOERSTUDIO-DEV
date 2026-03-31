import { Activity, Clock, Mic, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface SentimentResult {
    positive: number;
    neutral: number;
    negative: number;
}

interface HourlyActivity { hour: string; words: number; }
interface WordFreq { word: string; count: number; }
interface DailyProductivity { name: string; words: number; saved: number; }

interface AnalyticsOverview {
    total_words: number;
    time_saved_min: number;
    total_sessions: number;
    avg_wpm: number;
    current_streak: number;
    sentiment: SentimentResult;
    top_words: WordFreq[];
    hourly_heatmap: HourlyActivity[];
    recent_productivity: DailyProductivity[];
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        let frameId = 0;
        if (value === 0) {
            frameId = window.requestAnimationFrame(() => setDisplay(0));
            return () => {
                if (frameId) window.cancelAnimationFrame(frameId);
            };
        }
        const step = value / 30;
        const interval = window.setInterval(() => {
            start += step;
            if (start >= value) { setDisplay(value); window.clearInterval(interval); }
            else setDisplay(Math.floor(start));
        }, 20);
        return () => {
            window.clearInterval(interval);
            if (frameId) window.cancelAnimationFrame(frameId);
        };
    }, [value]);
    return <>{display.toLocaleString()}{suffix}</>;
}

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

const SENTIMENT_COLORS = ['#22c55e', '#64748b', '#ef4444']; // Pos, Neu, Neg

export default function Overview() {
    const [data, setData] = useState<AnalyticsOverview | null>(null);

    useEffect(() => {
        invoke<AnalyticsOverview>('get_analytics_dashboard_data')
            .then(res => setData(res))
            .catch(console.error);
    }, []);

    const stats = [
        { label: 'Total Words', value: data?.total_words || 0, suffix: '', icon: Zap },
        { label: 'Time Saved', value: data?.time_saved_min || 0, suffix: 'min', icon: Clock },
        { label: 'Sessions', value: data?.total_sessions || 0, suffix: '', icon: Mic },
        { label: 'Avg Pace', value: data?.avg_wpm || 0, suffix: ' wpm', icon: Activity },
    ];

    const sentimentData = data ? [
        { name: 'Positive', value: data.sentiment.positive },
        { name: 'Neutral', value: data.sentiment.neutral },
        { name: 'Negative', value: data.sentiment.negative },
    ].filter(s => s.value > 0) : [];

    return (
        <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>

            {/* Top Toolbar (Streak & Status) */}
            <motion.div variants={itemV} className="flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-bold">Analytics Dashboard</h1>
                    <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Advanced Voice Metrics & Trends</p>
                </div>
                {data && data.current_streak > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400">
                        <Award size={14} />
                        <span className="text-[12px] font-bold">{data.current_streak} Day Streak!</span>
                    </div>
                )}
            </motion.div>

            {/* KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((s, i) => (
                    <motion.div key={i} variants={itemV} className="glass-panel p-4 group cursor-default">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{s.label}</span>
                            <s.icon size={14} style={{ color: 'var(--text-quaternary)' }} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold tabular-nums"><AnimatedNumber value={s.value} suffix={s.suffix} /></span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1: Productivity & Frequency */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

                {/* Main Productivity Chart */}
                <motion.div variants={itemV} className="lg:col-span-3 glass-panel p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-[15px] font-bold">Productivity Heatmap</h3>
                            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Words transcribed per day</p>
                        </div>
                    </div>
                    <div className="h-[220px]">
                        {data && data.recent_productivity.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.recent_productivity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorW" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="var(--text-quaternary)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-quaternary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v: number) => v > 999 ? `${(v / 1000).toFixed(1)}k` : v.toString()} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="words" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorW)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[12px] text-gray-500">Not enough data to map productivity.</div>
                        )}
                    </div>
                </motion.div>

                {/* Word Frequency */}
                <motion.div variants={itemV} className="lg:col-span-2 glass-panel p-5">
                    <div className="mb-4">
                        <h3 className="text-[15px] font-bold">Top Words</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Most frequent non-stop words</p>
                    </div>
                    <div className="h-[220px]">
                        {data && data.top_words.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.top_words} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="word" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} width={70} />
                                    <Tooltip cursor={{ fill: 'var(--bg-input)' }} contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '12px' }} />
                                    <Bar dataKey="count" fill="var(--accent-secondary)" radius={[0, 4, 4, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[12px] text-gray-500">No words analyzed yet.</div>
                        )}
                    </div>
                </motion.div>

            </div>

            {/* Charts Row 2: VADER Sentiment & Hourly Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

                {/* VADER Sentiment */}
                <motion.div variants={itemV} className="lg:col-span-2 glass-panel p-5 flex flex-col">
                    <div className="mb-2">
                        <h3 className="text-[15px] font-bold flex items-center gap-2">Sentiment Analysis</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>VADER Polarity Scores</p>
                    </div>
                    {data && sentimentData.length > 0 ? (
                        <div className="flex-1 flex items-center">
                            <div className="w-1/2 h-[160px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                                            {sentimentData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '12px' }} formatter={(val) => `${val}%`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 space-y-3 pl-4">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[12px] text-gray-400">Positive {data.sentiment.positive}%</span></div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-500"></div><span className="text-[12px] text-gray-400">Neutral {data.sentiment.neutral}%</span></div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[12px] text-gray-400">Negative {data.sentiment.negative}%</span></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[12px] text-gray-500">VADER is awaiting input data.</div>
                    )}
                </motion.div>

                {/* Hourly Activity */}
                <motion.div variants={itemV} className="lg:col-span-3 glass-panel p-5">
                    <div className="mb-4">
                        <h3 className="text-[15px] font-bold">Hourly Activity Heatmap</h3>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>When do you dictate the most?</p>
                    </div>
                    <div className="h-[140px]">
                        {data && data.hourly_heatmap.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.hourly_heatmap.filter(h => h.words > 0)} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                    <XAxis dataKey="hour" stroke="var(--text-quaternary)" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-quaternary)" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '12px' }} />
                                    <Bar dataKey="words" fill="var(--status-info)" radius={[3, 3, 0, 0]} opacity={0.8} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[12px] text-gray-500">No activity logged today.</div>
                        )}
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}

import { motion } from 'framer-motion';
import { useState } from 'react';

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

type StyleTab = 'personal' | 'work' | 'email' | 'other';
type StyleId = 'formal' | 'casual' | 'excited';

const STORAGE_KEY = 'sloervoice_style_prefs';

type TabConfig = {
    id: StyleTab;
    label: string;
    bannerText: string;
    bannerSub: string;
    styles: Array<{
        id: StyleId;
        title: string;
        subtitle: string;
        sample: string;
        senderName?: string;
        senderTime?: string;
        recipientLine?: string;
        closingLine?: string;
    }>;
};

const tabs: TabConfig[] = [
    {
        id: 'personal',
        label: 'Personal messages',
        bannerText: 'This style applies in personal messengers',
        bannerSub: 'Style formatting only applies in English. More languages coming soon.',
        styles: [
            {
                id: 'formal',
                title: 'Formal.',
                subtitle: 'Caps + Punctuation',
                sample: "Hey, are you free for lunch tomorrow? Let's do 12 if that works for you.",
            },
            {
                id: 'casual',
                title: 'Casual',
                subtitle: 'Caps + Less punctuation',
                sample: "Hey are you free for lunch tomorrow? Let's do 12 if that works for you",
            },
            {
                id: 'excited',
                title: 'very casual',
                subtitle: 'No Caps + Less punctuation',
                sample: "hey are you free for lunch tomorrow? let's do 12 if that works for you",
            },
        ],
    },
    {
        id: 'work',
        label: 'Work messages',
        bannerText: 'This style applies in workplace messengers',
        bannerSub: 'Style formatting only applies in English. More languages coming soon.',
        styles: [
            {
                id: 'formal',
                title: 'Formal.',
                subtitle: 'Caps + Punctuation',
                sample: "Hey, if you're free, let's chat about the great results.",
                senderName: 'John Doe', senderTime: '9:45 AM',
            },
            {
                id: 'casual',
                title: 'Casual',
                subtitle: 'Caps + Less punctuation',
                sample: "Hey, if you're free let's chat about the great results",
                senderName: 'John Doe', senderTime: '9:45 AM',
            },
            {
                id: 'excited',
                title: 'Excited!',
                subtitle: 'More exclamations',
                sample: "Hey, if you're free, let's chat about the great results!",
                senderName: 'John Doe', senderTime: '9:45 AM',
            },
        ],
    },
    {
        id: 'email',
        label: 'Email',
        bannerText: 'This style applies in all major email apps',
        bannerSub: 'Style formatting only applies in English. More languages coming soon.',
        styles: [
            {
                id: 'formal',
                title: 'Formal.',
                subtitle: 'Caps + Punctuation',
                recipientLine: 'To: Alex Doe',
                sample: "Hi Alex,\n\nIt was great talking with you today. Looking forward to our next chat.",
                closingLine: "Best,\nMary",
            },
            {
                id: 'casual',
                title: 'Casual',
                subtitle: 'Caps + Less punctuation',
                recipientLine: 'To: Alex Doe',
                sample: "Hi Alex, it was great talking with you today. Looking forward to our next chat.",
                closingLine: "Best,\nMary",
            },
            {
                id: 'excited',
                title: 'Excited!',
                subtitle: 'More exclamations',
                recipientLine: 'To: Alex Doe',
                sample: "Hi Alex,\n\nIt was great talking with you today. Looking forward to our next chat!",
                closingLine: "Best,\nMary",
            },
        ],
    },
    {
        id: 'other',
        label: 'Other',
        bannerText: 'This style applies in all other apps',
        bannerSub: 'Style formatting only applies in English. More languages coming soon.',
        styles: [
            {
                id: 'formal',
                title: 'Formal.',
                subtitle: 'Caps + Punctuation',
                sample: "So far, I am enjoying the new workout routine.\n\nI am excited for tomorrow's workout, especially after a full night of rest.",
            },
            {
                id: 'casual',
                title: 'Casual',
                subtitle: 'Caps + Less punctuation',
                sample: "So far I am enjoying the new workout routine.\n\nI am excited for tomorrow's workout especially after a full night of rest.",
            },
            {
                id: 'excited',
                title: 'Excited!',
                subtitle: 'More exclamations',
                sample: "So far, I am enjoying the new workout routine.\n\nI am excited for tomorrow's workout, especially after a full night of rest!",
            },
        ],
    },
];

const loadPrefs = (): Record<StyleTab, StyleId> => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : { personal: 'formal', work: 'formal', email: 'formal', other: 'formal' };
    } catch {
        return { personal: 'formal', work: 'formal', email: 'formal', other: 'formal' };
    }
};

const avatarColors: Record<StyleId, string> = {
    formal: 'var(--accent-surface)',
    casual: '#f9a8d4',
    excited: '#f472b6',
};

export default function Style() {
    const [activeTab, setActiveTab] = useState<StyleTab>('personal');
    const [prefs, setPrefs] = useState<Record<StyleTab, StyleId>>(loadPrefs);

    const selectStyle = (tab: StyleTab, styleId: StyleId) => {
        const next = { ...prefs, [tab]: styleId };
        setPrefs(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const tabConfig = tabs.find(t => t.id === activeTab)!;

    return (
        <motion.div className="space-y-6 pb-8" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>

            <motion.section variants={itemV}>
                <h1 className="text-[28px] leading-tight font-black tracking-[-0.03em] mb-6">Style</h1>

                {/* Tabs */}
                <div className="flex items-center gap-6 mb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="pb-3 text-[14px] font-medium transition-colors relative"
                            style={{
                                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            }}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="styleTabIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                                    style={{ background: 'var(--text-primary)' }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Banner */}
                <div
                    className="rounded-2xl px-6 py-5 mb-6 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)',
                    }}
                >
                    <div className="relative z-10">
                        <h2 className="text-[18px] font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                            {tabConfig.bannerText}
                        </h2>
                        <p className="text-[12px] text-white/60">{tabConfig.bannerSub}</p>
                    </div>
                </div>

                {/* Style Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tabConfig.styles.map(style => {
                        const isSelected = prefs[activeTab] === style.id;
                        return (
                            <motion.button
                                key={style.id}
                                onClick={() => selectStyle(activeTab, style.id)}
                                className="text-left rounded-2xl p-5 transition-all"
                                whileHover={{ y: -2 }}
                                style={{
                                    background: 'var(--bg-card)',
                                    border: isSelected
                                        ? '2px dashed var(--text-tertiary)'
                                        : '1px solid var(--border-subtle)',
                                    cursor: 'pointer',
                                }}
                            >
                                {/* Title */}
                                <h3 className="text-[22px] font-black mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                                    {style.title}
                                </h3>
                                <p className="text-[12px] mb-4" style={{ color: 'var(--text-tertiary)' }}>
                                    {style.subtitle}
                                </p>

                                {/* Sender line (work messages) */}
                                {style.senderName && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                                            style={{ background: avatarColors[style.id], color: '#fff' }}
                                        >
                                            {style.senderName.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="text-[12px] font-semibold">{style.senderName}</span>
                                            <span className="text-[11px] ml-2" style={{ color: 'var(--text-tertiary)' }}>{style.senderTime}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Recipient line (email) */}
                                {style.recipientLine && (
                                    <div className="mb-2">
                                        <div className="flex gap-1 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-quaternary)' }} />
                                            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-quaternary)' }} />
                                            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-quaternary)' }} />
                                        </div>
                                        <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{style.recipientLine}</div>
                                    </div>
                                )}

                                {/* Sample text */}
                                <div className="text-[13px] leading-6 whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                                    {style.sample}
                                </div>

                                {/* Closing line (email) */}
                                {style.closingLine && (
                                    <div className="text-[13px] leading-6 mt-3 whitespace-pre-line font-medium" style={{ color: 'var(--text-secondary)' }}>
                                        {style.closingLine}
                                    </div>
                                )}

                                {/* Avatar for personal messages (no sender line) */}
                                {!style.senderName && !style.recipientLine && (
                                    <div className="flex justify-end mt-4">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
                                            style={{ background: avatarColors[style.id], color: '#fff' }}
                                        >
                                            J
                                        </div>
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.section>
        </motion.div>
    );
}

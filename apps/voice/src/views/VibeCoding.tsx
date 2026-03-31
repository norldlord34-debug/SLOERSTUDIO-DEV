import { motion } from 'framer-motion';
import { Code2, Variable, FileCode, Terminal, Braces, Hash, GitBranch, Cpu, Mic } from 'lucide-react';
import { useState } from 'react';

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

const PREF_KEYS = {
    variableRecognition: 'sloervoice_vibe_variable_recognition',
    fileTagging: 'sloervoice_vibe_file_tagging',
    voicePairProgramming: 'sloervoice_vibe_voice_pair',
    terminalMode: 'sloervoice_vibe_terminal_mode',
    reactMode: 'sloervoice_vibe_react_mode',
    testMode: 'sloervoice_vibe_test_mode',
} as const;

const getPref = (key: string, fallback = false) => {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === 'true';
};

const setPref = (key: string, value: boolean) => {
    localStorage.setItem(key, String(value));
};

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!checked); } }}
        className="relative w-[42px] h-[24px] rounded-full flex-shrink-0 transition-colors duration-200 cursor-pointer"
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
);

type FeatureCardProps = {
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    title: string;
    description: string;
    detail: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    examples?: string[];
};

const FeatureCard = ({ icon: Icon, title, description, detail, checked, onChange, examples }: FeatureCardProps) => (
    <div className="premium-panel px-5 py-5">
        <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] flex-shrink-0 mt-0.5">
                    <Icon size={18} style={{ color: checked ? 'var(--accent-primary)' : 'var(--text-tertiary)' }} />
                </div>
                <div>
                    <h3 className="text-[15px] font-bold">{title}</h3>
                    <p className="text-[12px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{description}</p>
                </div>
            </div>
            <ToggleSwitch checked={checked} onChange={onChange} />
        </div>
        <p className="text-[13px] leading-6 mb-3" style={{ color: 'var(--text-secondary)' }}>{detail}</p>
        {examples && examples.length > 0 && (
            <div className="space-y-1.5">
                {examples.map((ex, i) => (
                    <div key={i} className="premium-stat-card px-3 py-2.5 flex items-center gap-2">
                        <code className="text-[11px] font-mono" style={{ color: 'var(--accent-primary)' }}>{ex}</code>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default function VibeCoding() {
    const [variableRecognition, setVariableRecognition] = useState(() => getPref(PREF_KEYS.variableRecognition));
    const [fileTagging, setFileTagging] = useState(() => getPref(PREF_KEYS.fileTagging, true));
    const [voicePairProgramming, setVoicePairProgramming] = useState(() => getPref(PREF_KEYS.voicePairProgramming));
    const [terminalMode, setTerminalMode] = useState(() => getPref(PREF_KEYS.terminalMode));
    const [reactMode, setReactMode] = useState(() => getPref(PREF_KEYS.reactMode));
    const [testMode, setTestMode] = useState(() => getPref(PREF_KEYS.testMode));

    return (
        <motion.div className="space-y-6 pb-8" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>

            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="premium-section-eyebrow mb-2">Developer Tools</div>
                        <h1 className="text-[28px] leading-tight font-black tracking-[-0.03em]" style={{ fontFamily: 'Georgia, serif' }}>Vibe Coding</h1>
                        <p className="text-[13px] mt-3 max-w-2xl leading-6" style={{ color: 'var(--text-secondary)' }}>
                            Optimized for code editors like VS Code, Cursor and Windsurf. Recognizes programming syntax, variable names, file references and terminal commands so you can code entirely by voice.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="premium-chip" data-tone="info"><Code2 size={12} /> IDE Integration</span>
                        <span className="premium-chip" data-tone="warning"><Cpu size={12} /> AI-Powered</span>
                    </div>
                </div>
            </motion.section>

            {/* Supported IDEs */}
            <motion.div variants={itemV} className="grid grid-cols-3 gap-3">
                {[
                    { name: 'VS Code', desc: 'Full extension support', active: true },
                    { name: 'Cursor', desc: 'AI pair programming', active: true },
                    { name: 'Windsurf', desc: 'Cascade integration', active: true },
                ].map(ide => (
                    <div key={ide.name} className="premium-stat-card px-4 py-4 text-center">
                        <div className="text-[15px] font-bold">{ide.name}</div>
                        <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{ide.desc}</div>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--status-success)' }} />
                            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--status-success)' }}>Compatible</span>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Core Features */}
            <div className="grid gap-4 xl:grid-cols-2">
                <motion.div variants={itemV}>
                    <FeatureCard
                        icon={Variable}
                        title="Variable Recognition"
                        description="VS Code, Cursor, Windsurf"
                        detail="Better understands variables in code. Recognizes camelCase, snake_case, PascalCase and SCREAMING_SNAKE_CASE naming conventions, preserving them accurately during dictation."
                        checked={variableRecognition}
                        onChange={(v) => { setVariableRecognition(v); setPref(PREF_KEYS.variableRecognition, v); }}
                        examples={[
                            'const getUserData = async () => { ... }',
                            'let total_price = calculate_tax(base_amount)',
                            'interface IUserProfile extends BaseEntity',
                        ]}
                    />
                </motion.div>

                <motion.div variants={itemV}>
                    <FeatureCard
                        icon={FileCode}
                        title="File Tagging in Chat"
                        description="Cursor & Windsurf"
                        detail='Automatically tags files in your IDE chat when you mention them by voice. Say "index.tsx" and it becomes @index.tsx in the chat context, enabling precise AI code assistance.'
                        checked={fileTagging}
                        onChange={(v) => { setFileTagging(v); setPref(PREF_KEYS.fileTagging, v); }}
                        examples={[
                            '"open index.tsx" → @index.tsx',
                            '"edit the settings component" → @Settings.tsx',
                            '"check the package json" → @package.json',
                        ]}
                    />
                </motion.div>
            </div>

            {/* Voice Pair Programming */}
            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <h2 className="text-[18px] font-bold flex items-center gap-2">
                            <Mic size={18} style={{ color: 'var(--accent-premium)' }} />
                            Voice Pair Programming
                        </h2>
                        <p className="text-[13px] mt-2 max-w-xl leading-6" style={{ color: 'var(--text-secondary)' }}>
                            Dictate terminal commands, React components, or write tests entirely by voice. No keyboard required.
                        </p>
                    </div>
                    <ToggleSwitch checked={voicePairProgramming} onChange={(v) => { setVoicePairProgramming(v); setPref(PREF_KEYS.voicePairProgramming, v); }} />
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    <div className="premium-stat-card px-4 py-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Terminal size={15} style={{ color: voicePairProgramming && terminalMode ? 'var(--accent-primary)' : 'var(--text-tertiary)' }} />
                            <span className="text-[13px] font-bold">Terminal Commands</span>
                        </div>
                        <p className="text-[11px] leading-5 mb-3" style={{ color: 'var(--text-tertiary)' }}>Dictate shell commands: "npm install", "git commit", "docker build"</p>
                        <ToggleSwitch checked={terminalMode} onChange={(v) => { setTerminalMode(v); setPref(PREF_KEYS.terminalMode, v); }} />
                    </div>

                    <div className="premium-stat-card px-4 py-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Braces size={15} style={{ color: voicePairProgramming && reactMode ? 'var(--accent-primary)' : 'var(--text-tertiary)' }} />
                            <span className="text-[13px] font-bold">React Components</span>
                        </div>
                        <p className="text-[11px] leading-5 mb-3" style={{ color: 'var(--text-tertiary)' }}>Dictate JSX/TSX: "create a button component with onClick handler"</p>
                        <ToggleSwitch checked={reactMode} onChange={(v) => { setReactMode(v); setPref(PREF_KEYS.reactMode, v); }} />
                    </div>

                    <div className="premium-stat-card px-4 py-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Hash size={15} style={{ color: voicePairProgramming && testMode ? 'var(--accent-primary)' : 'var(--text-tertiary)' }} />
                            <span className="text-[13px] font-bold">Test Writing</span>
                        </div>
                        <p className="text-[11px] leading-5 mb-3" style={{ color: 'var(--text-tertiary)' }}>Dictate test cases: "it should return true when user is authenticated"</p>
                        <ToggleSwitch checked={testMode} onChange={(v) => { setTestMode(v); setPref(PREF_KEYS.testMode, v); }} />
                    </div>
                </div>
            </motion.section>

            {/* Syntax Examples */}
            <motion.div variants={itemV} className="premium-panel px-5 py-5">
                <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2">
                    <GitBranch size={15} style={{ color: 'var(--accent-premium)' }} /> Voice → Code Examples
                </h3>
                <div className="space-y-2">
                    {[
                        { voice: '"create a function called get user by ID that takes a number"', code: 'function getUserById(id: number) { }' },
                        { voice: '"import react and use state from react"', code: "import React, { useState } from 'react';" },
                        { voice: '"git commit message fix login bug"', code: 'git commit -m "fix login bug"' },
                        { voice: '"npm run dev"', code: 'npm run dev' },
                        { voice: '"const items equals empty array"', code: 'const items = [];' },
                    ].map((ex, i) => (
                        <div key={i} className="premium-stat-card px-4 py-3 flex flex-col md:flex-row md:items-center gap-2">
                            <div className="flex-1">
                                <span className="text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>🎙 </span>
                                <span className="text-[12px] italic" style={{ color: 'var(--text-secondary)' }}>{ex.voice}</span>
                            </div>
                            <span className="text-[11px]" style={{ color: 'var(--text-quaternary)' }}>→</span>
                            <code className="text-[12px] font-mono px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-input)', color: 'var(--accent-primary)' }}>{ex.code}</code>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

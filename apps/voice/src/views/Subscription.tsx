import { motion } from 'framer-motion';
import { Crown, Check, Shield, Zap, Infinity as InfinityIcon, Sparkles, Building2, ArrowRight, Gem, Radar, Users, ShieldCheck, type LucideIcon } from 'lucide-react';

const itemV = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
};

type PlanTone = 'info' | 'warning' | 'success';

type CommercialSignal = {
    label: string;
    value: string;
    detail: string;
    tone: PlanTone;
    icon: LucideIcon;
};

type EnterpriseAssurance = {
    title: string;
    description: string;
    icon: LucideIcon;
};

type PlanCard = {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    current: boolean;
    accent: boolean;
    cta: string;
    tone: PlanTone;
    audience: string;
    deployment: string;
    support: string;
    icon: LucideIcon;
};

const commercialSignals: CommercialSignal[] = [
    {
        label: 'Trust posture',
        value: 'Local-first security',
        detail: 'Transcripts, analytics and context stay anchored on-device for premium executive confidence.',
        tone: 'success',
        icon: ShieldCheck,
    },
    {
        label: 'Commercial lane',
        value: 'Founder to fleet',
        detail: 'The tiering scales from solo operator workflows to governed team rollouts without losing product luxury.',
        tone: 'info',
        icon: Building2,
    },
    {
        label: 'Value thesis',
        value: 'Premium monetization',
        detail: 'The product is priced as a flagship local AI surface, not a generic transcription utility.',
        tone: 'warning',
        icon: Gem,
    },
];

const enterpriseAssurances: EnterpriseAssurance[] = [
    {
        title: 'Local trust architecture',
        description: 'Privacy-first storage, premium telemetry and zero-cloud dependency reinforce the enterprise posture.',
        icon: Shield,
    },
    {
        title: 'Operator-grade rollout',
        description: 'The workflow grows from one founder cockpit into a multi-seat system without redesigning the operating model.',
        icon: Radar,
    },
    {
        title: 'Executive product value',
        description: 'Visual sophistication, microinteractions and reliability are positioned as commercial leverage, not ornament.',
        icon: Users,
    },
];

const plans: PlanCard[] = [
    {
        name: 'Starter',
        price: 'Free',
        period: '',
        description: 'For individual experiments and first contact with the local voice stack.',
        features: ['Whisper Tiny model', '30 min / day', 'Single profile', 'Basic dictionary'],
        current: false,
        accent: false,
        cta: 'Start free',
        tone: 'info',
        audience: 'Solo evaluation',
        deployment: 'Single seat',
        support: 'Community lane',
        icon: Zap,
    },
    {
        name: 'Enterprise Core',
        price: '$19',
        period: '/mo',
        description: 'The flagship local AI workspace for founders, operators and executive teams.',
        features: ['All Whisper models', 'Unlimited usage', 'NLP Engine', 'Multi profiles', 'Analytics', 'Priority support'],
        current: true,
        accent: true,
        cta: 'Current plan',
        tone: 'warning',
        audience: 'Executive operators',
        deployment: 'Premium cockpit',
        support: 'Priority lane',
        icon: Crown,
    },
    {
        name: 'Fleet',
        price: '$49',
        period: '/mo',
        description: 'For serious teams that need shared context, governance and rollout control.',
        features: ['Everything in Core', 'Team dashboard', 'Shared dictionaries', 'Custom fine-tuning', 'SSO / SAML', 'SLA guarantee'],
        current: false,
        accent: false,
        cta: 'Upgrade fleet',
        tone: 'success',
        audience: 'Scaled teams',
        deployment: 'Governed rollout',
        support: 'SLA backed',
        icon: Building2,
    },
];

const rolloutStats = [
    { label: 'Monetization angle', value: 'Premium local AI', detail: 'Luxury UX, secure posture and flagship motion elevate perceived value.' },
    { label: 'Expansion path', value: 'Operator to team', detail: 'Enterprise Core acts as the commercial default while Fleet absorbs governance needs.' },
    { label: 'Retention hook', value: 'Workflow trust', detail: 'Reliable local processing, analytics and profile control strengthen daily attachment.' },
];

export default function Subscription() {
    return (
        <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>

            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="grid gap-5 xl:grid-cols-[1.18fr,0.82fr]">
                    <div className="max-w-3xl">
                        <div className="premium-section-eyebrow mb-3">Enterprise Revenue Surface</div>
                        <div className="flex items-center gap-2 mb-3">
                            <Crown size={18} style={{ color: 'var(--accent-premium)' }} />
                            <h1 className="text-[28px] leading-tight font-black tracking-[-0.03em]">Commercial architecture designed to make local AI feel premium, trusted and expensive in the right way.</h1>
                        </div>
                        <p className="text-[13px] leading-6 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                            Every tier reinforces SloerVoice as a flagship local voice platform: privacy-forward, visually luxurious and commercially positioned for operators who expect enterprise-grade clarity.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-5">
                            <span className="premium-chip" data-tone="success"><Shield size={12} /> AES-256 posture</span>
                            <span className="premium-chip" data-tone="info"><Zap size={12} /> Local inference</span>
                            <span className="premium-chip" data-tone="warning"><Sparkles size={12} /> VIP monetization layer</span>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        {commercialSignals.map(({ label, value, detail, tone, icon: Icon }) => (
                            <div key={label} className="premium-stat-card px-4 py-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">{label}</div>
                                    <span className="premium-chip" data-tone={tone}><Icon size={12} /></span>
                                </div>
                                <div className="text-[16px] font-black mt-3 leading-snug">{value}</div>
                                <p className="text-[12px] mt-2 leading-6" style={{ color: 'var(--text-secondary)' }}>{detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
                <motion.section variants={itemV} className="premium-panel px-5 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                            <div className="premium-section-eyebrow mb-2">Commercial Telemetry</div>
                            <h2 className="text-[18px] font-bold">Enterprise Core remains the premium default for serious daily operators.</h2>
                        </div>
                        <span className="premium-chip" data-tone="warning"><InfinityIcon size={12} /> Unlimited active</span>
                    </div>

                    <div className="flex items-center justify-between mb-3 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                        <span>Usage this period</span>
                        <span className="font-semibold" style={{ color: 'var(--accent-premium)' }}>167 / ∞ min</span>
                    </div>
                    <div className="premium-progress-track">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '35%' }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="premium-progress-bar"
                        />
                    </div>

                    <div className="grid gap-3 md:grid-cols-4 mt-4">
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Privacy</div>
                            <div className="text-[14px] font-bold mt-2">Local-first</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Ops model</div>
                            <div className="text-[14px] font-bold mt-2">Zero cloud</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Retention</div>
                            <div className="text-[14px] font-bold mt-2">Workflow lock-in</div>
                        </div>
                        <div className="premium-stat-card px-4 py-4">
                            <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Storage</div>
                            <div className="text-[14px] font-bold mt-2">Protected</div>
                        </div>
                    </div>
                </motion.section>

                <motion.section variants={itemV} className="premium-panel px-5 py-5 space-y-4">
                    <div className="premium-section-eyebrow">Flagship Thesis</div>
                    <h2 className="text-[18px] font-bold">Enterprise Core is positioned as the monetization flagship, not a midpoint compromise.</h2>
                    <p className="text-[13px] leading-6" style={{ color: 'var(--text-secondary)' }}>
                        The strongest product story sits in the middle tier: premium visuals, local trust, advanced telemetry, multi-profile control and enough polish to justify an enterprise-feeling price point.
                    </p>
                    <div className="grid gap-3">
                        {enterpriseAssurances.map(({ title, description, icon: Icon }) => (
                            <div key={title} className="premium-stat-card px-4 py-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] flex-shrink-0">
                                        <Icon size={16} style={{ color: 'var(--accent-premium)' }} />
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-bold">{title}</div>
                                        <p className="text-[12px] mt-2 leading-6" style={{ color: 'var(--text-secondary)' }}>{description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {plans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                        <motion.section
                            key={plan.name}
                            variants={itemV}
                            whileHover={{ y: -6, scale: 1.01 }}
                            whileTap={{ scale: 0.995 }}
                            className="premium-panel p-5 flex flex-col relative"
                            style={plan.accent ? { borderColor: 'rgba(246, 193, 95, 0.22)' } : undefined}
                        >
                            <div className="absolute inset-x-0 top-0 h-24 opacity-70" style={{ background: plan.accent ? 'radial-gradient(circle at top, rgba(246, 193, 95, 0.18), transparent 70%)' : 'radial-gradient(circle at top, rgba(99, 243, 255, 0.12), transparent 70%)' }} />
                            <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                                            <Icon size={18} style={{ color: plan.accent ? 'var(--accent-premium)' : 'var(--accent-primary)' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-[18px] font-bold">{plan.name}</h3>
                                            <div className="text-[11px] premium-muted">{plan.audience}</div>
                                        </div>
                                    </div>
                                    <p className="text-[12px] leading-6" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
                                </div>
                                <span className="premium-chip" data-tone={plan.tone}>{plan.current ? 'Current' : 'Available'}</span>
                            </div>

                            <div className="relative z-10 flex items-baseline gap-1 mb-5">
                                <span className="text-[38px] font-black tracking-[-0.03em]">{plan.price}</span>
                                {plan.period && <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>{plan.period}</span>}
                            </div>

                            <div className="relative z-10 grid grid-cols-3 gap-2 mb-5">
                                <div className="premium-stat-card px-3 py-3">
                                    <div className="text-[10px] uppercase tracking-[0.16em] premium-muted">Audience</div>
                                    <div className="text-[12px] font-bold mt-2">{plan.audience}</div>
                                </div>
                                <div className="premium-stat-card px-3 py-3">
                                    <div className="text-[10px] uppercase tracking-[0.16em] premium-muted">Lane</div>
                                    <div className="text-[12px] font-bold mt-2">{plan.deployment}</div>
                                </div>
                                <div className="premium-stat-card px-3 py-3">
                                    <div className="text-[10px] uppercase tracking-[0.16em] premium-muted">Support</div>
                                    <div className="text-[12px] font-bold mt-2">{plan.support}</div>
                                </div>
                            </div>

                            <ul className="relative z-10 space-y-2.5 mb-6 flex-1">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-[13px]">
                                        <Check size={14} style={{ color: plan.accent ? 'var(--accent-premium)' : 'var(--accent-primary)' }} />
                                        <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={plan.current ? 'premium-button-secondary w-full' : 'premium-button-primary w-full'} disabled={plan.current}>
                                {plan.cta}
                                {!plan.current && <ArrowRight size={14} />}
                            </button>
                        </motion.section>
                    );
                })}
            </div>

            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="grid gap-4 xl:grid-cols-[1.08fr,0.92fr]">
                    <div>
                        <div className="premium-section-eyebrow mb-3">Expansion Narrative</div>
                        <h2 className="text-[20px] font-bold leading-tight">A tier system built to sell premium local AI, not commodity transcription minutes.</h2>
                        <p className="text-[13px] mt-3 leading-6 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                            The commercial path is deliberately staged: Starter invites experimentation, Enterprise Core captures most serious operators, and Fleet unlocks governance, shared context and enterprise procurement language.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        {rolloutStats.map((item) => (
                            <div key={item.label} className="premium-stat-card px-4 py-4">
                                <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">{item.label}</div>
                                <div className="text-[15px] font-black mt-2">{item.value}</div>
                                <div className="text-[12px] mt-2 leading-6" style={{ color: 'var(--text-secondary)' }}>{item.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Pro Features Card */}
            <motion.section variants={itemV} className="premium-panel px-6 py-6">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                        <Crown size={22} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                        <h2 className="text-[18px] font-black">Pro Features</h2>
                        <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>Unlock the full power of SloerVoice Voice with a Pro subscription.</p>
                    </div>
                </div>
                <div className="space-y-1 mt-5">
                    {[
                        'On-device voice transcription',
                        'Cloud-synced custom dictionary',
                        'AI-powered text polish',
                        'Cross-device sync',
                        'Priority support',
                    ].map((feature) => (
                        <div key={feature} className="premium-stat-card flex items-center gap-3 px-4 py-4">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0" style={{ background: 'var(--accent-surface)', border: '1px solid var(--accent-glow)' }}>
                                <Check size={12} style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <span className="text-[14px] font-medium">{feature}</span>
                        </div>
                    ))}
                </div>
            </motion.section>

            <motion.div variants={itemV} className="flex items-center justify-center gap-5 text-[11px] py-3" style={{ color: 'var(--text-quaternary)' }}>
                <span className="flex items-center gap-1"><Shield size={11} /> AES-256</span>
                <span className="flex items-center gap-1"><Zap size={11} /> On-device</span>
                <span className="flex items-center gap-1"><InfinityIcon size={11} /> Local storage</span>
            </motion.div>
        </motion.div>
    );
}

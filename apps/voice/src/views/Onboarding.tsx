import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, ChevronRight, ChevronLeft, Sparkles, Zap, Shield,
  MessageSquare, Mail, Code2, FileText, StickyNote, PenTool,
  Bot, Send, Briefcase, GraduationCap, Palette, Megaphone,
  Stethoscope, Scale, Building2, Wrench, Check, Volume2,
  Keyboard as KeyboardIcon
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   STEP DATA
   ═══════════════════════════════════════════════════════════ */

const ACTIVITY_OPTIONS = [
  { id: 'chatting_ai', label: 'Chatting with AI', icon: Bot },
  { id: 'sending_messages', label: 'Sending messages', icon: Send },
  { id: 'coding', label: 'Coding with AI', icon: Code2 },
  { id: 'drafting_emails', label: 'Drafting emails', icon: Mail },
  { id: 'writing_docs', label: 'Writing documents', icon: FileText },
  { id: 'taking_notes', label: 'Taking notes', icon: StickyNote },
  { id: 'writing_posts', label: 'Writing posts or comments', icon: PenTool },
  { id: 'something_else', label: 'Something else', icon: MessageSquare },
];

const OCCUPATION_OPTIONS = [
  { id: 'engineer', label: 'Software Engineer', icon: Code2 },
  { id: 'designer', label: 'Designer', icon: Palette },
  { id: 'marketer', label: 'Marketing', icon: Megaphone },
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'medical', label: 'Healthcare', icon: Stethoscope },
  { id: 'legal', label: 'Legal', icon: Scale },
  { id: 'executive', label: 'Executive / Manager', icon: Building2 },
  { id: 'freelance', label: 'Freelancer', icon: Briefcase },
  { id: 'other', label: 'Other', icon: Wrench },
];

const DEMO_TABS = [
  {
    id: 'messages',
    label: 'Messages',
    app: 'Slack',
    appIcon: '💬',
    prompt: 'Try saying…',
    subject: '',
    result: '"Hey team, let\'s sync up tomorrow at 10am to review the sprint progress and plan next steps."',
  },
  {
    id: 'email',
    label: 'Email',
    app: 'Gmail',
    appIcon: '✉️',
    prompt: 'Try saying…',
    subject: 'Quick update',
    result: '"Hi Greg,\n\nLet\'s connect soon. Are you available on Friday at 3, no actually 4?\n\nBest,\nMedia"',
  },
  {
    id: 'note',
    label: 'Whisper a note',
    app: 'Notion',
    appIcon: '📝',
    prompt: 'Whisper close to your mic…',
    subject: '',
    result: '"I want to pick up a few things from the store:\n\n1. Bread\n2. Potato chips\n3. Ice cream"',
  },
  {
    id: 'code',
    label: 'Prompting AI',
    app: 'VS Code',
    appIcon: '🧠',
    prompt: 'Try saying…',
    subject: '',
    result: '"Create a React component that fetches user data from the API and displays it in a sortable table with pagination."',
  },
];

const STEP_LABELS = ['WELCOME', 'ACTIVITY', 'OCCUPATION', 'MIC TEST', 'SMART FORMAT', 'RESULTS'];

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

interface OnboardingProps {
  onComplete: () => void;
}

/* ═══════════════════════════════════════════════════════════
   HOOK: useMicTest — isolates mic lifecycle
   ═══════════════════════════════════════════════════════════ */

function useMicTest(active: boolean) {
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState<number[]>(new Array(24).fill(0));
  const [micPeakWpm, setMicPeakWpm] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    const cleanup = () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      cancelAnimationFrame(animRef.current);
      setMicActive(false);
    };

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.7;
        src.connect(analyser);
        setMicActive(true);

        const dataArr = new Uint8Array(analyser.frequencyBinCount);
        let peakDetected = 0;
        const tick = () => {
          if (cancelled) return;
          analyser.getByteFrequencyData(dataArr);
          const bars: number[] = [];
          const binStep = Math.floor(dataArr.length / 24);
          for (let i = 0; i < 24; i++) {
            let sum = 0;
            for (let j = 0; j < binStep; j++) {
              sum += dataArr[i * binStep + j] || 0;
            }
            bars.push(sum / binStep / 255);
          }
          setMicVolume(bars);
          const avg = bars.reduce((a, b) => a + b, 0) / bars.length;
          if (avg > 0.15) {
            peakDetected = Math.min(peakDetected + 8, 200);
            setMicPeakWpm(Math.round(peakDetected));
          }
          animRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        console.warn('Mic permission denied or unavailable');
      }
    })();

    return cleanup;
  }, [active]);

  return { micActive, micVolume, micPeakWpm };
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedOccupation, setSelectedOccupation] = useState<string | null>(null);
  const [demoTab, setDemoTab] = useState(0);
  const [demoTabsCompleted, setDemoTabsCompleted] = useState<Set<number>>(new Set());
  const [animatedWpm, setAnimatedWpm] = useState(0);

  const { micActive, micVolume, micPeakWpm } = useMicTest(step === 3);

  // Welcome WPM counter animation
  useEffect(() => {
    if (step !== 0) return;
    const target = 116;
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(Math.random() * 4 + 1);
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setAnimatedWpm(current);
    }, 30);
    return () => clearInterval(interval);
  }, [step]);

  const toggleActivity = useCallback((id: string) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  }, []);

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return selectedActivities.length > 0;
      case 2: return selectedOccupation !== null;
      default: return true;
    }
  };

  const nextStep = useCallback(() => {
    if (step === 5) { onComplete(); return; }
    setStep(s => Math.min(s + 1, 5));
  }, [step, onComplete]);

  const prevStep = useCallback(() => {
    setStep(s => Math.max(s - 1, 0));
  }, []);

  const handleDemoTabClick = useCallback((idx: number) => {
    setDemoTab(idx);
    setDemoTabsCompleted(prev => new Set(prev).add(idx));
  }, []);

  const currentDemo = DEMO_TABS[demoTab];

  /* ═══════════════════════════════════════════════════════════
     RENDER — inline JSX per step (no inner components)
     ═══════════════════════════════════════════════════════════ */

  const renderProgressBar = () => (
    <div className="onb-progress-bar">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="onb-progress-step">
          <div className={`onb-progress-dot ${i < step ? 'completed' : ''} ${i === step ? 'active' : ''}`}>
            {i < step ? <Check size={10} /> : <span className="text-[9px] font-bold">{i + 1}</span>}
          </div>
          <span className={`onb-progress-label ${i <= step ? 'active' : ''}`}>{label}</span>
          {i < STEP_LABELS.length - 1 && (
            <div className={`onb-progress-line ${i < step ? 'completed' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {

      /* ── STEP 0: WELCOME ── */
      case 0:
        return (
          <div className="onb-split">
            <div className="onb-split-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="onb-logo-ring">
                    <img src="/logo.png" alt="SloerVoice" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-[15px] font-extrabold tracking-[0.12em] uppercase" style={{ color: 'var(--text-primary)' }}>SloerVoice Voice</span>
                </div>
                <h1 className="onb-title">Get started with<br /><span className="onb-title-accent">SloerVoice Voice</span></h1>
                <p className="onb-subtitle mt-4">Write faster in every app using your voice.<br />On-device. Private. Enterprise-grade.</p>
                <div className="flex gap-3 mt-8 flex-wrap">
                  <span className="premium-chip" data-tone="info"><Shield size={12} /> 100% Local</span>
                  <span className="premium-chip" data-tone="warning"><Sparkles size={12} /> AI Powered</span>
                  <span className="premium-chip" data-tone="success"><Zap size={12} /> Ultra-fast</span>
                </div>
              </motion.div>
            </div>
            <div className="onb-split-right onb-welcome-hero">
              <motion.div className="onb-wpm-showcase" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                <div className="onb-wpm-label">Using</div>
                <div className="onb-wpm-value">{animatedWpm} <span className="onb-wpm-unit">wpm</span></div>
                <div className="onb-wpm-wave">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div key={i} className="onb-wpm-wave-bar" animate={{ height: [8, 16 + Math.random() * 28, 8] }} transition={{ duration: 0.8 + Math.random() * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }} />
                  ))}
                </div>
                <p className="onb-wpm-tagline">4x faster than typing</p>
                <div className="flex justify-center gap-2 mt-4">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`onb-carousel-dot ${i === 0 ? 'active' : ''}`} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      /* ── STEP 1: ACTIVITY ── */
      case 1:
        return (
          <div className="onb-split">
            <div className="onb-split-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <button onClick={prevStep} className="onb-back-btn"><ChevronLeft size={14} /> Back</button>
                <h1 className="onb-title mt-4">Where do you spend<br />time typing?</h1>
                <p className="onb-subtitle mt-3">Select all that apply. This helps us personalize your experience.</p>
                <div className="onb-chips-grid mt-6">
                  {ACTIVITY_OPTIONS.map(opt => {
                    const selected = selectedActivities.includes(opt.id);
                    return (
                      <motion.button key={opt.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => toggleActivity(opt.id)} className={`onb-chip-selectable ${selected ? 'selected' : ''}`}>
                        <opt.icon size={14} />
                        <span>{opt.label}</span>
                        {selected && <Check size={12} className="onb-chip-check" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
            <div className="onb-split-right onb-illustration-bg">
              <motion.div className="onb-illustration-content" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <div className="onb-floating-cards">
                  <div className="onb-floating-card" style={{ top: '10%', right: '10%', animationDelay: '0s' }}><Bot size={24} /> <span>ChatGPT</span></div>
                  <div className="onb-floating-card" style={{ top: '35%', left: '5%', animationDelay: '0.5s' }}><MessageSquare size={24} /> <span>Slack</span></div>
                  <div className="onb-floating-card" style={{ bottom: '20%', right: '15%', animationDelay: '1s' }}><FileText size={24} /> <span>Notion</span></div>
                  <div className="onb-floating-card" style={{ bottom: '10%', left: '15%', animationDelay: '1.5s' }}><Code2 size={24} /> <span>VS Code</span></div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      /* ── STEP 2: OCCUPATION ── */
      case 2:
        return (
          <div className="onb-split">
            <div className="onb-split-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <button onClick={prevStep} className="onb-back-btn"><ChevronLeft size={14} /> Back</button>
                <h1 className="onb-title mt-4">What do you do?</h1>
                <p className="onb-subtitle mt-3">Your role helps us tailor dictation styles, formatting, and vocabulary.</p>
                <div className="onb-chips-grid mt-6">
                  {OCCUPATION_OPTIONS.map(opt => {
                    const selected = selectedOccupation === opt.id;
                    return (
                      <motion.button key={opt.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedOccupation(opt.id)} className={`onb-chip-selectable ${selected ? 'selected' : ''}`}>
                        <opt.icon size={14} />
                        <span>{opt.label}</span>
                        {selected && <Check size={12} className="onb-chip-check" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
            <div className="onb-split-right onb-illustration-bg">
              <motion.div className="onb-metric-card-stack" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <div className="onb-metric-preview">
                  <div className="onb-metric-preview-label">Average time saved per week</div>
                  <div className="onb-metric-preview-value">32 hours</div>
                  <div className="onb-metric-preview-bar">
                    <motion.div className="onb-metric-preview-fill" initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                </div>
                <div className="onb-metric-preview mt-4">
                  <div className="onb-metric-preview-label">Dictation accuracy</div>
                  <div className="onb-metric-preview-value">98.7%</div>
                  <div className="onb-metric-preview-bar">
                    <motion.div className="onb-metric-preview-fill" initial={{ width: 0 }} animate={{ width: '98%' }} transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      /* ── STEP 3: MIC TEST ── */
      case 3:
        return (
          <div className="onb-split">
            <div className="onb-split-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <button onClick={prevStep} className="onb-back-btn"><ChevronLeft size={14} /> Back</button>
                <h1 className="onb-title mt-4">Test your<br /><span className="onb-title-accent">microphone</span></h1>
                <p className="onb-subtitle mt-3">Speak naturally and watch the volume bars react. SloerVoice processes everything locally on your device.</p>
                <div className="flex gap-3 mt-6">
                  <span className="premium-chip" data-tone="success"><Shield size={12} /> On-device only</span>
                  <span className="premium-chip" data-tone="info"><Mic size={12} /> {micActive ? 'Listening...' : 'Requesting...'}</span>
                </div>
                {micPeakWpm > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                    <div className="onb-metric-preview">
                      <div className="onb-metric-preview-label">Estimated speaking speed</div>
                      <div className="onb-metric-preview-value">{micPeakWpm} wpm</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
            <div className="onb-split-right">
              <motion.div className="onb-mic-visualizer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="onb-mic-orb">
                  <motion.div className="onb-mic-orb-inner" animate={{ scale: micActive ? [1, 1.08, 1] : 1, boxShadow: micActive ? ['0 0 30px rgba(168,85,247,0.3)', '0 0 60px rgba(168,85,247,0.5)', '0 0 30px rgba(168,85,247,0.3)'] : '0 0 20px rgba(168,85,247,0.2)' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <Mic size={32} className="text-white" />
                  </motion.div>
                </div>
                <div className="onb-volume-bars">
                  {micVolume.map((v, i) => (
                    <motion.div key={i} className="onb-volume-bar" animate={{ height: Math.max(4, v * 80) }} transition={{ duration: 0.08 }} />
                  ))}
                </div>
                <div className="onb-mic-hint">
                  {micActive ? <><Volume2 size={14} /> Say something to test your microphone</> : <><Mic size={14} /> Waiting for microphone access...</>}
                </div>
              </motion.div>
            </div>
          </div>
        );

      /* ── STEP 4: SMART FORMAT ── */
      case 4:
        return (
          <div className="onb-split">
            <div className="onb-split-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <button onClick={prevStep} className="onb-back-btn"><ChevronLeft size={14} /> Back</button>
                <h1 className="onb-title mt-4">Try <span className="onb-title-accent italic">Smart Formatting</span></h1>
                <p className="onb-subtitle mt-3">Hold down on the <span className="keycap">Ctrl</span> + <span className="keycap">Space</span> keys, speak, and let go to insert spoken text.</p>
                <p className="onb-subtitle mt-3">SloerVoice will punctuate and format for you.</p>
              </motion.div>
            </div>
            <div className="onb-split-right">
              <motion.div className="onb-demo-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="onb-demo-tabs">
                  {DEMO_TABS.map((tab, i) => (
                    <button key={tab.id} onClick={() => handleDemoTabClick(i)} className={`onb-demo-tab ${demoTab === i ? 'active' : ''}`}>
                      {demoTabsCompleted.has(i) && <Check size={12} className="onb-demo-tab-check" />}
                      {tab.label}
                      {demoTab === i && <motion.div layoutId="demoTabIndicator" className="onb-demo-tab-indicator" />}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={demoTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="onb-demo-content">
                    <div className="onb-demo-app-header">
                      <span className="text-lg">{currentDemo.appIcon}</span>
                      <span className="font-bold text-[14px]">{currentDemo.app}</span>
                    </div>
                    {currentDemo.subject && (
                      <div className="onb-demo-subject">Subject: <strong>{currentDemo.subject}</strong></div>
                    )}
                    <div className="onb-demo-prompt">
                      <span className="onb-demo-prompt-badge">{currentDemo.prompt}</span>
                    </div>
                    <div className="onb-demo-result">
                      {currentDemo.result.split('\n').map((line, i) => (<div key={i}>{line}</div>))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        );

      /* ── STEP 5: RESULTS ── */
      case 5:
        return (
          <div className="onb-center-layout">
            <motion.div className="onb-results-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <h1 className="onb-results-title">
                Speaking can be<br />
                <span className="onb-title-accent-large">4x faster!</span><br />
                than the average typing speed
              </h1>
              <div className="onb-speed-compare mt-10">
                <div className="onb-speed-row">
                  <span className="onb-speed-label">Avg typing speed</span>
                  <div className="onb-speed-bar-track">
                    <KeyboardIcon size={18} className="onb-speed-icon" />
                    <motion.div className="onb-speed-bar-fill typing" initial={{ width: 0 }} animate={{ width: '25%' }} transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }} />
                    <span className="onb-speed-value">50 words/min</span>
                  </div>
                </div>
                <div className="onb-speed-row">
                  <span className="onb-speed-label">Your voice</span>
                  <div className="onb-speed-bar-track">
                    <Mic size={18} className="onb-speed-icon" />
                    <motion.div className="onb-speed-bar-fill voice" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
                    <span className="onb-speed-value">200 words/min</span>
                  </div>
                  <motion.div className="onb-speed-multiplier" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6, duration: 0.5, type: 'spring' }}>4x</motion.div>
                </div>
              </div>
              <motion.div className="onb-final-cta mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                <div className="flex gap-3 justify-center flex-wrap">
                  <span className="premium-chip" data-tone="warning"><Sparkles size={12} /> Save 32+ hours/week</span>
                  <span className="premium-chip" data-tone="info"><Zap size={12} /> 98.7% accuracy</span>
                  <span className="premium-chip" data-tone="success"><Shield size={12} /> 100% private</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onb-root">
      <div className="onb-container">
        {renderProgressBar()}
        <div className="onb-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="onb-step-wrapper"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="onb-footer">
          <div className="onb-footer-left">
            {step > 0 && step < 5 && (
              <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                Step {step + 1} of {STEP_LABELS.length}
              </span>
            )}
          </div>
          <div className="onb-footer-right">
            {step < 5 && step > 0 && (
              <button onClick={onComplete} className="onb-skip-btn">Skip setup</button>
            )}
            <motion.button
              onClick={nextStep}
              disabled={!canAdvance()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="onb-next-btn"
            >
              {step === 5 ? 'Start using SloerVoice Voice' : 'Continue'}
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

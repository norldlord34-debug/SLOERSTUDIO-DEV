import { useState, useEffect, useCallback } from 'react';
import { Home, Clock, BookOpen, Keyboard, CreditCard, Settings, Search, Mic, ChevronRight, Sparkles, Shield, Crown, Activity, Zap, Scissors, Type, StickyNote, Minus, Square, X, Code2, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import CommandPalette from './components/CommandPalette';
import ToastContainer from './components/Toast';
import Onboarding from './views/Onboarding';
import OverviewDashboard from './views/OverviewDashboard';
import History from './views/History';
import Dictionary from './views/Dictionary';
import Shortcuts from './views/Shortcuts';
import Subscription from './views/Subscription';
import SettingsView from './views/Settings';
import Snippets from './views/Snippets';
import Style from './views/Style';
import Scratchpad from './views/Scratchpad';
import VibeCoding from './views/VibeCoding';
import { decreaseWidgetOpacity, getStoredTheme, increaseWidgetOpacity, setStoredTheme, toggleThemeMode, toggleWidgetAlwaysOnTop, toggleWidgetCompactMode } from './lib/widgetPreferences';
import { usePermissionAlerts } from './hooks/usePermissionAlerts';
import './index.css';

type ViewState = 'overview' | 'history' | 'dictionary' | 'shortcuts' | 'snippets' | 'style' | 'scratchpad' | 'vibecoding' | 'subscription' | 'settings';

type HistorySummaryItem = {
  id: number;
};

type ShortcutConfig = {
  id: string;
  keys: string[];
};

const viewMeta: Record<ViewState, { label: string; description: string }> = {
  overview: { label: 'Overview', description: 'Performance analytics' },
  history: { label: 'History', description: 'Transcription timeline' },
  dictionary: { label: 'Dictionary', description: 'Context profiles' },
  shortcuts: { label: 'Shortcuts', description: 'Global hotkeys' },
  snippets: { label: 'Snippets', description: 'Text expansion shortcuts' },
  style: { label: 'Style', description: 'Dictation formatting styles' },
  scratchpad: { label: 'Scratchpad', description: 'Quick notes and drafts' },
  vibecoding: { label: 'Vibe Coding', description: 'Developer voice tools' },
  subscription: { label: 'Subscription', description: 'Enterprise plan' },
  settings: { label: 'Settings', description: 'System configuration' },
};

const resolveViewFromHash = (hash: string): ViewState => {
  const nextView = hash.replace(/^#\/?/, '') as ViewState;
  return nextView in viewMeta ? nextView : 'overview';
};

const NavSection = ({ label }: { label: string }) => (
  <div className="px-4 pt-6 pb-2">
    <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--text-quaternary)' }}>{label}</span>
  </div>
);

const NavItem = ({ id, icon: Icon, label, badge, currentView, onNavigate }: { id: ViewState; icon: LucideIcon; label: string; badge?: number; currentView: ViewState; onNavigate: (v: ViewState) => void }) => {
  const isActive = currentView === id;
  return (
    <motion.button
      onClick={() => onNavigate(id)}
      data-audit-id={`nav-${id}`}
      aria-current={isActive ? 'page' : undefined}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.992 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-[14px] text-[13px] font-semibold transition-colors relative group overflow-hidden ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
    >
      {isActive && (
        <motion.div
          layoutId="activeNavBackground"
          className="absolute inset-0 z-0 !rounded-[10px]"
          style={{
            background: 'linear-gradient(90deg, rgba(99, 243, 255, 0.18) 0%, rgba(246, 193, 95, 0.1) 100%)',
            borderLeft: '3px solid var(--accent-premium)'
          }}
          transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
        />
      )}
      <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03]">
        <Icon size={16} className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'opacity-60 group-hover:opacity-100 group-hover:scale-105'}`} style={isActive ? { color: 'var(--accent-premium)' } : {}} />
      </div>
      <span className="relative z-10">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="relative z-10 ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, var(--accent-premium), var(--accent-primary))', color: '#041016' }}>
          {badge}
        </span>
      )}
    </motion.button>
  );
};

const ONBOARDING_KEY = 'sloervoice_onboarding_completed';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem(ONBOARDING_KEY) !== 'true';
  });
  const [currentView, setCurrentView] = useState<ViewState>(() => resolveViewFromHash(window.location.hash));
  const [theme, setTheme] = useState(() => getStoredTheme());
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState<number>(0);

  usePermissionAlerts({ enableToast: true });

  // Load History count for the sidebar badge
  useEffect(() => {
    let unlistenHistoryUpdated: (() => void) | undefined;

    const loadHistoryCount = async () => {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        const history = await invoke<HistorySummaryItem[]>('get_history');
        if (history) setHistoryCount(history.length);
      } catch (e) { console.error(e); }
    };

    const setup = async () => {
      const { listen } = await import('@tauri-apps/api/event');
      await loadHistoryCount();
      unlistenHistoryUpdated = await listen('history_updated', loadHistoryCount);
    };

    setup();
    return () => {
      unlistenHistoryUpdated?.();
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
  }, [theme]);

  useEffect(() => {
    const syncViewFromHash = () => {
      setCurrentView(resolveViewFromHash(window.location.hash));
    };

    window.addEventListener('hashchange', syncViewFromHash);
    return () => window.removeEventListener('hashchange', syncViewFromHash);
  }, []);

  useEffect(() => {
    const nextHash = `#/${currentView}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  }, [currentView]);

  // Sync shortcuts to Rust backend on startup
  useEffect(() => {
    const saved = localStorage.getItem('sloervoice_shortcuts');
    let shortcuts: ShortcutConfig[] | null = null;
    if (saved) {
      try {
        shortcuts = JSON.parse(saved) as ShortcutConfig[];
      } catch (error) {
        console.error('Failed to parse stored shortcuts:', error);
      }
    }
    let targetShortcut = shortcuts?.find((s) => s.id === 'ptt') || shortcuts?.find((s) => s.id === 'toggle');
    if (!targetShortcut) {
      targetShortcut = { id: 'ptt', keys: ['Control', 'Space'] }; // Fallback safer than Alt+Space
    }
    import('@tauri-apps/api/core').then(({ invoke }) => {
      invoke('update_shortcuts', { keys: targetShortcut.keys }).catch(console.error);
    });
  }, []);

  // Global ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // System Tray events
  useEffect(() => {
    const handleTrayRecording = () => {
      import('@tauri-apps/api/core').then(({ invoke }) => {
        invoke('set_recording_state', { targetState: null }).catch(console.error);
      });
    };
    const handleTrayMute = () => {
      import('@tauri-apps/api/core').then(({ invoke }) => {
        invoke('toggle_mic_mute').catch(console.error);
      });
    };
    const handleTrayTheme = () => {
      setTheme(currentTheme => toggleThemeMode(currentTheme));
    };
    const handleTrayPreferences = () => setCurrentView('settings');
    const handleTrayHistory = () => setCurrentView('history');
    const handleTrayDictionary = () => setCurrentView('dictionary');
    const handleTrayShortcuts = () => setCurrentView('shortcuts');
    const handleTrayCompactWidget = () => toggleWidgetCompactMode();
    const handleTrayAlwaysOnTop = () => toggleWidgetAlwaysOnTop();
    const handleTrayIncreaseOpacity = () => increaseWidgetOpacity();
    const handleTrayDecreaseOpacity = () => decreaseWidgetOpacity();

    document.addEventListener('tray_toggle_recording', handleTrayRecording);
    document.addEventListener('tray_mute', handleTrayMute);
    document.addEventListener('tray_change_theme', handleTrayTheme);
    document.addEventListener('tray_open_preferences', handleTrayPreferences);
    document.addEventListener('tray_open_history', handleTrayHistory);
    document.addEventListener('tray_open_dictionary', handleTrayDictionary);
    document.addEventListener('tray_open_shortcuts', handleTrayShortcuts);
    document.addEventListener('tray_toggle_widget_compact', handleTrayCompactWidget);
    document.addEventListener('tray_toggle_widget_always_top', handleTrayAlwaysOnTop);
    document.addEventListener('tray_increase_widget_opacity', handleTrayIncreaseOpacity);
    document.addEventListener('tray_decrease_widget_opacity', handleTrayDecreaseOpacity);

    return () => {
      document.removeEventListener('tray_toggle_recording', handleTrayRecording);
      document.removeEventListener('tray_mute', handleTrayMute);
      document.removeEventListener('tray_change_theme', handleTrayTheme);
      document.removeEventListener('tray_open_preferences', handleTrayPreferences);
      document.removeEventListener('tray_open_history', handleTrayHistory);
      document.removeEventListener('tray_open_dictionary', handleTrayDictionary);
      document.removeEventListener('tray_open_shortcuts', handleTrayShortcuts);
      document.removeEventListener('tray_toggle_widget_compact', handleTrayCompactWidget);
      document.removeEventListener('tray_toggle_widget_always_top', handleTrayAlwaysOnTop);
      document.removeEventListener('tray_increase_widget_opacity', handleTrayIncreaseOpacity);
      document.removeEventListener('tray_decrease_widget_opacity', handleTrayDecreaseOpacity);
    };
  }, []);

  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view as ViewState);
  }, []);

  const currentMeta = viewMeta[currentView];
  const operationalSignals: Array<{ label: string; value: string; tone: 'success' | 'info' | 'warning'; icon: LucideIcon }> = [
    { label: 'Telemetry', value: 'Live', tone: 'success', icon: Activity },
    { label: 'Shortcut', value: 'Ctrl + Space', tone: 'info', icon: Keyboard },
    { label: 'Tier', value: 'Enterprise', tone: 'warning', icon: Crown },
  ];
  const premiumHighlights = [
    { label: 'Inference Core', value: 'Rust + Whisper local stack' },
    { label: 'Widget Engine', value: 'Orb, waveform, drag and PTT' },
    { label: 'Operational Mode', value: 'Secure on-device voice workflow' },
  ];

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  }, []);

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans relative" style={{ color: 'var(--text-primary)', background: 'transparent' }}>
      <div className="shell-ambient shell-ambient-a" />
      <div className="shell-ambient shell-ambient-b" />
      <div className="shell-ambient shell-ambient-c" />

      {/* ── Sidebar (Glassmorphism) ── */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col h-full sidebar-glass z-20">

        {/* Logo */}
        <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="premium-panel px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <img src="/logo.png" alt="SloerVoice-VOICE" className="w-8 h-8 object-contain" style={{ filter: 'drop-shadow(0 0 14px rgba(246, 193, 95, 0.35))' }} />
                </div>
                <div>
                  <div className="premium-section-eyebrow mb-1">Voice OS</div>
                  <div className="font-extrabold text-[18px] tracking-[0.14em] text-gradient">SloerVoice</div>
                </div>
              </div>
              <span className="premium-chip" data-tone="warning">VIP</span>
            </div>
            <p className="text-[12px] mt-4 leading-6" style={{ color: 'var(--text-secondary)' }}>
              Enterprise dictation cockpit with local inference, premium widget control and elite transcription telemetry.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="premium-stat-card px-3 py-3">
                <div className="text-[10px] uppercase tracking-[0.15em] premium-muted">Theme</div>
                <div className="text-[13px] font-bold mt-1 capitalize">{theme}</div>
              </div>
              <div className="premium-stat-card px-3 py-3">
                <div className="text-[10px] uppercase tracking-[0.15em] premium-muted">Sessions</div>
                <div className="text-[13px] font-bold mt-1">{historyCount}</div>
              </div>
            </div>
            <div className="premium-divider my-4" />
            <div className="flex flex-wrap gap-2">
              {operationalSignals.map(({ label, value, tone, icon: Icon }) => (
                <span key={label} className="premium-chip" data-tone={tone}>
                  <Icon size={12} /> {label}: {value}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar pb-4">
          <NavSection label="Core" />
          <div className="space-y-0.5">
            <NavItem id="overview" icon={Home} label="Overview" currentView={currentView} onNavigate={setCurrentView} />
            <NavItem id="history" icon={Clock} label="History" badge={historyCount} currentView={currentView} onNavigate={setCurrentView} />
            <NavItem id="dictionary" icon={BookOpen} label="Dictionary" currentView={currentView} onNavigate={setCurrentView} />
            <NavItem id="shortcuts" icon={Keyboard} label="Shortcuts" currentView={currentView} onNavigate={setCurrentView} />
            <NavItem id="snippets" icon={Scissors} label="Snippets" currentView={currentView} onNavigate={setCurrentView} />
            <NavItem id="style" icon={Type} label="Style" currentView={currentView} onNavigate={setCurrentView} />
            <NavItem id="scratchpad" icon={StickyNote} label="Scratchpad" currentView={currentView} onNavigate={setCurrentView} />
          </div>

          <NavSection label="Developer" />
          <div className="space-y-0.5">
            <NavItem id="vibecoding" icon={Code2} label="Vibe Coding" currentView={currentView} onNavigate={setCurrentView} />
          </div>

          <NavSection label="System" />
          <div className="space-y-0.5">
            <NavItem id="subscription" icon={CreditCard} label="Enterprise" currentView={currentView} onNavigate={setCurrentView} />
            <NavItem id="settings" icon={Settings} label="Settings" currentView={currentView} onNavigate={setCurrentView} />
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2.5 p-3 rounded-2xl surface-interactive cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-premium), var(--accent-primary))', color: '#041016' }}>
              JH
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>jhons</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-premium)' }}>Executive Workspace</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden z-10" style={{ background: 'transparent' }}>

        {/* Custom Title Bar (decorations: false) */}
        <div
          data-tauri-drag-region
          className="h-[38px] flex-shrink-0 flex items-center justify-between pl-4 pr-0 select-none z-50"
          style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div data-tauri-drag-region className="flex items-center gap-2 flex-1">
            <img src="/logo.png" alt="" className="w-4 h-4 object-contain pointer-events-none" />
            <span data-tauri-drag-region className="text-[12px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>SloerVoice-VOICE</span>
            <ChevronRight size={10} style={{ color: 'var(--text-quaternary)' }} />
            <span data-tauri-drag-region className="text-[12px] font-semibold">{currentMeta.label}</span>
          </div>
          <div className="flex items-center h-full">
            <button
              onClick={() => import('@tauri-apps/api/window').then(m => m.getCurrentWindow().minimize())}
              className="h-full px-4 flex items-center justify-center transition-colors hover:bg-white/10"
              aria-label="Minimize"
            ><Minus size={14} style={{ color: 'var(--text-tertiary)' }} /></button>
            <button
              onClick={() => import('@tauri-apps/api/window').then(m => m.getCurrentWindow().toggleMaximize())}
              className="h-full px-4 flex items-center justify-center transition-colors hover:bg-white/10"
              aria-label="Maximize"
            ><Square size={11} style={{ color: 'var(--text-tertiary)' }} /></button>
            <button
              onClick={() => import('@tauri-apps/api/window').then(m => m.getCurrentWindow().hide())}
              className="h-full px-4 flex items-center justify-center transition-colors hover:bg-red-500/80 hover:text-white"
              aria-label="Close"
            ><X size={14} style={{ color: 'var(--text-tertiary)' }} /></button>
          </div>
        </div>

        {/* Header (Glassmorphism) */}
        <header className="h-[52px] flex-shrink-0 flex items-center justify-between px-6 sticky top-0 z-30 header-glass">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setCommandPaletteOpen(true)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[12px] surface-interactive"
            >
              <Search size={13} style={{ color: 'var(--text-tertiary)' }} />
              <span style={{ color: 'var(--text-tertiary)' }}>Search…</span>
              <span className="keycap text-[10px] ml-1">⌘K</span>
            </motion.button>
          </div>
          <div className="flex items-center gap-2">
            <span className="premium-chip" data-tone="success"><Shield size={12} /> Local</span>
            <span className="premium-chip" data-tone="info"><Mic size={12} /> Ready</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[var(--content-max-width)] mx-auto w-full p-6 md:p-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-4 xl:grid-cols-[1.45fr,0.8fr]"
            >
              <section className="premium-panel px-6 py-6">
                <div className="premium-section-eyebrow mb-3">Executive Command Layer</div>
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl">
                    <h1 className="text-[30px] leading-tight font-black tracking-[-0.03em]">{currentMeta.label} cockpit with luxury-grade voice intelligence.</h1>
                    <p className="text-[13px] mt-3 max-w-2xl leading-6" style={{ color: 'var(--text-secondary)' }}>
                      SloerVoice is now staged as an enterprise voice platform with premium shell architecture, rich operational feedback and a fast local widget workflow built for serious daily use.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="premium-chip" data-tone="warning"><Sparkles size={12} /> Premium Motion</span>
                    <span className="premium-chip" data-tone="info"><Zap size={12} /> Fast Widget</span>
                    <span className="premium-chip" data-tone="success"><Shield size={12} /> On-device Trust</span>
                  </div>
                </div>
                <div className="premium-divider my-5" />
                <div className="grid gap-3 md:grid-cols-3">
                  {premiumHighlights.map((item) => (
                    <div key={item.label} className="premium-stat-card px-4 py-4">
                      <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">{item.label}</div>
                      <div className="text-[13px] font-semibold mt-2 leading-6">{item.value}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="premium-panel px-5 py-5">
                <div className="premium-section-eyebrow mb-3">Mission Control</div>
                <div className="space-y-3">
                  <div className="premium-stat-card px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Active view</div>
                        <div className="text-[16px] font-bold mt-1">{currentMeta.label}</div>
                      </div>
                      <span className="premium-chip" data-tone="info">Live</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="premium-stat-card px-4 py-4">
                      <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">Theme vault</div>
                      <div className="text-[15px] font-bold mt-1 capitalize">{theme}</div>
                    </div>
                    <div className="premium-stat-card px-4 py-4">
                      <div className="text-[10px] uppercase tracking-[0.18em] premium-muted">History cache</div>
                      <div className="text-[15px] font-bold mt-1">{historyCount}</div>
                    </div>
                  </div>
                  <button onClick={() => setCommandPaletteOpen(true)} className="premium-button-secondary w-full">
                    <Search size={14} /> Open command palette
                  </button>
                </div>
              </section>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {currentView === 'overview' && <OverviewDashboard />}
                {currentView === 'history' && <History />}
                {currentView === 'dictionary' && <Dictionary />}
                {currentView === 'shortcuts' && <Shortcuts />}
                {currentView === 'snippets' && <Snippets />}
                {currentView === 'style' && <Style />}
                {currentView === 'scratchpad' && <Scratchpad />}
                {currentView === 'vibecoding' && <VibeCoding />}
                {currentView === 'subscription' && <Subscription />}
                {currentView === 'settings' && <SettingsView theme={theme} setTheme={setTheme} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Global Overlays */}

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} onNavigate={handleNavigate} />
      <ToastContainer />
    </div>
  );
}

export default App;

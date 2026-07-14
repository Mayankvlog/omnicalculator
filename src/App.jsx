import React, { useState, useEffect } from 'react';
import { THEMES } from './types.js';
import SEO from './components/SEO.jsx';
import ThemeSelector from './components/ThemeSelector.jsx';
import CalculatorSimple from './components/CalculatorSimple.jsx';
import CalculatorScientific from './components/CalculatorScientific.jsx';
import CalculatorFraction from './components/CalculatorFraction.jsx';
import CalculatorPercentage from './components/CalculatorPercentage.jsx';
import CalculatorTimer from './components/CalculatorTimer.jsx';
import CalculatorHistory from './components/CalculatorHistory.jsx';
import { playSound, toggleSound } from './utils/audio.js';
import { LANGUAGES, TRANSLATIONS } from './utils/languages.js';
import { motion, AnimatePresence } from 'motion/react';

import { 
  Calculator, 
  Binary, 
  Percent, 
  Timer, 
  PieChart, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  BookOpen,
  Keyboard,
  Compass,
  Laptop,
  Globe
} from 'lucide-react';

export default function App() {
  // Language translation state
  const [lang, setLang] = useState('en');
  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Application Mode/Template state
  const [mode, setMode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryMode = params.get('mode');
      const validModes = ['basic', 'scientific', 'fraction', 'percentage', 'timer'];
      if (queryMode && validModes.includes(queryMode)) {
        return queryMode;
      }
    } catch (e) {
      console.warn('Could not read URL parameter "mode"', e);
    }
    return 'basic';
  });

  // Handle browser popstate navigation
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryMode = params.get('mode');
        const validModes = ['basic', 'scientific', 'fraction', 'percentage', 'timer'];
        if (queryMode && validModes.includes(queryMode)) {
          setMode(queryMode);
        }
      } catch (e) {
        console.warn('Could not handle popstate for "mode"', e);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Theme state
  const [currentThemeId, setCurrentThemeId] = useState('nordic');
  const activeTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  // Volume state
  const [soundOn, setSoundOn] = useState(true);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Math logs / History state
  const [history, setHistory] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Restore history on start
  useEffect(() => {
    try {
      const stored = localStorage.getItem('omni_calc_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      }
    } catch (e) {
      console.warn('Failed to restore history', e);
    }
  }, []);

  // Sync back to local storage
  const handleAddHistory = (expression, result) => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      expression,
      result,
      tab: mode
    };
    const updated = [...history, newItem].slice(-100); // store last 100 items maximum
    setHistory(updated);
    try {
      localStorage.setItem('omni_calc_logs', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist history', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('omni_calc_logs');
    } catch (e) {
      console.warn('Failed to clear history text link', e);
    }
  };

  const handleCopyResult = (text) => {
    navigator.clipboard.writeText(text);
    playSound('success');
    // Visual feedback helper
    const item = history.find(h => h.result === text);
    if (item) {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  // Sound Feedback Toggle
  const handleToggleSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    toggleSound(nextVal);
    playSound('success');
  };

  // Fullscreen Toggle
  const handleToggleFullscreen = () => {
    playSound('tick');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn('Could not request fullscreen', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Monitor fullscreen change events (e.g., if user exits with Escape)
  useEffect(() => {
    const onChange = () => {
       setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Quick switch function
  const selectMode = (m) => {
    playSound('success');
    setMode(m);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', m);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.warn('Could not update URL parameter "mode"', e);
    }
  };

  return (
    <div className={`min-h-screen ${activeTheme.bg} transition-colors duration-500 pb-16 flex flex-col relative overflow-hidden`}>
      {/* Dynamic SEO Injector updating tags */}
      <SEO mode={mode} />

      {/* Aesthetic Smooth Ambient Floating Blobs (Aura Effect) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute top-1/4 -left-12 w-72 h-72 rounded-full blur-3xl opacity-15 filter transition-colors duration-500 ${
            currentThemeId === 'nordic' ? 'bg-teal-500' :
            currentThemeId === 'classic' ? 'bg-amber-400' :
            currentThemeId === 'cyberpunk' ? 'bg-fuchsia-500' :
            currentThemeId === 'forest' ? 'bg-orange-600' : 'bg-rose-400'
          }`}
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 50, -20, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute bottom-1/4 -right-12 w-80 h-80 rounded-full blur-3xl opacity-15 filter transition-colors duration-500 ${
            currentThemeId === 'nordic' ? 'bg-sky-500' :
            currentThemeId === 'classic' ? 'bg-orange-500' :
            currentThemeId === 'cyberpunk' ? 'bg-cyan-500' :
            currentThemeId === 'forest' ? 'bg-emerald-600' : 'bg-orange-300'
          }`}
        />
      </div>

      {/* Top Application Header bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md shadow-sm transition-all duration-350 ${activeTheme.headerBg} ${activeTheme.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between relative z-10">
          
          {/* Brand Logo & Branding Info */}
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-tr from-teal-505 to-emerald-400 rounded-xl text-slate-950 font-extrabold select-none shadow-md cursor-pointer header-logo-neon"
            >
              <Calculator className="w-5.5 h-5.5" />
            </motion.div>
            <div>
              <h1 className="text-lg lg:text-xl font-extrabold tracking-tight">
                OmniCalc <span className="text-teal-400 font-black">Classic</span>
              </h1>
              <p className="hidden sm:block text-[10px] opacity-75 lg:opacity-85 leading-none mt-0.5 font-mono">
                High Precision Multi-Mode Calculator
              </p>
            </div>
          </div>

          {/* Quick Utility controls */}
          <div className="flex items-center gap-2.5">
            {/* Elegant Language Select Box */}
            <div className="relative flex items-center gap-1.5 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-750/70 rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2 text-xs text-slate-350 transition-all">
              <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <select
                id="language-select"
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value);
                  playSound('success');
                }}
                className="bg-transparent text-slate-200 outline-none cursor-pointer pr-1 text-xs font-sans max-w-[90px] sm:max-w-[130px] font-medium border-none focus:ring-0 focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Play/Mute sound toggle */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              id="sound-control-toggle"
              onClick={handleToggleSound}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundOn 
                  ? 'bg-slate-800/60 border-slate-700/60 text-teal-350 hover:bg-slate-850' 
                  : 'bg-rose-950/15 border-rose-905/30 text-rose-400 hover:bg-rose-950/25'
              }`}
              title={soundOn ? 'Disable tactile click sound tone' : 'Enable click tones'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </motion.button>

            {/* Distraction-Free Fullscreen */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              id="fullscreen-toggle-btn"
              onClick={handleToggleFullscreen}
              className="p-2.5 rounded-xl border border-slate-700/50 bg-slate-855/40 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen mode' : 'Enter Immersive Screen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </motion.button>
          </div>

        </div>
      </header>

      {/* Primary Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full space-y-8 flex flex-col relative z-10">
        
        {/* Templates Mode Navigation Grid Cards */}
        <nav aria-label="Calculator Modes" className="grid grid-cols-2 md:grid-cols-5 gap-3">
          
          {/* TAB 1 */}
          <button
            id="nav-mode-basic"
            onClick={() => selectMode('basic')}
            className="p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 group relative overflow-hidden bg-slate-900/35 border-slate-800/80 hover:bg-slate-900/20 text-slate-400 hover:text-slate-200"
          >
            {mode === 'basic' && (
              <motion.div
                layoutId="activeTabOutline"
                className="absolute inset-0 bg-teal-500/10 border border-teal-500/80 rounded-xl z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <div className="p-2 rounded-lg bg-slate-950/30 group-hover:scale-105 transition-transform z-10">
              <Calculator className="w-5 h-5 text-teal-400" />
            </div>
            <span className={`text-xs uppercase tracking-wider select-none z-10 ${mode === 'basic' ? 'text-teal-300 font-black' : ''}`}>{t('basic')}</span>
            <div className="hidden lg:block text-[9px] opacity-60 font-mono z-10">{t('simpleLayout')}</div>
          </button>

          {/* TAB 2 */}
          <button
            id="nav-mode-scientific"
            onClick={() => selectMode('scientific')}
            className="p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 group relative overflow-hidden bg-slate-900/35 border-slate-800/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
          >
            {mode === 'scientific' && (
              <motion.div
                layoutId="activeTabOutline"
                className="absolute inset-0 bg-teal-500/10 border border-teal-500/80 rounded-xl z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <div className="p-2 rounded-lg bg-slate-950/30 group-hover:scale-105 transition-transform z-10">
              <Binary className="w-5 h-5 text-teal-400" />
            </div>
            <span className={`text-xs uppercase tracking-wider select-none z-10 ${mode === 'scientific' ? 'text-teal-300 font-black' : ''}`}>{t('scientific')}</span>
            <div className="hidden lg:block text-[9px] opacity-60 font-mono z-10">{t('trigFunctions')}</div>
          </button>

          {/* TAB 3 */}
          <button
            id="nav-mode-fraction"
            onClick={() => selectMode('fraction')}
            className="p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 group relative overflow-hidden bg-slate-900/35 border-slate-800/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
          >
            {mode === 'fraction' && (
              <motion.div
                layoutId="activeTabOutline"
                className="absolute inset-0 bg-teal-500/10 border border-teal-500/80 rounded-xl z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <div className="p-2 rounded-lg bg-slate-950/30 group-hover:scale-105 transition-transform z-10">
              <PieChart className="w-5 h-5 text-teal-400" />
            </div>
            <span className={`text-xs uppercase tracking-wider select-none z-10 ${mode === 'fraction' ? 'text-teal-300 font-black' : ''}`}>{t('fraction')}</span>
            <div className="hidden lg:block text-[9px] opacity-60 font-mono z-10">{t('stepSolver')}</div>
          </button>

          {/* TAB 4 */}
          <button
            id="nav-mode-percentage"
            onClick={() => selectMode('percentage')}
            className="p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 group relative overflow-hidden bg-slate-900/35 border-slate-800/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
          >
            {mode === 'percentage' && (
              <motion.div
                layoutId="activeTabOutline"
                className="absolute inset-0 bg-teal-500/10 border border-teal-500/80 rounded-xl z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <div className="p-2 rounded-lg bg-slate-950/30 group-hover:scale-105 transition-transform z-10">
              <Percent className="w-5 h-5 text-teal-400" />
            </div>
            <span className={`text-xs uppercase tracking-wider select-none z-10 ${mode === 'percentage' ? 'text-teal-300 font-black' : ''}`}>{t('percentage')}</span>
            <div className="hidden lg:block text-[9px] opacity-60 font-mono z-10">{t('financialRates')}</div>
          </button>

          {/* TAB 5 */}
          <button
            id="nav-mode-timer"
            onClick={() => selectMode('timer')}
            className="col-span-2 md:col-span-1 p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 group relative overflow-hidden bg-slate-900/35 border-slate-800/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
          >
            {mode === 'timer' && (
              <motion.div
                layoutId="activeTabOutline"
                className="absolute inset-0 bg-teal-500/10 border border-teal-500/80 rounded-xl z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <div className="p-2 rounded-lg bg-slate-950/30 group-hover:scale-105 transition-transform z-10">
              <Timer className="w-5 h-5 text-teal-400" />
            </div>
            <span className={`text-xs uppercase tracking-wider select-none z-10 ${mode === 'timer' ? 'text-teal-300 font-black' : ''}`}>{t('timer')}</span>
            <div className="hidden lg:block text-[9px] opacity-60 font-mono z-10">{t('lapsAlarm')}</div>
          </button>

        </nav>

        {/* Dual Column Layout: Calculator on Left, History Log on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Template Renderer Switch Case */}
                {mode === 'basic' && (
                  <CalculatorSimple 
                    theme={activeTheme} 
                    onAddHistory={handleAddHistory} 
                    t={t}
                    lang={lang}
                  />
                )}

                {mode === 'scientific' && (
                  <CalculatorScientific 
                    theme={activeTheme} 
                    onAddHistory={handleAddHistory} 
                    t={t}
                    lang={lang}
                  />
                )}

                {mode === 'fraction' && (
                  <CalculatorFraction 
                    theme={activeTheme} 
                    onAddHistory={handleAddHistory} 
                    t={t}
                    lang={lang}
                  />
                )}

                {mode === 'percentage' && (
                  <CalculatorPercentage 
                    theme={activeTheme} 
                    onAddHistory={handleAddHistory} 
                    t={t}
                    lang={lang}
                  />
                )}

                {mode === 'timer' && (
                  <CalculatorTimer 
                    theme={activeTheme} 
                    onAddHistory={handleAddHistory} 
                    t={t}
                    lang={lang}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* History Column on Widescreens */}
          <div className="lg:col-span-1 h-full">
            <CalculatorHistory
              history={history}
              theme={activeTheme}
              onClearHistory={handleClearHistory}
              onCopyExpression={handleCopyResult}
              copiedId={copiedId}
              t={t}
            />
          </div>

        </div>

        {/* Dynamic theme switcher layout section */}
        <ThemeSelector
          currentThemeId={currentThemeId}
          onSelectTheme={setCurrentThemeId}
          cardBg={activeTheme.cardBg}
          t={t}
        />

        {/* Informative SEO and Documentation Text Boxes */}
        <section aria-label="Information Panel" className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 space-y-5 text-xs text-slate-400 leading-relaxed md:grid md:grid-cols-2 md:gap-x-8 md:space-y-0">
          <div>
            <h4 className="flex items-center gap-1.5 text-slate-200 font-bold mb-3">
              <BookOpen className="w-4 h-4 text-teal-400" /> {t('about')}
            </h4>
            <p className="mb-2">
              OmniCalc is a modern high-fidelity digital remake of the most popular web calculators. We have created a seamless interface matching the big display retro design but adding beautiful tactile synth sounds, flexible dark skins, complex fraction solvers with educational homework breakdowns, and an accurate high-precision clock timer.
            </p>
            <p>
              Use this digital tool natively on your laptop, desktop screen, or mobile Safari/Chrome browser. The page supports touch screens with comfortable 44px tap targets.
            </p>
          </div>

          <div>
            <h4 className="flex items-center gap-1.5 text-slate-200 font-bold mb-3">
              <Keyboard className="w-4 h-4 text-teal-400" /> {t('keyboard')}
            </h4>
            <p className="mb-2">
              For ultra-fast operations on desktop notebooks, you can use physical keyboard keys directly. Our system auto-binds standard keys:
            </p>
            <ul className="list-disc pl-4 space-y-1 font-mono text-[10px]">
              <li><strong className="text-teal-400">0 - 9</strong>: Standard number values</li>
              <li><strong className="text-teal-400">+, -, *, /</strong>: Addition, Subtraction, Multiplication, Division operators</li>
              <li><strong className="text-teal-400">Enter / =</strong>: Evaluate and log the formula</li>
              <li><strong className="text-teal-400">Backspace</strong>: Clears last digit character</li>
              <li><strong className="text-teal-400">Esc</strong>: Full mathematical Clear (AC)</li>
            </ul>
          </div>
        </section>

      </main>

      {/* Styled SEO Crawler Friendly Footer */}
      <footer className="mt-16 border-t border-slate-800/60 pt-6 text-center text-[11px] text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 OmniCalc Classic. Built with high precision. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-350 cursor-help flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> {t('precisionTrig')}
            </span>
            <span className="hover:text-slate-350 cursor-help flex items-center gap-1">
              <Laptop className="w-3.5 h-3.5" /> {t('clientSafe')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

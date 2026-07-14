import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/audio.js';
import { Play, Pause, RotateCw, Flag, Bell, Timer, Music, XCircle } from 'lucide-react';

export default function CalculatorTimer({ theme, onAddHistory, t }) {
  // Tabs: 'stopwatch' | 'countdown'
  const [activeSubTab, setActiveSubTab] = useState('stopwatch');

  // --- STOPWATCH STATE ---
  const [swRunning, setSwRunning] = useState(false);
  const [swTime, setSwTime] = useState(0); // in milliseconds
  const [laps, setLaps] = useState([]);
  const swIntervalRef = useRef(null);
  const swStartTimeRef = useRef(0);

  // --- COUNTDOWN STATE ---
  const [cdHours, setCdHours] = useState(0);
  const [cdMinutes, setCdMinutes] = useState(5);
  const [cdSeconds, setCdSeconds] = useState(0);
  const [cdRunning, setCdRunning] = useState(false);
  const [cdTimeLeft, setCdTimeLeft] = useState(300); // in seconds
  const [cdInitialTime, setCdInitialTime] = useState(300);
  const cdIntervalRef = useRef(null);
  const [alarmActive, setAlarmActive] = useState(false);
  const alarmIntervalRef = useRef(null);

  // --- STOPWATCH ACTIONS ---
  const startStopwatch = () => {
    playSound('click');
    if (!swRunning) {
      setSwRunning(true);
      swStartTimeRef.current = Date.now() - swTime;
      swIntervalRef.current = setInterval(() => {
        setSwTime(Date.now() - swStartTimeRef.current);
      }, 10);
    }
  };

  const pauseStopwatch = () => {
    playSound('click');
    if (swRunning) {
      setSwRunning(false);
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    }
  };

  const resetStopwatch = () => {
    playSound('click');
    setSwRunning(false);
    if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    if (swTime > 0) {
      onAddHistory('Stopwatch Session Time', formatSwTime(swTime));
    }
    setSwTime(0);
    setLaps([]);
  };

  const recordLap = () => {
    playSound('tick');
    setLaps([swTime, ...laps]);
  };

  const formatSwTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const mStr = minutes.toString().padStart(2, '0');
    const sStr = seconds.toString().padStart(2, '0');
    const cStr = centiseconds.toString().padStart(2, '0');

    return `${mStr}:${sStr}.${cStr}`;
  };

  // --- COUNTDOWN ACTIONS ---
  const handleStartCountdown = () => {
    playSound('click');
    if (cdRunning) return;

    if (!cdRunning && cdTimeLeft <= 0) {
      // Re-populate from inputs if idle
      const totalSec = cdHours * 3600 + cdMinutes * 60 + cdSeconds;
      if (totalSec <= 0) {
        playSound('error');
        return;
      }
      setCdTimeLeft(totalSec);
      setCdInitialTime(totalSec);
    }

    setCdRunning(true);
    cdIntervalRef.current = setInterval(() => {
      setCdTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finished!
          clearInterval(cdIntervalRef.current);
          setCdRunning(false);
          triggerAlarmSound();
          onAddHistory('Egg Timer Countdown Done', 'Alarm Fired!');
          return 0;
        }
        // Soft tick sound every second
        if (prev % 1 === 0) {
          playSound('tick');
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePauseCountdown = () => {
    playSound('click');
    setCdRunning(false);
    if (cdIntervalRef.current) clearInterval(cdIntervalRef.current);
  };

  const handleResetCountdown = () => {
    playSound('click');
    setCdRunning(false);
    if (cdIntervalRef.current) clearInterval(cdIntervalRef.current);
    dismissAlarm();
    const totalSec = cdHours * 3600 + cdMinutes * 60 + cdSeconds;
    setCdTimeLeft(totalSec);
    setCdInitialTime(totalSec || 300);
  };

  const triggerAlarmSound = () => {
    setAlarmActive(true);
    // Beep every second until dismissed
    playSound('beep');
    alarmIntervalRef.current = setInterval(() => {
      playSound('beep');
    }, 1200);
  };

  const dismissAlarm = () => {
    setAlarmActive(false);
    playSound('success');
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  // Convert inputs to timer on-the-fly when not running
  useEffect(() => {
    if (!cdRunning && !alarmActive) {
      const totalSec = cdHours * 3600 + cdMinutes * 60 + cdSeconds;
      setCdTimeLeft(totalSec);
      setCdInitialTime(totalSec || 300);
    }
  }, [cdHours, cdMinutes, cdSeconds]);

  // Clean elements on unmount
  useEffect(() => {
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
      if (cdIntervalRef.current) clearInterval(cdIntervalRef.current);
      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
    };
  }, []);

  const formatCdTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const hStr = hrs > 0 ? `${hrs}:` : '';
    const mStr = mins.toString().padStart(2, '0');
    const sStr = secs.toString().padStart(2, '0');

    return `${hStr}${mStr}:${sStr}`;
  };

  // Progress percentage for countdown egg visualizer
  const fillProgress = cdInitialTime > 0 ? (cdTimeLeft / cdInitialTime) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Sub tabs to switch stopwatch / countdown timer */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 gap-2 w-full max-w-xl mb-6">
        <button
          onClick={() => { playSound('tick'); setActiveSubTab('stopwatch'); }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'stopwatch' ? 'bg-teal-650 text-teal-100 shadow' : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <Timer className="w-4 h-4" /> {t('stopwatch')}
        </button>
        <button
          onClick={() => { playSound('tick'); setActiveSubTab('countdown'); }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'countdown' ? 'bg-teal-650 text-teal-100 shadow' : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" /> {t('countdown')}
        </button>
      </div>

      <div
        id="time-tools-calculator-frame"
        className={`w-full max-w-xl rounded-2xl p-6 border ${theme.cardBg} transition-all duration-300`}
      >
        {activeSubTab === 'stopwatch' ? (
          // --- STOPWATCH SCREEN WORKFLOW ---
          <div className="space-y-6">
            <h3 className="text-center font-bold text-sm tracking-wider uppercase text-slate-400">{t('stopwatch')}</h3>
            
            {/* Display */}
            <div className={`py-8 rounded-xl border text-center font-mono text-5xl lg:text-6xl font-extrabold tracking-tight ${theme.displayBg} ${theme.displayText}`}>
              {formatSwTime(swTime)}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!swRunning ? (
                <button
                  id="sw-start-btn"
                  onClick={startStopwatch}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Play className="w-4.5 h-4.5 fill-current" /> {t('start')}
                </button>
              ) : (
                <button
                  id="sw-pause-btn"
                  onClick={pauseStopwatch}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Pause className="w-4.5 h-4.5 fill-current" /> {t('pause')}
                </button>
              )}
              
              {swRunning && (
                <button
                  id="sw-lap-btn"
                  onClick={recordLap}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <Flag className="w-4.5 h-4.5" /> {t('lap') || 'Lap'}
                </button>
              )}

              <button
                id="sw-reset-btn"
                onClick={resetStopwatch}
                className="flex items-center gap-2 px-6 py-3 bg-rose-950/40 border border-rose-900/30 hover:bg-rose-900/50 text-rose-300 font-bold rounded-xl transition-all cursor-pointer"
              >
                <RotateCw className="w-4.5 h-4.5" /> {t('reset')}
              </button>
            </div>

            {/* Lap Table */}
            {laps.length > 0 && (
              <div className="border border-slate-800/80 rounded-xl overflow-hidden mt-6 bg-black/30">
                <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 flex justify-between text-xs font-bold text-slate-400">
                  <span>LAP NUMBER</span>
                  <span>SPLIT PERIOD</span>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-850/50 font-mono text-sm">
                  {laps.map((lapTime, index) => (
                    <div key={index} className="px-4 py-2 flex justify-between items-center bg-slate-955/20">
                      <span className="text-slate-500 text-xs">Lap {laps.length - index}</span>
                      <span className="text-teal-400 font-bold">{formatSwTime(lapTime)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // --- COUNTDOWN EGG TIMER SCREEN WORKFLOW ---
          <div className="space-y-6">
            <h3 className="text-center font-bold text-sm tracking-wider uppercase text-slate-400">{t('countdown')}</h3>

            {alarmActive && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 text-center rounded-xl p-4 flex flex-col items-center justify-center gap-2 animate-bounce">
                <Music className="w-6 h-6 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-wider">🔔 Timer Finished! Alarm Sounding!</span>
                <button
                  id="dismiss-alarm-btn"
                  onClick={dismissAlarm}
                  className="mt-1 flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-colors text-xs cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> Stop Signal
                </button>
              </div>
            )}

            {/* Visual Progress ring/meter */}
            <div className="flex justify-center items-center py-4 relative">
              <div className={`relative flex flex-col justify-center items-center rounded-full w-48 h-48 border shadow-lg bg-black/40 overflow-hidden ${theme.border}`}>
                
                {/* Visual Fluid Progress Shade background filling */}
                <div 
                  className="absolute bottom-0 w-full bg-teal-500/10 border-t border-teal-500/20 transition-all duration-1001" 
                  style={{ height: `${fillProgress}%` }}
                />

                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1 z-10">TIMER EXPIRING</span>
                <span className="text-4xl font-mono font-extrabold text-teal-300 font-bold z-10">
                  {formatCdTime(cdTimeLeft)}
                </span>
                
                <span className="text-[10px] font-mono text-slate-600 mt-2 z-10 uppercase select-none">
                  {cdRunning ? 'RUNNING' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Inputs grid when pause/idle */}
            {!cdRunning && !alarmActive && (
              <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/80 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Adjust Timer Period</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center">
                    <label htmlFor="timer-hours" className="text-[10px] text-slate-500 font-bold uppercase mb-1">Hours</label>
                    <select
                      id="timer-hours"
                      value={cdHours}
                      onChange={(e) => { playSound('tick'); setCdHours(parseInt(e.target.value)); }}
                      className="w-full bg-slate-950 border border-slate-800 text-teal-400 font-bold text-center py-2 rounded-lg cursor-pointer"
                    >
                      {Array.from({ length: 24 }).map((_, h) => (
                        <option key={h} value={h}>{h} hr</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col items-center">
                    <label htmlFor="timer-minutes" className="text-[10px] text-slate-500 font-bold uppercase mb-1">Minutes</label>
                    <select
                      id="timer-minutes"
                      value={cdMinutes}
                      onChange={(e) => { playSound('tick'); setCdMinutes(parseInt(e.target.value)); }}
                      className="w-full bg-slate-950 border border-slate-800 text-teal-400 font-bold text-center py-2 rounded-lg cursor-pointer"
                    >
                      {Array.from({ length: 60 }).map((_, m) => (
                        <option key={m} value={m}>{m} min</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col items-center">
                    <label htmlFor="timer-seconds" className="text-[10px] text-slate-500 font-bold uppercase mb-1">Seconds</label>
                    <select
                      id="timer-seconds"
                      value={cdSeconds}
                      onChange={(e) => { playSound('tick'); setCdSeconds(parseInt(e.target.value)); }}
                      className="w-full bg-slate-950 border border-slate-800 text-teal-400 font-bold text-center py-2 rounded-lg cursor-pointer"
                    >
                      {Array.from({ length: 60 }).map((_, s) => (
                        <option key={s} value={s}>{s} sec</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Countdown Buttons Controls */}
            <div className="flex justify-center gap-4">
              {!cdRunning ? (
                <button
                  id="cd-start-btn"
                  onClick={handleStartCountdown}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  disabled={cdTimeLeft <= 0}
                >
                  <Play className="w-4.5 h-4.5 fill-current" /> {t('start')}
                </button>
              ) : (
                <button
                  id="cd-pause-btn"
                  onClick={handlePauseCountdown}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Pause className="w-4.5 h-4.5 fill-current" /> {t('pause')}
                </button>
              )}

              <button
                id="cd-reset-btn"
                onClick={handleResetCountdown}
                className="flex items-center gap-2 px-6 py-3 bg-rose-950/40 border border-rose-900/30 hover:bg-rose-900/50 text-rose-300 font-bold rounded-xl transition-all cursor-pointer"
              >
                <RotateCw className="w-4.5 h-4.5" /> {t('reset')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

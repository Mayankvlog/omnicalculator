import React from 'react';
import { Trash2, Copy, Check, Clock } from 'lucide-react';
import { playSound } from '../utils/audio.js';
import { motion, AnimatePresence } from 'motion/react';

export default function CalculatorHistory({
  history,
  theme,
  onClearHistory,
  onCopyExpression,
  copiedId,
  t
}) {
  
  const handleClear = () => {
    playSound('error');
    onClearHistory();
  };

  const handleCopy = (item) => {
    playSound('tick');
    onCopyExpression(item.result);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border ${theme.cardBg} transition-all duration-300 relative overflow-hidden shadow-lg`}>
      {/* History Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-800/80 bg-slate-900/10 dark:bg-black/20 relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 select-none animate-fade-in">
          <Clock className="w-3.5 h-3.5 text-teal-400" /> {t('history')} ({history.length})
        </h3>
        {history.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="clear-logs-btn"
            onClick={handleClear}
            className="flex items-center gap-1 text-[10px] uppercase font-bold text-rose-400 hover:text-rose-350 bg-rose-950/20 px-2 py-1 rounded transition-colors border border-rose-900/30 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" /> {t('clearInputs')}
          </motion.button>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto lg:max-h-[500px] p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 relative z-10">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 text-xs select-none">
            <span className="text-2xl mb-2 select-none animate-bounce">🧾</span>
            <p>{t('emptyHistory')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {history.slice().reverse().map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, height: "auto", y: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9, y: 10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="bg-slate-950/35 border border-slate-850/60 rounded-xl p-3.5 transition-all hover:bg-slate-950/50 flex flex-col gap-1 text-right group relative overflow-hidden"
                >
                  {/* Timestamp & Type Tab badge */}
                  <div className="flex justify-between items-center mb-1 text-[9px] font-mono text-slate-500 select-none">
                    <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-teal-400 font-bold uppercase tracking-widest leading-none">
                      {item.tab}
                    </span>
                    <span>{formatTime(item.timestamp)}</span>
                  </div>

                  {/* Equation */}
                  <div className="text-xs text-slate-400 truncate font-mono select-all">
                    {item.expression}
                  </div>

                  {/* Result Value with Copy Button */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    {/* Visual quick copy on hover */}
                    <button
                      onClick={() => handleCopy(item)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-teal-400 transition-all cursor-pointer"
                      title="Copy result to clipboard"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-emerald-400 animate-ping-once" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>

                    <div className="font-mono text-base font-extrabold text-teal-400 truncate select-all">
                      {item.result}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

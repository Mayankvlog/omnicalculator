import React from 'react';
import { THEMES } from '../types.js';
import { playSound } from '../utils/audio.js';
import { Palette, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function ThemeSelector({ currentThemeId, onSelectTheme, cardBg, t }) {
  const handleSelect = (id) => {
    playSound('success');
    onSelectTheme(id);
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 w-full relative overflow-hidden">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5 select-none relative z-10">
        <Palette className="w-4 h-4 text-teal-400" /> {t('theme')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
        {THEMES.map((theme) => {
          const isSelected = theme.id === currentThemeId;
          return (
            <motion.button
              key={theme.id}
              onClick={() => handleSelect(theme.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                isSelected
                  ? 'border-teal-500 bg-teal-500/10 text-teal-300 ring-1 ring-teal-500'
                  : 'border-slate-800 bg-slate-950/20 text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold truncate leading-none">
                  {theme.name}
                </span>
                <span className="text-[9px] text-slate-500 leading-none">
                  {theme.id.toUpperCase()} skin
                </span>
              </div>

              {isSelected ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="shrink-0 ml-2"
                >
                  <Check className="w-4 h-4 text-teal-400" />
                </motion.div>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

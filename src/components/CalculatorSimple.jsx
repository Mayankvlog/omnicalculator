import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/audio.js';
import { Delete, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function CalculatorSimple({ theme, onAddHistory, t }) {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [memory, setMemory] = useState(0);
  const [hasMemory, setHasMemory] = useState(false);
  const [resetOnNext, setResetOnNext] = useState(false);
  const [activeButtonId, setActiveButtonId] = useState(null);
  const calculatorRef = useRef(null);

  const handleKeyClick = (value, type) => {
    playSound('click');

    if (type === 'number') {
      if (display === '0' || resetOnNext) {
        setDisplay(value);
        setResetOnNext(false);
      } else {
        if (display.replace('.', '').length < 15) {
          setDisplay(display + value);
        }
      }
    } else if (type === 'operator') {
      setResetOnNext(false);
      if (value === '+/-') {
        const num = parseFloat(display);
        if (!isNaN(num)) {
          setDisplay((num * -1).toString());
        }
        return;
      }
      if (value === '%') {
        const num = parseFloat(display);
        if (!isNaN(num)) {
          const res = (num / 100).toString();
          setDisplay(res);
          onAddHistory(`${num} %`, res);
        }
        return;
      }

      let cleanDisplay = display;
      if (display.endsWith('.')) {
        cleanDisplay = display.slice(0, -1);
      }
      setFormula(formula + ' ' + cleanDisplay + ' ' + value);
      setResetOnNext(true);
    } else if (type === 'action') {
      switch (value) {
        case 'C':
          setDisplay('0');
          setFormula('');
          setResetOnNext(false);
          break;
        case 'CE':
          setDisplay('0');
          break;
        case 'Backspace':
          if (display.length > 1) {
            setDisplay(display.slice(0, -1));
          } else {
            setDisplay('0');
          }
          break;
        case '.':
          if (resetOnNext) {
            setDisplay('0.');
            setResetOnNext(false);
          } else if (!display.includes('.')) {
            setDisplay(display + '.');
          }
          break;
        case 'MC':
          setMemory(0);
          setHasMemory(false);
          break;
        case 'MR':
          setDisplay(memory.toString());
          setResetOnNext(true);
          break;
        case 'M+': {
          const currentVal = parseFloat(display);
          if (!isNaN(currentVal)) {
            setMemory(prev => prev + currentVal);
            setHasMemory(true);
            setResetOnNext(true);
          }
          break;
        }
        case 'M-': {
          const currentVal = parseFloat(display);
          if (!isNaN(currentVal)) {
            setMemory(prev => prev - currentVal);
            setHasMemory(true);
            setResetOnNext(true);
          }
          break;
        }
      }
    } else if (type === 'equals') {
      let finalFormula = formula + ' ' + display;
      if (!formula) return;

      try {
        const sanitizedExpr = finalFormula
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/−/g, '-');

        const evalResult = new Function(`return (${sanitizedExpr})`)();

        if (evalResult === Infinity || evalResult === -Infinity || isNaN(evalResult)) {
          playSound('error');
          setDisplay(t('error') || 'Error');
          setFormula('');
          setResetOnNext(true);
          return;
        }

        const roundedResult = Math.round(evalResult * 1e10) / 1e10;
        const resultStr = roundedResult.toString();

        setDisplay(resultStr);
        setFormula('');
        setResetOnNext(true);
        onAddHistory(finalFormula, resultStr);
        playSound('success');
      } catch (err) {
        playSound('error');
        setDisplay(t('error') || 'Error');
        setFormula('');
        setResetOnNext(true);
      }
    }
  };

  const triggerHighlight = (btnId) => {
    setActiveButtonId(btnId);
    setTimeout(() => setActiveButtonId(null), 130);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        handleKeyClick(key, 'number');
        triggerHighlight(`btn-${key}`);
      } else if (key === '.') {
        e.preventDefault();
        handleKeyClick('.', 'action');
        triggerHighlight('btn-dec');
      } else if (key === '+') {
        e.preventDefault();
        handleKeyClick('+', 'operator');
        triggerHighlight('btn-add');
      } else if (key === '-') {
        e.preventDefault();
        handleKeyClick('−', 'operator');
        triggerHighlight('btn-sub');
      } else if (key === '*' || key === 'x' || key === 'X') {
        e.preventDefault();
        handleKeyClick('×', 'operator');
        triggerHighlight('btn-mul');
      } else if (key === '/') {
        e.preventDefault();
        handleKeyClick('÷', 'operator');
        triggerHighlight('btn-div');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleKeyClick('=', 'equals');
        triggerHighlight('btn-eq');
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleKeyClick('Backspace', 'action');
        triggerHighlight('btn-backspace');
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        handleKeyClick('C', 'action');
        triggerHighlight('btn-clear');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, formula, memory, resetOnNext]);

  // Framer-motion layout transitions
  const btnAnimationProps = {
    whileHover: { scale: 1.04, y: -1 },
    whileTap: { scale: 0.93 },
    transition: { type: "spring", stiffness: 450, damping: 14 }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Interactive Quick Help Badge */}
      <div className="w-full max-w-lg mb-3 flex justify-between items-center text-xs opacity-75">
        <span className="flex items-center gap-1.5 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-teal-400" /> Keyboard Triggers Online
        </span>
        {hasMemory && (
          <span className="animate-pulse text-rose-500 font-mono font-bold bg-rose-500/10 px-2 py-0.5 rounded">
            MEM Active (MR: {memory})
          </span>
        )}
      </div>

      <div
        ref={calculatorRef}
        id="basic-calculator-frame"
        className={`w-full max-w-lg rounded-2xl p-6 border ${theme.cardBg} transition-all duration-300 relative shadow-xl`}
      >
        {/* Large screen digital display */}
        <div className={`w-full rounded-xl p-5 mb-5 border text-right overflow-hidden ${theme.displayBg}`}>
          <div className={`h-6 text-sm mb-1 truncate select-none ${theme.displayAltText}`}>
            {formula || '\u00A0'}
          </div>
          <motion.div 
            key={display}
            initial={{ scale: 0.98, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={`text-4xl lg:text-5xl font-semibold tracking-tight truncate select-all ${theme.displayText}`}
          >
            {display}
          </motion.div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3 antialiased">
          {/* Memory Row */}
          <motion.button
            {...btnAnimationProps}
            id="btn-mc"
            onClick={() => handleKeyClick('MC', 'action')}
            className={`py-3 px-1 rounded-xl text-xs font-mono font-bold border transition-all ${
              activeButtonId === 'btn-mc' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnAction} relative group cursor-pointer`}
          >
            MC
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-neutral-950 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
              Memory Clear
            </span>
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-mr"
            onClick={() => handleKeyClick('MR', 'action')}
            className={`py-3 px-1 rounded-xl text-xs font-mono font-bold border transition-all ${
              activeButtonId === 'btn-mr' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnAction} relative group cursor-pointer`}
          >
            MR
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-neutral-950 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
              Memory Recall ({memory})
            </span>
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-mplus"
            onClick={() => handleKeyClick('M+', 'action')}
            className={`py-3 px-1 rounded-xl text-xs font-mono font-bold border transition-all ${
              activeButtonId === 'btn-mplus' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnAction} relative group cursor-pointer`}
          >
            M+
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-neutral-950 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
              Memory Add (+{display})
            </span>
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-mminus"
            onClick={() => handleKeyClick('M-', 'action')}
            className={`py-3 px-1 rounded-xl text-xs font-mono font-bold border transition-all ${
              activeButtonId === 'btn-mminus' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnAction} relative group cursor-pointer`}
          >
            M-
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-neutral-950 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
              Memory Subtract (-{display})
            </span>
          </motion.button>

          {/* Action Row */}
          <motion.button
            {...btnAnimationProps}
            id="btn-clear"
            onClick={() => handleKeyClick('C', 'action')}
            className={`py-4 rounded-xl text-sm font-extrabold border transition-all cursor-pointer ${
              activeButtonId === 'btn-clear' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnAction}`}
          >
            C
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-clear-entry"
            onClick={() => handleKeyClick('CE', 'action')}
            className={`py-4 rounded-xl text-sm font-extrabold border transition-all cursor-pointer ${
              activeButtonId === 'btn-clear-entry' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnAction}`}
          >
            CE
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-backspace"
            onClick={() => handleKeyClick('Backspace', 'action')}
            className={`py-4 flex items-center justify-center rounded-xl text-sm font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-backspace' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnAction}`}
            aria-label="Delete last digit"
          >
            <Delete className="w-5 h-5" />
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-div"
            onClick={() => handleKeyClick('÷', 'operator')}
            className={`py-4 rounded-xl text-lg font-black border transition-all cursor-pointer ${
              activeButtonId === 'btn-div' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnFn}`}
          >
            ÷
          </motion.button>

          {/* Number 7, 8, 9, * */}
          <motion.button
            {...btnAnimationProps}
            id="btn-7"
            onClick={() => handleKeyClick('7', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-7' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-450' : ''
            } ${theme.btnNumber}`}
          >
            7
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-8"
            onClick={() => handleKeyClick('8', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-8' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-450' : ''
            } ${theme.btnNumber}`}
          >
            8
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-9"
            onClick={() => handleKeyClick('9', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-9' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-450' : ''
            } ${theme.btnNumber}`}
          >
            9
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-mul"
            onClick={() => handleKeyClick('×', 'operator')}
            className={`py-4 rounded-xl text-lg font-black border transition-all cursor-pointer ${
              activeButtonId === 'btn-mul' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnFn}`}
          >
            ×
          </motion.button>

          {/* Number 4, 5, 6, - */}
          <motion.button
            {...btnAnimationProps}
            id="btn-4"
            onClick={() => handleKeyClick('4', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-4' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-450' : ''
            } ${theme.btnNumber}`}
          >
            4
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-5"
            onClick={() => handleKeyClick('5', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-5' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-450' : ''
            } ${theme.btnNumber}`}
          >
            5
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-6"
            onClick={() => handleKeyClick('6', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-6' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-455' : ''
            } ${theme.btnNumber}`}
          >
            6
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-sub"
            onClick={() => handleKeyClick('−', 'operator')}
            className={`py-4 rounded-xl text-lg font-black border transition-all cursor-pointer ${
              activeButtonId === 'btn-sub' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnFn}`}
          >
            −
          </motion.button>

          {/* Number 1, 2, 3, + */}
          <motion.button
            {...btnAnimationProps}
            id="btn-1"
            onClick={() => handleKeyClick('1', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-1' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-450' : ''
            } ${theme.btnNumber}`}
          >
            1
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-2"
            onClick={() => handleKeyClick('2', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-2' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-450' : ''
            } ${theme.btnNumber}`}
          >
            2
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-3"
            onClick={() => handleKeyClick('3', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-3' ? 'scale-95 brightness-125 saturate-155 ring-2 ring-teal-455' : ''
            } ${theme.btnNumber}`}
          >
            3
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-add"
            onClick={() => handleKeyClick('+', 'operator')}
            className={`py-4 rounded-xl text-lg font-black border transition-all cursor-pointer ${
              activeButtonId === 'btn-add' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-400' : ''
            } ${theme.btnFn}`}
          >
            +
          </motion.button>

          {/* Row +/- , 0 , . , = */}
          <motion.button
            {...btnAnimationProps}
            id="btn-sign"
            onClick={() => handleKeyClick('+/-', 'operator')}
            className={`py-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
              activeButtonId === 'btn-sign' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            ±
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-0"
            onClick={() => handleKeyClick('0', 'number')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-0' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-450' : ''
            } ${theme.btnNumber}`}
          >
            0
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-dec"
            onClick={() => handleKeyClick('.', 'action')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-dec' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            .
          </motion.button>

          <motion.button
            {...btnAnimationProps}
            id="btn-eq"
            onClick={() => handleKeyClick('=', 'equals')}
            className={`py-4 rounded-xl text-lg font-black border transition-all cursor-pointer ${
              activeButtonId === 'btn-eq' ? 'scale-95 brightness-115 ring-2 ring-teal-400' : ''
            } ${theme.btnEquals}`}
          >
            =
          </motion.button>
        </div>

        {/* Double zero & percentage */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <motion.button
            {...btnAnimationProps}
            id="btn-00"
            onClick={() => handleKeyClick('00', 'number')}
            className={`py-3.5 rounded-xl text-center font-bold border transition-all cursor-pointer ${
              activeButtonId === 'btn-00' ? 'scale-95 brightness-125 saturate-150 ring-2 ring-teal-450' : ''
            } ${theme.btnNumber}`}
          >
            00
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="btn-perc"
            onClick={() => handleKeyClick('%', 'operator')}
            className={`py-3.5 rounded-xl text-center font-black border transition-all cursor-pointer ${
              activeButtonId === 'btn-perc' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnFn}`}
          >
            % (Percent)
          </motion.button>
        </div>
      </div>
    </div>
  );
}

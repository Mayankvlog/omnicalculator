import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio.js';
import { Delete, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function CalculatorScientific({ theme, onAddHistory, t }) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isRad, setIsRad] = useState(true); // Radians vs Degrees
  const [hasError, setHasError] = useState(false);
  const [activeButtonId, setActiveButtonId] = useState(null);

  const appendSymbol = (symbol) => {
    playSound('click');
    setHasError(false);
    
    // Auto insert multiplication on cases like '9(sin'
    let updated = expression;
    if (symbol === '(' && expression && /[0-9πe)]/.test(expression.slice(-1))) {
      updated += ' × ';
    } else if (/[πe]/.test(symbol) && expression && /[0-9)]/.test(expression.slice(-1))) {
      updated += ' × ';
    } else if (['sin(', 'cos(', 'tan(', 'log(', 'ln(', '√('].includes(symbol) && expression && /[0-9πe)]/.test(expression.slice(-1))) {
      updated += ' × ';
    }

    setExpression(updated + symbol);
  };

  const handleClear = () => {
    playSound('click');
    setExpression('');
    setResult('0');
    setHasError(false);
  };

  const handleBackspace = () => {
    playSound('click');
    setHasError(false);
    if (expression.length === 0) return;

    const endings = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', ' √('];
    for (const ending of endings) {
      if (expression.endsWith(ending)) {
        setExpression(expression.slice(0, -ending.length));
        return;
      }
    }

    if (expression.endsWith(' ')) {
      setExpression(expression.slice(0, -3));
    } else {
      setExpression(expression.slice(0, -1));
    }
  };

  const factorial = (n) => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const handleEvaluate = () => {
    if (!expression) {
      playSound('error');
      return;
    }

    playSound('click');
    try {
      let parsed = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      parsed = parsed.replace(/π/g, 'Math.PI');
      parsed = parsed.replace(/e/g, 'Math.E');

      while (parsed.includes('^')) {
        const caretIndex = parsed.indexOf('^');
        
        let leftStart = caretIndex - 1;
        if (parsed[leftStart] === ')') {
          let bracketCount = 1;
          leftStart--;
          while (leftStart >= 0 && bracketCount > 0) {
            if (parsed[leftStart] === ')') bracketCount++;
            if (parsed[leftStart] === '(') bracketCount--;
            leftStart--;
          }
          leftStart++;
        } else {
          while (leftStart >= 0 && /[0-9.\w_Math]/i.test(parsed[leftStart])) {
            leftStart--;
          }
          leftStart++;
        }
        const baseExpr = parsed.substring(leftStart, caretIndex);

        let rightEnd = caretIndex + 1;
        if (parsed[rightEnd] === '(') {
          let bracketCount = 1;
          rightEnd++;
          while (rightEnd < parsed.length && bracketCount > 0) {
            if (parsed[rightEnd] === '(') bracketCount++;
            if (parsed[rightEnd] === ')') bracketCount--;
            rightEnd++;
          }
        } else {
          while (rightEnd < parsed.length && /[0-9.\w_Math]/i.test(parsed[rightEnd])) {
            rightEnd++;
          }
        }
        const powerExpr = parsed.substring(caretIndex + 1, rightEnd);

        const fullMatch = parsed.substring(leftStart, rightEnd);
        const replacedMatch = `Math.pow(${baseExpr}, ${powerExpr})`;
        parsed = parsed.replace(fullMatch, replacedMatch);
      }

      const trigFunctions = ['sin', 'cos', 'tan'];
      for (const trig of trigFunctions) {
        let keyword = `${trig}(`;
        while (parsed.includes(keyword)) {
          const startIndex = parsed.indexOf(keyword);
          const innerStart = startIndex + keyword.length;
          
          let bracketCount = 1;
          let innerEnd = innerStart;
          while (innerEnd < parsed.length && bracketCount > 0) {
            if (parsed[innerEnd] === '(') bracketCount++;
            if (parsed[innerEnd] === ')') bracketCount--;
            innerEnd++;
          }
          
          const arg = parsed.substring(innerStart, innerEnd - 1);
          const correctArg = isRad ? `(${arg})` : `((${arg}) * Math.PI / 180)`;
          
          const fullTrigMatch = parsed.substring(startIndex, innerEnd);
          const replacedTrig = `Math.${trig}${correctArg}`;
          parsed = parsed.replace(fullTrigMatch, replacedTrig);
        }
      }

      parsed = parsed.replace(/√\(/g, 'Math.sqrt(');
      parsed = parsed.replace(/log\(/g, 'Math.log10(');
      parsed = parsed.replace(/ln\(/g, 'Math.log(');

      while (parsed.includes('!')) {
        const bangIndex = parsed.indexOf('!');
        let leftStart = bangIndex - 1;
        if (parsed[leftStart] === ')') {
          let bracketCount = 1;
          leftStart--;
          while (leftStart >= 0 && bracketCount > 0) {
            if (parsed[leftStart] === ')') bracketCount++;
            if (parsed[leftStart] === '(') bracketCount--;
            leftStart--;
          }
          leftStart++;
        } else {
          while (leftStart >= 0 && /[0-9.]/.test(parsed[leftStart])) {
            leftStart--;
          }
          leftStart++;
        }
        const operand = parsed.substring(leftStart, bangIndex);
        const replacement = `factorial(${operand})`;
        parsed = parsed.replace(operand + '!', replacement);
      }

      const executeEval = new Function('factorial', `return (${parsed})`);
      const rawResult = executeEval(factorial);

      if (rawResult === Infinity || rawResult === -Infinity || isNaN(rawResult)) {
        throw new Error('Invalid calculation sequence');
      }

      const cleanRes = Math.round(rawResult * 1e12) / 1e12;
      const resStr = cleanRes.toString();
      setResult(resStr);
      onAddHistory(expression, resStr);
      playSound('success');
    } catch (err) {
      playSound('error');
      setResult(t('error') || 'Error');
      setHasError(true);
    }
  };

  const triggerHighlight = (btnId) => {
    setActiveButtonId(btnId);
    setTimeout(() => setActiveButtonId(null), 130);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

      const key = e.key;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        appendSymbol(key);
        triggerHighlight(`sci-btn-${key}`);
      } else if (key === '.') {
        e.preventDefault();
        appendSymbol('.');
        triggerHighlight('sci-btn-dec');
      } else if (key === '+') {
        e.preventDefault();
        appendSymbol(' + ');
        triggerHighlight('sci-btn-add');
      } else if (key === '-') {
        e.preventDefault();
        appendSymbol(' − ');
        triggerHighlight('sci-btn-sub');
      } else if (key === '*') {
        e.preventDefault();
        appendSymbol(' × ');
        triggerHighlight('sci-btn-mul');
      } else if (key === '/') {
        e.preventDefault();
        appendSymbol(' ÷ ');
        triggerHighlight('sci-btn-div');
      } else if (key === '^') {
        e.preventDefault();
        appendSymbol('^');
        triggerHighlight('sci-btn-pow');
      } else if (key === '(') {
        e.preventDefault();
        appendSymbol('(');
        triggerHighlight('sci-btn-open');
      } else if (key === ')') {
        e.preventDefault();
        appendSymbol(')');
        triggerHighlight('sci-btn-close');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEvaluate();
        triggerHighlight('sci-btn-eq');
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        triggerHighlight('sci-btn-backspace');
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
        triggerHighlight('sci-btn-ac');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expression, isRad]);

  const toggleTrigMode = () => {
    playSound('tick');
    setIsRad(!isRad);
  };

  const btnAnimationProps = {
    whileHover: { scale: 1.04, y: -0.5 },
    whileTap: { scale: 0.94 },
    transition: { type: "spring", stiffness: 450, damping: 13 }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Trig Mode Header Selector Badge */}
      <div className="w-full max-w-xl mb-3 flex items-center justify-between text-xs opacity-80">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-teal-400" /> Professional algebraic parser active.
        </span>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTrigMode}
          className={`flex items-center gap-2 border px-3 py-1 rounded-full font-mono font-semibold select-none transition-all cursor-pointer ${
            isRad 
              ? 'bg-teal-500/15 text-teal-400 border-teal-500/40' 
              : 'bg-yellow-500/15 text-yellow-500 border-yellow-500/40'
          }`}
        >
          Trig: <span className="underline uppercase">{isRad ? 'RAD (Radians)' : 'DEG (Degrees)'}</span>
        </motion.button>
      </div>

      <div
        id="scientific-calculator-frame"
        className={`w-full max-w-xl rounded-2xl p-6 border ${theme.cardBg} transition-all duration-300 shadow-xl`}
      >
        {/* Visual Dual Displays */}
        <div className={`w-full rounded-xl p-5 mb-5 border text-right overflow-hidden ${theme.displayBg}`}>
          <div className="flex justify-between items-center h-5 text-xs mb-1 select-none opacity-75">
            <span className="font-mono text-[9px] bg-slate-850 px-1.5 py-0.5 rounded text-teal-400 font-extrabold uppercase ring-1 ring-slate-800">
              {isRad ? 'RAD' : 'DEG'}
            </span>
            <span className={`truncate leading-none font-mono ${theme.displayAltText}`}>
              {expression || (t('ready') || 'Ready')}
            </span>
          </div>
          <motion.div 
            key={result}
            initial={{ scale: 0.98, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.12 }}
            className={`text-3xl lg:text-4xl font-semibold tracking-tight truncate select-all ${
              hasError ? 'text-rose-500 font-mono' : theme.displayText
            }`}
          >
            {result}
          </motion.div>
        </div>

        {/* Buttons Grid layout: 5 cols for comprehensive functions */}
        <div className="grid grid-cols-5 gap-2 select-none antialiased">
          
          {/* Row 1 Scientific keys */}
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('sin(')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
          >
            sin
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('cos(')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
          >
            cos
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('tan(')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
          >
            tan
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('π')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
          >
            π
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-ac"
            onClick={handleClear}
            className={`py-3.5 rounded-xl text-xs font-bold border col-span-1 transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-ac' ? 'scale-95 brightness-125' : ''
            } ${theme.btnAction}`}
          >
            AC
          </motion.button>

          {/* Row 2 Scientific keys */}
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('log(')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
            title="Logarithm base 10"
          >
            log₁₀
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('ln(')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
            title="Natural logarithm"
          >
            ln
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('e')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
          >
            e
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-pow"
            onClick={() => appendSymbol('^')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-pow' ? 'scale-95 brightness-125' : ''
            } ${theme.btnFn}`}
            title="Exponent power (x^y)"
          >
            xʸ
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-backspace"
            onClick={handleBackspace}
            className={`py-3.5 flex items-center justify-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-backspace' ? 'scale-95 brightness-125' : ''
            } ${theme.btnAction}`}
            aria-label="Delete character"
          >
            <Delete className="w-4.5 h-4.5" />
          </motion.button>

          {/* Row 3 Scientific keys */}
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('√(')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
            title="Square root"
          >
            √x
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('^2')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
            title="Square (x²)"
          >
            x²
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('^3')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
            title="Cube (x³)"
          >
            x³
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('!')}
            className={`py-3.5 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
            title="Factorial"
          >
            x!
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-div"
            onClick={() => appendSymbol(' ÷ ')}
            className={`py-3.5 rounded-xl text-sm font-black border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-div' ? 'scale-95 brightness-125' : ''
            } ${theme.btnFn}`}
          >
            ÷
          </motion.button>

          {/* Key matrices: Numbers 7, 8, 9, brackets */}
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-7"
            onClick={() => appendSymbol('7')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-7' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            7
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-8"
            onClick={() => appendSymbol('8')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-8' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            8
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-9"
            onClick={() => appendSymbol('9')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-9' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            9
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-open"
            onClick={() => appendSymbol('(')}
            className={`py-4 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-open' ? 'scale-95 brightness-125' : ''
            } ${theme.btnFn}`}
          >
            (
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-mul"
            onClick={() => appendSymbol(' × ')}
            className={`py-4 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-mul' ? 'scale-95 brightness-125' : ''
            } ${theme.btnFn}`}
          >
            ×
          </motion.button>

          {/* Numbers 4, 5, 6, - */}
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-4"
            onClick={() => appendSymbol('4')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-4' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            4
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-5"
            onClick={() => appendSymbol('5')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-5' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            5
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-6"
            onClick={() => appendSymbol('6')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-6' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            6
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-close"
            onClick={() => appendSymbol(')')}
            className={`py-4 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-close' ? 'scale-95 brightness-125' : ''
            } ${theme.btnFn}`}
          >
            )
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-sub"
            onClick={() => appendSymbol(' − ')}
            className={`py-4 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-sub' ? 'scale-95 brightness-125' : ''
            } ${theme.btnFn}`}
          >
            −
          </motion.button>

          {/* Numbers 1, 2, 3, + */}
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-1"
            onClick={() => appendSymbol('1')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-1' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            1
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-2"
            onClick={() => appendSymbol('2')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-2' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            2
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-3"
            onClick={() => appendSymbol('3')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-3' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            3
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol('^(-1)')}
            className={`py-4 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
            title="Reciprocal inverse (1/x)"
          >
            1/x
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-add"
            onClick={() => appendSymbol(' + ')}
            className={`py-4 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-add' ? 'scale-95 brightness-125' : ''
            } ${theme.btnFn}`}
          >
            +
          </motion.button>

          {/* Bottom row: Decimal, 0, exponent utility, equal */}
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-dec"
            onClick={() => appendSymbol('.')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-dec' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            .
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-0"
            onClick={() => appendSymbol('0')}
            className={`py-4 rounded-xl text-lg font-bold border transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-0' ? 'scale-95 brightness-125 ring-2 ring-teal-400' : ''
            } ${theme.btnNumber}`}
          >
            0
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            onClick={() => appendSymbol(' * 10^')}
            className={`py-4 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${theme.btnFn}`}
            title="Scientific notation (x * 10^y)"
          >
            EXP
          </motion.button>
          <motion.button
            {...btnAnimationProps}
            id="sci-btn-eq"
            onClick={handleEvaluate}
            className={`py-4 rounded-xl text-lg font-black border col-span-2 transition-all cursor-pointer ${
              activeButtonId === 'sci-btn-eq' ? 'scale-95 brightness-115' : ''
            } ${theme.btnEquals}`}
          >
            =
          </motion.button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { playSound } from '../utils/audio.js';
import { Percent, ArrowRight, HelpCircle } from 'lucide-react';

export default function CalculatorPercentage({ theme, onAddHistory, t }) {
  // Case 1: What is X% of Y
  const [x1, setX1] = useState('15');
  const [y1, setY1] = useState('200');
  const [ans1, setAns1] = useState(null);

  // Case 2: X is what % of Y
  const [x2, setX2] = useState('40');
  const [y2, setY2] = useState('200');
  const [ans2, setAns2] = useState(null);

  // Case 3: Percentage increase/decrease from X to Y
  const [x3, setX3] = useState('120');
  const [y3, setY3] = useState('150');
  const [ans3, setAns3] = useState(null);
  const [growthType, setGrowthType] = useState(null);

  // Case 4: Add/Sub X% to/from Y
  const [x4, setX4] = useState('10');
  const [y4, setY4] = useState('150');
  const [op4, setOp4] = useState('add');
  const [ans4, setAns4] = useState(null);

  const calculateCase1 = (e) => {
    e.preventDefault();
    playSound('click');
    const x = parseFloat(x1);
    const y = parseFloat(y1);
    if (isNaN(x) || isNaN(y)) {
      playSound('error');
      return;
    }
    const result = (x / 100) * y;
    const cleanResult = (Math.round(result * 1000000) / 1000000).toString();
    setAns1(cleanResult);
    onAddHistory(`${x}% of ${y}`, cleanResult);
    playSound('success');
  };

  const calculateCase2 = (e) => {
    e.preventDefault();
    playSound('click');
    const x = parseFloat(x2);
    const y = parseFloat(y2);
    if (isNaN(x) || isNaN(y) || y === 0) {
      playSound('error');
      return;
    }
    const result = (x / y) * 100;
    const cleanResult = (Math.round(result * 10000) / 10000).toString();
    setAns2(cleanResult + '%');
    onAddHistory(`${x} is what % of ${y}`, `${cleanResult}%`);
    playSound('success');
  };

  const calculateCase3 = (e) => {
    e.preventDefault();
    playSound('click');
    const x = parseFloat(x3);
    const y = parseFloat(y3);
    if (isNaN(x) || isNaN(y) || x === 0) {
      playSound('error');
      return;
    }
    const diff = y - x;
    const ratio = (diff / x) * 100;
    const cleanResult = Math.abs(Math.round(ratio * 10000) / 10000).toString() + '%';
    
    setAns3(cleanResult);
    if (diff > 0) {
      setGrowthType('increase');
    } else if (diff < 0) {
      setGrowthType('decrease');
    } else {
      setGrowthType('equal');
    }

    onAddHistory(`% change from ${x} to ${y}`, `${diff > 0 ? '+' : ''}${Math.round(ratio * 10000) / 10000}%`);
    playSound('success');
  };

  const calculateCase4 = (e) => {
    e.preventDefault();
    playSound('click');
    const x = parseFloat(x4);
    const y = parseFloat(y4);
    if (isNaN(x) || isNaN(y)) {
      playSound('error');
      return;
    }
    const percentageAmount = (x / 100) * y;
    const result = op4 === 'add' ? y + percentageAmount : y - percentageAmount;
    const cleanResult = (Math.round(result * 100000) / 100000).toString();
    
    setAns4(cleanResult);
    onAddHistory(`${op4 === 'add' ? 'Add' : 'Subtract'} ${x}% to ${y}`, cleanResult);
    playSound('success');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-xl mb-3 flex justify-between items-center text-xs opacity-75">
        <span className="flex items-center gap-1.5 font-medium">
          <HelpCircle className="w-3.5 h-3.5" /> Instant Financial Growth & Ratio Math Solver
        </span>
      </div>

      <div
        id="percentage-calculator-frame"
        className={`w-full max-w-xl rounded-2xl p-6 border ${theme.cardBg} transition-all duration-300 space-y-8`}
      >
        {/* Case 1: What is X% of Y? */}
        <div className="border-b border-slate-800/80 pb-6">
          <h3 className="text-sm font-bold text-teal-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/10"><Percent className="w-4 h-4" /></span>
            1. Percentage Value Solver
          </h3>
          <form onSubmit={calculateCase1} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm">What is</span>
            <input
              type="number"
              step="any"
              value={x1}
              id="perc-case1-x"
              onChange={(e) => setX1(e.target.value)}
              className="w-20 bg-slate-950/40 text-teal-300 border border-slate-800 rounded-lg p-2.5 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label="Percentage amount"
            />
            <span className="text-sm">% of</span>
            <input
              type="number"
              step="any"
              value={y1}
              id="perc-case1-y"
              onChange={(e) => setY1(e.target.value)}
              className="w-28 bg-slate-950/40 text-teal-300 border border-slate-800 rounded-lg p-2.5 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label="Total factor"
            />
            <button
              type="submit"
              className={`py-2 px-5 rounded-lg font-bold transition-all text-sm cursor-pointer ${theme.btnEquals}`}
            >
              {t('calculate')}
            </button>
            {ans1 !== null && (
              <div className="flex items-center gap-1.5 sm:ml-auto">
                <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:inline" />
                <span className="text-xs text-slate-400 sm:hidden">Answer:</span>
                <span className="text-lg font-extrabold text-teal-400 font-mono bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20">
                  {ans1}
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Case 2: X is what percent of Y? */}
        <div className="border-b border-slate-800/80 pb-6">
          <h3 className="text-sm font-bold text-teal-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/10"><Percent className="w-4 h-4" /></span>
            2. Ratio Percentage Calculator
          </h3>
          <form onSubmit={calculateCase2} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="number"
              step="any"
              value={x2}
              id="perc-case2-x"
              onChange={(e) => setX2(e.target.value)}
              className="w-24 bg-slate-950/40 text-teal-300 border border-slate-800 rounded-lg p-2.5 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label="Sub-value factor"
            />
            <span className="text-sm">is what percent of</span>
            <input
              type="number"
              step="any"
              value={y2}
              id="perc-case2-y"
              onChange={(e) => setY2(e.target.value)}
              className="w-28 bg-slate-950/40 text-teal-300 border border-slate-800 rounded-lg p-2.5 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label="Total factor"
            />
            <button
              type="submit"
              className={`py-2 px-5 rounded-lg font-bold transition-all text-sm cursor-pointer ${theme.btnEquals}`}
            >
              {t('calculate')}
            </button>
            {ans2 !== null && (
              <div className="flex items-center gap-1.5 sm:ml-auto">
                <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:inline" />
                <span className="text-xs text-slate-400 sm:hidden">Answer:</span>
                <span className="text-lg font-extrabold text-teal-400 font-mono bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20">
                  {ans2}
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Case 3: Percentage increase/decrease */}
        <div className="border-b border-slate-800/80 pb-6">
          <h3 className="text-sm font-bold text-teal-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/10"><Percent className="w-4 h-4" /></span>
            3. Percentage Growth / Decline Difference
          </h3>
          <form onSubmit={calculateCase3} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm">From value</span>
            <input
              type="number"
              step="any"
              value={x3}
              id="perc-case3-x"
              onChange={(e) => setX3(e.target.value)}
              className="w-24 bg-slate-950/40 text-teal-300 border border-slate-800 rounded-lg p-2.5 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label="Initial value"
            />
            <span className="text-sm">to</span>
            <input
              type="number"
              step="any"
              value={y3}
              id="perc-case3-y"
              onChange={(e) => setY3(e.target.value)}
              className="w-28 bg-slate-950/40 text-teal-300 border border-slate-800 rounded-lg p-2.5 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label="Subsequent value"
            />
            <button
              type="submit"
              className={`py-2 px-5 rounded-lg font-bold transition-all text-sm cursor-pointer ${theme.btnEquals}`}
            >
              {t('calculate')}
            </button>
            {ans3 !== null && (
              <div className="flex flex-col items-start sm:items-end sm:ml-auto select-none">
                <div className="flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:inline" />
                  <span className="text-lg font-extrabold text-teal-400 font-mono bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20">
                    {ans3}
                  </span>
                </div>
                {growthType && (
                  <span className={`text-[10px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded ${
                    growthType === 'increase' ? 'text-teal-400 bg-teal-950/40' : 
                    growthType === 'decrease' ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400 bg-slate-800'
                  }`}>
                    {growthType === 'increase' ? '▲ INCREASE' : 
                     growthType === 'decrease' ? '▼ DECREASE' : 'NO CHANGE'}
                  </span>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Case 4: Add/Subtract Percentage */}
        <div>
          <h3 className="text-sm font-bold text-teal-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/10"><Percent className="w-4 h-4" /></span>
            4. Percent Surcharge & Tax/Discount Solver
          </h3>
          <form onSubmit={calculateCase4} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={op4}
              id="perc-case4-op"
              onChange={(e) => { playSound('tick'); setOp4(e.target.value); }}
              className="bg-slate-950 border border-slate-800 text-teal-400 text-sm font-bold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              aria-label="Surcharge modifier"
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
            </select>
            <input
              type="number"
              step="any"
              value={x4}
              id="perc-case4-x"
              onChange={(e) => setX4(e.target.value)}
              className="w-20 bg-slate-950/40 text-teal-300 border border-slate-800 rounded-lg p-2.5 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label="Surcharge percent"
            />
            <span className="text-sm">% to/from</span>
            <input
              type="number"
              step="any"
              value={y4}
              id="perc-case4-y"
              onChange={(e) => setY4(e.target.value)}
              className="w-28 bg-slate-950/40 text-teal-300 border border-slate-800 rounded-lg p-2.5 text-center font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label="Original value"
            />
            <button
              type="submit"
              className={`py-2 px-5 rounded-lg font-bold transition-all text-sm cursor-pointer ${theme.btnEquals}`}
            >
              {t('calculate')}
            </button>
            {ans4 !== null && (
              <div className="flex items-center gap-1.5 sm:ml-auto">
                <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:inline" />
                <span className="text-xs text-slate-400 sm:hidden">Answer:</span>
                <span className="text-lg font-extrabold text-teal-400 font-mono bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20">
                  {ans4}
                </span>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}

export const THEMES = [
  {
    id: 'nordic',
    name: 'Nordic Slate (Default Dark)',
    bg: 'bg-slate-950 text-slate-100',
    cardBg: 'bg-slate-900 border-slate-800 shadow-2xl shadow-slate-950/50',
    displayBg: 'bg-slate-950 border-slate-800',
    displayText: 'text-teal-400 font-mono',
    displayAltText: 'text-slate-500 font-mono',
    btnNumber: 'bg-slate-800 text-slate-100 border-slate-700/50 hover:bg-slate-755',
    btnNumberHover: 'hover:bg-slate-700',
    btnAction: 'bg-rose-950/50 text-rose-300 border-rose-900/30 hover:bg-rose-900/50',
    btnActionHover: 'hover:bg-rose-900',
    btnFn: 'bg-slate-800/80 text-teal-300 border-slate-700/50 hover:bg-slate-700/80',
    btnFnHover: 'hover:bg-slate-700',
    btnEquals: 'bg-teal-600 text-slate-950 font-bold border-teal-500 hover:bg-teal-500',
    btnEqualsHover: 'hover:bg-teal-400',
    textMuted: 'text-slate-400',
    border: 'border-slate-800',
    headerBg: 'bg-slate-900/95 border-slate-800',
    headerText: 'text-slate-100'
  },
  {
    id: 'classic',
    name: 'Retro Solar (Classic Web)',
    bg: 'bg-zinc-100 text-zinc-900',
    cardBg: 'bg-zinc-200 border-zinc-300 shadow-xl',
    displayBg: 'bg-amber-100/90 border-zinc-400/80 shadow-inner',
    displayText: 'text-zinc-900 font-mono tracking-tight font-extrabold',
    displayAltText: 'text-zinc-650 font-mono font-medium',
    btnNumber: 'bg-zinc-50 text-zinc-900 border-zinc-300 active:bg-zinc-100 hover:bg-zinc-100 shadow-sm',
    btnNumberHover: 'hover:bg-zinc-100',
    btnAction: 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700 shadow-sm font-bold',
    btnActionHover: 'hover:bg-amber-700',
    btnFn: 'bg-zinc-750 text-white border-zinc-800 hover:bg-zinc-800 shadow-sm',
    btnFnHover: 'hover:bg-zinc-800',
    btnEquals: 'bg-orange-500 text-white font-bold border-orange-600 hover:bg-orange-600 shadow-sm',
    btnEqualsHover: 'hover:bg-orange-600',
    textMuted: 'text-zinc-650',
    border: 'border-zinc-350',
    headerBg: 'bg-zinc-900 text-zinc-100',
    headerText: 'text-zinc-100'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    bg: 'bg-zinc-950 text-fuchsia-400',
    cardBg: 'bg-black border-yellow-500 border-2 shadow-[0_0_15px_rgba(234,179,8,0.15)]',
    displayBg: 'bg-zinc-950 border-fuchsia-500 border-2 shadow-[0_0_10px_rgba(217,70,239,0.1)]',
    displayText: 'text-yellow-400 font-mono font-bold tracking-widest',
    displayAltText: 'text-fuchsia-600 font-mono',
    btnNumber: 'bg-zinc-900 text-fuchsia-400 border-fuchsia-950 hover:bg-zinc-850 hover:text-fuchsia-300',
    btnNumberHover: 'hover:bg-zinc-800',
    btnAction: 'bg-cyan-950 text-cyan-300 border-cyan-500 hover:bg-cyan-900',
    btnActionHover: 'hover:bg-cyan-800',
    btnFn: 'bg-zinc-900 text-cyan-400 border-cyan-950 hover:bg-zinc-850 hover:text-cyan-300',
    btnFnHover: 'hover:bg-zinc-800',
    btnEquals: 'bg-fuchsia-600 text-white border-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.5)] hover:bg-fuchsia-500',
    btnEqualsHover: 'hover:bg-fuchsia-400',
    textMuted: 'text-zinc-500',
    border: 'border-zinc-800',
    headerBg: 'bg-black border-b border-yellow-500',
    headerText: 'text-yellow-500'
  },
  {
    id: 'forest',
    name: 'Autumn Forest (Warm Earth)',
    bg: 'bg-[#1e231f] text-[#f2e9e1]',
    cardBg: 'bg-[#29302b] border-[#38433d] shadow-2xl',
    displayBg: 'bg-[#151916] border-[#222a25]',
    displayText: 'text-[#e5c38c] font-mono',
    displayAltText: 'text-[#687e70] font-mono',
    btnNumber: 'bg-[#313b34] text-[#f2e9e1] border-[#3d4941] hover:bg-[#3d4941]',
    btnNumberHover: 'hover:bg-[#3d4941]',
    btnAction: 'bg-[#915637] text-orange-100 border-[#a26442] hover:bg-[#a26442]',
    btnActionHover: 'hover:bg-[#a26442]',
    btnFn: 'bg-[#3c4a40] text-[#a9c9b5] border-[#48594d] hover:bg-[#48594d]',
    btnFnHover: 'hover:bg-[#4c5d51]',
    btnEquals: 'bg-[#cb8947] text-[#1c1f1d] font-bold border-[#dc9b59] hover:bg-[#dc9b59]',
    btnEqualsHover: 'hover:bg-[#e6a968]',
    textMuted: 'text-[#9bae9e]',
    border: 'border-[#38433d]',
    headerBg: 'bg-[#29302b] border-b border-[#38433d]',
    headerText: 'text-[#e5c38c]'
  },
  {
    id: 'pastel',
    name: 'Warm Pastel Bloom',
    bg: 'bg-[#faf8f5] text-[#4a3e3d]',
    cardBg: 'bg-[#f4ebe1] border-[#eacfbc] shadow-lg shadow-[#ece3d7]',
    displayBg: 'bg-[#fffcf9] border-[#eacfbc] shadow-inner',
    displayText: 'text-[#9c786c] font-mono font-bold',
    displayAltText: 'text-[#cfa498] font-mono',
    btnNumber: 'bg-[#fffaf5] text-[#5c4a45] border-[#f0dfd5] hover:bg-[#fcf5eb]',
    btnNumberHover: 'hover:bg-[#fcf5eb]',
    btnAction: 'bg-[#e29c82] text-white border-[#e9aa92] hover:bg-[#eaa085]',
    btnActionHover: 'hover:bg-[#ea9c81]',
    btnFn: 'bg-[#dfc4b5] text-[#5c4a45] border-[#ead0c3] hover:bg-[#e8cbbe]',
    btnFnHover: 'hover:bg-[#e4bfb0]',
    btnEquals: 'bg-[#a3bfa8] text-[#334639] font-bold border-[#b7cfbc] hover:bg-[#b7cfbc]',
    btnEqualsHover: 'hover:bg-[#c2dac7]',
    textMuted: 'text-[#877470]',
    border: 'border-[#e0d2c5]',
    headerBg: 'bg-[#f4ebe1] border-b border-[#ffd6bc]',
    headerText: 'text-[#9c786c]'
  }
];

export const SEO_TEMPLATES = {
  basic: {
    title: "Fullscreen Classic Calculator | Standard Math Mode - OmniCalc Classic",
    description: "Classic large-screen online calculator. Simple math layout matching the ease of physical desktop calculators. Free, fast keyboard layout support.",
    keywords: "online calculator, free basic calculator, fullscreen calculator, standard math tool, keyboard calculator, simple counter"
  },
  scientific: {
    title: "Advanced Scientific Calculator Online | Trigo & Equations - OmniCalc Classic",
    description: "Multi-function online scientific calculator. Handles trigonometry, logs, bracket resolution, exponents, radians, degrees, and value persistence.",
    keywords: "scientific calculator, online scientific calculator, trigonometry calculator, logs solver, advanced mathematics, algebraic expression helper"
  },
  fraction: {
    title: "Interactive Fraction Calculator with Step Simplifier - OmniCalc Classic",
    description: "Calculate fractions instantly. Add, subtract, multiply, and divide proper and improper fractions with detailed step-by-step math breakdowns.",
    keywords: "fraction calculator, fraction addition, improper fraction simplifier, fraction steps, math fractions solver, homework checker"
  },
  percentage: {
    title: "Dynamic Percentage Calculator & Growth Tracker - OmniCalc Classic",
    description: "Calculate fraction changes, margin growth, percentage ratios, and compound rates quickly with our robust template calculators.",
    keywords: "percentage calculator, growth solver, discount calculator, calculate margins, percentage markup tool, percent of total"
  },
  timer: {
    title: "Digital Stopwatch & Countdown Egg Timer Online - OmniCalc Classic",
    description: "Accurate online countdown timer, stopwatch with high-precision lap splits, and audio-alerting egg timer. Simple browser workflow notifications.",
    keywords: "online stopwatch, digital timer, egg timer, countdown clock, clock alarm, workout timer, split time stopwatch"
  }
};

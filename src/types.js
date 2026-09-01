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
    keywords: "online calculator, free basic calculator, fullscreen calculator, standard math tool, keyboard calculator, simple counter, free online calculator no download, basic calculator for windows, large display calculator online, calculator with keyboard support, basic arithmetic calculator online, calculator for everyday math, instant online calculator fast, simple math calculator free, how do i use a calculator online, is there a free calculator that needs no download, what is the easiest way to do math in the browser, calculator that works on any device with a keyboard, how do i open a calculator in full screen mode, what is the best basic online calculator for students"
  },
  scientific: {
    title: "Advanced Scientific Calculator Online | Trigo & Equations - OmniCalc Classic",
    description: "Multi-function online scientific calculator. Handles trigonometry, logs, bracket resolution, exponents, radians, degrees, and value persistence.",
    keywords: "scientific calculator, online scientific calculator, trigonometry calculator, logs solver, advanced mathematics, algebraic expression helper, free online scientific calculator, trigonometry calculator online, logarithms calculator with values, scientific calculator with parentheses, exponents calculator online, scientific calculator radians to degrees, algebraic expression solver online, solve advanced math problems online, scientific notation calculator online, how do i calculate sine and cosine online, is there a free scientific calculator in the browser, how do you solve logarithms without a scientific calculator, how to convert degrees to radians online, what scientific calculator handles brackets and exponents, best online scientific calculator for exams"
  },
  fraction: {
    title: "Interactive Fraction Calculator with Step Simplifier - OmniCalc Classic",
    description: "Calculate fractions instantly. Add, subtract, multiply, and divide proper and improper fractions with detailed step-by-step math breakdowns.",
    keywords: "fraction calculator, fraction addition, improper fraction simplifier, fraction steps, math fractions solver, homework checker, fraction calculator with step by step solution, add fractions calculator online, improper fraction to mixed number calculator, subtract fractions step by step, multiply and divide fractions calculator, simplify fractions calculator with steps, fraction homework helper online, equivalent fractions calculator online, fraction solver for students, how to add fractions with different denominators online, how do i simplify a fraction step by step, what fraction calculator shows working steps, how to convert an improper fraction to a mixed number online, where can i check my fraction homework answers, what is the best fraction calculator for kids learning math"
  },
  percentage: {
    title: "Dynamic Percentage Calculator & Growth Tracker - OmniCalc Classic",
    description: "Calculate fraction changes, margin growth, percentage ratios, and compound rates quickly with our robust template calculators.",
    keywords: "percentage calculator, growth solver, discount calculator, calculate margins, percentage markup tool, percent of total, percentage increase calculator between two numbers, how to calculate percentage of a number, discount percentage calculator online, percentage margin calculator, percentage change calculator online, percent of a number calculator, markup calculator online free, percentage decrease calculator online, compound growth percentage calculator, how to calculate percentage increase between two numbers, how do i work out a percentage of a total, what is the formula for percentage change online, how to calculate discount percentage off a price, what percentage calculator shows margin and markup, what is the fastest way to calculate percent change online"
  },
  timer: {
    title: "Digital Stopwatch & Countdown Egg Timer Online - OmniCalc Classic",
    description: "Accurate online countdown timer, stopwatch with high-precision lap splits, and audio-alerting egg timer. Simple browser workflow notifications.",
    keywords: "online stopwatch, digital timer, egg timer, countdown clock, clock alarm, workout timer, split time stopwatch, online stopwatch with lap times, countdown timer online free, egg timer online no download, fullscreen stopwatch with splits, workout interval timer online, timer with alarm sound online, digital stopwatch online accurate, split lap timer for running, how do i use an online stopwatch with splits, is there a countdown timer that works in the browser, how to set a timer with an alarm sound online, what is the best free egg timer for cooking, how to run a full screen workout timer, best online timer for studying with split laps"
  }
};

export const GEO_LONG_TAIL = {
  intro: {
    q: "What is OmniCalc Classic?",
    a: "OmniCalc Classic is a free online multi-calculator suite that runs entirely in your browser with no download required. It combines a basic calculator, a scientific calculator with trigonometry, logarithms, and bracket resolution, a step-by-step fraction solver, a percentage and growth calculator, and an accurate stopwatch with countdown timer in one tool. The suite supports multiple themes, keyboard shortcuts, tactile sound tones, full screen mode, and persistent calculation history, and it works on desktop and mobile browsers."
  },
  basic: [
    {
      q: "How do I use a free online calculator without downloading anything?",
      a: "OmniCalc Classic's basic calculator runs directly in the browser, so there is nothing to install. Open the full screen layout for a large display, then press the number and operator buttons on screen or type with the physical keyboard. Every calculation is fast and free, and it works on desktop computers, laptops, tablets, and mobile browsers."
    },
    {
      q: "Can I use the basic calculator with a keyboard on any device?",
      a: "Yes. The standard math mode auto-binds number keys 0 to 9, the operators plus, minus, multiply, and divide, Enter to evaluate the expression, Backspace to delete the last digit, and Escape to clear. This keyboard calculator support makes everyday math quick on any device without touching the screen."
    },
    {
      q: "What is the easiest way to do simple math in the browser every day?",
      a: "Keep a simple counter and full screen calculator tab open and use it like a physical desktop calculator. It is built for daily sums, budgeting, and quick arithmetic, and every result is saved to the calculation history in your browser so you never lose track of what you have worked out."
    }
  ],
  scientific: [
    {
      q: "How do I calculate sine, cosine, and tangent online?",
      a: "Switch to the scientific calculator and press the sin, cos, and tan buttons. Choose between radians and degrees to match your problem, and the trigonometry calculator returns precise values instantly. Bracket resolution and exponents are handled automatically, so multi-part expressions evaluate in the correct order."
    },
    {
      q: "Is there a free scientific calculator in the browser that solves logarithms?",
      a: "Yes. The scientific mode includes a logarithms calculator for common and natural logs, plus powers and roots. Type the whole expression with parentheses and the algebraic expression solver evaluates it accurately, keeping intermediate values so later steps can use them."
    },
    {
      q: "How do I convert degrees to radians without a physical calculator?",
      a: "Use the online scientific calculator and toggle between degrees and radians before entering your angle. The advanced mathematics tool converts automatically, so trigonometric results always match the unit you are working in, which is useful for exams and engineering homework."
    }
  ],
  fraction: [
    {
      q: "How do I add fractions with different denominators online?",
      a: "Enter the two fractions into the fraction calculator and it finds a common denominator for you. The step-by-step fraction simplifier shows each stage of the working, so you can see exactly how the answer was reached instead of just copying a final number."
    },
    {
      q: "What fraction calculator shows the working steps for homework?",
      a: "OmniCalc Classic's fraction solver is built as a homework checker for students. It adds, subtracts, multiplies, and divides proper and improper fractions and prints an educational breakdown of every step, from the raw ratio to the reduced answer."
    },
    {
      q: "How do I convert an improper fraction to a mixed number online?",
      a: "Type the numerator and denominator into the math fractions solver and open the mixed number view. The improper fraction simplifier converts the value into a whole number plus a proper fraction automatically and shows you the division that produced it."
    }
  ],
  percentage: [
    {
      q: "How do I calculate the percentage increase between two numbers?",
      a: "The percentage calculator takes your starting value and final value and works out the exact percentage change between them. It reports both increases and decreases as a percentage of the original number, so growth rates and declines are clear at a glance."
    },
    {
      q: "How do I work out a percentage of a total amount?",
      a: "Enter the part and the total into the percent of a number calculator and it returns the exact percent of total in one click. The tool also handles ratios, so it answers questions about how much one value represents compared to another."
    },
    {
      q: "How do I calculate a discount percentage off a price?",
      a: "Use the discount calculator online by entering the original price and the percentage off. The percentage markup tool also shows margin and markup automatically, which makes it useful for store pricing, budgets, and quick financial checks."
    }
  ],
  timer: [
    {
      q: "How do I use an online stopwatch with split laps?",
      a: "Open the timer mode and press the split button to record high-precision lap times while the digital stopwatch keeps running underneath. Every split is stored in the history log, which makes it ideal for running, interval workouts, and time trials."
    },
    {
      q: "Is there a countdown timer that works in the browser with an alarm?",
      a: "Yes. Set any countdown and the browser tool plays an alarm chime sound when the time is up. The egg timer is accurate and runs in full screen, so cooking, studying, and classroom use are all covered without installing a separate app."
    },
    {
      q: "How do I run a full screen workout interval timer?",
      a: "Use the full screen mode to keep the workout interval timer visible from across the room, then use the stopwatch split laps to track each round. The alarm sound on completion gives clear feedback between intervals so the whole session stays on schedule."
    }
  ]
};

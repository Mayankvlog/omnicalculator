import React, { useState } from 'react';
import { playSound } from '../utils/audio.js';
import { HelpCircle, RefreshCw } from 'lucide-react';

export default function CalculatorFraction({ theme, onAddHistory, t, lang }) {
  // Fraction 1: num1 / den1
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('2');
  
  // Fraction 2: num2 / den2
  const [num2, setNum2] = useState('2');
  const [den2, setDen2] = useState('3');

  const [operator, setOperator] = useState('+');

  // Result state
  const [resNum, setResNum] = useState(null);
  const [resDen, setResDen] = useState(null);
  
  // Simplified Result
  const [simpNum, setSimpNum] = useState(null);
  const [simpDen, setSimpDen] = useState(null);

  // Mixed Fraction Result
  const [wholeNum, setWholeNum] = useState(null);
  const [mixedNum, setMixedNum] = useState(null);
  const [mixedDen, setMixedDen] = useState(null);

  const [steps, setSteps] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // GCD Helper
  const getGcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // LCM Helper
  const getLcm = (a, b) => {
    return Math.abs(a * b) / getGcd(a, b);
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    playSound('click');
    setErrorMsg('');
    setResNum(null);
    setResDen(null);
    setSimpNum(null);
    setSimpDen(null);
    setWholeNum(null);
    setMixedNum(null);
    setMixedDen(null);
    setSteps([]);

    const n1 = parseInt(num1);
    const d1 = parseInt(den1);
    const n2 = parseInt(num2);
    const d2 = parseInt(den2);

    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
      playSound('error');
      setErrorMsg('Please enter valid integers in all fraction spots.');
      return;
    }

    if (d1 === 0 || d2 === 0) {
      playSound('error');
      setErrorMsg('Denominators cannot be zero (division by zero).');
      return;
    }

    const newSteps = [];
    let finalNum = 0;
    let finalDen = 1;

    // Build the expression string for history
    const exprString = `(${n1}/${d1}) ${operator} (${n2}/${d2})`;

    if (operator === '+' || operator === '-') {
      const lcm = getLcm(d1, d2);
      const mult1 = lcm / d1;
      const mult2 = lcm / d2;
      
      const newN1 = n1 * mult1;
      const newN2 = n2 * mult2;

      newSteps.push({
        title: 'Step 1: Find a Common Denominator',
        expression: `LCM of ${d1} and ${d2} is ${lcm}`,
        explanation: `Multiply the first fraction numerator/denominator by ${mult1} and the second fraction numerator/denominator by ${mult2} to make their denominators equal to ${lcm}.`
      });

      newSteps.push({
        title: 'Step 2: Rewrite Fractions',
        expression: `${newN1}/${lcm} ${operator} ${newN2}/${lcm}`,
        explanation: `Our equation is converted so both denominators match.`
      });

      if (operator === '+') {
        finalNum = newN1 + newN2;
        finalDen = lcm;
        newSteps.push({
          title: 'Step 3: Add Numerators',
          expression: `(${newN1} + ${newN2}) / ${lcm} = ${finalNum}/${finalDen}`,
          explanation: `Add the two numerators together while keeping the denominator constant.`
        });
      } else {
        finalNum = newN1 - newN2;
        finalDen = lcm;
        newSteps.push({
          title: 'Step 3: Subtract Numerators',
          expression: `(${newN1} - ${newN2}) / ${lcm} = ${finalNum}/${finalDen}`,
          explanation: `Subtract the second numerator from the first numerator while keeping the denominator constant.`
        });
      }
    } else if (operator === '*') {
      finalNum = n1 * n2;
      finalDen = d1 * d2;
      newSteps.push({
        title: 'Step 1: Multiply Numerators & Denominators directly',
        expression: `(${n1} * ${n2}) / (${d1} * ${d2}) = ${finalNum}/${finalDen}`,
        explanation: `Multiply the numerators together, and the denominators together.`
      });
    } else if (operator === '/') {
      if (n2 === 0) {
        playSound('error');
        setErrorMsg('Cannot divide by zero fraction (numerator of divisor is 0).');
        return;
      }
      finalNum = n1 * d2;
      finalDen = d1 * n2;

      // Ensure denominator sign is clean
      if (finalDen < 0) {
        finalNum = -finalNum;
        finalDen = -finalDen;
      }

      newSteps.push({
        title: 'Step 1: Invert Divisor and Multiply',
        expression: `(${n1}/${d1}) * (${d2}/${n2})`,
        explanation: `Division of a fraction is multiplying by its reciprocal (invert the second fraction).`
      });
      newSteps.push({
        title: 'Step 2: Multiply Across',
        expression: `(${n1} * ${d2}) / (${d1} * ${n2}) = ${finalNum}/${finalDen}`,
        explanation: `Multiply numerators together, then denominators together.`
      });
    }

    setResNum(finalNum);
    setResDen(finalDen);

    // Simplify the fraction
    const gcd = getGcd(finalNum, finalDen);
    const simplifiedNum = finalNum / gcd;
    const simplifiedDen = finalDen / gcd;

    setSimpNum(simplifiedNum);
    setSimpDen(simplifiedDen);

    if (gcd > 1) {
      newSteps.push({
        title: 'Step 4: Reduce to Simplest Form',
        expression: `GCD of ${finalNum} and ${finalDen} is ${gcd}. Divide both by ${gcd}: ${simplifiedNum}/${simplifiedDen}`,
        explanation: `Simplify the fraction by dividing both parts by their Greatest Common Divisor (${gcd}).`
      });
    } else {
      newSteps.push({
        title: 'Step 4: Verify Simplification',
        expression: `Fraction ${finalNum}/${finalDen} is already in simplified form.`,
        explanation: `The Greatest Common Divisor is 1, so it cannot be simplified further.`
      });
    }

    // Convert to Mixed Number if improper (numerator > denominator and not zero result)
    if (Math.abs(simplifiedNum) > simplifiedDen && simplifiedDen !== 1) {
      const whole = Math.trunc(simplifiedNum / simplifiedDen);
      const rem = Math.abs(simplifiedNum % simplifiedDen);
      
      setWholeNum(whole);
      setMixedNum(rem);
      setMixedDen(simplifiedDen);

      newSteps.push({
        title: 'Mixed Number Representation',
        expression: `${whole} [${rem}/${simplifiedDen}]`,
        explanation: `Convert improper fraction to a mixed number by dividing: ${simplifiedNum} ÷ ${simplifiedDen} = ${whole} with a remainder of ${rem}.`
      });
    }

    setSteps(newSteps);
    
    // Save to history list
    let historyResult = `${simplifiedNum}/${simplifiedDen}`;
    if (simplifiedDen === 1) historyResult = simplifiedNum.toString();
    onAddHistory(exprString, historyResult);
    playSound('success');
  };

  const handleReset = () => {
    playSound('click');
    setNum1('1');
    setDen1('2');
    setNum2('2');
    setDen2('3');
    setOperator('+');
    setResNum(null);
    setResDen(null);
    setSimpNum(null);
    setSimpDen(null);
    setWholeNum(null);
    setMixedNum(null);
    setMixedDen(null);
    setSteps([]);
    setErrorMsg('');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Informative Header */}
      <div className="w-full max-w-xl mb-3 flex items-center justify-between text-xs opacity-75">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> Interactive Math Homework Assistant
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 hover:underline cursor-pointer opacity-80 bg-transparent border-0"
        >
          <RefreshCw className="w-3 h-3" /> {t('clearInputs')}
        </button>
      </div>

      <div
        id="fraction-calculator-frame"
        className={`w-full max-w-xl rounded-2xl p-6 border ${theme.cardBg} transition-all duration-300`}
      >
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="flex flex-row items-center justify-center gap-6">
            
            {/* Fraction A */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider opacity-60">FRACTION A</span>
              <div className="flex flex-col items-center p-3 rounded-xl border border-slate-750 bg-slate-950/20 w-24">
                <input
                  type="text"
                  pattern="-?[0-9]*"
                  id="num1-val"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  className="w-16 text-center text-xl font-bold bg-slate-950/30 text-teal-400 p-2 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                  aria-label="Fraction 1 Numerator"
                />
                <hr className={`w-16 my-2 border-2 ${theme.border}`} />
                <input
                  type="text"
                  pattern="-?[0-9]*"
                  id="den1-val"
                  value={den1}
                  onChange={(e) => setDen1(e.target.value)}
                  className="w-16 text-center text-xl font-bold bg-slate-950/30 text-teal-400 p-2 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                  aria-label="Fraction 1 Denominator"
                />
              </div>
            </div>

            {/* Operator Column */}
            <div className="flex flex-col items-center pt-6">
              <select
                id="fraction-operator"
                value={operator}
                onChange={(e) => { playSound('tick'); setOperator(e.target.value); }}
                className="bg-slate-955 border border-slate-800 text-teal-400 text-xl font-bold p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-center cursor-pointer"
                aria-label="Arithmetic operator"
              >
                <option value="+">+</option>
                <option value="-">−</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
            </div>

            {/* Fraction B */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider opacity-60">FRACTION B</span>
              <div className="flex flex-col items-center p-3 rounded-xl border border-slate-755 bg-slate-950/20 w-24">
                <input
                  type="text"
                  pattern="-?[0-9]*"
                  id="num2-val"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  className="w-16 text-center text-xl font-bold bg-slate-950/30 text-teal-400 p-2 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                  aria-label="Fraction 2 Numerator"
                />
                <hr className={`w-16 my-2 border-2 ${theme.border}`} />
                <input
                  type="text"
                  pattern="-?[0-9]*"
                  id="den2-val"
                  value={den2}
                  onChange={(e) => setDen2(e.target.value)}
                  className="w-16 text-center text-xl font-bold bg-slate-950/30 text-teal-400 p-2 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                  aria-label="Fraction 2 Denominator"
                />
              </div>
            </div>

          </div>

          {errorMsg && (
            <div className="text-center text-rose-400 text-sm font-semibold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 animate-shake">
              {errorMsg}
            </div>
          )}

          {/* Calculate button */}
          <button
            type="submit"
            id="fraction-calc-btn"
            className={`w-full py-4 text-center rounded-xl font-bold tracking-wide transition-all shadow-md cursor-pointer ${theme.btnEquals}`}
          >
            {t('calculate')}
          </button>
        </form>

        {/* Display results */}
        {resNum !== null && resDen !== null && simpNum !== null && simpDen !== null && (
          <div className="mt-8 border-t border-slate-800 pt-6 animate-fadeIn">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 text-center mb-6">{t('result')}</h3>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              
              {/* Unsimplified Result */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-mono text-slate-500 mb-2">{t('rawRatio')}</span>
                <div className="flex items-center gap-1 font-mono text-xl font-bold">
                  <div className="flex flex-col items-center">
                    <span>{resNum}</span>
                    <hr className="w-10 my-1 border" />
                    <span>{resDen}</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-teal-400 text-2xl font-bold select-none">→</div>

              {/* Simplified Form */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-mono text-teal-300 font-bold mb-2">{t('reducedAnswer')}</span>
                {simpDen === 1 ? (
                  <div className="text-3xl font-extrabold text-teal-400 font-mono py-2">{simpNum}</div>
                ) : (
                  <div className="flex items-center gap-1 font-mono text-2xl font-bold text-teal-400">
                    <div className="flex flex-col items-center">
                      <span>{simpNum}</span>
                      <hr className="w-12 my-1 border-2 border-teal-500" />
                      <span>{simpDen}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mixed Form if improper */}
              {wholeNum !== null && mixedNum !== null && mixedDen !== null && (
                <>
                  <div className="text-slate-400 text-2xl font-bold select-none">+</div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono text-orange-400 font-bold mb-2">{t('improFraction')}</span>
                    <div className="flex items-center gap-1 font-mono text-2xl font-extrabold text-orange-400">
                      <span>{wholeNum}</span>
                      <div className="flex items-center gap-1 font-mono text-lg font-bold ml-1">
                        <span>{mixedNum}</span>
                        <hr className="w-8 my-0.5 border-orange-500" />
                        <span>{mixedDen}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
            </div>

            {/* Interactive Step-by-Step Educational Panel */}
            <div className={`mt-8 bg-black/40 rounded-xl p-4 border border-teal-980`}>
              <h4 className="text-xs font-bold text-teal-300 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <span>📚</span> {t('stepByStep')}
              </h4>
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="border-l-2 border-teal-800 pl-4 py-1">
                    <h5 className="text-xs font-bold text-slate-300">{step.title}</h5>
                    <div className="font-mono text-sm text-teal-400 my-1 py-1 px-2.5 bg-slate-950/40 rounded inline-block">
                      {step.expression}
                    </div>
                    <p className="text-xs text-slate-400">{step.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

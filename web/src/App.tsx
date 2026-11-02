/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ConsoleMode,
  OperationType,
  UnaryOperationType,
  ConstantType,
  CalculationRecord,
} from './types/calculator';
import {
  pythonOperations,
  PYTHON_CONSTANTS,
  getOperatorSymbol,
  getFunctionName,
  formatPythonNumber,
  resolverPassoAPasso,
  pythonSourceFiles,
} from './utils/pythonEngine';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { PixelCalculator } from './components/PixelCalculator';
import { LearningBoard } from './components/LearningBoard';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [consoleMode, setConsoleMode] = useState<ConsoleMode>('calculator');

  // Calculator State
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [activeOperator, setActiveOperator] = useState<OperationType | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');
  const [parenMode, setParenMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // History State
  const [history, setHistory] = useState<CalculationRecord[]>([]);

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
  };

  // Download script corresponding to active console mode
  const handleDownloadScript = () => {
    soundManager.playKeyClick('number');
    const isLearning = consoleMode === 'learning';
    const content = isLearning
      ? pythonSourceFiles['calc_bit/passo_a_passo.py']
      : pythonSourceFiles['calc_bit/cientifica.py'];
    const blob = new Blob([content], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isLearning ? 'passo_a_passo.py' : 'cientifica.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Input Digit
  const handleDigit = useCallback(
    (digit: string) => {
      soundManager.playKeyClick('number');
      setError(null);

      if (parenMode) {
        setCurrentValue((prev) => prev + digit);
        setExpression((prev) => prev + digit);
        return;
      }

      if (digit === '.') {
        if (waitingForOperand) {
          setCurrentValue('0.');
          setWaitingForOperand(false);
          return;
        }
        if (!currentValue.includes('.')) {
          setCurrentValue((prev) => prev + '.');
        }
        return;
      }

      if (waitingForOperand || currentValue === '0') {
        setCurrentValue(digit);
        setWaitingForOperand(false);
      } else {
        if (currentValue.length < 16) {
          setCurrentValue((prev) => prev + digit);
        }
      }
    },
    [currentValue, waitingForOperand, parenMode]
  );

  // Handle Parentheses '(' and ')'
  const handleParenthesis = useCallback(
    (paren: '(' | ')') => {
      soundManager.playKeyClick('operator');
      setError(null);

      if (!parenMode) {
        // Inicia modo de expressão com parênteses na calculadora
        let baseExpr = '';
        if (previousValue !== null && activeOperator) {
          const sym = getOperatorSymbol(activeOperator);
          baseExpr = waitingForOperand
            ? `${formatPythonNumber(previousValue)} ${sym} ${paren}`
            : `${formatPythonNumber(previousValue)} ${sym} ${currentValue}${paren}`;
        } else if (currentValue !== '0' && !waitingForOperand) {
          baseExpr = paren === '(' ? `${currentValue} * (` : `${currentValue})`;
        } else {
          baseExpr = paren;
        }
        setParenMode(true);
        setPreviousValue(null);
        setActiveOperator(null);
        setWaitingForOperand(false);
        setCurrentValue(baseExpr);
        setExpression(baseExpr);
      } else {
        setCurrentValue((prev) => prev + paren);
        setExpression((prev) => prev + paren);
      }
    },
    [parenMode, previousValue, activeOperator, waitingForOperand, currentValue]
  );

  // Insert Mathematical Constant (pi or e)
  const handleConstant = useCallback(
    (constant: ConstantType) => {
      soundManager.playKeyClick('number');
      setError(null);
      const val = constant === 'pi' ? PYTHON_CONSTANTS.PI : PYTHON_CONSTANTS.EULER;
      const formatted = Number(val.toFixed(8)).toString();
      if (parenMode) {
        setCurrentValue((prev) => prev + formatted);
        setExpression((prev) => prev + formatted);
        return;
      }
      setCurrentValue(formatted);
      setWaitingForOperand(false);
    },
    [parenMode]
  );

  // Execute binary operation (basic + scientific 2-operand)
  const executeCalculation = useCallback(
    (op: OperationType, a: number, b: number): { result: number | null; err: string | null } => {
      try {
        let res = 0;
        if (op === 'add') res = pythonOperations.somar(a, b);
        else if (op === 'subtract') res = pythonOperations.subtrair(a, b);
        else if (op === 'multiply') res = pythonOperations.multiplicar(a, b);
        else if (op === 'divide') res = pythonOperations.dividir(a, b);
        else if (op === 'power') res = pythonOperations.potencia(a, b);
        else if (op === 'modulo') res = pythonOperations.modulo(a, b);
        else if (op === 'percent') res = pythonOperations.porcentagem(a, b);

        return { result: res, err: null };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { result: null, err: msg };
      }
    },
    []
  );

  // Execute unary scientific operation immediately on currentValue
  const handleUnaryOperator = useCallback(
    (op: UnaryOperationType) => {
      const fnName = getFunctionName(op);
      if (parenMode) {
        soundManager.playKeyClick('operator');
        setCurrentValue((prev) => `${prev}${fnName}(`);
        setExpression((prev) => `${prev}${fnName}(`);
        return;
      }

      const x = parseFloat(currentValue);
      if (isNaN(x)) return;

      const pythonSnippet = `${fnName}(${formatPythonNumber(x)})`;

      try {
        let res = 0;
        if (op === 'square') res = pythonOperations.quadrado(x);
        else if (op === 'sqrt') res = pythonOperations.raiz_quadrada(x);
        else if (op === 'factorial') res = pythonOperations.fatorial(x);
        else if (op === 'sin') res = pythonOperations.seno(x);
        else if (op === 'cos') res = pythonOperations.cosseno(x);
        else if (op === 'tan') res = pythonOperations.tangente(x);
        else if (op === 'log10') res = pythonOperations.log10(x);
        else if (op === 'ln') res = pythonOperations.ln(x);

        soundManager.playKeyClick('equals');
        const formattedRes = formatPythonNumber(res);
        setCurrentValue(formattedRes);
        setExpression(`${pythonSnippet} =`);
        setError(null);
        setWaitingForOperand(true);

        const newRecord: CalculationRecord = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
          operandA: x,
          operandB: null,
          operation: op,
          operatorSymbol: fnName,
          result: res,
          pythonSnippet: `${pythonSnippet} -> ${formattedRes}`,
          expression: `${pythonSnippet} =`,
        };
        setHistory((prev) => [newRecord, ...prev]);
      } catch (err: unknown) {
        soundManager.playKeyClick('error');
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setWaitingForOperand(true);

        const newRecord: CalculationRecord = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
          operandA: x,
          operandB: null,
          operation: op,
          operatorSymbol: fnName,
          result: null,
          error: msg,
          pythonSnippet,
          expression: pythonSnippet,
        };
        setHistory((prev) => [newRecord, ...prev]);
      }
    },
    [currentValue, parenMode]
  );

  // Handle Binary Operator
  const handleOperator = useCallback(
    (nextOperator: OperationType) => {
      soundManager.playKeyClick('operator');
      setError(null);

      if (parenMode) {
        const opSym =
          nextOperator === 'modulo' ? '%' : getOperatorSymbol(nextOperator);
        setCurrentValue((prev) => `${prev} ${opSym} `);
        setExpression((prev) => `${prev} ${opSym} `);
        return;
      }

      const inputValue = parseFloat(currentValue);

      if (previousValue === null) {
        setPreviousValue(inputValue);
        setExpression(`${formatPythonNumber(inputValue)} ${getOperatorSymbol(nextOperator)}`);
      } else if (activeOperator && !waitingForOperand) {
        const { result, err } = executeCalculation(activeOperator, previousValue, inputValue);

        if (err) {
          soundManager.playKeyClick('error');
          setError(err);
          setPreviousValue(null);
          setActiveOperator(null);
          setWaitingForOperand(true);
          return;
        }

        if (result !== null) {
          setCurrentValue(formatPythonNumber(result));
          setPreviousValue(result);
          setExpression(`${formatPythonNumber(result)} ${getOperatorSymbol(nextOperator)}`);
        }
      } else {
        setExpression(`${formatPythonNumber(previousValue)} ${getOperatorSymbol(nextOperator)}`);
      }

      setActiveOperator(nextOperator);
      setWaitingForOperand(true);
    },
    [currentValue, previousValue, activeOperator, waitingForOperand, executeCalculation, parenMode]
  );

  // Equals
  const handleEquals = useCallback(() => {
    if (parenMode) {
      const report = resolverPassoAPasso(currentValue);
      if (!report.sucesso || report.resultadoFinal === null) {
        soundManager.playKeyClick('error');
        setError(report.erro || 'Erro na expressão');
        setParenMode(false);
        setWaitingForOperand(true);
        return;
      }

      soundManager.playKeyClick('equals');
      const formattedRes = formatPythonNumber(report.resultadoFinal);
      setExpression(`${currentValue} =`);
      setCurrentValue(formattedRes);
      setParenMode(false);
      setWaitingForOperand(true);

      const newRecord: CalculationRecord = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
        operandA: report.resultadoFinal,
        operandB: null,
        operation: 'add',
        operatorSymbol: '()',
        result: report.resultadoFinal,
        pythonSnippet: `resolver_passo_a_passo("${currentValue}") -> ${formattedRes}`,
        expression: `${currentValue} =`,
      };
      setHistory((prev) => [newRecord, ...prev]);
      return;
    }

    if (activeOperator === null || previousValue === null) {
      soundManager.playKeyClick('equals');
      return;
    }

    const operandA = previousValue;
    const operandB = parseFloat(currentValue);
    const op = activeOperator;
    const opSymbol = getOperatorSymbol(op);
    const fnName = getFunctionName(op);

    const { result, err } = executeCalculation(op, operandA, operandB);

    const pythonSnippet = `${fnName}(${formatPythonNumber(operandA)}, ${formatPythonNumber(operandB)})`;

    if (err) {
      soundManager.playKeyClick('error');
      setError(err);

      const newRecord: CalculationRecord = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
        operandA,
        operandB,
        operation: op,
        operatorSymbol: opSymbol,
        result: null,
        error: err,
        pythonSnippet,
        expression: `${formatPythonNumber(operandA)} ${opSymbol} ${formatPythonNumber(operandB)}`,
      };
      setHistory((prev) => [newRecord, ...prev]);

      setPreviousValue(null);
      setActiveOperator(null);
      setWaitingForOperand(true);
      return;
    }

    if (result !== null) {
      soundManager.playKeyClick('equals');
      const formattedRes = formatPythonNumber(result);
      setCurrentValue(formattedRes);
      setExpression(`${formatPythonNumber(operandA)} ${opSymbol} ${formatPythonNumber(operandB)} =`);

      const newRecord: CalculationRecord = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
        operandA,
        operandB,
        operation: op,
        operatorSymbol: opSymbol,
        result,
        pythonSnippet: `${pythonSnippet} -> ${formattedRes}`,
        expression: `${formatPythonNumber(operandA)} ${opSymbol} ${formatPythonNumber(operandB)} =`,
      };
      setHistory((prev) => [newRecord, ...prev]);

      setPreviousValue(null);
      setActiveOperator(null);
      setWaitingForOperand(true);
    }
  }, [activeOperator, previousValue, currentValue, executeCalculation, parenMode]);

  // Clear All
  const handleClear = useCallback(() => {
    soundManager.playKeyClick('clear');
    setCurrentValue('0');
    setPreviousValue(null);
    setActiveOperator(null);
    setWaitingForOperand(false);
    setParenMode(false);
    setExpression('');
    setError(null);
  }, []);

  // Backspace
  const handleBackspace = useCallback(() => {
    soundManager.playKeyClick('number');
    if (parenMode) {
      if (currentValue.length > 1) {
        const next = currentValue.slice(0, -1);
        setCurrentValue(next);
        setExpression(next);
      } else {
        setCurrentValue('0');
        setExpression('');
        setParenMode(false);
      }
      return;
    }
    if (waitingForOperand || error) {
      setCurrentValue('0');
      setError(null);
      return;
    }
    if (currentValue.length > 1) {
      setCurrentValue((prev) => prev.slice(0, -1));
    } else {
      setCurrentValue('0');
    }
  }, [waitingForOperand, error, currentValue, parenMode]);

  // Invert Sign (±)
  const handleToggleSign = useCallback(() => {
    soundManager.playKeyClick('number');
    if (parenMode || currentValue === '0' || error) return;
    if (currentValue.startsWith('-')) {
      setCurrentValue((prev) => prev.slice(1));
    } else {
      setCurrentValue((prev) => '-' + prev);
    }
  }, [currentValue, error, parenMode]);

  // Restore history record
  const handleSelectRecord = (record: CalculationRecord) => {
    if (record.result !== null) {
      setParenMode(false);
      setCurrentValue(formatPythonNumber(record.result));
      setExpression(record.expression);
    }
  };

  // Global Keyboard Navigation (when in calculator mode)
  useEffect(() => {
    if (consoleMode !== 'calculator') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDigit('.');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleParenthesis(e.key);
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('add');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('subtract');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('multiply');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('divide');
      } else if (e.key === '^') {
        e.preventDefault();
        handleOperator('power');
      } else if (e.key === '%') {
        e.preventDefault();
        handleOperator('modulo');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    consoleMode,
    handleDigit,
    handleParenthesis,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClear,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        consoleMode={consoleMode}
        onSelectConsoleMode={setConsoleMode}
        onDownloadScript={handleDownloadScript}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-center">
        {consoleMode === 'calculator' ? (
          <PixelCalculator
            currentValue={currentValue}
            previousValue={previousValue}
            activeOperator={activeOperator}
            expression={expression}
            error={error}
            onDigit={handleDigit}
            onParenthesis={handleParenthesis}
            onOperator={handleOperator}
            onUnaryOperator={handleUnaryOperator}
            onConstant={handleConstant}
            onEquals={handleEquals}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onToggleSign={handleToggleSign}
            history={history}
            onSelectRecord={handleSelectRecord}
          />
        ) : (
          <LearningBoard />
        )}
      </main>

      <footer className="border-t-4 border-[#12111c] py-4 text-center text-xs text-[#7d799b] bg-[#141320] font-pixel">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            CALC BIT &middot;{' '}
            {consoleMode === 'calculator'
              ? 'CONSOLE PORTÁTIL BÁSICO & CIENTÍFICO'
              : 'MODO APRENDIZADO (JOY-CON + LOUSA PEMDAS)'}
          </div>
          <div className="text-[#a5a1c2] font-arcade text-[10px]">
            PYTHON 3 &middot; 16-BIT EDITION
          </div>
        </div>
      </footer>
    </div>
  );
}

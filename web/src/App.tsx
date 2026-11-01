/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, OperationType, CalculationRecord } from './types/calculator';
import {
  pythonOperations,
  getOperatorSymbol,
  getFunctionName,
  formatPythonNumber,
  pythonSourceFiles,
} from './utils/pythonEngine';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { PixelCalculator } from './components/PixelCalculator';
import { PythonTerminal } from './components/PythonTerminal';
import { CodeViewer } from './components/CodeViewer';
import { OperationsGuide } from './components/OperationsGuide';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ArchitectureDocs } from './components/ArchitectureDocs';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Calculator State
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [activeOperator, setActiveOperator] = useState<OperationType | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [memoryValue, setMemoryValue] = useState<number>(0);

  // Python Inspector State
  const [lastOperation, setLastOperation] = useState<OperationType | null>('add');
  const [lastOperandA, setLastOperandA] = useState<number | null>(null);
  const [lastOperandB, setLastOperandB] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<number | null>(null);

  // History State
  const [history, setHistory] = useState<CalculationRecord[]>([]);

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
  };

  // Download cli.py
  const handleDownloadScript = () => {
    soundManager.playKeyClick('number');
    const content = pythonSourceFiles['calc_bit/cli.py'];
    const blob = new Blob([content], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cli.py';
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
        // Prevent exceeding sensible display limits
        if (currentValue.length < 16) {
          setCurrentValue((prev) => prev + digit);
        }
      }
    },
    [currentValue, waitingForOperand]
  );

  // Execute binary operation
  const executeCalculation = useCallback(
    (op: OperationType, a: number, b: number): { result: number | null; err: string | null } => {
      try {
        let res = 0;
        if (op === 'add') res = pythonOperations.somar(a, b);
        else if (op === 'subtract') res = pythonOperations.subtrair(a, b);
        else if (op === 'multiply') res = pythonOperations.multiplicar(a, b);
        else if (op === 'divide') res = pythonOperations.dividir(a, b);

        return { result: res, err: null };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { result: null, err: msg };
      }
    },
    []
  );

  // Handle Operator
  const handleOperator = useCallback(
    (nextOperator: OperationType) => {
      soundManager.playKeyClick('operator');
      setError(null);
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
      setLastOperation(nextOperator);
    },
    [currentValue, previousValue, activeOperator, waitingForOperand, executeCalculation]
  );

  // Equals
  const handleEquals = useCallback(() => {
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

    setLastOperation(op);
    setLastOperandA(operandA);
    setLastOperandB(operandB);

    const pythonSnippet = `${fnName}(${formatPythonNumber(operandA)}, ${formatPythonNumber(operandB)})`;

    if (err) {
      soundManager.playKeyClick('error');
      setError('ZeroDivisionError: division by zero');
      setLastResult(null);

      // Record in history
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
      setLastResult(result);
      setExpression(`${formatPythonNumber(operandA)} ${opSymbol} ${formatPythonNumber(operandB)} =`);

      // Record in history
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
  }, [activeOperator, previousValue, currentValue, executeCalculation]);

  // Clear All
  const handleClear = useCallback(() => {
    soundManager.playKeyClick('clear');
    setCurrentValue('0');
    setPreviousValue(null);
    setActiveOperator(null);
    setWaitingForOperand(false);
    setExpression('');
    setError(null);
  }, []);

  // Backspace
  const handleBackspace = useCallback(() => {
    soundManager.playKeyClick('number');
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
  }, [waitingForOperand, error, currentValue]);

  // Invert Sign (±)
  const handleToggleSign = useCallback(() => {
    soundManager.playKeyClick('number');
    if (currentValue === '0' || error) return;
    if (currentValue.startsWith('-')) {
      setCurrentValue((prev) => prev.slice(1));
    } else {
      setCurrentValue((prev) => '-' + prev);
    }
  }, [currentValue, error]);

  // Percentage (%)
  const handlePercent = useCallback(() => {
    soundManager.playKeyClick('number');
    const val = parseFloat(currentValue);
    if (!isNaN(val)) {
      const res = val / 100;
      setCurrentValue(formatPythonNumber(res));
      setWaitingForOperand(true);
    }
  }, [currentValue]);

  // Memory functions
  const handleMemoryClear = () => {
    soundManager.playKeyClick('clear');
    setMemoryValue(0);
  };

  const handleMemoryRecall = () => {
    soundManager.playKeyClick('number');
    setCurrentValue(formatPythonNumber(memoryValue));
    setWaitingForOperand(true);
  };

  const handleMemoryAdd = () => {
    soundManager.playKeyClick('operator');
    const val = parseFloat(currentValue);
    if (!isNaN(val)) {
      setMemoryValue((prev) => prev + val);
    }
  };

  // Restore history record
  const handleSelectRecord = (record: CalculationRecord) => {
    if (record.result !== null) {
      setCurrentValue(formatPythonNumber(record.result));
      setLastOperation(record.operation);
      setLastOperandA(record.operandA);
      setLastOperandB(record.operandB);
      setLastResult(record.result);
      setExpression(record.expression);
      setActiveTab('calculator');
    }
  };

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not capture keyboard if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (activeTab !== 'calculator') return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDigit('.');
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
  }, [activeTab, handleDigit, handleOperator, handleEquals, handleBackspace, handleClear]);

  // Compute live Python snippet for display
  const getDisplayPythonSnippet = (): string => {
    if (activeOperator && previousValue !== null) {
      const fn = getFunctionName(activeOperator);
      return `${fn}(${formatPythonNumber(previousValue)}, ${currentValue})`;
    }
    if (lastOperation && lastOperandA !== null && lastOperandB !== null) {
      const fn = getFunctionName(lastOperation);
      return `${fn}(${formatPythonNumber(lastOperandA)}, ${formatPythonNumber(lastOperandB)}) -> ${
        lastResult !== null ? formatPythonNumber(lastResult) : 'erro'
      }`;
    }
    return 'somar(a, b), subtrair(a, b), multiplicar(a, b), dividir(a, b)';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadScript={handleDownloadScript}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* TAB 1: CALCULADORA VISUAL PIXEL ART 16-BIT */}
        {activeTab === 'calculator' && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
            <PixelCalculator
              currentValue={currentValue}
              previousValue={previousValue}
              activeOperator={activeOperator}
              expression={expression}
              error={error}
              onDigit={handleDigit}
              onOperator={handleOperator}
              onEquals={handleEquals}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onToggleSign={handleToggleSign}
              history={history}
              onSelectRecord={handleSelectRecord}
            />
          </div>
        )}

        {/* TAB 2: TERMINAL CLI PYTHON */}
        {activeTab === 'terminal' && <PythonTerminal />}

        {/* TAB 3: CÓDIGO FONTE & TESTES UNITÁRIOS */}
        {activeTab === 'code' && <CodeViewer />}

        {/* TAB 4: GUIA DAS 4 OPERAÇÕES */}
        {activeTab === 'guide' && <OperationsGuide />}

        {/* TAB 5: ARQUITETURA & ONDE ESTÁ O PYTHON */}
        {activeTab === 'docs' && <ArchitectureDocs />}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#12111c] py-4 text-center text-xs text-[#7d799b] bg-[#141320] font-pixel">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            CALC BIT &middot; 4 OPERAÇÕES BÁSICAS EM PYTHON
          </div>
          <div className="text-[#a5a1c2] font-arcade text-[10px]">
            PEP 8 &middot; ZERO DIVISION SAFE
          </div>
        </div>
      </footer>
    </div>
  );
}

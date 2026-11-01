/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ActiveTab,
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
  pythonSourceFiles,
} from './utils/pythonEngine';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { PixelCalculator } from './components/PixelCalculator';
import { PythonTerminal } from './components/PythonTerminal';
import { CodeViewer } from './components/CodeViewer';
import { OperationsGuide } from './components/OperationsGuide';
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

  // Python Inspector State
  const [lastOperation, setLastOperation] = useState<OperationType | UnaryOperationType | null>('add');

  // History State
  const [history, setHistory] = useState<CalculationRecord[]>([]);

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
  };

  // Download cientifica.py
  const handleDownloadScript = () => {
    soundManager.playKeyClick('number');
    const content = pythonSourceFiles['calc_bit/cientifica.py'];
    const blob = new Blob([content], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cientifica.py';
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
        if (currentValue.length < 16) {
          setCurrentValue((prev) => prev + digit);
        }
      }
    },
    [currentValue, waitingForOperand]
  );

  // Insert Mathematical Constant (pi or e)
  const handleConstant = useCallback((constant: ConstantType) => {
    soundManager.playKeyClick('number');
    setError(null);
    const val = constant === 'pi' ? PYTHON_CONSTANTS.PI : PYTHON_CONSTANTS.EULER;
    setCurrentValue(Number(val.toFixed(8)).toString());
    setWaitingForOperand(false);
  }, []);

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
      const x = parseFloat(currentValue);
      if (isNaN(x)) return;

      const fnName = getFunctionName(op);
      const pythonSnippet = `${fnName}(${formatPythonNumber(x)})`;
      setLastOperation(op);

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
    [currentValue]
  );

  // Handle Binary Operator
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

  // Restore history record
  const handleSelectRecord = (record: CalculationRecord) => {
    if (record.result !== null) {
      setCurrentValue(formatPythonNumber(record.result));
      setLastOperation(record.operation);
      setExpression(record.expression);
      setActiveTab('calculator');
    }
  };

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [activeTab, handleDigit, handleOperator, handleEquals, handleBackspace, handleClear]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadScript={handleDownloadScript}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'calculator' && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
            <PixelCalculator
              currentValue={currentValue}
              previousValue={previousValue}
              activeOperator={activeOperator}
              lastOperation={lastOperation}
              expression={expression}
              error={error}
              onDigit={handleDigit}
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
          </div>
        )}

        {activeTab === 'terminal' && <PythonTerminal />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'guide' && <OperationsGuide />}
        {activeTab === 'docs' && <ArchitectureDocs />}
      </main>

      <footer className="border-t-4 border-[#12111c] py-4 text-center text-xs text-[#7d799b] bg-[#141320] font-pixel">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>CALC BIT SCIENTIFIC &middot; BÁSICA &amp; CIENTÍFICA EM PYTHON</div>
          <div className="text-[#a5a1c2] font-arcade text-[10px]">
            PEP 8 &middot; MATH MODULE &middot; SAFE EXCEPTIONS
          </div>
        </div>
      </footer>
    </div>
  );
}

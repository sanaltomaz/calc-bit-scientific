import React, { useState, useRef, useEffect } from 'react';
import { pythonOperations, formatPythonNumber } from '../utils/pythonEngine';
import { Terminal, RefreshCw, Play, CornerDownLeft } from 'lucide-react';
import { soundManager } from '../utils/audio';

type TerminalStep = 'menu' | 'num1' | 'num2' | 'finished';

interface TerminalLine {
  text: string;
  type: 'system' | 'prompt' | 'input' | 'output' | 'error' | 'header';
}

export const PythonTerminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: '$ python calculadora.py', type: 'system' },
    { text: '==========================================', type: 'header' },
    { text: '      CALCULADORA BÁSICA EM PYTHON        ', type: 'header' },
    { text: '==========================================', type: 'header' },
    { text: '1. Adição        [ + ]', type: 'system' },
    { text: '2. Subtração     [ - ]', type: 'system' },
    { text: '3. Multiplicação [ * ]', type: 'system' },
    { text: '4. Divisão       [ / ]', type: 'system' },
    { text: '5. Sair', type: 'system' },
    { text: '------------------------------------------', type: 'header' },
  ]);

  const [step, setStep] = useState<TerminalStep>('menu');
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [num1, setNum1] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const getPromptText = () => {
    switch (step) {
      case 'menu':
        return 'Escolha uma opção (1-5): ';
      case 'num1':
        return 'Digite o primeiro número: ';
      case 'num2':
        return 'Digite o segundo número: ';
      case 'finished':
        return 'Pressione Enter para continuar...';
    }
  };

  const resetTerminal = () => {
    soundManager.playKeyClick('clear');
    setStep('menu');
    setSelectedOp(null);
    setNum1(null);
    setInputValue('');
    setLines([
      { text: '$ python calculadora.py', type: 'system' },
      { text: '==========================================', type: 'header' },
      { text: '      CALCULADORA BÁSICA EM PYTHON        ', type: 'header' },
      { text: '==========================================', type: 'header' },
      { text: '1. Adição        [ + ]', type: 'system' },
      { text: '2. Subtração     [ - ]', type: 'system' },
      { text: '3. Multiplicação [ * ]', type: 'system' },
      { text: '4. Divisão       [ / ]', type: 'system' },
      { text: '5. Sair', type: 'system' },
      { text: '------------------------------------------', type: 'header' },
    ]);
  };

  const handleInputSubmit = (forcedVal?: string) => {
    const val = (forcedVal !== undefined ? forcedVal : inputValue).trim();
    if (!val && step !== 'finished') return;

    soundManager.playKeyClick('number');

    if (step === 'menu') {
      const newLines: TerminalLine[] = [
        ...lines,
        { text: `Escolha uma opção (1-5): ${val}`, type: 'input' },
      ];

      if (val === '5') {
        newLines.push({
          text: '\nObrigado por utilizar a Calculadora Python! Até logo.',
          type: 'output',
        });
        newLines.push({ text: 'Process finished with exit code 0', type: 'system' });
        setLines(newLines);
        setStep('finished');
        setInputValue('');
        return;
      }

      if (!['1', '2', '3', '4'].includes(val)) {
        newLines.push({
          text: ' [!] Opção inválida. Escolha um número de 1 a 5.',
          type: 'error',
        });
        setLines(newLines);
        setInputValue('');
        return;
      }

      setSelectedOp(val);
      setStep('num1');
      setLines(newLines);
      setInputValue('');
      return;
    }

    if (step === 'num1') {
      const cleanVal = val.replace(',', '.');
      const parsed = parseFloat(cleanVal);
      if (isNaN(parsed)) {
        setLines((prev) => [
          ...prev,
          { text: `Digite o primeiro número: ${val}`, type: 'input' },
          {
            text: ' [!] Entrada inválida. Por favor digite um número válido.',
            type: 'error',
          },
        ]);
        setInputValue('');
        return;
      }

      setNum1(parsed);
      setStep('num2');
      setLines((prev) => [
        ...prev,
        { text: `Digite o primeiro número: ${val}`, type: 'input' },
      ]);
      setInputValue('');
      return;
    }

    if (step === 'num2') {
      const cleanVal = val.replace(',', '.');
      const parsed = parseFloat(cleanVal);
      if (isNaN(parsed)) {
        setLines((prev) => [
          ...prev,
          { text: `Digite o segundo número: ${val}`, type: 'input' },
          {
            text: ' [!] Entrada inválida. Por favor digite um número válido.',
            type: 'error',
          },
        ]);
        setInputValue('');
        return;
      }

      const n1 = num1 ?? 0;
      const n2 = parsed;
      const newLines: TerminalLine[] = [
        ...lines,
        { text: `Digite o segundo número: ${val}`, type: 'input' },
      ];

      try {
        let res = 0;
        let sym = '+';

        if (selectedOp === '1') {
          res = pythonOperations.somar(n1, n2);
          sym = '+';
        } else if (selectedOp === '2') {
          res = pythonOperations.subtrair(n1, n2);
          sym = '-';
        } else if (selectedOp === '3') {
          res = pythonOperations.multiplicar(n1, n2);
          sym = '*';
        } else if (selectedOp === '4') {
          res = pythonOperations.dividir(n1, n2);
          sym = '/';
        }

        soundManager.playKeyClick('equals');
        newLines.push({
          text: `\n>>> Resultado: ${formatPythonNumber(n1)} ${sym} ${formatPythonNumber(n2)} = ${formatPythonNumber(res)}`,
          type: 'output',
        });
      } catch (err: unknown) {
        soundManager.playKeyClick('error');
        const msg = err instanceof Error ? err.message : String(err);
        newLines.push({
          text: `\n [ERRO] ${msg}`,
          type: 'error',
        });
      }

      // Reinicia o loop do menu como no script Python
      newLines.push({ text: '\n==========================================', type: 'header' });
      newLines.push({ text: '1. Adição  2. Subtração  3. Multiplicação  4. Divisão  5. Sair', type: 'system' });
      newLines.push({ text: '------------------------------------------', type: 'header' });

      setLines(newLines);
      setStep('menu');
      setSelectedOp(null);
      setNum1(null);
      setInputValue('');
      return;
    }

    if (step === 'finished') {
      resetTerminal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <span>Simulador de Terminal CLI (Python 3)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Execute a aplicação interativa exatamente como ela se comporta no terminal do seu computador.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div
        className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-hidden flex flex-col min-h-[460px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header Dots */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-slate-500 ml-2 font-mono">bash - python3 calculadora.py</span>
          </div>
          <span className="text-[11px] text-slate-400">UTF-8</span>
        </div>

        {/* Scrollable output lines */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pb-3">
          {lines.map((l, i) => {
            if (l.type === 'header') {
              return (
                <div key={i} className="text-amber-400/90 font-bold tracking-wider">
                  {l.text}
                </div>
              );
            }
            if (l.type === 'error') {
              return (
                <div key={i} className="text-rose-400 font-semibold pl-2">
                  {l.text}
                </div>
              );
            }
            if (l.type === 'output') {
              return (
                <div key={i} className="text-emerald-400 font-bold pl-2 py-1 bg-emerald-950/20 rounded border-l-2 border-emerald-500">
                  {l.text}
                </div>
              );
            }
            if (l.type === 'input') {
              return (
                <div key={i} className="text-slate-300 font-medium">
                  {l.text}
                </div>
              );
            }
            return (
              <div key={i} className="text-slate-400">
                {l.text}
              </div>
            );
          })}

          {/* Active Prompt Input */}
          <div className="flex items-center gap-1 text-slate-200 pt-1">
            <span className="text-amber-400 font-bold">{getPromptText()}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono caret-amber-400 text-xs sm:text-sm"
            />
            <button
              onClick={() => handleInputSubmit()}
              className="p-1 text-slate-400 hover:text-white"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div ref={terminalEndRef} />
        </div>

        {/* Quick action helper buttons when in menu step */}
        {step === 'menu' && (
          <div className="border-t border-slate-900 pt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-sans">Opções rápidas:</span>
            {[
              { val: '1', label: '1. Somar (+)' },
              { val: '2', label: '2. Subtrair (-)' },
              { val: '3', label: '3. Multiplicar (*)' },
              { val: '4', label: '4. Dividir (/)' },
              { val: '5', label: '5. Sair' },
            ].map((btn) => (
              <button
                key={btn.val}
                onClick={() => handleInputSubmit(btn.val)}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-amber-300 rounded border border-slate-800 transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { evaluatePythonREPL } from '../utils/pythonEngine';
import { Terminal, CornerDownLeft, Trash2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ReplHistoryEntry {
  input: string;
  output: string;
  isError: boolean;
}

export const PythonRepl: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<ReplHistoryEntry[]>([
    {
      input: 'somar(14, 28)',
      output: '42',
      isError: false,
    },
    {
      input: 'dividir(100, 4)',
      output: '25',
      isError: false,
    },
  ]);

  const handleExecute = (cmd?: string) => {
    const commandToRun = (cmd !== undefined ? cmd : inputVal).trim();
    if (!commandToRun) return;

    soundManager.playKeyClick('equals');
    const { output, isError } = evaluatePythonREPL(commandToRun);
    setHistory((prev) => [...prev, { input: commandToRun, output, isError }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  const clearHistory = () => {
    soundManager.playKeyClick('clear');
    setHistory([]);
  };

  const quickSnippets = [
    'somar(25, 75)',
    'subtrair(100, 37)',
    'multiplicar(12, 12)',
    'dividir(10, 0)',
    '(15 + 5) * 4',
  ];

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-sm text-white">
            Mini-REPL Python Interativo
          </h3>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
          title="Limpar histórico do console"
        >
          <Trash2 className="w-3 h-3" />
          <span>Limpar</span>
        </button>
      </div>

      {/* Quick Snippets */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-400 font-mono">Exemplos:</span>
        {quickSnippets.map((snip) => (
          <button
            key={snip}
            onClick={() => handleExecute(snip)}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-amber-300/90 border border-slate-800 transition-colors active:scale-95"
          >
            {snip}
          </button>
        ))}
      </div>

      {/* Output Console Log */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 max-h-48 overflow-y-auto font-mono text-xs space-y-2">
        {history.length === 0 ? (
          <div className="text-slate-400 text-center py-4 text-xs font-sans">
            Digite chamadas como <code className="text-amber-400">somar(a, b)</code> ou expressões matemáticas para testar em tempo real.
          </div>
        ) : (
          history.map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-amber-400 select-none">&gt;&gt;&gt;</span>
                <span className="text-slate-200">{item.input}</span>
              </div>
              <div
                className={`pl-6 ${
                  item.isError ? 'text-rose-400 font-medium' : 'text-emerald-400 font-semibold'
                }`}
              >
                {item.output}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Command Input Bar */}
      <div className="flex items-center gap-2 bg-slate-950 rounded-xl border border-slate-800 px-3 py-1.5 focus-within:border-amber-500/50 transition-colors">
        <span className="font-mono text-amber-400 select-none text-xs">&gt;&gt;&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex: somar(50, 25) ou 14.5 * 2"
          className="flex-1 bg-transparent border-none text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleExecute()}
          disabled={!inputVal.trim()}
          className="p-1 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 text-slate-950 transition-all"
          title="Executar comando (Enter)"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

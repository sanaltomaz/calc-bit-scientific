import React from 'react';
import { OperationType } from '../types/calculator';
import { Delete, Divide, Minus, Plus, X, Percent } from 'lucide-react';

interface CalculatorKeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: OperationType) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  activeOperator: OperationType | null;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onBackspace,
  onToggleSign,
  onPercent,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  activeOperator,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Memory & Quick Utilities Row */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onMemoryClear}
          className="py-1.5 text-xs font-mono font-medium text-slate-400 bg-slate-900/60 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-800/80 transition-all active:scale-95"
          title="Memory Clear (MC)"
        >
          MC
        </button>
        <button
          onClick={onMemoryRecall}
          className="py-1.5 text-xs font-mono font-medium text-slate-400 bg-slate-900/60 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-800/80 transition-all active:scale-95"
          title="Memory Recall (MR)"
        >
          MR
        </button>
        <button
          onClick={onMemoryAdd}
          className="py-1.5 text-xs font-mono font-medium text-slate-400 bg-slate-900/60 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-800/80 transition-all active:scale-95"
          title="Memory Add (M+)"
        >
          M+
        </button>
        <button
          onClick={onPercent}
          className="py-1.5 text-xs font-mono font-medium text-amber-400 bg-slate-900/60 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition-all active:scale-95 flex items-center justify-center gap-1"
          title="Porcentagem (%)"
        >
          <Percent className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1: AC, Backspace, Sign, Divide */}
        <button
          onClick={onClear}
          className="h-12 sm:h-14 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/40 font-mono font-semibold text-base flex flex-col items-center justify-center transition-all active:scale-95 shadow-sm"
          title="Limpar tudo (Esc)"
        >
          <span>AC</span>
          <span className="text-[9px] text-rose-400/60 font-sans">Esc</span>
        </button>

        <button
          onClick={onBackspace}
          className="h-12 sm:h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-mono text-sm flex flex-col items-center justify-center transition-all active:scale-95"
          title="Apagar último dígito (Backspace)"
        >
          <Delete className="w-5 h-5 text-slate-300" />
          <span className="text-[9px] text-slate-500 font-sans">⌫</span>
        </button>

        <button
          onClick={onToggleSign}
          className="h-12 sm:h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-mono text-sm flex flex-col items-center justify-center transition-all active:scale-95"
          title="Inverter sinal (±)"
        >
          <span className="font-mono text-base font-bold text-slate-300 leading-none">±</span>
          <span className="text-[9px] text-slate-500 font-sans mt-0.5">±</span>
        </button>

        <button
          onClick={() => onOperator('divide')}
          className={`h-12 sm:h-14 rounded-xl font-mono text-lg flex flex-col items-center justify-center transition-all active:scale-95 border ${
            activeOperator === 'divide'
              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-500/20'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}
          title="Divisão (/) - dividir(a, b)"
        >
          <Divide className="w-5 h-5" />
          <span className="text-[9px] opacity-75 font-sans">/</span>
        </button>

        {/* Row 2: 7, 8, 9, Multiply */}
        {['7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => onDigit(digit)}
            className="h-12 sm:h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800/90 font-mono font-semibold text-xl flex items-center justify-center transition-all active:scale-95 shadow-sm"
          >
            {digit}
          </button>
        ))}

        <button
          onClick={() => onOperator('multiply')}
          className={`h-12 sm:h-14 rounded-xl font-mono text-lg flex flex-col items-center justify-center transition-all active:scale-95 border ${
            activeOperator === 'multiply'
              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-500/20'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}
          title="Multiplicação (*) - multiplicar(a, b)"
        >
          <X className="w-5 h-5" />
          <span className="text-[9px] opacity-75 font-sans">*</span>
        </button>

        {/* Row 3: 4, 5, 6, Subtract */}
        {['4', '5', '6'].map((digit) => (
          <button
            key={digit}
            onClick={() => onDigit(digit)}
            className="h-12 sm:h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800/90 font-mono font-semibold text-xl flex items-center justify-center transition-all active:scale-95 shadow-sm"
          >
            {digit}
          </button>
        ))}

        <button
          onClick={() => onOperator('subtract')}
          className={`h-12 sm:h-14 rounded-xl font-mono text-lg flex flex-col items-center justify-center transition-all active:scale-95 border ${
            activeOperator === 'subtract'
              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-500/20'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}
          title="Subtração (-) - subtrair(a, b)"
        >
          <Minus className="w-5 h-5" />
          <span className="text-[9px] opacity-75 font-sans">-</span>
        </button>

        {/* Row 4: 1, 2, 3, Add */}
        {['1', '2', '3'].map((digit) => (
          <button
            key={digit}
            onClick={() => onDigit(digit)}
            className="h-12 sm:h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800/90 font-mono font-semibold text-xl flex items-center justify-center transition-all active:scale-95 shadow-sm"
          >
            {digit}
          </button>
        ))}

        <button
          onClick={() => onOperator('add')}
          className={`h-12 sm:h-14 rounded-xl font-mono text-lg flex flex-col items-center justify-center transition-all active:scale-95 border ${
            activeOperator === 'add'
              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-500/20'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}
          title="Adição (+) - somar(a, b)"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[9px] opacity-75 font-sans">+</span>
        </button>

        {/* Row 5: 0, Decimal, Equals */}
        <button
          onClick={() => onDigit('0')}
          className="col-span-2 h-12 sm:h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800/90 font-mono font-semibold text-xl flex items-center justify-start px-6 transition-all active:scale-95 shadow-sm"
        >
          0
        </button>

        <button
          onClick={() => onDigit('.')}
          className="h-12 sm:h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800/90 font-mono font-bold text-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm"
          title="Ponto decimal (.)"
        >
          .
        </button>

        <button
          onClick={onEquals}
          className="h-12 sm:h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-mono font-bold text-2xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-lg shadow-amber-500/20 border border-amber-300"
          title="Calcular resultado (Enter ou =)"
        >
          <span>=</span>
          <span className="text-[9px] text-slate-900/70 font-sans -mt-1">Enter</span>
        </button>
      </div>
    </div>
  );
};

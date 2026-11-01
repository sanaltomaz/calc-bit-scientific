import React from 'react';
import { Terminal } from 'lucide-react';

interface CalculatorDisplayProps {
  expression: string;
  currentValue: string;
  activeOperatorSymbol?: string;
  pythonSnippet?: string;
  error?: string | null;
  hasMemory: boolean;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  currentValue,
  activeOperatorSymbol,
  pythonSnippet,
  error,
  hasMemory,
}) => {
  // Dynamically shrink font size if text is too long
  const getFontSizeClass = (len: number) => {
    if (len > 14) return 'text-2xl sm:text-3xl';
    if (len > 10) return 'text-3xl sm:text-4xl';
    return 'text-4xl sm:text-5xl';
  };

  return (
    <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-inner flex flex-col justify-between min-h-[140px] relative overflow-hidden">
      {/* Top row: Memory indicator, active operator and Expression history */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400 min-h-[22px]">
        <div className="flex items-center gap-2">
          {hasMemory && (
            <span className="text-amber-400 font-bold bg-amber-950/60 border border-amber-800/50 px-1.5 py-0.2 rounded text-[10px]">
              M
            </span>
          )}
          {activeOperatorSymbol && (
            <span className="text-amber-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {activeOperatorSymbol}
            </span>
          )}
        </div>
        <div className="text-right truncate max-w-[260px] text-slate-400 tracking-wider">
          {expression || '\u00A0'}
        </div>
      </div>

      {/* Main Display: Current number or error */}
      <div className="py-1 text-right">
        {error ? (
          <div className="text-rose-400 font-mono text-base sm:text-lg font-semibold tracking-tight break-all">
            {error}
          </div>
        ) : (
          <div
            className={`font-mono font-bold tracking-tight text-white tabular-nums transition-all ${getFontSizeClass(
              currentValue.length
            )}`}
          >
            {currentValue}
          </div>
        )}
      </div>

      {/* Bottom row: Live Python translation */}
      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Terminal className="w-3 h-3 text-amber-400/80" />
          <span className="text-slate-400">Python:</span>
        </div>
        <div className="truncate max-w-[280px] text-amber-300/90 font-medium">
          {pythonSnippet || 'calculadora.py'}
        </div>
      </div>
    </div>
  );
};

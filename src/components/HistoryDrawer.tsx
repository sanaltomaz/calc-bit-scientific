import React from 'react';
import { CalculationRecord } from '../types/calculator';
import { History, Trash2, Copy, ArrowUpRight, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HistoryDrawerProps {
  history: CalculationRecord[];
  onSelectRecord: (record: CalculationRecord) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelectRecord,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playKeyClick('number');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-sm text-white">
            Histórico de Operações
          </h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              soundManager.playKeyClick('clear');
              onClearHistory();
            }}
            className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
            title="Limpar histórico"
          >
            <Trash2 className="w-3 h-3" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[360px] pr-1">
        {history.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 space-y-1">
            <p>Nenhuma operação realizada ainda.</p>
            <p className="text-[11px] text-slate-600">
              Faça contas na calculadora para registrar chamadas de função Python.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                soundManager.playKeyClick('number');
                onSelectRecord(item);
              }}
              className="bg-slate-950/70 hover:bg-slate-950 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <span>{item.expression}</span>
                <span className="text-[10px] text-slate-600 font-sans">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`font-mono font-bold text-sm ${
                    item.error ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {item.error ? 'Erro (ZeroDivisionError)' : `= ${item.result}`}
                </span>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleCopy(item.id, item.pythonSnippet, e)}
                    className="p-1 hover:text-white text-slate-400 transition-colors"
                    title="Copiar chamada Python"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-[10px] text-amber-400/80 flex items-center font-sans">
                    Restaurar <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>

              <div className="font-mono text-[10px] text-slate-500 truncate pt-1 border-t border-slate-900">
                <code>{item.pythonSnippet}</code>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

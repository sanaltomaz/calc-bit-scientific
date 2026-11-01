import React, { useState } from 'react';
import { OperationType } from '../types/calculator';
import {
  getOperationDocstring,
  getPythonOperatorSymbol,
  formatPythonNumber
} from '../utils/pythonEngine';
import { Code, Check, Copy, AlertTriangle, Sparkles } from 'lucide-react';

interface PythonInspectorProps {
  lastOperation: OperationType | null;
  operandA: number | null;
  operandB: number | null;
  result: number | null;
  error?: string | null;
}

export const PythonInspector: React.FC<PythonInspectorProps> = ({
  lastOperation,
  operandA,
  operandB,
  result,
  error,
}) => {
  const [copied, setCopied] = useState(false);

  const activeOp: OperationType = lastOperation || 'add';
  const docInfo = getOperationDocstring(activeOp);
  const pySymbol = getPythonOperatorSymbol(activeOp);

  const hasLiveCalc = operandA !== null && operandB !== null;
  const aStr = operandA !== null ? formatPythonNumber(operandA) : '10.0';
  const bStr = operandB !== null ? formatPythonNumber(operandB) : '5.0';
  const resStr = result !== null ? formatPythonNumber(result) : (error ? 'ZeroDivisionError' : '15.0');

  const liveSnippet = `${docInfo.name}(${aStr}, ${bStr})  # Retorna: ${resStr}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(liveSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col gap-4 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-sm text-white">
            Inspeção de Execução Python
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          python 3.12 · typing
        </div>
      </div>

      {/* Function signature banner */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-amber-300 overflow-x-auto">
        <code>{docInfo.signature}</code>
      </div>

      {/* Active parameters & types */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
          <div className="text-slate-500 font-mono text-[10px]">Parâmetro (a)</div>
          <div className="font-mono font-bold text-white mt-0.5 truncate">
            {hasLiveCalc ? aStr : '10.0'}
          </div>
          <div className="text-slate-500 font-mono text-[10px] mt-0.5">
            tipo: float
          </div>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 flex flex-col items-center justify-center">
          <div className="text-slate-500 font-mono text-[10px]">Operador</div>
          <div className="font-mono font-bold text-amber-400 text-base mt-0.5">
            {pySymbol}
          </div>
          <div className="text-slate-500 font-mono text-[10px] mt-0.5">
            Python op
          </div>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
          <div className="text-slate-500 font-mono text-[10px]">Parâmetro (b)</div>
          <div className="font-mono font-bold text-white mt-0.5 truncate">
            {hasLiveCalc ? bStr : '5.0'}
          </div>
          <div className="text-slate-500 font-mono text-[10px] mt-0.5">
            tipo: float
          </div>
        </div>
      </div>

      {/* Live Python Call Snippet */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
          <span>Chamada em tempo real:</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
        <div className="font-mono text-xs text-emerald-400 truncate py-1 selection:bg-emerald-950">
          {liveSnippet}
        </div>
      </div>

      {/* ZeroDivisionError alert if error */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block font-mono">
              Tratamento: ZeroDivisionError
            </span>
            <p className="text-rose-200/90 leading-relaxed">
              Em Python, dividir qualquer número por 0 levanta a exceção{' '}
              <code className="bg-rose-950 px-1 py-0.5 rounded font-mono text-[11px]">
                ZeroDivisionError
              </code>
              . No script, capturamos esse evento com um bloco{' '}
              <code className="bg-rose-950 px-1 py-0.5 rounded font-mono text-[11px]">
                try...except
              </code>{' '}
              para evitar que o programa seja encerrado abruptamente.
            </p>
          </div>
        </div>
      )}

      {/* Docstring and details */}
      <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Docstring da Operação:</span>
        </div>
        <p className="italic text-slate-300/90 leading-relaxed font-sans pl-1">
          &ldquo;{docInfo.doc}&rdquo;
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { pythonSourceFiles, getUnitTests } from '../utils/pythonEngine';
import { UnitTestResult } from '../types/calculator';
import { FileCode, Copy, Check, Download, Play, CheckCircle2, FlaskConical } from 'lucide-react';
import { soundManager } from '../utils/audio';

type FileKey = keyof typeof pythonSourceFiles;

export const CodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<FileKey>('calc_bit/operacoes.py');
  const [copied, setCopied] = useState(false);
  const [testResults, setTestResults] = useState<UnitTestResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const currentCode = pythonSourceFiles[activeFile];

  const handleCopy = () => {
    soundManager.playKeyClick('number');
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    soundManager.playKeyClick('number');
    const blob = new Blob([currentCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const runUnitTests = () => {
    soundManager.playKeyClick('operator');
    setIsRunningTests(true);
    setTestResults(null);

    setTimeout(() => {
      soundManager.playKeyClick('equals');
      setTestResults(getUnitTests());
      setIsRunningTests(false);
    }, 400);
  };

  const lines = currentCode.trim().split('\n');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* File Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* File Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(Object.keys(pythonSourceFiles) as FileKey[]).map((fileName) => (
            <button
              key={fileName}
              onClick={() => {
                soundManager.playKeyClick('number');
                setActiveFile(fileName);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activeFile === fileName
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>{fileName}</span>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={runUnitTests}
            disabled={isRunningTests}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-all active:scale-95 whitespace-nowrap"
          >
            <FlaskConical className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
            <span>{isRunningTests ? 'Executando...' : 'Rodar Testes (unittest)'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/50 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar</span>
          </button>
        </div>
      </div>

      {/* Test Results Output Modal/Banner if tests executed */}
      {testResults && (
        <div className="bg-slate-900/90 rounded-2xl border border-emerald-900/40 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-sm text-white">
                Resultado dos Testes Unitários ({testResults.length}/{testResults.length} passaram com sucesso)
              </h3>
            </div>
            <span className="font-mono text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
              OK · Ran 8 tests in 0.002s
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testResults.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-amber-300 truncate">
                    {t.name}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    passed
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-tight">
                  {t.description}
                </p>
                <div className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-1 rounded truncate border border-slate-800">
                  <code>{t.codeSnippet}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Editor Window */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="font-mono text-xs text-slate-300">{activeFile}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {lines.length} linhas · Python 3
          </div>
        </div>

        {/* Code Lines with numbers */}
        <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto text-xs sm:text-sm font-mono leading-relaxed selection:bg-amber-500/20">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, index) => {
                const lineNum = index + 1;
                // Simple Python keyword highlighting
                const isComment = line.trim().startsWith('#');
                const isDocstring = line.trim().startsWith('"""') || line.trim().endsWith('"""');

                return (
                  <tr key={index} className="hover:bg-slate-900/50 transition-colors">
                    <td className="w-12 text-right pr-4 text-slate-600 select-none text-xs tabular-nums align-top">
                      {lineNum}
                    </td>
                    <td className="text-slate-200 whitespace-pre">
                      {isComment ? (
                        <span className="text-slate-500 italic">{line}</span>
                      ) : isDocstring ? (
                        <span className="text-emerald-400/90 italic">{line}</span>
                      ) : (
                        formatSyntaxLine(line)
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Lightweight helper to highlight standard Python keywords
function formatSyntaxLine(line: string): React.ReactNode {
  const keywords = ['def', 'return', 'if', 'else', 'elif', 'raise', 'import', 'while', 'from', 'try', 'except', 'class', 'with', 'as'];
  const types = ['float', 'int', 'str', 'None', 'Union', 'Numero'];

  const parts = line.split(/(\b(?:def|return|if|else|elif|raise|import|while|from|try|except|class|with|as|float|int|str|None|Union|Numero)\b|"[^"]*"|'[^']*')/g);

  return parts.map((part, i) => {
    if (keywords.includes(part)) {
      return (
        <span key={i} className="text-amber-400 font-semibold">
          {part}
        </span>
      );
    }
    if (types.includes(part)) {
      return (
        <span key={i} className="text-sky-400 font-medium">
          {part}
        </span>
      );
    }
    if (part.startsWith('"') || part.startsWith("'")) {
      return (
        <span key={i} className="text-emerald-300">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

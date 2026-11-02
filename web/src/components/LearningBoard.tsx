import React, { useState, useEffect, useCallback } from 'react';
import { ResolutionReport } from '../types/calculator';
import { resolverPassoAPasso, formatPythonNumber } from '../utils/pythonEngine';
import { soundManager } from '../utils/audio';
import {
  Sparkles,
  Play,
  RotateCcw,
  Delete,
  BookOpen,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
} from 'lucide-react';

interface PresetExample {
  label: string;
  expr: string;
  tag: string;
}

const PRESET_EXAMPLES: PresetExample[] = [
  {
    label: 'Parênteses vs Multiplicação',
    expr: '2 + 3 * (4 + 5)',
    tag: 'PEMDAS Básico',
  },
  {
    label: 'Potência & Divisão',
    expr: '(10 - 2) ^ 2 / 4',
    tag: 'Expoentes',
  },
  {
    label: 'Funções Científicas',
    expr: 'sqrt(16) + fatorial(4) * 2',
    tag: 'Científica',
  },
  {
    label: 'Parênteses Aninhados',
    expr: '((2 + 3) * 4 - 5) / 3',
    tag: 'Aninhado',
  },
  {
    label: 'Divisão por Zero',
    expr: '10 / (5 - 5)',
    tag: 'Erro Didático',
  },
];

/**
 * Destaca visualmente a primeira ocorrência da sub-expressão `alvo` dentro de `texto`.
 */
function renderHighlightedExpression(texto: string, alvo: string) {
  if (!alvo) return <span>{texto}</span>;
  const idx = texto.indexOf(alvo);
  if (idx === -1) {
    return <span>{texto}</span>;
  }
  const antes = texto.slice(0, idx);
  const meio = texto.slice(idx, idx + alvo.length);
  const depois = texto.slice(idx + alvo.length);

  return (
    <>
      <span className="text-[#cbd5e1]">{antes}</span>
      <span className="px-1.5 py-0.5 mx-0.5 rounded bg-[#fbbf24]/25 border border-[#fbbf24] text-[#fde047] font-bold shadow-[0_0_10px_rgba(251,191,36,0.25)]">
        {meio}
      </span>
      <span className="text-[#cbd5e1]">{depois}</span>
    </>
  );
}

export const LearningBoard: React.FC = () => {
  const [exprInput, setExprInput] = useState<string>('2 + 3 * (4 + 5)');
  const [report, setReport] = useState<ResolutionReport>(() =>
    resolverPassoAPasso('2 + 3 * (4 + 5)')
  );
  const [animKey, setAnimKey] = useState<number>(1);
  const [visibleSteps, setVisibleSteps] = useState<number>(99);
  const [showSciKeys, setShowSciKeys] = useState<boolean>(false);

  // Dispara a resolução com animação em cascata de todos os passos
  const triggerSolve = useCallback((targetExpr: string) => {
    const res = resolverPassoAPasso(targetExpr);
    setReport(res);
    setAnimKey((prev) => prev + 1);

    if (!res.sucesso) {
      soundManager.playKeyClick('error');
      setVisibleSteps(res.etapas.length + 1);
      return;
    }

    soundManager.playKeyClick('equals');
    setVisibleSteps(0);
  }, []);

  // Efeito cascata que revela os passos sequencialmente de uma só vez
  useEffect(() => {
    const total = report.etapas.length + 1;
    if (visibleSteps >= total) return;

    const timer = setTimeout(() => {
      setVisibleSteps((v) => v + 1);
    }, 150);

    return () => clearTimeout(timer);
  }, [visibleSteps, report.etapas.length]);

  const appendToken = (token: string) => {
    soundManager.playKeyClick('number');
    setExprInput((prev) => {
      if (prev === '0' && /^[0-9(]$/.test(token)) {
        return token;
      }
      return prev + token;
    });
  };

  const handleBackspace = () => {
    soundManager.playKeyClick('number');
    setExprInput((prev) => {
      // Se terminar com chamada de função como 'sqrt(', remove o token inteiro
      const fnMatch = prev.match(/(sqrt|fatorial|sin|cos|tan|log10|ln)\($/);
      if (fnMatch) {
        return prev.slice(0, -fnMatch[0].length);
      }
      return prev.length > 0 ? prev.slice(0, -1) : '';
    });
  };

  const handleClear = () => {
    soundManager.playKeyClick('clear');
    setExprInput('');
    setReport(resolverPassoAPasso(''));
  };

  // Conta parênteses abertos para ajudar o usuário
  const openParensCount =
    (exprInput.match(/\(/g) || []).length - (exprInput.match(/\)/g) || []).length;

  return (
    <div className="w-full max-w-6xl mx-auto py-1 sm:py-3 select-none">
      {/* ================= CONSOLE HÍBRIDO: JOY-CON ESQUERDO + LOUSA DIGITAL ================= */}
      <div className="flex flex-col lg:flex-row items-stretch justify-center w-full shadow-[10px_10px_0px_0px_#0b0a12]">
        {/* ================= LADO ESQUERDO: JOY-CON RETRÔ ACOPLADO ================= */}
        <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 bg-[#0891b2] border-4 border-[#12111c] rounded-t-3xl lg:rounded-l-[36px] lg:rounded-tr-none p-4 sm:p-5 flex flex-col justify-between gap-3.5 relative z-20 shadow-inner">
          {/* Detalhe Superior: Botão '-' do Joy-Con & Indicador LED */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              {/* Botão Minus físico do Joy-Con */}
              <div className="w-5 h-2 bg-[#1e293b] border-2 border-black rounded-sm shadow-[1px_1px_0px_0px_#000]" />
              <span className="font-arcade text-[9px] text-[#ecfeff] tracking-wider drop-shadow-[1px_1px_0px_#000]">
                JOY-CALC L
              </span>
            </div>

            <button
              onClick={() => {
                soundManager.playKeyClick('operator');
                setShowSciKeys((prev) => !prev);
              }}
              className={`font-arcade text-[8px] px-2 py-1 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 cursor-pointer ${
                showSciKeys
                  ? 'bg-[#fbbf24] text-black font-bold'
                  : 'bg-[#164e63] text-[#cffafe] hover:bg-[#155e75]'
              }`}
              title="Alternar funções científicas no Joy-Con"
            >
              <Cpu className="w-3 h-3" />
              <span>{showSciKeys ? 'BÁSICO' : '+FUNÇÕES'}</span>
            </button>
          </div>

          {/* Mini Visor de Entrada da Expressão no Joy-Con */}
          <div className="bg-[#0f172a] border-4 border-black rounded-2xl p-3 shadow-inner flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[9px] font-arcade text-[#38bdf8]">
              <span>EXPRESSÃO</span>
              <span
                className={
                  openParensCount === 0
                    ? 'text-[#10b981]'
                    : openParensCount > 0
                    ? 'text-[#fbbf24]'
                    : 'text-[#f43f5e]'
                }
              >
                {openParensCount === 0
                  ? '( ) OK'
                  : openParensCount > 0
                  ? `FALTA ${openParensCount} ')'`
                  : `')' EXTRA`}
              </span>
            </div>

            <input
              type="text"
              value={exprInput}
              onChange={(e) => setExprInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  triggerSolve(exprInput);
                }
              }}
              placeholder="Ex: 2 + 3 * (4 + 5)"
              aria-label="Expressão matemática"
              className="w-full bg-[#1e293b] text-[#f8fafc] font-pixel text-sm sm:text-base px-2.5 py-2 rounded-lg border-2 border-black focus:outline-none focus:border-[#fbbf24] tracking-wide"
            />
          </div>

          {/* Gaveta de Funções Científicas (Opcional no Joy-Con) */}
          {showSciKeys && (
            <div className="bg-[#164e63] border-2 border-black rounded-xl p-2 grid grid-cols-4 gap-1.5">
              {[
                { label: '√(', token: 'sqrt(', title: 'Raiz Quadrada' },
                { label: 'n!', token: 'fatorial(', title: 'Fatorial' },
                { label: 'xʸ', token: ' ^ ', title: 'Potência' },
                { label: 'mod', token: ' % ', title: 'Módulo (Resto)' },
                { label: 'sin(', token: 'sin(', title: 'Seno (graus)' },
                { label: 'cos(', token: 'cos(', title: 'Cosseno (graus)' },
                { label: 'log(', token: 'log10(', title: 'Log base 10' },
                { label: 'π', token: 'π', title: 'Constante Pi' },
              ].map((fn) => (
                <button
                  key={fn.label}
                  onClick={() => appendToken(fn.token)}
                  title={fn.title}
                  className="h-8 bg-[#0f172a] hover:bg-[#1e293b] text-[#38bdf8] border-2 border-black rounded font-arcade text-[9px] pixel-btn-action flex items-center justify-center cursor-pointer"
                >
                  {fn.label}
                </button>
              ))}
            </div>
          )}

          {/* Teclado Físico do Joy-Con com Suporte a Parênteses ( ) */}
          <div className="grid grid-cols-4 gap-2">
            {/* Linha 1: C, (, ), DEL */}
            <button
              onClick={handleClear}
              className="h-11 bg-[#e11d48] hover:bg-[#be123c] text-white border-2 border-black rounded-xl font-arcade text-xs pixel-btn-action flex items-center justify-center cursor-pointer"
              title="Limpar expressão"
            >
              C
            </button>

            <button
              onClick={() => appendToken('(')}
              className="h-11 bg-[#fbbf24] hover:bg-[#f59e0b] text-black border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              title="Abrir parênteses ("
            >
              (
            </button>

            <button
              onClick={() => appendToken(')')}
              className="h-11 bg-[#fbbf24] hover:bg-[#f59e0b] text-black border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              title="Fechar parênteses )"
            >
              )
            </button>

            <button
              onClick={handleBackspace}
              className="h-11 bg-[#1e293b] hover:bg-[#334155] text-[#e2e8f0] border-2 border-black rounded-xl font-arcade text-xs pixel-btn-action flex items-center justify-center cursor-pointer"
              title="Apagar último caractere"
            >
              <Delete className="w-4 h-4" />
            </button>

            {/* Linha 2: 7, 8, 9, / */}
            {['7', '8', '9'].map((d) => (
              <button
                key={d}
                onClick={() => appendToken(d)}
                className="h-11 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => appendToken(' / ')}
              className="h-11 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              title="Divisão (/)"
            >
              ÷
            </button>

            {/* Linha 3: 4, 5, 6, * */}
            {['4', '5', '6'].map((d) => (
              <button
                key={d}
                onClick={() => appendToken(d)}
                className="h-11 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => appendToken(' * ')}
              className="h-11 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              title="Multiplicação (*)"
            >
              ×
            </button>

            {/* Linha 4: 1, 2, 3, - */}
            {['1', '2', '3'].map((d) => (
              <button
                key={d}
                onClick={() => appendToken(d)}
                className="h-11 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => appendToken(' - ')}
              className="h-11 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              title="Subtração (-)"
            >
              -
            </button>

            {/* Linha 5: 0, ., ^, + */}
            <button
              onClick={() => appendToken('0')}
              className="h-11 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
            >
              0
            </button>
            <button
              onClick={() => appendToken('.')}
              className="h-11 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
            >
              .
            </button>
            <button
              onClick={() => appendToken(' ^ ')}
              className="h-11 bg-[#1e293b] hover:bg-[#334155] text-[#fbbf24] border-2 border-black rounded-xl font-arcade text-xs font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              title="Potência (^)"
            >
              xʸ
            </button>
            <button
              onClick={() => appendToken(' + ')}
              className="h-11 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-xl font-arcade text-sm font-bold pixel-btn-action flex items-center justify-center cursor-pointer"
              title="Adição (+)"
            >
              +
            </button>
          </div>

          {/* Botão Principal de Resolver na Lousa */}
          <button
            onClick={() => triggerSolve(exprInput)}
            className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-[#052e16] border-2 border-black rounded-2xl font-arcade text-xs sm:text-sm font-bold pixel-btn-action flex items-center justify-center gap-2 shadow-[0_4px_0_0_#064e3b] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESOLVER NA LOUSA</span>
          </button>

          {/* Trilho Metálico de Encaixe Lateral do Switch (Desktop) */}
          <div className="hidden lg:flex flex-col justify-between items-center absolute -right-2 top-8 bottom-8 w-3 bg-[#1e293b] border-2 border-black rounded-sm z-30">
            <span className="w-1.5 h-4 bg-[#475569] rounded-full mt-2" />
            <span className="w-1.5 h-8 bg-[#10b981] rounded-full animate-pulse" />
            <span className="w-1.5 h-4 bg-[#475569] rounded-full mb-2" />
          </div>
        </div>

        {/* ================= LADO DIREITO: LOUSA DIGITAL DE APRENDIZADO ================= */}
        <div className="flex-1 bg-[#2b231d] border-4 border-t-0 lg:border-t-4 lg:border-l-0 border-[#12111c] rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none p-3 sm:p-5 flex flex-col justify-between gap-4">
          {/* Superfície Verde-Escura da Lousa Escolar / Quadro Negro Digital */}
          <div className="flex-1 bg-[#11261b] border-4 border-[#09150f] rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-4 relative overflow-hidden shadow-inner">
            {/* Cabeçalho da Lousa + Exemplos Rápidos */}
            <div className="flex flex-col gap-3 border-b-2 border-[#1e3f2d] pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#fbbf24]" />
                  <h2 className="font-arcade text-xs sm:text-sm text-[#fef08a] tracking-wider">
                    LOUSA DE RESOLUÇÃO PEMDAS
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerSolve(exprInput)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#1e3f2d] hover:bg-[#27523b] text-[#a7f3d0] border border-[#34d399]/40 rounded font-pixel text-xs transition-colors cursor-pointer"
                    title="Reanimar passo a passo"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reanimar</span>
                  </button>
                </div>
              </div>

              {/* Barra de Exemplos Didáticos para Testar com 1 Clique */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="font-arcade text-[9px] text-[#6ee7b7] shrink-0 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3 h-3 text-[#fbbf24]" />
                  EXEMPLOS:
                </span>
                {PRESET_EXAMPLES.map((preset) => (
                  <button
                    key={preset.expr}
                    onClick={() => {
                      setExprInput(preset.expr);
                      triggerSolve(preset.expr);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-left font-pixel text-xs transition-all shrink-0 cursor-pointer ${
                      exprInput === preset.expr
                        ? 'bg-[#fbbf24] text-black border-black font-bold shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-[#173325] hover:bg-[#1e4230] text-[#d1fae5] border-[#2d5a43]'
                    }`}
                  >
                    <span>{preset.expr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Corpo da Lousa: Equação Inicial + Lista Completa de Passos em Cascata */}
            <div key={animKey} className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 max-h-[480px]">
              {/* Quadro da Expressão Original */}
              <div className="bg-[#0b1911] border-2 border-[#1e3f2d] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-arcade text-[9px] px-2 py-0.5 bg-[#1e3f2d] text-[#6ee7b7] rounded">
                    EQUAÇÃO
                  </span>
                  <span className="font-pixel text-base sm:text-lg text-white tracking-wider">
                    {report.expressaoOriginal || '—'}
                  </span>
                </div>
                <span className="font-pixel text-xs text-[#94a3b8]">
                  Ordem: 1º Parênteses ( ) &rarr; 2º Funções/Potências &rarr; 3º × e ÷ &rarr; 4º + e -
                </span>
              </div>

              {/* Caso haja erro de sintaxe ou matemático (ex: Divisão por Zero) */}
              {!report.sucesso && (
                <div className="bg-[#3b1219] border-2 border-[#f43f5e] rounded-xl p-4 flex flex-col gap-2 text-[#ffe4e6] animate-fadeIn">
                  <div className="flex items-center gap-2 font-arcade text-xs text-[#fda4af]">
                    <AlertTriangle className="w-4 h-4 text-[#f43f5e] shrink-0" />
                    <span>ATENÇÃO NA LOUSA: {report.erro}</span>
                  </div>
                  {report.explicacaoErro && (
                    <p className="font-pixel text-xs sm:text-sm text-[#fecdd3] leading-relaxed">
                      {report.explicacaoErro}
                    </p>
                  )}
                </div>
              )}

              {/* Lista de Etapas de Resolução (Exibidas em Cascata) */}
              {report.etapas.length > 0 ? (
                <div className="space-y-3">
                  {report.etapas.map((step, index) => {
                    const isVisible = index < visibleSteps;
                    return (
                      <div
                        key={step.ordem}
                        className={`bg-[#152f22] border-2 border-[#28543d] rounded-xl p-3.5 transition-all duration-500 ${
                          isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-3 pointer-events-none'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#234834] pb-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-arcade text-[10px] px-2 py-0.5 bg-[#fbbf24] text-black rounded font-bold">
                              PASSO {step.ordem}
                            </span>
                            <span className="font-pixel text-sm sm:text-base text-white">
                              {renderHighlightedExpression(
                                step.expressaoAntes,
                                step.operacaoAtual
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 font-pixel text-xs bg-[#0b1911] px-2.5 py-1 rounded border border-[#1e3f2d]">
                            <span className="text-[#94a3b8]">Resolve:</span>
                            <span className="text-[#fde047] font-bold">{step.operacaoAtual}</span>
                            <span className="text-[#94a3b8]">=</span>
                            <span className="text-[#34d399] font-bold">
                              {formatPythonNumber(step.resultadoParcial)}
                            </span>
                          </div>
                        </div>

                        {/* Explicação Pedagógica (Por que esta operação foi escolhida) + Função Python */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-pixel">
                          <div className="text-[#d1fae5] flex items-start gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#34d399] shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-[#6ee7b7]">Regra:</strong>{' '}
                              {step.regraAplicada}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[#38bdf8] bg-[#0b1911] px-2 py-0.5 rounded border border-[#1e3a8a]/50 shrink-0">
                            <Code2 className="w-3.5 h-3.5" />
                            <span>{step.dicaPython}</span>
                          </div>
                        </div>

                        {/* Como a equação fica após este passo */}
                        <div className="mt-2 pt-1.5 border-t border-[#1e3f2d]/60 flex items-center justify-between text-xs font-pixel text-[#a7f3d0]">
                          <span>Restante na lousa:</span>
                          <span className="font-bold text-sm text-white tracking-wide">
                            = {step.expressaoDepois}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                report.sucesso && (
                  <div className="bg-[#152f22] border-2 border-[#28543d] rounded-xl p-4 text-center font-pixel text-sm text-[#a7f3d0]">
                    O número digitado já está simplificado! Adicione operadores (+, -, *, /) ou
                    parênteses ( ) para ver as etapas.
                  </div>
                )
              )}

              {/* Resultado Final Destacado em Giz Verde */}
              {report.sucesso && report.resultadoFinal !== null && (
                <div
                  className={`bg-[#0b1911] border-2 border-[#10b981] rounded-xl p-4 flex items-center justify-between transition-all duration-500 ${
                    visibleSteps >= report.etapas.length
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <div className="font-arcade text-[10px] text-[#6ee7b7]">
                        RESULTADO FINAL NA LOUSA
                      </div>
                      <div className="font-pixel text-xs text-[#94a3b8]">
                        Resolvido em {report.etapas.length} etapa(s) seguindo a precedência PEMDAS
                      </div>
                    </div>
                  </div>

                  <div className="font-arcade text-xl sm:text-2xl text-[#34d399] font-bold tracking-tight">
                    = {formatPythonNumber(report.resultadoFinal)}
                  </div>
                </div>
              )}
            </div>

            {/* Bandeja de Giz na Base da Lousa */}
            <div className="border-t-2 border-[#1e3f2d] pt-2.5 flex items-center justify-between text-[10px] font-pixel text-[#6ee7b7]">
              <div className="flex items-center gap-3">
                <span className="inline-block w-8 h-2 bg-[#f8fafc] rounded-sm border border-black/40" />
                <span className="inline-block w-6 h-2 bg-[#fde047] rounded-sm border border-black/40" />
                <span className="inline-block w-7 h-2 bg-[#38bdf8] rounded-sm border border-black/40" />
                <span className="hidden sm:inline text-[#94a3b8]">
                  calc_bit.passo_a_passo.resolver_passo_a_passo()
                </span>
              </div>
              <span className="font-arcade text-[8px] text-[#a7f3d0]">SLATE-SWITCH 16-BIT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

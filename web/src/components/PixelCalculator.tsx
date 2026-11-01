import React, { useState } from 'react';
import {
  OperationType,
  UnaryOperationType,
  ConstantType,
  CalculationRecord,
} from '../types/calculator';
import { getFunctionName, formatPythonNumber } from '../utils/pythonEngine';
import { soundManager } from '../utils/audio';
import {
  History,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Cpu,
} from 'lucide-react';

interface PixelCalculatorProps {
  currentValue: string;
  previousValue: number | null;
  activeOperator: OperationType | null;
  expression: string;
  error: string | null;
  onDigit: (digit: string) => void;
  onOperator: (op: OperationType) => void;
  onUnaryOperator: (op: UnaryOperationType) => void;
  onConstant: (constant: ConstantType) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  history: CalculationRecord[];
  onSelectRecord: (record: CalculationRecord) => void;
}

type PaletteMode = 'gameboy' | 'amber' | 'cyber';

const OPERATION_LABELS: Record<string, string> = {
  pi: 'Constante Pi (π ≈ 3.14159)',
  e: 'Constante de Euler (e ≈ 2.71828)',
  square: 'Quadrado (x²)',
  power: 'Potência (xʸ)',
  sqrt: 'Raiz Quadrada (√x)',
  factorial: 'Fatorial (n!)',
  modulo: 'Resto da Divisão (mod)',
  percent: 'Porcentagem (%)',
  sin: 'Seno em Graus (sin)',
  cos: 'Cosseno em Graus (cos)',
  tan: 'Tangente em Graus (tan)',
  log10: 'Logaritmo Base 10 (log)',
  ln: 'Logaritmo Natural (ln)',
};

export const PixelCalculator: React.FC<PixelCalculatorProps> = ({
  currentValue,
  previousValue,
  activeOperator,
  expression,
  error,
  onDigit,
  onOperator,
  onUnaryOperator,
  onConstant,
  onEquals,
  onClear,
  onBackspace,
  onToggleSign,
  history,
  onSelectRecord,
}) => {
  const [palette, setPalette] = useState<PaletteMode>('gameboy');
  const [showHistory, setShowHistory] = useState(false);
  const [scientificOpen, setScientificOpen] = useState(false);
  const [activeHint, setActiveHint] = useState<string>('Selecione uma função científica');

  // Paleta de cores 16-bit para a tela LCD
  const lcdStyles = {
    gameboy: {
      bg: 'bg-[#9bbc0f]',
      text: 'text-[#0f380f]',
      dimText: 'text-[#306230]',
      border: 'border-[#8bac0f]',
      label: 'Game Boy',
    },
    amber: {
      bg: 'bg-[#1c140a]',
      text: 'text-[#fbbf24]',
      dimText: 'text-[#b45309]',
      border: 'border-[#78350f]',
      label: 'CRT Âmbar',
    },
    cyber: {
      bg: 'bg-[#081820]',
      text: 'text-[#38bdf8]',
      dimText: 'text-[#0369a1]',
      border: 'border-[#0c4a6e]',
      label: 'Cyber Bit',
    },
  }[palette];

  const currentPythonFunc = activeOperator ? getFunctionName(activeOperator) : null;

  const toggleScientificWing = () => {
    soundManager.playKeyClick('operator');
    setScientificOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-2 sm:py-4 select-none">
      {/* Console Wrapper: Main Unit + Smooth Animated Lateral Expansion Wing */}
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center w-full max-w-4xl relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        {/* ================= UNIDADE PRINCIPAL (HANDHELD CONSOLE) ================= */}
        <div
          className={`w-full max-w-[380px] sm:max-w-[410px] bg-[#2d2b42] border-4 border-[#12111c] p-4 sm:p-6 shadow-[8px_8px_0px_0px_#0e0d16] flex flex-col gap-4 relative z-20 transition-[border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scientificOpen ? 'rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none' : 'rounded-2xl'
          }`}
        >
          {/* Top Plate: Brand, Power LEDs, LCD Switcher & SCI Expansion Trigger */}
          <div className="flex items-center justify-between gap-2 px-1 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <span className="w-2 h-2 bg-[#e11d48] border border-black inline-block" />
                <span className="w-2 h-2 bg-[#fbbf24] border border-black inline-block" />
                <span className="w-2 h-2 bg-[#38bdf8] border border-black inline-block" />
              </div>
              <span className="font-arcade text-[10px] sm:text-xs text-[#a5a1c2] tracking-wider">
                CALC BIT
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* LCD Palette Switcher */}
              <button
                onClick={() => {
                  soundManager.playKeyClick('number');
                  setPalette((p) =>
                    p === 'gameboy' ? 'amber' : p === 'amber' ? 'cyber' : 'gameboy'
                  );
                }}
                className="font-pixel text-[9px] px-2 py-0.5 bg-[#1b1a29] text-[#fbbf24] border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all uppercase cursor-pointer"
                title="Alternar paleta da tela LCD"
              >
                {lcdStyles.label}
              </button>

              {/* Top Toggle Button for Scientific Expansion Wing */}
              <button
                onClick={toggleScientificWing}
                className={`font-arcade text-[9px] px-2.5 py-1 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  scientificOpen
                    ? 'bg-[#10b981] text-[#052e16] font-bold'
                    : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                }`}
                title="Abrir/Fechar Aba Científica Lateral"
              >
                <Cpu className="w-3 h-3" />
                <span>SCI</span>
                <ChevronRight
                  className={`w-3 h-3 transition-transform duration-500 ${
                    scientificOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 16-bit LCD Screen Frame */}
          <div className="bg-[#181724] border-4 border-[#0c0c14] rounded-xl p-3 shadow-inner">
            <div
              className={`w-full ${lcdStyles.bg} border-2 ${lcdStyles.border} rounded-lg p-3 sm:p-4 min-h-[115px] flex flex-col justify-between relative overflow-hidden scanlines shadow-inner transition-colors duration-300`}
            >
              {/* Top row: Status ticker & expression */}
              <div className="flex items-center justify-between font-arcade text-[9px] sm:text-[10px] gap-2">
                <span className={`${lcdStyles.dimText} uppercase truncate max-w-[140px]`}>
                  {error
                    ? '! ERRO !'
                    : currentPythonFunc
                    ? `[${currentPythonFunc}]`
                    : scientificOpen
                    ? 'SCI MODE'
                    : 'READY'}
                </span>
                <span className={`${lcdStyles.dimText} tracking-wider truncate max-w-[190px]`}>
                  {expression || '\u00A0'}
                </span>
              </div>

              {/* Main Value Display */}
              <div className="text-right py-1">
                {error ? (
                  <div className="font-arcade text-[11px] sm:text-xs text-[#e11d48] font-bold tracking-tight truncate">
                    {error.replace(/^(ZeroDivisionError|ValueError):\s*/i, '')}
                  </div>
                ) : (
                  <div
                    className={`font-arcade font-bold tracking-tighter ${lcdStyles.text} transition-all break-all ${
                      currentValue.length > 12
                        ? 'text-base sm:text-lg'
                        : currentValue.length > 8
                        ? 'text-xl sm:text-2xl'
                        : 'text-2xl sm:text-3xl'
                    }`}
                  >
                    {currentValue}
                  </div>
                )}
              </div>

              {/* Bottom LCD Ticker: Python Real-Time Operation */}
              <div className="border-t border-black/20 pt-1 flex items-center justify-between font-pixel text-[9px] sm:text-[10px]">
                <span className={`${lcdStyles.dimText}`}>
                  {scientificOpen ? 'CIENTÍFICA' : 'BÁSICA'}
                </span>
                <span className={`${lcdStyles.text} font-bold truncate max-w-[230px]`}>
                  {activeOperator && previousValue !== null
                    ? `${getFunctionName(activeOperator)}(${formatPythonNumber(
                        previousValue
                      )}, ${currentValue})`
                    : scientificOpen
                    ? 'GRAUS (DEG) ATIVO'
                    : '4 OPERAÇÕES'}
                </span>
              </div>
            </div>
          </div>

          {/* Conventional 4x5 Keypad Grid with 16-bit Pixel Buttons */}
          <div className="grid grid-cols-4 gap-2.5 pt-1">
            {/* Row 1: Clear, DEL, Sign, Divide */}
            <button
              onClick={onClear}
              className="h-12 sm:h-14 bg-[#be123c] hover:bg-[#9f1239] text-[#ffe4e6] border-2 border-black rounded-lg font-arcade text-xs sm:text-sm pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
              title="Limpar tudo (Esc)"
            >
              <span>C</span>
            </button>

            <button
              onClick={onBackspace}
              className="h-12 sm:h-14 bg-[#3f3c56] hover:bg-[#343147] text-[#e2e0ed] border-2 border-black rounded-lg font-arcade text-xs sm:text-sm pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
              title="Apagar dígito"
            >
              <span>DEL</span>
            </button>

            <button
              onClick={onToggleSign}
              className="h-12 sm:h-14 bg-[#3f3c56] hover:bg-[#343147] text-[#e2e0ed] border-2 border-black rounded-lg font-arcade text-xs sm:text-sm pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
              title="Inverter sinal (±)"
            >
              <span>+/-</span>
            </button>

            <button
              onClick={() => onOperator('divide')}
              className={`h-12 sm:h-14 border-2 border-black rounded-lg font-arcade text-sm sm:text-base pixel-btn-action flex items-center justify-center cursor-pointer ${
                activeOperator === 'divide'
                  ? 'bg-[#fbbf24] text-black font-bold'
                  : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
              }`}
              title="Divisão: dividir(a, b)"
            >
              /
            </button>

            {/* Row 2: 7, 8, 9, Multiply */}
            {['7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => onDigit(digit)}
                className="h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold cursor-pointer"
              >
                {digit}
              </button>
            ))}

            <button
              onClick={() => onOperator('multiply')}
              className={`h-12 sm:h-14 border-2 border-black rounded-lg font-arcade text-sm sm:text-base pixel-btn-action flex items-center justify-center cursor-pointer ${
                activeOperator === 'multiply'
                  ? 'bg-[#fbbf24] text-black font-bold'
                  : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
              }`}
              title="Multiplicação: multiplicar(a, b)"
            >
              *
            </button>

            {/* Row 3: 4, 5, 6, Subtract */}
            {['4', '5', '6'].map((digit) => (
              <button
                key={digit}
                onClick={() => onDigit(digit)}
                className="h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold cursor-pointer"
              >
                {digit}
              </button>
            ))}

            <button
              onClick={() => onOperator('subtract')}
              className={`h-12 sm:h-14 border-2 border-black rounded-lg font-arcade text-sm sm:text-base pixel-btn-action flex items-center justify-center cursor-pointer ${
                activeOperator === 'subtract'
                  ? 'bg-[#fbbf24] text-black font-bold'
                  : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
              }`}
              title="Subtração: subtrair(a, b)"
            >
              -
            </button>

            {/* Row 4: 1, 2, 3, Add */}
            {['1', '2', '3'].map((digit) => (
              <button
                key={digit}
                onClick={() => onDigit(digit)}
                className="h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold cursor-pointer"
              >
                {digit}
              </button>
            ))}

            <button
              onClick={() => onOperator('add')}
              className={`h-12 sm:h-14 border-2 border-black rounded-lg font-arcade text-sm sm:text-base pixel-btn-action flex items-center justify-center cursor-pointer ${
                activeOperator === 'add'
                  ? 'bg-[#fbbf24] text-black font-bold'
                  : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
              }`}
              title="Adição: somar(a, b)"
            >
              +
            </button>

            {/* Row 5: 0 (col-span-2), Decimal, Equals */}
            <button
              onClick={() => onDigit('0')}
              className="col-span-2 h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold cursor-pointer"
            >
              0
            </button>

            <button
              onClick={() => onDigit('.')}
              className="h-12 sm:h-14 bg-[#e2e0ed] hover:bg-[#d1cfe0] text-[#1e1b2e] border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold cursor-pointer"
              title="Ponto decimal"
            >
              .
            </button>

            <button
              onClick={onEquals}
              className="h-12 sm:h-14 bg-[#10b981] hover:bg-[#059669] text-white border-2 border-black rounded-lg font-arcade text-base sm:text-lg pixel-btn-action flex items-center justify-center font-bold shadow-[0_4px_0_0_#064e3b] cursor-pointer"
              title="Calcular (Enter)"
            >
              =
            </button>
          </div>

          {/* Collapsible History Drawer Bar */}
          <div className="border-t-2 border-[#1c1a2c] pt-2">
            <button
              onClick={() => {
                soundManager.playKeyClick('number');
                setShowHistory(!showHistory);
              }}
              className="w-full flex items-center justify-between text-[#a5a1c2] hover:text-white font-pixel text-xs py-1 px-1 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>Histórico ({history.length})</span>
              </div>
              {showHistory ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showHistory ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="bg-[#1b1928] border-2 border-black rounded-lg p-2 max-h-36 overflow-y-auto space-y-1.5">
                  {history.length === 0 ? (
                    <div className="text-center py-3 text-[11px] text-[#7d799b] font-pixel">
                      Nenhuma conta realizada ainda.
                    </div>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          soundManager.playKeyClick('number');
                          onSelectRecord(item);
                        }}
                        className="p-1.5 bg-[#252336] hover:bg-[#302c46] border border-black rounded flex items-center justify-between cursor-pointer font-pixel text-xs gap-2"
                      >
                        <span className="text-[#a5a1c2] truncate max-w-[160px]">
                          {item.pythonSnippet}
                        </span>
                        <span className="font-bold text-[#10b981] shrink-0">
                          {item.error ? '!ERRO!' : `= ${formatPythonNumber(item.result ?? 0)}`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Physical Side Latch Tab on Desktop when closed */}
          <button
            onClick={toggleScientificWing}
            className={`hidden lg:flex flex-col items-center justify-center gap-2 absolute -right-9 top-24 w-9 h-36 bg-[#232136] hover:bg-[#2d2b42] border-4 border-l-0 border-[#12111c] rounded-r-xl shadow-[6px_6px_0px_0px_#0e0d16] text-[#fbbf24] transition-all duration-300 group cursor-pointer ${
              scientificOpen
                ? 'opacity-0 pointer-events-none translate-x-2'
                : 'opacity-100 translate-x-0'
            }`}
            title="Expandir Módulo Científico Lateral"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] border border-black" />
            <span className="font-arcade text-[9px] [writing-mode:vertical-rl] tracking-widest text-[#e2e0ed] group-hover:text-[#fbbf24]">
              SCI-PACK
            </span>
            <ChevronRight className="w-4 h-4 text-[#fbbf24] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* ================= ABA LATERAL ACOPLADA COM TRANSIÇÃO SUAVE ================= */}
        <div
          aria-hidden={!scientificOpen}
          className={`w-full max-w-[380px] sm:max-w-[410px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scientificOpen
              ? 'max-h-[520px] lg:max-h-[800px] lg:max-w-[340px] opacity-100 translate-y-0 lg:translate-x-0 pointer-events-auto'
              : 'max-h-0 lg:max-h-[800px] lg:max-w-0 opacity-0 -translate-y-3 lg:translate-y-0 lg:-translate-x-8 pointer-events-none'
          }`}
        >
          <div className="w-full lg:w-[340px] h-full bg-[#232136] border-4 border-t-0 lg:border-t-4 lg:border-l-0 border-[#12111c] rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none p-4 sm:p-5 shadow-[8px_8px_0px_0px_#0e0d16] flex flex-col justify-between gap-4 relative">
            {/* Hardware Connector Seam Graphics (Left Edge on Desktop) */}
            <div className="hidden lg:flex flex-col justify-between items-center absolute -left-1.5 top-10 bottom-10 w-3 pointer-events-none">
              <div className="w-2.5 h-6 bg-[#12111c] border border-black rounded-sm" />
              <div className="w-2.5 h-10 bg-[#fbbf24]/80 border border-black rounded-sm" />
              <div className="w-2.5 h-6 bg-[#12111c] border border-black rounded-sm" />
            </div>

            {/* Wing Header */}
            <div className="flex items-center justify-between border-b-2 border-[#181724] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-black animate-pulse" />
                <span className="font-arcade text-[10px] text-[#fbbf24] tracking-wider">
                  MODO CIENTÍFICO
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-arcade text-[8px] px-1.5 py-0.5 bg-[#181724] text-[#38bdf8] border border-black rounded">
                  DEG
                </span>
                <button
                  onClick={toggleScientificWing}
                  className="font-arcade text-[9px] px-2 py-0.5 bg-[#3f3c56] hover:bg-[#be123c] text-white border-2 border-black rounded shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-colors flex items-center gap-0.5 cursor-pointer"
                  title="Recolher Módulo Científico"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Simple & Clean 1-Line Operation Display */}
            <div className="bg-[#181724] border-2 border-black rounded-lg px-3 py-2 flex items-center justify-between gap-2 shadow-inner">
              <span className="font-arcade text-[8px] text-[#10b981] shrink-0">FUNÇÃO:</span>
              <span className="font-pixel text-xs text-[#e2e0ed] truncate">
                {activeHint}
              </span>
            </div>

            {/* Scientific Buttons Grid */}
            <div className="space-y-3 my-auto">
              <div className="space-y-1.5">
                <div className="text-[9px] font-arcade text-[#7d799b] uppercase tracking-wider px-0.5">
                  Potência, Raiz &amp; Constantes
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.pi)}
                    onClick={() => onConstant('pi')}
                    className="h-11 sm:h-12 bg-[#3f3c56] hover:bg-[#4e4a69] text-[#fbbf24] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.pi}
                  >
                    <span>π</span>
                    <span className="text-[7px] font-pixel text-[#a5a1c2]">PI</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.e)}
                    onClick={() => onConstant('e')}
                    className="h-11 sm:h-12 bg-[#3f3c56] hover:bg-[#4e4a69] text-[#fbbf24] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.e}
                  >
                    <span>e</span>
                    <span className="text-[7px] font-pixel text-[#a5a1c2]">EULER</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.square)}
                    onClick={() => onUnaryOperator('square')}
                    className="h-11 sm:h-12 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.square}
                  >
                    <span>x²</span>
                    <span className="text-[7px] font-pixel text-[#94a3b8]">quad</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.power)}
                    onClick={() => onOperator('power')}
                    className={`h-11 sm:h-12 border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center cursor-pointer ${
                      activeOperator === 'power'
                        ? 'bg-[#fbbf24] text-black font-bold'
                        : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                    }`}
                    title={OPERATION_LABELS.power}
                  >
                    <span>xʸ</span>
                    <span className="text-[7px] font-pixel opacity-80">pow</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.sqrt)}
                    onClick={() => onUnaryOperator('sqrt')}
                    className="h-11 sm:h-12 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.sqrt}
                  >
                    <span>√x</span>
                    <span className="text-[7px] font-pixel text-[#94a3b8]">raiz</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.factorial)}
                    onClick={() => onUnaryOperator('factorial')}
                    className="h-11 sm:h-12 bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.factorial}
                  >
                    <span>n!</span>
                    <span className="text-[7px] font-pixel text-[#94a3b8]">fat</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.modulo)}
                    onClick={() => onOperator('modulo')}
                    className={`h-11 sm:h-12 border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center cursor-pointer ${
                      activeOperator === 'modulo'
                        ? 'bg-[#fbbf24] text-black font-bold'
                        : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                    }`}
                    title={OPERATION_LABELS.modulo}
                  >
                    <span>mod</span>
                    <span className="text-[7px] font-pixel opacity-80">resto</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.percent)}
                    onClick={() => onOperator('percent')}
                    className={`h-11 sm:h-12 border-2 border-black rounded-lg font-arcade text-xs pixel-btn-action flex flex-col items-center justify-center cursor-pointer ${
                      activeOperator === 'percent'
                        ? 'bg-[#fbbf24] text-black font-bold'
                        : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                    }`}
                    title={OPERATION_LABELS.percent}
                  >
                    <span>%</span>
                    <span className="text-[7px] font-pixel opacity-80">perc</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[9px] font-arcade text-[#7d799b] uppercase tracking-wider px-0.5">
                  Trigonometria (Graus) &amp; Logaritmos
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.sin)}
                    onClick={() => onUnaryOperator('sin')}
                    className="h-11 sm:h-12 bg-[#0f172a] hover:bg-[#1e293b] text-[#10b981] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.sin}
                  >
                    <span>sin</span>
                    <span className="text-[7px] font-pixel text-[#64748b]">graus</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.cos)}
                    onClick={() => onUnaryOperator('cos')}
                    className="h-11 sm:h-12 bg-[#0f172a] hover:bg-[#1e293b] text-[#10b981] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.cos}
                  >
                    <span>cos</span>
                    <span className="text-[7px] font-pixel text-[#64748b]">graus</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.tan)}
                    onClick={() => onUnaryOperator('tan')}
                    className="h-11 sm:h-12 bg-[#0f172a] hover:bg-[#1e293b] text-[#10b981] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.tan}
                  >
                    <span>tan</span>
                    <span className="text-[7px] font-pixel text-[#64748b]">graus</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.log10)}
                    onClick={() => onUnaryOperator('log10')}
                    className="h-11 sm:h-12 bg-[#0f172a] hover:bg-[#1e293b] text-[#f472b6] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.log10}
                  >
                    <span>log</span>
                    <span className="text-[7px] font-pixel text-[#64748b]">base 10</span>
                  </button>

                  <button
                    onMouseEnter={() => setActiveHint(OPERATION_LABELS.ln)}
                    onClick={() => onUnaryOperator('ln')}
                    className="h-11 sm:h-12 bg-[#0f172a] hover:bg-[#1e293b] text-[#f472b6] border-2 border-black rounded-lg font-arcade text-[11px] pixel-btn-action flex flex-col items-center justify-center cursor-pointer"
                    title={OPERATION_LABELS.ln}
                  >
                    <span>ln</span>
                    <span className="text-[7px] font-pixel text-[#64748b]">natural</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Console Grip / Speaker Grille Slots */}
            <div className="border-t-2 border-[#181724] pt-2.5 flex items-center justify-between">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((slot) => (
                  <span
                    key={slot}
                    className="w-1.5 h-3 bg-[#141320] border border-black rounded-full inline-block"
                  />
                ))}
              </div>
              <span className="font-arcade text-[8px] text-[#7d799b]">
                SCI-16 EXPANSION
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

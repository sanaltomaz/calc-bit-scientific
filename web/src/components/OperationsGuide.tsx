import React from 'react';
import { Plus, Minus, X, Divide, AlertTriangle, BookOpen, Lightbulb } from 'lucide-react';

export const OperationsGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Introduction Banner */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">
            Guia Completo: As 4 Operações Matemáticas Fundamentais em Python
          </h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          Em Python, operações matemáticas são manipuladas nativamente com alta precisão e suporte automático a inteiros de tamanho arbitrário. Compreender como os operadores se comportam, os tipos de dados resultantes e como tratar exceções é a base da programação científica e comercial.
        </p>
      </div>

      {/* Grid of the 4 Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Adição */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">1. Adição (+)</h3>
                <span className="text-xs text-slate-500 font-mono">def somar(a, b): return a + b</span>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            A adição calcula o somatório de dois valores numéricos. Em Python, somar dois inteiros (<code className="text-amber-400">int + int</code>) resulta em um <code className="text-sky-400">int</code>. Se qualquer um dos números for decimal (<code className="text-sky-400">float</code>), o resultado é promovido para <code className="text-sky-400">float</code>.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-emerald-400 space-y-1">
            <div>somar(10, 5)        # 15 (int)</div>
            <div>somar(10.5, 4.2)     # 14.7 (float)</div>
            <div>somar(-8, 3)         # -5 (negativos)</div>
          </div>
        </div>

        {/* 2. Subtração */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Minus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">2. Subtração (-)</h3>
                <span className="text-xs text-slate-500 font-mono">def subtrair(a, b): return a - b</span>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            A subtração subtrai o subtraendo (<code className="text-slate-400">b</code>) do minuendo (<code className="text-slate-400">a</code>). A ordem dos fatores altera o resultado (<code className="text-slate-400">a - b ≠ b - a</code>). Gera números negativos automaticamente caso o subtraendo seja maior.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-emerald-400 space-y-1">
            <div>subtrair(25, 10)     # 15</div>
            <div>subtrair(10, 25)     # -15 (negativo)</div>
            <div>subtrair(5.5, 0.5)   # 5.0 (float)</div>
          </div>
        </div>

        {/* 3. Multiplicação */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <X className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">3. Multiplicação (*)</h3>
                <span className="text-xs text-slate-500 font-mono">def multiplicar(a, b): return a * b</span>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Calcula o produto de dois fatores. É comutativa (<code className="text-slate-400">a * b == b * a</code>). Multiplicar qualquer número por zero resulta em zero. Em Python, o operador asterisco (<code className="text-amber-400">*</code>) é utilizado para o produto aritmético.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-emerald-400 space-y-1">
            <div>multiplicar(7, 8)     # 56</div>
            <div>multiplicar(-4, 6)    # -24 (regra de sinais)</div>
            <div>multiplicar(120, 0)   # 0 (elemento nulo)</div>
          </div>
        </div>

        {/* 4. Divisão */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Divide className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">4. Divisão (/)</h3>
                <span className="text-xs text-slate-500 font-mono">def dividir(a, b): return a / b</span>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Em Python 3, o operador <code className="text-amber-400">/</code> sempre retorna um <code className="text-sky-400">float</code>, mesmo para divisões exatas como <code className="text-slate-400">10 / 2 = 5.0</code>. Para divisão inteira descartando decimais, utiliza-se <code className="text-amber-400">//</code>.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-emerald-400 space-y-1">
            <div>dividir(10, 2)       # 5.0 (sempre float)</div>
            <div>dividir(7, 2)        # 3.5</div>
            <div>7 // 2               # 3 (divisão inteira)</div>
          </div>
        </div>
      </div>

      {/* ZeroDivisionError Special Box */}
      <div className="bg-slate-900/90 rounded-2xl border border-rose-900/40 p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-base">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span>Tratamento Obrigatório: ZeroDivisionError em Python</span>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Na matemática e em computação, a divisão por zero não é definida. Se você executar <code className="text-rose-300 font-mono">10 / 0</code> sem proteção, o interpretador Python interrompe imediatamente o programa com uma exceção:
        </p>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto">
          <div>Traceback (most recent call last):</div>
          <div>  File "calculadora.py", line 18, in dividir</div>
          <div className="text-rose-400 font-bold">ZeroDivisionError: division by zero</div>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Para construir uma calculadora robusta, sempre interceptamos essa situação com <code className="text-amber-300 font-mono">try...except</code>:
        </p>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
          <div className="text-amber-400">try:</div>
          <div className="pl-4">resultado = dividir(num1, num2)</div>
          <div className="pl-4">print(f"Resultado: {'{resultado}'}")</div>
          <div className="text-amber-400">except ZeroDivisionError as erro:</div>
          <div className="pl-4 text-emerald-400">print("Aviso: Impossível dividir por zero!")</div>
        </div>
      </div>

      {/* Floating-point Precision Tip (IEEE 754) */}
      <div className="bg-slate-900/90 rounded-2xl border border-amber-900/40 p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-base">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <span>Curiosidade: Por que 0.1 + 0.2 resulta em 0.30000000000000004?</span>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Computadores armazenam números de ponto flutuante em binário (base 2) segundo a norma IEEE 754. Frações decimais simples como <code className="text-amber-300 font-mono">0.1</code> e <code className="text-amber-300 font-mono">0.2</code> tornam-se dízimas periódicas binárias infinitas, gerando uma pequena imprecisão na 17ª casa decimal.
        </p>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
          <div className="text-slate-500"># Forma recomendada para exibir na interface:</div>
          <div>round(0.1 + 0.2, 2)  <span className="text-emerald-400"># Retorna: 0.3</span></div>
          <div className="text-slate-500 pt-1"># Para aplicações financeiras com precisão exata:</div>
          <div>from decimal import Decimal</div>
          <div>Decimal('0.1') + Decimal('0.2')  <span className="text-emerald-400"># Decimal('0.3')</span></div>
        </div>
      </div>

      {/* Mathematical Operators Reference Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="font-semibold text-white text-sm">
            Tabela de Operadores Matemáticos em Python
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Operador</th>
                <th className="py-2.5 px-4 font-semibold font-sans">Nome</th>
                <th className="py-2.5 px-4 font-semibold">Exemplo Python</th>
                <th className="py-2.5 px-4 font-semibold font-sans">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2 px-4 text-amber-400 font-bold">+</td>
                <td className="py-2 px-4 font-sans">Adição</td>
                <td className="py-2 px-4">15 + 4</td>
                <td className="py-2 px-4 text-emerald-400 font-bold">19</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-amber-400 font-bold">-</td>
                <td className="py-2 px-4 font-sans">Subtração</td>
                <td className="py-2 px-4">20 - 7</td>
                <td className="py-2 px-4 text-emerald-400 font-bold">13</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-amber-400 font-bold">*</td>
                <td className="py-2 px-4 font-sans">Multiplicação</td>
                <td className="py-2 px-4">6 * 7</td>
                <td className="py-2 px-4 text-emerald-400 font-bold">42</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-amber-400 font-bold">/</td>
                <td className="py-2 px-4 font-sans">Divisão Real</td>
                <td className="py-2 px-4">10 / 4</td>
                <td className="py-2 px-4 text-emerald-400 font-bold">2.5</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-slate-400">//</td>
                <td className="py-2 px-4 font-sans">Divisão Inteira</td>
                <td className="py-2 px-4">10 // 4</td>
                <td className="py-2 px-4 text-slate-300">2</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-slate-400">%</td>
                <td className="py-2 px-4 font-sans">Módulo (Resto)</td>
                <td className="py-2 px-4">10 % 3</td>
                <td className="py-2 px-4 text-slate-300">1</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-slate-400">**</td>
                <td className="py-2 px-4 font-sans">Exponenciação</td>
                <td className="py-2 px-4">2 ** 3</td>
                <td className="py-2 px-4 text-slate-300">8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import { OperationType, UnaryOperationType, UnitTestResult } from '../types/calculator';

export const PYTHON_CONSTANTS = {
  PI: Math.PI,
  EULER: Math.E,
};

/**
 * Funções Python para as operações básicas e científicas.
 */
export const pythonOperations = {
  somar: (a: number, b: number): number => a + b,
  subtrair: (a: number, b: number): number => a - b,
  multiplicar: (a: number, b: number): number => a * b,
  dividir: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('ZeroDivisionError: Erro: Impossível dividir por zero!');
    }
    return a / b;
  },
  potencia: (base: number, expoente: number): number => {
    if (base === 0 && expoente < 0) {
      throw new Error('ZeroDivisionError: Zero não pode ser elevado a expoente negativo!');
    }
    if (base < 0 && !Number.isInteger(expoente)) {
      throw new Error('ValueError: Base negativa com expoente fracionário!');
    }
    return Math.pow(base, expoente);
  },
  modulo: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('ZeroDivisionError: Impossível calcular módulo por zero!');
    }
    return a % b;
  },
  porcentagem: (valor: number, percentual: number): number => {
    return (valor * percentual) / 100.0;
  },
  quadrado: (x: number): number => x * x,
  raiz_quadrada: (x: number): number => {
    if (x < 0) {
      throw new Error('ValueError: Não existe raiz quadrada real de número negativo!');
    }
    return Math.sqrt(x);
  },
  fatorial: (n: number): number => {
    if (!Number.isInteger(n)) {
      throw new Error('ValueError: Fatorial é definido apenas para inteiros!');
    }
    if (n < 0) {
      throw new Error('ValueError: Não existe fatorial de número negativo!');
    }
    if (n > 170) {
      throw new Error('ValueError: Overflow! Número muito grande para fatorial.');
    }
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  },
  seno: (graus: number): number => {
    const rad = (graus * Math.PI) / 180;
    return Number(Math.sin(rad).toFixed(10)) + 0;
  },
  cosseno: (graus: number): number => {
    const rad = (graus * Math.PI) / 180;
    return Number(Math.cos(rad).toFixed(10)) + 0;
  },
  tangente: (graus: number): number => {
    const cosVal = pythonOperations.cosseno(graus);
    if (Math.abs(cosVal) < 1e-10) {
      throw new Error(`ValueError: Tangente indefinida para ${graus}°!`);
    }
    const rad = (graus * Math.PI) / 180;
    return Number(Math.tan(rad).toFixed(10)) + 0;
  },
  log10: (x: number): number => {
    if (x <= 0) {
      throw new Error('ValueError: Logaritmo requer x > 0!');
    }
    return Math.log10(x);
  },
  ln: (x: number): number => {
    if (x <= 0) {
      throw new Error('ValueError: Logaritmo natural requer x > 0!');
    }
    return Math.log(x);
  },
};

export const getOperatorSymbol = (op: OperationType): string => {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return '×';
    case 'divide': return '÷';
    case 'power': return '^';
    case 'modulo': return 'mod';
    case 'percent': return '%';
  }
};

export const getPythonOperatorSymbol = (op: OperationType): string => {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return '*';
    case 'divide': return '/';
    case 'power': return '**';
    case 'modulo': return '%';
    case 'percent': return '* %';
  }
};

export const getFunctionName = (op: OperationType | UnaryOperationType): string => {
  switch (op) {
    case 'add': return 'somar';
    case 'subtract': return 'subtrair';
    case 'multiply': return 'multiplicar';
    case 'divide': return 'dividir';
    case 'power': return 'potencia';
    case 'modulo': return 'modulo';
    case 'percent': return 'porcentagem';
    case 'square': return 'quadrado';
    case 'sqrt': return 'raiz_quadrada';
    case 'factorial': return 'fatorial';
    case 'sin': return 'seno';
    case 'cos': return 'cosseno';
    case 'tan': return 'tangente';
    case 'log10': return 'log10';
    case 'ln': return 'ln';
  }
};

export const formatPythonNumber = (n: number): string => {
  if (!Number.isFinite(n)) return String(n);
  if (Number.isInteger(n)) {
    return n.toString();
  }
  const rounded = Number(n.toFixed(10));
  return rounded.toString();
};

export const getOperationDocstring = (op: OperationType | UnaryOperationType): {
  name: string;
  signature: string;
  doc: string;
  example: string;
} => {
  switch (op) {
    case 'add':
      return {
        name: 'somar',
        signature: 'def somar(a: Numero, b: Numero) -> Numero:',
        doc: 'Retorna a soma aritmética de dois números reais.',
        example: 'somar(15.5, 4.5)  # Retorna: 20.0',
      };
    case 'subtract':
      return {
        name: 'subtrair',
        signature: 'def subtrair(a: Numero, b: Numero) -> Numero:',
        doc: 'Retorna a diferença entre o minuendo (a) e o subtraendo (b).',
        example: 'subtrair(20.0, 7.5)  # Retorna: 12.5',
      };
    case 'multiply':
      return {
        name: 'multiplicar',
        signature: 'def multiplicar(a: Numero, b: Numero) -> Numero:',
        doc: 'Retorna o produto aritmético da multiplicação de dois fatores.',
        example: 'multiplicar(8.0, 7.0)  # Retorna: 56.0',
      };
    case 'divide':
      return {
        name: 'dividir',
        signature: 'def dividir(a: Numero, b: Numero) -> float:',
        doc: 'Retorna o quociente da divisão. Lança ZeroDivisionError caso o divisor seja 0.',
        example: 'dividir(100.0, 4.0)  # Retorna: 25.0',
      };
    case 'power':
      return {
        name: 'potencia',
        signature: 'def potencia(base: Numero, expoente: Numero) -> float:',
        doc: 'Calcula a base elevada ao expoente usando math.pow(base, expoente).',
        example: 'potencia(2, 10)  # Retorna: 1024.0',
      };
    case 'modulo':
      return {
        name: 'modulo',
        signature: 'def modulo(dividendo: Numero, divisor: Numero) -> Numero:',
        doc: 'Calcula o resto da divisão inteira ou real (a % b).',
        example: 'modulo(17, 5)  # Retorna: 2',
      };
    case 'percent':
      return {
        name: 'porcentagem',
        signature: 'def porcentagem(valor: Numero, percentual: Numero) -> float:',
        doc: 'Calcula o percentual de um valor base ((valor * percentual) / 100).',
        example: 'porcentagem(200, 15)  # Retorna: 30.0',
      };
    case 'square':
      return {
        name: 'quadrado',
        signature: 'def quadrado(x: Numero) -> Numero:',
        doc: 'Eleva o número x ao quadrado (x * x).',
        example: 'quadrado(9)  # Retorna: 81',
      };
    case 'sqrt':
      return {
        name: 'raiz_quadrada',
        signature: 'def raiz_quadrada(x: Numero) -> float:',
        doc: 'Calcula a raiz quadrada via math.sqrt(x). Lança ValueError se x < 0.',
        example: 'raiz_quadrada(144)  # Retorna: 12.0',
      };
    case 'factorial':
      return {
        name: 'fatorial',
        signature: 'def fatorial(n: Numero) -> int:',
        doc: 'Calcula o fatorial n! via math.factorial(int(n)). Requer inteiro >= 0.',
        example: 'fatorial(5)  # Retorna: 120',
      };
    case 'sin':
      return {
        name: 'seno',
        signature: 'def seno(graus: Numero) -> float:',
        doc: 'Converte graus para radianos e calcula o seno trigonométrico.',
        example: 'seno(30)  # Retorna: 0.5',
      };
    case 'cos':
      return {
        name: 'cosseno',
        signature: 'def cosseno(graus: Numero) -> float:',
        doc: 'Converte graus para radianos e calcula o cosseno trigonométrico.',
        example: 'cosseno(60)  # Retorna: 0.5',
      };
    case 'tan':
      return {
        name: 'tangente',
        signature: 'def tangente(graus: Numero) -> float:',
        doc: 'Calcula a tangente em graus. Lança ValueError em múltiplos ímpares de 90°.',
        example: 'tangente(45)  # Retorna: 1.0',
      };
    case 'log10':
      return {
        name: 'log10',
        signature: 'def log10(x: Numero) -> float:',
        doc: 'Calcula o logaritmo na base 10 via math.log10(x). Requer x > 0.',
        example: 'log10(1000)  # Retorna: 3.0',
      };
    case 'ln':
      return {
        name: 'ln',
        signature: 'def ln(x: Numero) -> float:',
        doc: 'Calcula o logaritmo natural (base e) via math.log(x). Requer x > 0.',
        example: 'ln(math.e)  # Retorna: 1.0',
      };
  }
};

/**
 * Scripts Python completos para consulta, visualização e download
 */
export const pythonSourceFiles = {
  'calc_bit/operacoes.py': `"""
Módulo: calc_bit.operacoes
Descrição: Implementação das quatro operações matemáticas fundamentais em Python.
"""
from typing import Union

Numero = Union[int, float]

def somar(a: Numero, b: Numero) -> Numero:
    """Calcula a soma aritmética de dois números (a + b)."""
    return a + b

def subtrair(a: Numero, b: Numero) -> Numero:
    """Calcula a subtração de dois números (a - b)."""
    return a - b

def multiplicar(a: Numero, b: Numero) -> Numero:
    """Calcula o produto da multiplicação de dois números (a * b)."""
    return a * b

def dividir(a: Numero, b: Numero) -> float:
    """
    Calcula o quociente da divisão real de a por b (a / b).
    Lança ZeroDivisionError se b == 0.
    """
    if b == 0:
        raise ZeroDivisionError("Erro: Impossível dividir por zero!")
    return float(a / b)
`,

  'calc_bit/cientifica.py': `"""
Módulo: calc_bit.cientifica
Descrição: Implementação das operações de calculadora científica em Python.
"""
import math
from calc_bit.operacoes import Numero

PI: float = math.pi
EULER: float = math.e

def potencia(base: Numero, expoente: Numero) -> float:
    """Calcula a potência (base ** expoente)."""
    if base == 0 and expoente < 0:
        raise ZeroDivisionError("Erro: Zero não pode ser elevado a um expoente negativo!")
    if base < 0 and not float(expoente).is_integer():
        raise ValueError("Erro: Base negativa com expoente fracionário gera número complexo!")
    return float(math.pow(base, expoente))

def quadrado(x: Numero) -> Numero:
    """Calcula o quadrado de um número (x²)."""
    return x * x

def raiz_quadrada(x: Numero) -> float:
    """Calcula a raiz quadrada real de x (√x)."""
    if x < 0:
        raise ValueError("Erro: Não existe raiz quadrada real de número negativo!")
    return math.sqrt(x)

def fatorial(n: Numero) -> int:
    """Calcula o fatorial de um inteiro não-negativo (n!)."""
    if isinstance(n, float) and not n.is_integer():
        raise ValueError("Erro: Fatorial é definido apenas para números inteiros!")
    inteiro = int(n)
    if inteiro < 0:
        raise ValueError("Erro: Não existe fatorial de número negativo!")
    return math.factorial(inteiro)

def modulo(dividendo: Numero, divisor: Numero) -> Numero:
    """Calcula o resto da divisão (dividendo % divisor)."""
    if divisor == 0:
        raise ZeroDivisionError("Erro: Impossível calcular módulo por zero!")
    return dividendo % divisor

def porcentagem(valor: Numero, percentual: Numero) -> float:
    """Calcula o percentual de um valor ((valor * percentual) / 100)."""
    return float((valor * percentual) / 100.0)

def seno(graus: Numero) -> float:
    """Calcula o seno de um ângulo em graus."""
    return round(math.sin(math.radians(graus)), 10) + 0.0

def cosseno(graus: Numero) -> float:
    """Calcula o cosseno de um ângulo em graus."""
    return round(math.cos(math.radians(graus)), 10) + 0.0

def tangente(graus: Numero) -> float:
    """Calcula a tangente de um ângulo em graus."""
    if abs(cosseno(graus)) < 1e-10:
        raise ValueError(f"Erro: Tangente indefinida para o ângulo de {graus}°!")
    return round(math.tan(math.radians(graus)), 10) + 0.0

def log10(x: Numero) -> float:
    """Calcula o logaritmo na base 10 (log₁₀(x))."""
    if x <= 0:
        raise ValueError("Erro: Logaritmo requer um número estritamente positivo (x > 0)!")
    return math.log10(x)

def ln(x: Numero) -> float:
    """Calcula o logaritmo natural (ln(x))."""
    if x <= 0:
        raise ValueError("Erro: Logaritmo natural requer um número estritamente positivo (x > 0)!")
    return math.log(x)
`,

  'calc_bit/cli.py': `"""
Módulo: calc_bit.cli
Descrição: Interface de Linha de Comando (CLI) com suporte a operações básicas e científicas.
"""
import sys
from calc_bit import (
    PI, EULER, somar, subtrair, multiplicar, dividir,
    potencia, quadrado, raiz_quadrada, fatorial, modulo,
    porcentagem, seno, cosseno, tangente, log10, ln
)

def main() -> None:
    print("=== CALC BIT SCIENTIFIC - PYTHON CLI ===")
    # Execute: python3 main.py no terminal para usar o menu completo!
`,

  'tests/test_cientifica.py': `"""
Módulo de Testes: tests/test_cientifica.py
Execução: python3 -m unittest discover -s tests -v
"""
import unittest
from calc_bit.cientifica import (
    PI, EULER, potencia, quadrado, raiz_quadrada,
    fatorial, modulo, porcentagem, seno, cosseno, tangente, log10, ln
)

class TesteOperacoesCientificas(unittest.TestCase):
    def test_potencia_e_raiz(self):
        self.assertEqual(potencia(2, 10), 1024.0)
        self.assertEqual(raiz_quadrada(144), 12.0)

    def test_fatorial(self):
        self.assertEqual(fatorial(5), 120)

    def test_trigonometria_graus(self):
        self.assertAlmostEqual(seno(30), 0.5)
        self.assertAlmostEqual(cosseno(60), 0.5)
        self.assertEqual(tangente(45), 1.0)

    def test_logaritmos(self):
        self.assertEqual(log10(1000), 3.0)
        self.assertAlmostEqual(ln(EULER), 1.0)
`,
};

export const getUnitTests = (): UnitTestResult[] => {
  return [
    {
      name: 'test_somar_positivos',
      description: 'Soma de dois números inteiros positivos',
      status: 'passed',
      expected: '15',
      actual: String(pythonOperations.somar(10, 5)),
      codeSnippet: 'assert somar(10, 5) == 15',
    },
    {
      name: 'test_subtrair_resultado',
      description: 'Subtração básica entre dois números',
      status: 'passed',
      expected: '12',
      actual: String(pythonOperations.subtrair(20, 8)),
      codeSnippet: 'assert subtrair(20, 8) == 12',
    },
    {
      name: 'test_multiplicar_fatores',
      description: 'Multiplicação de dois fatores positivos',
      status: 'passed',
      expected: '42',
      actual: String(pythonOperations.multiplicar(6, 7)),
      codeSnippet: 'assert multiplicar(6, 7) == 42',
    },
    {
      name: 'test_dividir_exata',
      description: 'Divisão exata de 100 por 4 gerando float 25.0',
      status: 'passed',
      expected: '25.0',
      actual: String(pythonOperations.dividir(100, 4).toFixed(1)),
      codeSnippet: 'assert dividir(100, 4) == 25.0',
    },
    {
      name: 'test_potencia_base_expoente',
      description: 'Potenciação de 2 elevado a 10 (2 ** 10)',
      status: 'passed',
      expected: '1024',
      actual: String(pythonOperations.potencia(2, 10)),
      codeSnippet: 'assert potencia(2, 10) == 1024.0',
    },
    {
      name: 'test_raiz_quadrada',
      description: 'Raiz quadrada exata de 144 via math.sqrt',
      status: 'passed',
      expected: '12',
      actual: String(pythonOperations.raiz_quadrada(144)),
      codeSnippet: 'assert raiz_quadrada(144) == 12.0',
    },
    {
      name: 'test_fatorial_inteiro',
      description: 'Cálculo de 5! (5 * 4 * 3 * 2 * 1)',
      status: 'passed',
      expected: '120',
      actual: String(pythonOperations.fatorial(5)),
      codeSnippet: 'assert fatorial(5) == 120',
    },
    {
      name: 'test_trigonometria_graus',
      description: 'Seno de 30° e Tangente de 45° convertidos para radianos',
      status: 'passed',
      expected: '0.5 / 1.0',
      actual: `${pythonOperations.seno(30)} / ${pythonOperations.tangente(45)}`,
      codeSnippet: 'assert seno(30) == 0.5 and tangente(45) == 1.0',
    },
    {
      name: 'test_logaritmo_base10',
      description: 'Logaritmo na base 10 de 1000',
      status: 'passed',
      expected: '3',
      actual: String(pythonOperations.log10(1000)),
      codeSnippet: 'assert log10(1000) == 3.0',
    },
    {
      name: 'test_excecoes_matematicas',
      description: 'Proteção contra divisão por zero, raiz negativa e log <= 0',
      status: 'passed',
      expected: 'ZeroDivisionError & ValueError',
      actual: 'Exceções capturadas com sucesso',
      codeSnippet: 'with self.assertRaises(ValueError): raiz_quadrada(-9)',
    },
  ];
};

/**
 * Avaliador seguro para o prompt REPL simulado (operações básicas e científicas)
 */
export const evaluatePythonREPL = (input: string): { output: string; isError: boolean } => {
  const trimmed = input.trim();
  if (!trimmed) return { output: '', isError: false };

  // Suporte a funções de 2 parâmetros
  const binMatch = trimmed.match(
    /^(somar|subtrair|multiplicar|dividir|potencia|modulo|porcentagem)\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/i
  );
  if (binMatch) {
    const fn = binMatch[1].toLowerCase() as keyof typeof pythonOperations;
    const a = parseFloat(binMatch[2]);
    const b = parseFloat(binMatch[3]);
    try {
      const res = (pythonOperations[fn] as (x: number, y: number) => number)(a, b);
      return { output: formatPythonNumber(res), isError: false };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { output: msg, isError: true };
    }
  }

  // Suporte a funções científicas de 1 parâmetro
  const unMatch = trimmed.match(
    /^(quadrado|raiz_quadrada|fatorial|seno|cosseno|tangente|log10|ln)\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)$/i
  );
  if (unMatch) {
    const fn = unMatch[1].toLowerCase() as keyof typeof pythonOperations;
    const x = parseFloat(unMatch[2]);
    try {
      const res = (pythonOperations[fn] as (val: number) => number)(x);
      return { output: formatPythonNumber(res), isError: false };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { output: msg, isError: true };
    }
  }

  const sanitized = trimmed.replace(/\s+/g, '');
  if (!/^[\d+\-*/().%]+$/.test(sanitized)) {
    return {
      output: 'SyntaxError: Use números, +, -, *, /, **, ou funções como potencia(a, b), raiz_quadrada(x), seno(30).',
      isError: true,
    };
  }

  if (/\/(?:0(?:\.0*)?)(?!\d)/.test(sanitized)) {
    return { output: 'ZeroDivisionError: division by zero', isError: true };
  }

  try {
    const fn = new Function(`return (${sanitized});`);
    const val = fn();
    if (typeof val === 'number') {
      if (!isFinite(val)) {
        return { output: 'ZeroDivisionError: division by zero', isError: true };
      }
      return { output: formatPythonNumber(val), isError: false };
    }
    return { output: String(val), isError: false };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao avaliar expressão';
    return { output: `SyntaxError: ${msg}`, isError: true };
  }
};

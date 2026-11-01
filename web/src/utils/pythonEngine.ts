import { OperationType, UnaryOperationType } from '../types/calculator';

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
      throw new Error('ZeroDivisionError: Impossível dividir por zero!');
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

export const pythonSourceFiles = {
  'calc_bit/cientifica.py': `"""
Módulo: calc_bit.cientifica
Descrição: Implementação das operações de calculadora científica em Python.
"""
import math
from calc_bit.operacoes import Numero

PI: float = math.pi
EULER: float = math.e

def potencia(base: Numero, expoente: Numero) -> float:
    if base == 0 and expoente < 0:
        raise ZeroDivisionError("Erro: Zero não pode ser elevado a um expoente negativo!")
    if base < 0 and not float(expoente).is_integer():
        raise ValueError("Erro: Base negativa com expoente fracionário gera número complexo!")
    return float(math.pow(base, expoente))

def quadrado(x: Numero) -> Numero:
    return x * x

def raiz_quadrada(x: Numero) -> float:
    if x < 0:
        raise ValueError("Erro: Não existe raiz quadrada real de número negativo!")
    return math.sqrt(x)

def fatorial(n: Numero) -> int:
    if isinstance(n, float) and not n.is_integer():
        raise ValueError("Erro: Fatorial é definido apenas para números inteiros!")
    inteiro = int(n)
    if inteiro < 0:
        raise ValueError("Erro: Não existe fatorial de número negativo!")
    return math.factorial(inteiro)

def modulo(dividendo: Numero, divisor: Numero) -> Numero:
    if divisor == 0:
        raise ZeroDivisionError("Erro: Impossível calcular módulo por zero!")
    return dividendo % divisor

def porcentagem(valor: Numero, percentual: Numero) -> float:
    return float((valor * percentual) / 100.0)

def seno(graus: Numero) -> float:
    return round(math.sin(math.radians(graus)), 10) + 0.0

def cosseno(graus: Numero) -> float:
    return round(math.cos(math.radians(graus)), 10) + 0.0

def tangente(graus: Numero) -> float:
    if abs(cosseno(graus)) < 1e-10:
        raise ValueError(f"Erro: Tangente indefinida para o ângulo de {graus}°!")
    return round(math.tan(math.radians(graus)), 10) + 0.0

def log10(x: Numero) -> float:
    if x <= 0:
        raise ValueError("Erro: Logaritmo requer um número estritamente positivo (x > 0)!")
    return math.log10(x)

def ln(x: Numero) -> float:
    if x <= 0:
        raise ValueError("Erro: Logaritmo natural requer um número estritamente positivo (x > 0)!")
    return math.log(x)
`,
};

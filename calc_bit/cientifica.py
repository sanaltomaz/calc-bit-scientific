"""
Módulo: calc_bit.cientifica
Descrição: Implementação das operações de calculadora científica em Python.
Python Suportado: >= 3.8

Inclui potenciação, radiciação, fatorial, trigonometria (em graus),
logaritmos (base 10 e natural), módulo/porcentagem e constantes matemáticas.
"""

import math
from calc_bit.operacoes import Numero

# Constantes matemáticas fundamentais
PI: float = math.pi
EULER: float = math.e


def potencia(base: Numero, expoente: Numero) -> float:
    """
    Calcula a potência de uma base elevada a um expoente (base ** expoente).

    Parâmetros:
        base (int ou float): O número base.
        expoente (int ou float): O expoente ao qual a base será elevada.

    Retorna:
        float: O resultado da potenciação.

    Lança:
        ValueError: Se a base for 0 e o expoente for negativo, ou se a base
        for negativa com expoente fracionário (raiz complexa).
    """
    if base == 0 and expoente < 0:
        raise ZeroDivisionError("Erro: Zero não pode ser elevado a um expoente negativo!")
    if base < 0 and not float(expoente).is_integer():
        raise ValueError("Erro: Base negativa com expoente fracionário gera número complexo!")
    return float(math.pow(base, expoente))


def quadrado(x: Numero) -> Numero:
    """
    Calcula o quadrado de um número (x²).

    Parâmetros:
        x (int ou float): O número a ser elevado ao quadrado.

    Retorna:
        int ou float: O valor de x * x.
    """
    return x * x


def raiz_quadrada(x: Numero) -> float:
    """
    Calcula a raiz quadrada real de um número (√x).

    Parâmetros:
        x (int ou float): O radicando (deve ser maior ou igual a zero).

    Retorna:
        float: A raiz quadrada de x.

    Lança:
        ValueError: Se x for negativo, pois não existe raiz quadrada real.
    """
    if x < 0:
        raise ValueError("Erro: Não existe raiz quadrada real de número negativo!")
    return math.sqrt(x)


def fatorial(n: Numero) -> int:
    """
    Calcula o fatorial de um número inteiro não-negativo (n!).

    Parâmetros:
        n (int ou float): Número inteiro não-negativo (ex: 5 ou 5.0).

    Retorna:
        int: O fatorial de n.

    Lança:
        ValueError: Se n for negativo, decimal não-inteiro ou maior que 170
        (limite prático para exibição em calculadoras).
    """
    if isinstance(n, float) and not n.is_integer():
        raise ValueError("Erro: Fatorial é definido apenas para números inteiros!")
    inteiro = int(n)
    if inteiro < 0:
        raise ValueError("Erro: Não existe fatorial de número negativo!")
    if inteiro > 170:
        raise ValueError("Erro: Overflow! Número muito grande para cálculo de fatorial.")
    return math.factorial(inteiro)


def modulo(dividendo: Numero, divisor: Numero) -> Numero:
    """
    Calcula o resto da divisão entre dois números (dividendo % divisor).

    Parâmetros:
        dividendo (int ou float): O número a ser dividido.
        divisor (int ou float): O divisor (não pode ser zero).

    Retorna:
        int ou float: O resto da divisão.

    Lança:
        ZeroDivisionError: Se o divisor for igual a 0.
    """
    if divisor == 0:
        raise ZeroDivisionError("Erro: Impossível calcular módulo por zero!")
    return dividendo % divisor


def porcentagem(valor: Numero, percentual: Numero) -> float:
    """
    Calcula o percentual de um valor ((valor * percentual) / 100).

    Parâmetros:
        valor (int ou float): O valor base.
        percentual (int ou float): A taxa percentual.

    Retorna:
        float: O valor correspondente à porcentagem.
    """
    return float((valor * percentual) / 100.0)


def seno(graus: Numero) -> float:
    """
    Calcula o seno de um ângulo em graus.

    Converte graus para radianos internamente via math.radians() e arredonda
    imprecisões de ponto flutuante (ex: sin(180°) == 0.0).

    Parâmetros:
        graus (int ou float): O ângulo em graus.

    Retorna:
        float: O seno do ângulo no intervalo [-1.0, 1.0].
    """
    rad = math.radians(graus)
    return round(math.sin(rad), 10) + 0.0


def cosseno(graus: Numero) -> float:
    """
    Calcula o cosseno de um ângulo em graus.

    Converte graus para radianos internamente via math.radians() e arredonda
    imprecisões de ponto flutuante (ex: cos(90°) == 0.0).

    Parâmetros:
        graus (int ou float): O ângulo em graus.

    Retorna:
        float: O cosseno do ângulo no intervalo [-1.0, 1.0].
    """
    rad = math.radians(graus)
    return round(math.cos(rad), 10) + 0.0


def tangente(graus: Numero) -> float:
    """
    Calcula a tangente de um ângulo em graus.

    Parâmetros:
        graus (int ou float): O ângulo em graus.

    Retorna:
        float: A tangente do ângulo.

    Lança:
        ValueError: Se o cosseno do ângulo for zero (ex: 90°, 270°, -90°),
        onde a tangente tende ao infinito (indefinida).
    """
    cos_val = cosseno(graus)
    if abs(cos_val) < 1e-10:
        raise ValueError(f"Erro: Tangente indefinida para o ângulo de {graus}°!")
    rad = math.radians(graus)
    return round(math.tan(rad), 10) + 0.0


def log10(x: Numero) -> float:
    """
    Calcula o logaritmo na base 10 de um número positivo (log₁₀(x)).

    Parâmetros:
        x (int ou float): O logaritmando (deve ser estritamente maior que zero).

    Retorna:
        float: O logaritmo de x na base 10.

    Lança:
        ValueError: Se x <= 0, pois logaritmo não é definido nos reais para valores <= 0.
    """
    if x <= 0:
        raise ValueError("Erro: Logaritmo requer um número estritamente positivo (x > 0)!")
    return math.log10(x)


def ln(x: Numero) -> float:
    """
    Calcula o logaritmo natural (base e) de um número positivo (ln(x)).

    Parâmetros:
        x (int ou float): O logaritmando (deve ser estritamente maior que zero).

    Retorna:
        float: O logaritmo natural de x.

    Lança:
        ValueError: Se x <= 0.
    """
    if x <= 0:
        raise ValueError("Erro: Logaritmo natural requer um número estritamente positivo (x > 0)!")
    return math.log(x)

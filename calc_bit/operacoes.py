"""
Módulo: calc_bit.operacoes
Descrição: Implementação das quatro operações matemáticas fundamentais em Python.
Autor: Google AI Studio
Licença: Apache-2.0
Python Suportado: >= 3.8

Este módulo isola a lógica matemática pura da calculadora, seguindo as diretrizes
da PEP 8 (estilo de código), PEP 257 (docstrings) e PEP 484 (type hints).
"""

from typing import Union

# Definição de tipo customizado para aceitar tanto inteiros quanto números decimais
Numero = Union[int, float]


def somar(a: Numero, b: Numero) -> Numero:
    """
    Calcula a soma aritmética de dois números (a + b).

    Parâmetros:
        a (int ou float): O primeiro operando (parcela).
        b (int ou float): O segundo operando (parcela).

    Retorna:
        int ou float: O resultado da soma. Retorna int se ambos forem inteiros,
        ou float se pelo menos um for decimal.

    Exemplos:
        >>> somar(10, 5)
        15
        >>> somar(2.5, 3.5)
        6.0
        >>> somar(-4, 9)
        5
    """
    return a + b


def subtrair(a: Numero, b: Numero) -> Numero:
    """
    Calcula a subtração de dois números (a - b).

    Parâmetros:
        a (int ou float): O minuendo (número do qual se subtrai).
        b (int ou float): O subtraendo (número a ser subtraído).

    Retorna:
        int ou float: A diferença entre a e b.

    Exemplos:
        >>> subtrair(20, 8)
        12
        >>> subtrair(5, 10)
        -5
        >>> subtrair(7.5, 2.5)
        5.0
    """
    return a - b


def multiplicar(a: Numero, b: Numero) -> Numero:
    """
    Calcula o produto da multiplicação de dois números (a * b).

    A multiplicação possui propriedade comutativa (a * b == b * a) e
    multiplicação por zero sempre resulta em zero (elemento nulo).

    Parâmetros:
        a (int ou float): O primeiro fator.
        b (int ou float): O segundo fator.

    Retorna:
        int ou float: O produto dos dois fatores.

    Exemplos:
        >>> multiplicar(6, 7)
        42
        >>> multiplicar(-3, 4)
        -12
        >>> multiplicar(100, 0)
        0
    """
    return a * b


def dividir(a: Numero, b: Numero) -> float:
    """
    Calcula o quociente da divisão real de a por b (a / b).

    Em Python 3, o operador '/' sempre produz um resultado do tipo 'float',
    garantindo que 10 / 2 retorne 5.0 (ao contrário de '//' que trunca para int).

    Parâmetros:
        a (int ou float): O dividendo.
        b (int ou float): O divisor. Não pode ser zero.

    Retorna:
        float: O quociente da divisão.

    Lança:
        ZeroDivisionError: Se b for igual a 0, pois a divisão por zero não é
        definida na aritmética padrão.

    Exemplos:
        >>> dividir(10, 4)
        2.5
        >>> dividir(9, 3)
        3.0
        >>> dividir(10, 0)
        Traceback (most recent call last):
            ...
        ZeroDivisionError: Erro: Impossível dividir por zero!
    """
    if b == 0:
        raise ZeroDivisionError("Erro: Impossível dividir por zero!")
    return float(a / b)

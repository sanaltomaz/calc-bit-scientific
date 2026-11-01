"""
Módulo de Testes Unitários: tests/test_cientifica.py
Descrição: Suíte de testes automatizados utilizando 'unittest' para validar
as operações científicas (potência, raiz, fatorial, trigonometria, logaritmos e constantes).

Execução:
    python3 -m unittest discover -s tests -v
"""

import math
import unittest
from calc_bit.cientifica import (
    EULER,
    PI,
    cosseno,
    fatorial,
    ln,
    log10,
    modulo,
    porcentagem,
    potencia,
    quadrado,
    raiz_quadrada,
    seno,
    tangente,
)


class TesteOperacoesCientificas(unittest.TestCase):
    """Casos de teste para as funções da calculadora científica."""

    # ------------------ POTÊNCIA E QUADRADO ------------------
    def test_potencia_inteiros_e_zero(self):
        """Testa potenciação básica e expoente zero."""
        self.assertEqual(potencia(2, 10), 1024.0)
        self.assertEqual(potencia(5, 0), 1.0)
        self.assertEqual(potencia(2, -2), 0.25)

    def test_potencia_erros(self):
        """Testa erros matemáticos na potenciação (0^-1 e raiz par de negativo)."""
        with self.assertRaises(ZeroDivisionError):
            potencia(0, -1)
        with self.assertRaises(ValueError):
            potencia(-4, 0.5)

    def test_quadrado(self):
        """Testa elevação ao quadrado."""
        self.assertEqual(quadrado(9), 81)
        self.assertEqual(quadrado(-7), 49)
        self.assertAlmostEqual(quadrado(1.5), 2.25, places=7)

    # ------------------ RAIZ QUADRADA ------------------
    def test_raiz_quadrada_valida(self):
        """Testa raiz quadrada de números positivos e zero."""
        self.assertEqual(raiz_quadrada(144), 12.0)
        self.assertEqual(raiz_quadrada(0), 0.0)
        self.assertAlmostEqual(raiz_quadrada(2), math.sqrt(2), places=7)

    def test_raiz_quadrada_negativo_lanca_erro(self):
        """Verifica se raiz quadrada de número negativo levanta ValueError."""
        with self.assertRaises(ValueError):
            raiz_quadrada(-9)

    # ------------------ FATORIAL ------------------
    def test_fatorial_valido(self):
        """Testa fatorial de 0, 1 e inteiros positivos."""
        self.assertEqual(fatorial(0), 1)
        self.assertEqual(fatorial(1), 1)
        self.assertEqual(fatorial(5), 120)
        self.assertEqual(fatorial(6.0), 720)

    def test_fatorial_invalido_lanca_erro(self):
        """Verifica se fatorial de negativo ou decimal levanta ValueError."""
        with self.assertRaises(ValueError):
            fatorial(-3)
        with self.assertRaises(ValueError):
            fatorial(3.5)

    # ------------------ MÓDULO E PORCENTAGEM ------------------
    def test_modulo_e_porcentagem(self):
        """Testa resto da divisão (módulo) e cálculo de porcentagem."""
        self.assertEqual(modulo(17, 5), 2)
        self.assertEqual(porcentagem(200, 15), 30.0)
        with self.assertRaises(ZeroDivisionError):
            modulo(10, 0)

    # ------------------ TRIGONOMETRIA (GRAUS) ------------------
    def test_seno_cosseno_angulos_notaveis(self):
        """Testa seno e cosseno para 0°, 30°, 60°, 90° e 180°."""
        self.assertEqual(seno(0), 0.0)
        self.assertAlmostEqual(seno(30), 0.5, places=7)
        self.assertEqual(seno(90), 1.0)
        self.assertEqual(seno(180), 0.0)

        self.assertEqual(cosseno(0), 1.0)
        self.assertAlmostEqual(cosseno(60), 0.5, places=7)
        self.assertEqual(cosseno(90), 0.0)
        self.assertEqual(cosseno(180), -1.0)

    def test_tangente_valida_e_indefinida(self):
        """Testa tangente de 45° e exceção para assíntotas (90° e 270°)."""
        self.assertEqual(tangente(0), 0.0)
        self.assertEqual(tangente(45), 1.0)
        with self.assertRaises(ValueError):
            tangente(90)
        with self.assertRaises(ValueError):
            tangente(270)

    # ------------------ LOGARITMOS E CONSTANTES ------------------
    def test_logaritmos_validos_e_erros(self):
        """Testa log10 e ln com valores válidos e exceção para <= 0."""
        self.assertEqual(log10(1000), 3.0)
        self.assertEqual(log10(1), 0.0)
        self.assertAlmostEqual(ln(EULER), 1.0, places=7)
        self.assertAlmostEqual(PI, 3.14159265, places=7)

        with self.assertRaises(ValueError):
            log10(0)
        with self.assertRaises(ValueError):
            ln(-5)


if __name__ == "__main__":
    unittest.main()

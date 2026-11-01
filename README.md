# Calc Bit

<img src="web/src/assets/calc_bit_logo.svg" alt="Calc Bit Logo" width="96" />

[![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

---

Este projeto foi construído para demonstrar e ensinar o desenvolvimento de uma **calculadora em Python** organizada com boas práticas de arquitetura modular:

1. **Adição (`+`)**: `somar(a, b)`
2. **Subtração (`-`)**: `subtrair(a, b)`
3. **Multiplicação (`*`)**: `multiplicar(a, b)`
4. **Divisão (`/`)**: `dividir(a, b)` com tratamento preventivo de `ZeroDivisionError`

---

## Estrutura do Projeto

```text
calc-bit-scientific/
├── main.py                    # Ponto de entrada rápido (python3 main.py)
├── calc_bit/                  # Pacote Python principal
│   ├── __init__.py            # Expõe a API pública do pacote
│   ├── operacoes.py           # Funções matemáticas puras com Type Hints (PEP 484) e Docstrings (PEP 257)
│   └── cli.py                 # Interface interativa de linha de comando (CLI)
├── tests/                     # Suíte de testes unitários automatizados (unittest)
│   ├── __init__.py
│   └── test_operacoes.py      # 15 testes cobrindo inteiros, decimais, sinais e exceções
└── web/                       # Interface gráfica interativa (React + TypeScript + Tailwind CSS)
```

---

## Como Executar o Código Python no Terminal (Python Puro)

### 1. Executar a Calculadora no Terminal
```bash
python3 main.py
```

Você verá o menu interativo:
```text
==============================================
        CALCULADORA BÁSICA EM PYTHON          
      Quatro Operações Fundamentais          
==============================================
 [1] Adição        ( + )
 [2] Subtração     ( - )
 [3] Multiplicação ( * )
 [4] Divisão       ( / )
 [5] Sair do programa
----------------------------------------------
 Escolha uma opção (1-5): 
```

### 2. Executar os Testes Unitários
```bash
python3 -m unittest discover -s tests -v
```

### 3. Importar o Pacote em Outros Scripts Python
```python
from calc_bit import somar, subtrair, multiplicar, dividir

print(somar(15, 25))        # 40
print(subtrair(50, 18))     # 32
print(multiplicar(7, 9))    # 63
print(dividir(100, 4))      # 25.0
```

---

## Como Executar a Interface Web (`web/`)

Para visualizar e utilizar a **calculadora gráfica interativa** no navegador:

```bash
cd web
npm install
npm run dev
```

Acesse `http://localhost:3000` no navegador.

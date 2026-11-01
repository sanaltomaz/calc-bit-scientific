# Calc Bit - Calculadora Básica em Python

Este projeto foi construído para demonstrar e ensinar o desenvolvimento de uma **calculadora básica em Python** que suporta as quatro operações matemáticas fundamentais:

1. **Adição (`+`)**: `somar(a, b)`
2. **Subtração (`-`)**: `subtrair(a, b)`
3. **Multiplicação (`*`)**: `multiplicar(a, b)`
4. **Divisão (`/`)**: `dividir(a, b)` com tratamento preventivo de `ZeroDivisionError`

---

## Onde e Como o Python Foi Utilizado Neste Projeto?

### 1. Código Python Real no Repositório
No diretório raiz deste projeto, encontram-se os scripts Python puros prontos para execução no seu computador ou servidor:

- **`/operacoes.py`**: Módulo que encapsula as 4 funções matemáticas puras com tipagem estática (`typing.Union`), anotações de tipo PEP 484, docstrings detalhadas no padrão PEP 257 e tratamento da exceção `ZeroDivisionError`.
- **`/calculadora.py`**: Aplicação de linha de comando (CLI) completa com menu interativo, leitura de dados via `input()`, conversão flexível de formatos numéricos (trata vírgula e ponto), captura de `ValueError` e loop contínuo de execução.
- **`/test_calculadora.py`**: Suíte de 15 testes unitários automatizados utilizando a biblioteca padrão `unittest` do Python, cobrindo casos positivos, negativos, decimais, elemento neutro, elemento nulo e divisão por zero.

### 2. Por que Há TypeScript e React no Projeto?
O Google AI Studio opera em um ambiente de contêiner voltado para aplicações web visuais interativas. Para que você pudesse testar a calculadora diretamente no navegador com:
- Teclado visual com cliques táteis e atalhos físicos;
- Simulador interativo do terminal do Python (`python3 calculadora.py`);
- Inspeção em tempo real de chamadas de funções, tipos de dados e docstrings;
- Execução em tempo real de testes unitários;

Foi desenvolvida uma interface rica em **React + TypeScript + Tailwind CSS** que atua como **bancada de testes interativa e ambiente de aprendizado**.

---

## Como Executar a Interface Web (React + TypeScript)

Para visualizar e utilizar a **calculadora gráfica interativa** no seu navegador (com teclado virtual e físico, áudio tátil sintetizado, emulador de terminal CLI e inspeção de código em tempo real):

### Pré-requisitos
- **Node.js** (versão 18 ou superior) instalado em sua máquina.
- **npm**, **yarn** ou **pnpm**.

### Passo a Passo

1. **Instale as dependências do projeto**:
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acesse no seu navegador**:
   Abra o endereço indicado no terminal:
   ```text
   http://localhost:3000
   ```

### Scripts npm Disponíveis no `package.json`

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local Vite na porta 3000 com recarregamento rápido. |
| `npm run build` | Compila o código TypeScript e empacota os ativos para a pasta `dist/`. |
| `npm run preview` | Executa um servidor local para testar a versão compilada de produção (`dist/`). |
| `npm run lint` | Executa a validação estática de tipos TypeScript via `tsc --noEmit`. |

---

## Como Executar o Código Python no Terminal (Python Puro)

Se você tiver o Python 3 instalado no seu computador (Linux, macOS ou Windows):

### 1. Executar a Calculadora no Terminal
```bash
python3 calculadora.py
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
python3 -m unittest test_calculadora.py -v
```

Saída esperada:
```text
test_dividir_com_decimais ... ok
test_dividir_exata ... ok
test_divisao_por_zero_lanca_excecao ... ok
test_multiplicar_decimais ... ok
test_multiplicar_elemento_nulo_zero ... ok
test_multiplicar_positivos ... ok
test_multiplicar_regra_de_sinais ... ok
test_somar_com_zero ... ok
test_somar_decimais ... ok
test_somar_negativos ... ok
test_somar_numeros_positivos ... ok
test_subtrair_decimais ... ok
test_subtrair_minuendo_maior ... ok
test_subtrair_minuendo_menor ... ok
test_subtrair_negativos ... ok

Ran 15 tests in 0.001s
OK
```

### 3. Importar as Funções em Outros Scripts Python
```python
from operacoes import somar, subtrair, multiplicar, dividir

print(somar(15, 25))        # 40
print(subtrair(50, 18))     # 32
print(multiplicar(7, 9))    # 63
print(dividir(100, 4))      # 25.0
```

---

## Detalhes das 4 Operações em Python

| Operação | Função Python | Operador | Tipo Retorno | Particularidade |
| :--- | :--- | :--- | :--- | :--- |
| **Adição** | `somar(a, b)` | `+` | `int` ou `float` | Se houver ao menos um `float`, promove o resultado para `float`. |
| **Subtração** | `subtrair(a, b)` | `-` | `int` ou `float` | Subtrai minuendo do subtraendo; gera negativos automaticamente se $b > a$. |
| **Multiplicação** | `multiplicar(a, b)` | `*` | `int` ou `float` | Comutativa ($a \times b = b \times a$); qualquer valor $\times 0 = 0$. |
| **Divisão** | `dividir(a, b)` | `/` | `float` | Em Python 3 sempre gera `float`. Lança `ZeroDivisionError` se $b = 0$. |

---

## Tratamento de Erros e Exceções

1. **`ZeroDivisionError`**:
   Divisão por zero não é permitida matematicamente. O código protege a execução:
   ```python
   def dividir(a: float, b: float) -> float:
       if b == 0:
           raise ZeroDivisionError("Erro: Impossível dividir por zero!")
       return a / b
   ```

2. **`ValueError`**:
   Ocorre quando o usuário digita letras ou caracteres inválidos no lugar de números. O script trata isso no loop de entrada:
   ```python
   try:
       entrada = float(input("Digite um número: "))
   except ValueError:
       print("Entrada inválida!")
   ```

# ADR 0001: Modularização do Pacote Python e Isolamento do Frontend Web

* **Status:** Aceito
* **Data:** 01/11/2026
* **Decisores:** sanaltomaz (Autor), Antigravity (AI Assistant)

---

## 1. Contexto e Motivação
No início do projeto, os scripts Python (`calculadora.py`, `operacoes.py`, `test_calculadora.py`) estavam localizados na raiz do projeto junto com os arquivos de configuração do ecossistema Node.js/Vite (`package.json`, `tsconfig.json`, `vite.config.ts`, etc.). 

Essa disposição apresentava problemas de manutenibilidade:
* Dificuldade de empacotamento e distribuição do código Python como biblioteca.
* Mistura de ferramentas de linting, testes e dependências entre Python e TypeScript.
* Ausência de uma suíte formal de testes com descoberta automática (`unittest discover`).

---

## 2. Decisão Arquitetural
Adotar a estrutura padrão de empacotamento da comunidade Python (PEP 517 / PEP 518) combinada com um diretório isolado para aplicações clientes:
1. Criar o pacote Python `calc_bit/` com `__init__.py` expondo a API pública.
2. Separar a interface CLI (`calc_bit/cli.py`) da lógica matemática pura (`calc_bit/operacoes.py`).
3. Centralizar os testes automatizados na pasta `tests/` com descoberta padrão via `unittest`.
4. Mover a interface gráfica em React/Vite para a subpasta `web/`.
5. Fornecer `main.py` na raiz apenas como orquestrador do ponto de entrada no terminal.

---

## 3. Como Foi Implementada
* **Estrutura de Diretórios Resultante:**
  ```text
  calc-bit-scientific/
  ├── main.py              # Ponto de entrada CLI rápido
  ├── calc_bit/            # Pacote Python
  │   ├── __init__.py      # Exportações públicas (somar, subtrair, etc.)
  │   ├── operacoes.py     # Lógica matemática pura
  │   └── cli.py           # Interface de menu no terminal
  ├── tests/               # Testes unitários automatizados
  │   └── test_operacoes.py
  └── web/                 # Aplicação React + TypeScript + Vite
  ```
* **Gitignore e Limpeza:** Criação de regras específicas para `.venv/`, `__pycache__/`, `web/node_modules/` e remoção de metadados temporários.

---

## 4. Consequências e Impactos
* **Pontos Positivos (+):**
  * Separação estrita de responsabilidades (*Separation of Concerns*).
  * O projeto se comporta como um pacote Python profissional e importável (`from calc_bit import somar`).
  * Facilidade de execução de testes com `python3 -m unittest discover -s tests -v`.
  * O frontend web fica desacoplado, facilitando deploys e builds independentes.
* **Compromissos / Desafios (-):**
  * Desenvolvedores precisam navegar até a pasta `web/` para executar comandos `npm install` e `npm run dev`.

---

## 5. Alternativas Consideradas e Motivo do Descarte
* **Alternativa A: Manter tudo na raiz:** Descartada por poluir o repositório e violar convenções de empacotamento Python.
* **Alternativa B: Repositórios Git separados (Monorepo vs Multirepo):** Descartada para manter a entrega simples e unificada no contexto dos desafios da Imersão da Google.

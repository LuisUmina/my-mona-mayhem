<!-- l10n-sync: source-file="workshop/01-setup.md" -->
# Parte 1: Configuração e Context Engineering

---

Nesta parte você vai configurar seu ambiente de desenvolvimento **e** ensinar o Copilot sobre a base de código — para que cada prompt futuro comece com o contexto adequado.

## Seção 1: Configuração Inicial

### Passo 1: Crie Seu Repositório

1. Abra [github.com/copilot-dev-days/mona-mayhem](https://github.com/copilot-dev-days/mona-mayhem)
2. Crie seu próprio repositório por uma destas opções:
   - clicando em **Use this template** → **Create a new repository**, ou
   - fazendo um fork do repositório.
3. Nomeie-o como `my-mona-mayhem` e defina a visibilidade como **Public** (se criou a partir do template)

<!-- track:vscode:start -->
### Passo 2: Escolha Seu Ambiente de Desenvolvimento

#### Opção A: VS Code Local

1. Abra o VS Code e execute **Git: Clone** → **Clone from GitHub**
2. Selecione seu repositório `my-mona-mayhem`
3. Quando solicitado, instale as **extensões recomendadas**

#### Opção B: GitHub Codespaces

1. Abra seu repositório no GitHub
2. Clique em **Code** → **Codespaces** → **Create codespace on main**
3. Aguarde o ambiente iniciar e as dependências serem instaladas

### Passo 3: Instale as Dependências e Inicie o Aplicativo

1. Abra o terminal integrado no seu repositório.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o aplicativo:

   ```bash
   npm run dev
   ```

> ✅ **O aplicativo está rodando no seu navegador!**
<!-- track:vscode:end -->

<!-- track:cli:start -->
### Passo 2: Instale o GitHub Copilot CLI

Use o caminho de instalação que corresponde à sua máquina:

- **npm (multiplataforma, requer Node.js 22+)**

  ```bash
  npm install -g @github/copilot
  ```

- **Homebrew (macOS/Linux)**

  ```bash
  brew install copilot-cli
  ```

- **WinGet (Windows)**

  ```bash
  winget install GitHub.Copilot
  ```

### Passo 3: Inicie o Aplicativo e Autentique o CLI

1. Clone seu repositório localmente e abra um terminal na raiz do projeto.
2. Instale as dependências e inicie o aplicativo:

   ```bash
   npm install
   npm run dev
   ```

3. Abra um **segundo terminal** no mesmo repositório e inicie o Copilot CLI:

   ```bash
   copilot
   ```

4. Na sessão interativa, digite:

   ```
   /login
   ```

5. Siga as instruções do fluxo de autenticação do dispositivo, depois confirme que confia no repositório quando o CLI solicitar aprovação.

> ✅ **Agora você tem a pré-visualização do aplicativo em um terminal e o Copilot CLI pronto em outro.**
<!-- track:cli:end -->

## Seção 2: Context Engineering

Context Engineering é como você ensina a IA sobre sua base de código. Quanto melhor o contexto, melhor será cada resposta futura.

<!-- track:vscode:start -->
### Tarefa 1: Gere Instruções do Workspace com /init

Vamos usar o comando integrado `/init` para gerar um arquivo de instruções do workspace para o Copilot:

1. Abra o **Copilot Chat** e digite:

   ```
   /init simple instructions with a project overview, build/dev commands, and Astro best practices, (ignore the workshop).
   ```

2. Revise o arquivo gerado — o Copilot analisará seu projeto e criará um `.github/copilot-instructions.md`.
3. Aceite as alterações, depois faça **commit** do arquivo de instruções.

> **Resultado:** Todas as futuras solicitações ao Copilot agora têm um mapa do seu workspace incorporado.

### Tarefa 2: Agentes em Segundo Plano

**Agente em segundo plano local:**

1. No painel de Chat, clique em **+** → **New background agent**
2. Digite o prompt:

   > "Add linting rules for unused vars and improve code style; fix any errors"

3. Quando terminar, **Revise e Aplique** as alterações, depois delete a sessão.

**Agente na nuvem:**

1. Inicie outro agente em segundo plano com:

   > "Make the README more engaging as a landing page"

> **Resultado:** Regras de linting adicionadas, erros corrigidos, README melhorado — tudo sem sair do seu editor.

### Tarefa 3: Explore o Projeto

Abra o **Copilot Chat** no **modo Ask** e experimente estes prompts:

- `"Explain the architecture of this project"`
- `"What files are in the src directory and what do they do?"`
- `"What would I need to build to make the Battle button work?"`

> 💡 Use **@workspace** para dar ao Copilot contexto de todo o projeto para respostas mais precisas.
<!-- track:vscode:end -->

<!-- track:cli:start -->
### Tarefa 1: Gere Instruções do Repositório com /init

Vamos usar `/init` para gerar um arquivo de instruções do workspace para o Copilot:

1. No Copilot CLI, digite:

   ```
   /init simple instructions with a project overview, build/dev commands, and Astro best practices, (ignore the workshop).
   ```

2. Revise o arquivo gerado — o Copilot analisará seu projeto e criará um `.github/copilot-instructions.md`.
3. Faça commit do arquivo de instruções.

> **Resultado:** As sessões futuras do CLI herdam automaticamente as instruções específicas do repositório a partir de `.github/copilot-instructions.md`.

### Tarefa 2: Configure Seu Ambiente CLI

Pratique os controles do CLI que facilitarão os passos posteriores:

1. Execute `/help` para verificar os comandos slash disponíveis.
2. Use `/model` para inspecionar os modelos disponíveis para você.
3. Se o Copilot aprendeu muitas aprovações durante a experimentação, reinicie-as com:

   ```
   /reset-allowed-tools
   ```

4. Se seu repositório está dentro de um diretório pai maior, use `/add-dir PATH` para ampliar explicitamente o workspace permitido.

> 💡 A documentação do CLI recomenda instruções personalizadas concisas mais permissões de ferramentas explícitas para que o Copilot se mantenha rápido e previsível.

### Tarefa 3: Explore o Projeto pelo Terminal

Experimente estes prompts dentro do Copilot CLI:

- `Give me an overview of this project.`
- `@src/pages/api/contributions/[username].ts What is this file for and what needs to be built here?`
- `@src/pages/index.astro What exists here and what would I need to add to build the battle page?`

Se quiser uma resposta rápida de disparo único fora da sessão interativa, experimente:

```bash
copilot -p "Summarize the architecture of this repo in 5 bullet points"
```

> **Resultado:** Agora você tem instruções, conhecimento de comandos e uma noção de como alimentar arquivos no contexto do Copilot CLI.
<!-- track:cli:end -->

## ✅ Parte 1 Completa

Você aprendeu como:

- **Configurar** o repositório e o ambiente de desenvolvimento local
- **Gerar instruções** com `/init` para que o Copilot entenda seu projeto e a direção de design
- **Estabelecer um hábito de revisão** antes de aplicar alterações geradas
- **Explorar a base de código** com prompts ricos em contexto

<!-- l10n-sync: source-file="README.md" -->
# 🎮 Mona Mayhem

**Workshop VS Code GitHub Copilot** — Construa uma Arena de Batalha de Contribuições GitHub

Aplicativo Astro de arcade para comparar as contribuições GitHub de dois usuários. Inclui API, totais, vencedor ou empate e calendários diários interativos, com layout responsivo, navegação por teclado e movimento reduzido. Consulte o [funcionamento da comparação](docs/battle.md) e o [contrato da API](docs/api-contributions.md).

![Mona Mayhem Screenshot](https://github.com/user-attachments/assets/5eca79e2-cb9f-4e93-aa0d-23666ebde3b7)

## 📚 Workshop

| Parte | Título | Recurso do Copilot |
|-------|--------|-------------------|
| [00](workshop/pt_BR/00-overview.md) | Visão Geral | O que você vai aprender |
| [01](workshop/pt_BR/01-setup.md) | Configuração & Engenharia de Contexto | Instruções de workspace, background agents |
| [02](workshop/pt_BR/02-plan-and-scaffold.md) | Planejar & Estruturar | Plan Mode |
| [03](workshop/pt_BR/03-agent-mode.md) | Agent Mode: Construir o Jogo | Agent Mode |
| [04](workshop/pt_BR/04-design-vibes.md) | Temas Design-First | Plan + Agent Mode |
| [05](workshop/pt_BR/05-polish.md) | Polimento & Multi-Agent | Background & cloud agents |
| [06](workshop/pt_BR/06-bonus.md) | Bônus & Extensões | Desafios abertos |

## 🚀 Início Rápido

1. **Use este template** → Crie um novo repositório
2. Clone e abra no VS Code
3. Instale as dependências com `npm ci` e inicie o aplicativo com `npm run dev`
4. Siga o [guia do workshop](workshop/pt_BR/00-overview.md)

## Pré-requisitos

- VS Code v1.107+
- GitHub Copilot (Pro, Business ou Enterprise)
- Node.js >=22.12.0
- Git

É necessário npm >=9.6.5. `.nvmrc` fixa a versão mínima compatível do Node.

## Verificação e portal do workshop

```sh
npm ci
npm test
npm run build
npm run docs:build
```

`npm test` verifica a comparação, a API de contribuições, cache, erros, navegação entre idiomas, configuração do conteúdo e arquivos do portal gerado. `npm run build` compila o aplicativo de servidor; não executa uma verificação completa de tipos TypeScript. `npm run dev` permite comparar dois usuários em http://localhost:4321. O aplicativo e sua API precisam do servidor Astro Node; o GitHub Pages publica o guia do workshop.

`npm run docs:build` gera `_site/` com o portal e as lições nos três idiomas. Sirva essa pasta com um servidor HTTP estático para visualizar a publicação. Ao servir a raiz do repositório em localhost, `/docs/` também carrega as lições de `/workshop/`.

Por padrão, o portal usa o conteúdo incluído na publicação, permitindo que forks exibam suas próprias lições. Para alterar a origem, configure `contentBase` em `docs/workshop-config.js`: o diretório deve conter os Markdown em inglês e as subpastas `es/` e `pt_BR/`. URLs relativas partem da raiz do portal; origens externas devem permitir CORS. O valor `null` usa o conteúdo incluído.

O workflow do GitHub Pages instala dependências, executa testes e compila Astro para validar o projeto. Publica apenas `_site/`; o aplicativo de servidor requer hospedagem Node.

## Stack Tecnológica

- **Framework**: [Astro](https://astro.build/) v6
- **Runtime**: Node.js com adaptador [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/)
- **Fonte**: Press Start 2P (fonte de jogos retrô)
- **API**: API de gráfico de contribuições do GitHub

## Licença

MIT

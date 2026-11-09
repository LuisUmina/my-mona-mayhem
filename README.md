🌐 [Português (Brasil)](README.pt_BR.md) | [Español](README.es.md)

# 🎮 Mona Mayhem

**VS Code & GitHub Copilot CLI Workshop** — Build a GitHub Contribution Battle Arena

A workshop template for building a retro arcade-themed website with Astro that compares GitHub contribution graphs of two users. This is the **starting point** — you'll build the app step by step using GitHub Copilot.

![Mona Mayhem Screenshot](https://github.com/user-attachments/assets/5eca79e2-cb9f-4e93-aa0d-23666ebde3b7)
*What you'll build by the end of the workshop*

## 📚 Workshop

The workshop supports two tracks — follow the one that matches your preferred workflow:

- **VS Code track** — Chat, Plan Mode, Agent Mode, background agents, and editor-native review loops
- **CLI track** — `copilot`, `@file` context, `/plan`, autonomous edits, `/fleet`, `/delegate`, and `/review`

| Part | Title | Copilot Focus |
|------|-------|---------------|
| [00](workshop/00-overview.md) | Overview | Track selection and learning goals |
| [01](workshop/01-setup.md) | Setup & Context Engineering | Instructions, permissions, and environment setup |
| [02](workshop/02-plan-and-scaffold.md) | Plan & Scaffold | Planning the API and page architecture |
| [03](workshop/03-agent-mode.md) | Build the Game | Agentic implementation and iteration |
| [04](workshop/04-design-vibes.md) | Design-First Theming | Visual design planning and implementation |
| [05](workshop/05-polish.md) | Polish & Parallel Work | Parallelism, reviews, and quality passes |
| [06](workshop/06-bonus.md) | Bonus & Extensions | Open-ended feature ideas and extra Copilot experiments |

## 🚀 Quick Start

1. **Create your own repo first** by either:
   - clicking **Use this template** to create a new repo, or
   - forking this repository.
2. Choose your workshop path:
   - **VS Code:** clone your repo and open it in VS Code.
   - **GitHub Copilot CLI:** clone your repo locally, install `copilot`, and work from your terminal.
3. Follow the [workshop guide](workshop/00-overview.md)

### Run locally

Use Node.js >=22.12.0 and npm >=9.6.5. `.nvmrc` pins the minimum supported Node version.

```sh
npm ci
npm run dev
```

Open http://localhost:4321. The initial page is a welcome screen; the contribution API intentionally returns HTTP 501 until implemented during the workshop.

To verify the base and prepare the documentation portal:

```sh
npm test
npm run build
npm run docs:build
```

`npm test` checks language navigation, content configuration, and the generated portal. `npm run build` compiles the server app; it does not perform a full TypeScript check. `npm run docs:build` copies the portal and all three languages into `_site/`. Serve that directory with a static HTTP server to preview the deployed portal. When serving the repository root on localhost, `/docs/` also loads lessons directly from `/workshop/`.

### Workshop content source

The portal loads the workshop files included in the deployment, so forks display their own lessons. To use another source, set `contentBase` in `docs/workshop-config.js` to a directory URL containing the English Markdown files and the `es/` and `pt_BR/` subdirectories. Relative URLs resolve from the portal root; external sources must allow browser requests (CORS). Leave it as `null` to use the bundled content.

## Prerequisites

### Shared

- GitHub Copilot (Pro, Business, or Enterprise)
- Git
- Node.js >=22.12.0

### VS Code track

- VS Code v1.107+
- GitHub Copilot extension signed in

### CLI track

- GitHub Copilot CLI (`copilot`)
- Node.js >=22.12.0 if you plan to install the CLI via `npm install -g @github/copilot`
- Or Homebrew / WinGet if you prefer a native package manager install

## Technology Stack

- **Framework**: [Astro](https://astro.build/) v6
- **Runtime**: Node.js with [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) adapter
- **Font**: Press Start 2P (retro gaming font)
- **API**: GitHub's contribution graph API

## Deployment Notes

### Current GitHub Pages setup

The workflow in `.github/workflows/deploy.yml` installs dependencies, runs regression tests, and builds the Astro app as validation. It then prepares static content from `docs/` and `workshop/` using `npm run docs:build` and deploys `_site/` to GitHub Pages. The Astro server app from `src/` is not deployed to Pages.

### If you want to deploy the Astro app to GitHub Pages

GitHub Pages is static hosting, so the Astro app should use static output.

1. Change `output` in `astro.config.mjs` from `server` to `static`.
2. Remove the Node adapter (`@astrojs/node`) from `astro.config.mjs` and `package.json`.
3. Update the GitHub Actions workflow to run `npm ci` and `npm run build`, then upload `dist/` as the Pages artifact.
4. If deploying to a project page (`https://<user>.github.io/<repo>/`), set `site` and `base` in `astro.config.mjs`.

If you plan to keep API routes running in production, use a server platform instead of GitHub Pages (for example, Vercel, Netlify, or a Node host).

## License

MIT

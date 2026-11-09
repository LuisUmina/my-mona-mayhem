# Verification and CI

Use Node.js >=22.12.0 and install development dependencies:

```sh
npm ci
npm run verify
```

`verify` stops at the first failure and performs these steps:

1. `npm test`: unit tests for the API, cache, comparison, calendars and workshop portal.
2. `npm run build`: its `prebuild` hook runs `npm run check`, then Astro builds the application.
3. `npm run test:ui`: tests the built HTTP server and interactive page with controlled GitHub responses.
4. `npm run docs:build`: prepares the workshop portal in `_site/`.

## Type checking

`npm run check` uses [Astro's checker](https://docs.astro.build/en/reference/cli-reference/#astro-check) for the project's TypeScript, Astro components and configuration. Strict types and unused local/parameter checks are enabled. Errors and warnings fail the check. Generated output and JavaScript test fixtures are outside the source type-check scope.

The check is automatic before every `npm run build`. It is separate from linting; no linter is required or added.

TypeScript stays on the supported 6.x major because the installed Astro checker supports TypeScript 5/6. The test DOM stays on jsdom 27.x to preserve the project's Node 22.12 minimum. These are development dependencies; the application runtime does not import them.

## Compiled application integration tests

Build first when running these tests separately:

```sh
npm run build
npm run test:ui
```

The suite starts `dist/server/entry.mjs` on an available loopback port in an owned child process. A Node `--import` hook in `tests/helpers/github-fixture.mjs` replaces GitHub requests in that process only. Other outbound requests are rejected. No credentials or live GitHub requests are needed, and no fixture switch or test endpoint exists in production code.

The suite fetches the actual server-rendered HTML and executes its built ES modules in [jsdom](https://github.com/jsdom/jsdom). Client requests go through HTTP to the real API route, normalization and cache before reaching the upstream fixtures. Each screen has an isolated DOM; the server and timers are closed after testing.

Coverage includes:

- Empty/invalid users, error messages and focus on the affected field.
- Form submission, disabled loading state, winner, totals, calendars and result focus.
- A second comparison clearing old results and replacing calendars.
- Missing users, zero-activity ties, rate limiting and retry without reload.
- Incompatible periods and invalid upstream responses, without partial results.
- Client timeout, form recovery and a successful fresh retry. Only the client deadline is shortened in this test.
- Calendar keyboard/pointer events, exact counts and one keyboard entry point per calendar.

Node's `--experimental-vm-modules` flag is used only by this test command to execute the built ES modules in the isolated DOM.

### Scope

jsdom does not render a real browser layout. These tests cover application behavior and HTTP integration; they do not replace visual/mobile checks, native browser Enter behavior or screen reader testing. The previous phases' real-browser checks remain separate. The suite does not claim cross-browser or automated accessibility certification.

## GitHub Actions

`.github/workflows/verify.yml` runs on pull requests, manual dispatch, and calls from the deployment workflow. It installs dependencies with `npm ci`, runs the same `npm run verify` command on Node 22.12.0, and saves `_site/` only after success. The validation job has read-only repository permissions.

On pushes to `main`, `.github/workflows/deploy.yml` calls verification first. Its deployment job depends on that result and downloads the workshop artifact from the same workflow run. It publishes that already-verified artifact instead of rebuilding a second copy. Pull request validation does not publish Pages.

GitHub Pages still hosts the guide only. Hosting the interactive Node application belongs to phase 6.

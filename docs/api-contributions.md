# Contributions API

`GET /api/contributions/{username}` runs on the Astro Node server. It is not available on the static GitHub Pages workshop portal.

```sh
npm ci
npm run dev
curl http://localhost:4321/api/contributions/octocat
```

## Source and date range

The server requests `https://github.com/{username}.contribs` with JSON accept headers. This public endpoint currently supplies schema `v2` without a token. It is a GitHub website endpoint rather than a versioned REST/GraphQL API; changes to its format are rejected with a controlled `502` instead of exposing incorrect results. There is no automatic fallback to another provider.

The API uses GitHub's default rolling contribution period and returns its exact inclusive `from` and `to` dates. Dates are interpreted in UTC. Custom periods/query parameters are not supported in this phase. The comparison page must verify that both responses cover the same period.

`privateContributionsIncluded` preserves the source's flag; consumers should display it rather than assuming all counts are public-only. No repository details or credentials are returned.

## Successful response — HTTP 200

| Field | Type | Meaning |
|---|---|---|
| `username` | string | Validated, lowercase GitHub username |
| `from`, `to` | YYYY-MM-DD | Inclusive contribution period |
| `rangeDays` | integer | Number of consecutive days in that period |
| `totalContributions` | integer | Sum of all daily counts |
| `privateContributionsIncluded` | boolean | Flag supplied by GitHub |
| `generatedAt` | string | Generation timestamp supplied by GitHub |
| `colors` | string[5] | Validated hex palette, levels 0–4 |
| `weeks` | array | Weeks with `firstDay` and `contributionDays` |

Each entry in `contributionDays` has this shape:

```json
{
  "date": "2026-01-02",
  "weekday": 5,
  "contributionCount": 2,
  "level": 2,
  "color": "#40c463"
}
```

`weekday` runs from Sunday (0) through Saturday (6). Edge weeks may contain fewer than seven days. The server checks dates, continuity, counts, palette, levels, declared range and total before caching a response.

## Errors

Errors return JSON with `error` (a safe message) and `code` (a stable identifier).

| Status | Code | Meaning |
|---|---|---|
| 400 | `INVALID_USERNAME` | Use 1–39 ASCII letters/digits with optional single internal hyphens |
| 404 | `USER_NOT_FOUND` | GitHub returned 404 |
| 502 | `UPSTREAM_ERROR` | GitHub/network/redirect failure |
| 502 | `INVALID_UPSTREAM_DATA` | Invalid JSON, unsupported schema or inconsistent calendar |
| 503 | `UPSTREAM_UNAVAILABLE` | GitHub returned 403 or 429 |
| 503 | `SERVER_BUSY` | Maximum concurrent unique requests reached |
| 504 | `UPSTREAM_TIMEOUT` | GitHub request or body read exceeded 10 seconds |
| 500 | `INTERNAL_ERROR` | Unexpected internal error; details are not exposed |

503 responses include `Retry-After: 60`. A missing username path is handled by Astro routing as 404.

## Cache and limits

- Successful responses are cached in memory for five minutes, with a maximum of 100 usernames per server process. Oldest inserted entries are evicted when full.
- Keys ignore username casing. Simultaneous requests for the same user share one upstream request. At most 100 unique upstream requests run concurrently.
- Entries are invalidated when the UTC day changes. Errors are not cached. The 10-second timeout covers both response headers and body.
- Responses use `Cache-Control: no-store`: freshness is managed by the server cache, without a second browser/CDN cache. Server processes have independent caches; restarts clear them.
- The upstream hostname is fixed and redirects are rejected. User input cannot select another host.

## Verification

`npm test` runs deterministic tests without network access, covering partial weeks, calendar validation, upstream failures, timeout, cache expiry, concurrent request sharing and the HTTP JSON contract. Node's type stripping flag runs the TypeScript service on the minimum supported Node version without an additional test runner.

`npm run build` produces `dist/server/entry.mjs`. Run it with Node on a server host to exercise the built API; GitHub Pages continues to publish documentation only.

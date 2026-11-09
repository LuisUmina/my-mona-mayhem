# Comparing two GitHub users

The Mona Mayhem application now includes a working comparison screen. Start it locally:

```sh
npm ci
npm run dev
```

Open http://localhost:4321, enter two GitHub usernames without `@`, and click **Comparar contribuciones** or press **Enter** in either field.

The app fetches both users in parallel and displays:

- Total contributions for each user, with links to their GitHub profiles.
- The inclusive date range and number of days compared.
- The winner and contribution difference, or a tie when totals match (including zero).
- Whether GitHub reports private contribution counts as included.
- A complete daily contribution calendar for each user, with month and weekday labels.

Usernames are trimmed, normalized to lowercase and validated before requesting data. Comparing the same user is allowed and produces a tie. The app only declares a result when both responses have the same period.

While a comparison is loading, fields and the submit button are disabled to prevent duplicate submissions. Errors explain how to correct a username or retry. Editing a field hides the previous results so they cannot be confused with the newly entered users. The client cancels unfinished requests when the comparison finishes or after 15 seconds; the server has its own 10-second upstream timeout.

The form has explicit labels, keyboard submission, live status/error messages and focus management. Results become the focus after success; invalid or missing usernames focus the affected input. Without JavaScript, the page explains that it must be enabled.

## Interactive calendars and arcade theme

Each square is one actual day from the API, including zero-activity days and partial weeks. The browser checks the calendar's date continuity, week order, weekdays, total, counts and levels before rendering it. No days are fabricated or padded with contributions.

The five greens represent intensity relative to each user's own activity, not identical absolute thresholds across users. The legend explains direction; the day inspector provides the exact date and count without relying on color. Hover over a day, click/tap it, or focus it to inspect its details.

Each calendar has one keyboard entry point, initially the latest day. Use **Up/Down** for the previous/next day, **Left/Right** for the previous/next week, and **Home/End** for the first/last day. **Tab** leaves the calendar instead of stopping at every square. The 44-pixel previous/next controls are an alternative for touch input. Focused dates are scrolled into view without animated scrolling.

Calendars sit side by side on wide screens and stack on narrower ones. On mobile, the year scrolls inside its calendar; the page itself stays within the viewport. A persistent detail panel avoids floating tooltips covering the graph or disappearing on touch devices.

The arcade styling uses the locally served Press Start 2P font, a pixel favicon, and lime/lavender accents. The original font license is included in `public/fonts/OFL.txt`. Short result transitions and button effects are disabled when `prefers-reduced-motion: reduce` is active. No flashing effects or external font requests are used.

## Application versus workshop portal

GitHub Pages publishes the workshop guide from `_site/`. The interactive application and its API run on the Astro Node server. Pushing a commit validates and publishes the guide; it does not host the Node application on Pages.

`npm run build` builds the application; `node dist/server/entry.mjs` starts the built server. The [API documentation](api-contributions.md) describes the upstream data, cache and error contract.

## Checks

Run `npm run verify` for source type checking, unit tests, a production build, compiled-page integration tests and portal generation. See [verification and CI](verification.md) for commands, test coverage and the distinction between DOM integration and real-browser checks.

`npm test` covers parallel requests, winners, ties, periods, malformed data, calendar continuity, leap days, keyboard targets, validation, cancellation and retries, plus the existing API and workshop tests. Real-browser checks cover winning and zero-activity tie results, complete calendars, arrow/Home/End/Tab navigation, previous/next controls, local font loading, and desktop/mobile widths without page overflow.

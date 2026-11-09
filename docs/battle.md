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

Usernames are trimmed, normalized to lowercase and validated before requesting data. Comparing the same user is allowed and produces a tie. The app only declares a result when both responses have the same period.

While a comparison is loading, fields and the submit button are disabled to prevent duplicate submissions. Errors explain how to correct a username or retry. Editing a field hides the previous results so they cannot be confused with the newly entered users. The client cancels unfinished requests when the comparison finishes or after 15 seconds; the server has its own 10-second upstream timeout.

The form has explicit labels, keyboard submission, live status/error messages and focus management. Results become the focus after success; invalid or missing usernames focus the affected input. Without JavaScript, the page explains that it must be enabled.

Calendar heatmaps and the full arcade visual treatment belong to phase 4. The current screen compares contribution totals.

## Application versus workshop portal

GitHub Pages publishes the workshop guide from `_site/`. The interactive application and its API run on the Astro Node server. Pushing a commit validates and publishes the guide; it does not host the Node application on Pages.

`npm run build` builds the application; `node dist/server/entry.mjs` starts the built server. The [API documentation](api-contributions.md) describes the upstream data, cache and error contract.

## Checks

`npm test` includes deterministic comparison tests for parallel requests, winners in either position, ties, matching periods, malformed data, validation, cancellation and retries, in addition to the existing API and workshop tests. The comparison page was also checked in a real browser for empty inputs, Enter submission, a real winning result, a nonexistent user, recovery to a tie, and a mobile breakpoint.

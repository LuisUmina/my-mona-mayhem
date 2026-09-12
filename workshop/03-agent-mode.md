# Part 3: Build the Game with Agentic Workflows

---

This part is where Copilot goes from planner to implementer. Instead of writing code line by line, you describe what you want and let Copilot carry out the work across the files it needs to change.

## Task 1: Wire Up the Battle

<!-- track:vscode:start -->
1. Switch to **Agent** mode in Copilot Chat.
2. Enter this prompt:
<!-- track:vscode:end -->

<!-- track:cli:start -->
1. Return Copilot CLI to its standard coding flow (or stay in autopilot if you want Copilot to keep moving until you stop it).
2. Mention the page file for extra context if helpful: `@src/pages/index.astro`
3. Enter this prompt:
<!-- track:cli:end -->

   > Add client-side JavaScript to the battle page that:
   > 1. When the Battle button is clicked, gets both usernames from the inputs
   > 2. Validates both are filled (show error if not)
   > 3. Fetches both users' contribution data in parallel from our API
   > 4. Renders contribution graphs as colored grids — each day is a colored square using GitHub's color palette
   > 5. Shows a VS badge between the two users
   > 6. Displays username, total contributions, and date range for each user
   > 7. Handles loading states and errors
   > 8. Also triggers on Enter key in input fields.
   > 9. Simple UI for now that is already scaffolded.
   >
   > Use TypeScript interfaces for the contribution data structure.

<!-- track:vscode:start -->
3. Let Agent Mode work through the implementation across `index.astro`.
4. Review the proposed changes in the diff view before accepting them.
<!-- track:vscode:end -->

<!-- track:cli:start -->
4. Let Copilot CLI work through the implementation across `src/pages/index.astro`.
5. Use `/diff` to inspect the generated changes, then approve them.
<!-- track:cli:end -->

## Task 2: Test the Battle

> **⚠️ Not seeing changes?** If the battle page hasn't updated, stop the dev server (`Ctrl+C`) and restart with `npm run dev`, then refresh your browser.

1. Enter `octocat` and `torvalds` as the two usernames, then click **Battle**.
2. You should see both contribution graphs rendered side by side with colored grids.
3. Test error cases:
   - Leave one or both fields empty and click Battle — you should see a validation error.
   - Enter an invalid username — the app should display an error from the API.
4. Test pressing **Enter** in either input field — it should trigger the battle just like clicking the button.

## Task 3: Iterate with Copilot

If anything isn't quite right, give Copilot follow-up feedback directly. For example:

- *"The contribution squares are too large, make them 12x12px"*
- *"Add a hover tooltip showing the date and contribution count"*
- *"The loading state needs a pulse animation"*

<!-- track:vscode:start -->
Agent Mode handles multi-file changes and iterations naturally. Each follow-up prompt builds on the previous conversation, so you can refine the implementation incrementally without starting over.
<!-- track:vscode:end -->

<!-- track:cli:start -->
Copilot CLI sessions keep their history, so each follow-up prompt builds on the last one. Use `/session` or `/context` if you want to inspect what Copilot is carrying forward, and `/review` after a larger iteration if you want an extra pass for bugs or polish.
<!-- track:cli:end -->

## Tips for This Part

- **Be specific about what you want** — clear requirements lead to better results.
- **Break down large tasks into smaller prompts** if Copilot goes off track.
- **Review changes before accepting** — generated code is faster to inspect than to rewrite later.
- **Test the app immediately after each implementation pass** so issues stay localized.

## ✅ Part 3 Complete

You've learned how to:

- Use Copilot for **multi-file implementation work**
- **Iterate on results** with focused follow-up prompts
- Handle the **full feature loop** — implementation, review, testing, and refinement

# Part 2: Plan & Scaffold

---

Before writing any code, let's use Copilot's planning workflows to think through the architecture. Planning first helps you design better systems and gives Copilot the context it needs to generate higher-quality code.

## Task 1: Plan the API Architecture

<!-- track:vscode:start -->
1. Switch to **Plan** mode in Copilot Chat (click the mode selector at the bottom of the chat panel)
<!-- track:vscode:end -->

<!-- track:cli:start -->
1. Enter **plan mode** in Copilot CLI by pressing **Shift+Tab** until the mode changes, or by using `/plan`.
<!-- track:cli:end -->

2. Enter this prompt:

   ```
   I need to build a server-side API proxy that fetches GitHub contribution data
   for any username. The endpoint is https://github.com/{username}.contribs which
   returns JSON. We need to bypass CORS restrictions. Plan the implementation
   including the route structure, error handling, and caching strategy.
   ```

3. **Review the plan** — this is where planning shines. Don't just accept the first response:
   - Ask for clarifications on anything unclear
   - Suggest changes if something doesn't feel right
   - Iterate until you're satisfied with the approach

<!-- track:vscode:start -->
4. Once you're happy with the plan, ask Copilot to implement it — switch to **Agent** mode and tell it to go ahead.
<!-- track:vscode:end -->

<!-- track:cli:start -->
4. Once you're happy with the plan, tell Copilot CLI to proceed with implementation.
5. Review the resulting file edits with `/diff` before approving them.
<!-- track:cli:end -->

6. **Result:** You should now have an API route created at:

   ```
   src/pages/api/contributions/[username].ts
   ```

## Task 2: Test the API

> **⚠️ Not seeing changes?** If the dev server doesn't pick up the new route, stop it (`Ctrl+C`) and restart with `npm run dev`.

1. Make sure your dev server is running, then test the endpoint:

   ```bash
   curl http://localhost:4321/api/contributions/octocat
   ```

2. You should see JSON with contribution data returned.
3. Test the error case too — try an invalid username and confirm it returns an appropriate error response.

## Task 3: Plan the Battle Page

<!-- track:vscode:start -->
1. Stay in **Plan** mode and enter this prompt:
<!-- track:vscode:end -->

<!-- track:cli:start -->
1. Stay in plan mode (or run `/plan`) and enter this prompt:
<!-- track:cli:end -->

   ```
   Now I need the main page. Plan a battle page for "Mona Mayhem - GitHub
   Contribution Battle Arena" with: two username inputs (Player 1 and Player 2),
   a battle button, and a results area. Keep the UI simple — don't over-engineer
   the layout or styling at this stage. Plan the HTML structure, basic styling,
   and how the battle interaction will work.
   ```

2. **Review and iterate** on the plan — ask questions, suggest changes, refine the approach.

<!-- track:vscode:start -->
3. When you're satisfied, switch to **Agent** mode and let Copilot build the page.
<!-- track:vscode:end -->

<!-- track:cli:start -->
3. When you're satisfied, have Copilot CLI implement the approved plan.
4. Use `/diff` again to inspect the HTML and CSS scaffolding before approving.
<!-- track:cli:end -->

## Task 4: Verify the Scaffold

> **⚠️ Not seeing changes?** If the page doesn't look right or hasn't updated, stop the dev server (`Ctrl+C`) and restart with `npm run dev`, then refresh your browser.

1. Open http://localhost:4321 in your browser.
2. You should see:
   - The game title
   - Two username input fields (Player 1 and Player 2)
   - A battle button
3. The button won't work yet — that's expected! We haven't wired up the interaction logic. That comes next.

---

## ✅ Part 2 Complete!

You've learned how to:

- **Plan before coding** instead of jumping straight into implementation
- **Iterate on plans** until the architecture feels right
- **Move from plan to implementation** with a clearer, safer workflow

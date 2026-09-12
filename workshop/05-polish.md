# Part 5: Polish & Parallel Work

---

Now that the app works and looks great, it's time to polish. This part is about splitting work up so you can improve responsiveness, error handling, and quality without doing everything in a single serial loop.

<!-- track:vscode:start -->
## Task 1: Background Agent for Responsive Design

1. In the Chat panel, click **+** for a new chat
2. In the bottom of the window you will see **Local** change to **Copilot CLI**
3. Enter this prompt:

   ```
   Add responsive CSS media queries: at 1024px switch comparison to single column,
   at 768px reduce font sizes, stack inputs vertically, and make the layout
   mobile-friendly. Also improve keyboard accessibility — ensure tab order works,
   Enter triggers battle, and focus states are visible.
   ```

4. Let it run independently — you don't need to watch it.
5. When it finishes, **Review** the changes and click **Apply**.

## Task 2: Background Agent for Error UX

1. Start another background agent.
2. Enter this prompt:

   ```
   Improve the error experience: add a shake animation for errors, styled error
   messages with red (#ff3366) neon glow effects matching the arcade theme, and
   better input validation feedback. Show clear error messages when usernames are
   empty or invalid.
   ```

3. Review the changes when the agent completes and click **Apply**.

## Task 3: Cloud Agent for Variations (Optional)

1. In the Chat panel, click **+** for a new chat
2. In the bottom of the window you will see **Local** change to **Cloud**
3. Enter this prompt:

   ```
   Create an alternative color theme for the battle page — keep the retro arcade
   style but use blue (#00f5ff) and orange (#ff6b35) instead of green and purple.
   Create it as a CSS custom property theme that could be toggled.
   ```

4. Check **agent sessions** to monitor progress.
5. Review the design variation in the PR the cloud agent creates.

## Task 4: Verify Everything
<!-- track:vscode:end -->

<!-- track:cli:start -->
## Task 1: Split the Work with `/fleet`

In Copilot CLI, use `/fleet` to split the work across parallel subagents, then review the combined output:

```text
/fleet Improve the app in parallel:
1. Add responsive CSS media queries so the comparison collapses to one column at 1024px and the inputs stack on small screens.
2. Improve keyboard accessibility and focus visibility.
3. Improve the error experience with stronger validation feedback and arcade-style neon error states.
```

Let the CLI orchestrate the work, then inspect the combined result with `/diff` before approving anything.

## Task 2: Delegate a Variation (Optional)

If you want to try an asynchronous cloud workflow, delegate a design variation:

```text
/delegate Create an alternative color theme for the battle page that keeps the retro arcade look but swaps in blue (#00f5ff) and orange (#ff6b35). Make it easy to toggle.
```

That delegated task should create a pull request you can review separately while you keep working locally.

## Task 3: Run an Agentic Review

Before you wrap up, ask Copilot CLI for a review pass:

```text
/review Focus on potential bugs, accessibility issues, and UX regressions in the current branch.
```

Review the findings, fix anything you agree with, then run `/diff` again so you're clear on what changed.

## Task 4: Verify Everything
<!-- track:cli:end -->

> **⚠️ Not seeing changes?** If any of the polish updates aren't showing up, stop the dev server (`Ctrl+C`) and restart with `npm run dev`, then do a hard refresh (`Ctrl+Shift+R`) in your browser.

Run through these test scenarios to make sure everything works:

| Test | Expected Result |
|------|----------------|
| Empty fields, click Battle | Styled error with shake animation |
| Valid usernames | Contribution graphs displayed |
| Invalid username | Error from API with retro styling |
| Enter key in input | Triggers battle |
| Mobile width | Single-column responsive layout |
| Hover contribution squares | Tooltip with date and count |

Build for production and confirm there are no errors:

```bash
npm run build && npm run preview
```

Once everything looks good, commit your working code.

---

## ✅ Part 5 Complete!

**What you learned:**

- Break polish work into **smaller parallel tasks**
- Review generated changes before merging them into your main branch
- Use Copilot for **quality passes and optional explorations**, not just implementation

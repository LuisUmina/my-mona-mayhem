# Part 4: Design-First Theming

---

In this part, you'll use Copilot's planning and implementation loops to design a comprehensive theme transformation. This is design-first development — start with the vision, iterate on the visuals, and let Copilot handle the CSS heavy lifting.

## Task 1: Plan the Retro Theme

<!-- track:vscode:start -->
Switch to **Plan** mode in GitHub Copilot Chat.
<!-- track:vscode:end -->

<!-- track:cli:start -->
Use `/plan` in GitHub Copilot CLI, or press **Shift+Tab** until plan mode is active.
<!-- track:cli:end -->

Enter this prompt:

> I want to transform this page into a full retro arcade experience. Plan a comprehensive visual overhaul that includes: CRT scanline effects on the background, neon glow on the title that pulses like a neon sign, animated VS badge with gradient color shifts, shine/shimmer overlay on the user result cards, float-in animations for input fields, color-shifting loading text between green and purple, and hover glow effects on contribution squares. Keep the dark background (`#0a0a1a`) with green (`#5fed83`) and purple (`#8a2be2`) accent colors. Use a dark theme with the Press Start 2P retro gaming font from Google Fonts.

Copilot will generate a detailed implementation plan covering all the visual effects. **Don't accept it immediately** — review the plan and iterate:

- Suggest adjustments to animation timing (for example, *"Make the neon pulse slower, around 3 seconds"*)
- Ask about specific effects (for example, *"How will the shimmer overlay work on the cards?"*)
- Request changes to the approach if something doesn't feel right

## Task 2: Implement the Theme

When you're satisfied with the plan, tell Copilot to implement it.

> Implement the retro arcade theme plan we just designed.

Copilot will add multiple CSS animations, pseudo-elements, and transitions across your stylesheet. This may include:

- `@keyframes` for scanlines, neon pulse, shimmer, and float-in effects
- Pseudo-elements (`::before`, `::after`) for overlay effects
- CSS custom properties for theme colors
- Transition and hover states for interactive elements

<!-- track:cli:start -->
After the changes land, use `/diff` to review the styling changes before you approve them.
<!-- track:cli:end -->

## Task 3: Fine-Tune the Vibes

> **⚠️ Not seeing changes?** If the new theme or animations aren't showing up, stop the dev server (`Ctrl+C`) and restart with `npm run dev`, then do a hard refresh (`Ctrl+Shift+R`) in your browser.

Keep the browser preview open and iterate on the design. Try prompts like:

> The scanline effect is too strong, reduce opacity to 0.03

> Add a subtle electrical flicker to the title text

> The VS badge should pulse more dramatically

This is **design-first development** — you're iterating on the visual output in real time. Each prompt refines the experience until it feels right. Don't settle for "good enough" — push the vibes until the page looks like it belongs in an arcade cabinet.

## Task 4: Update Instructions

Your instructions should reflect major design decisions so later prompts stay aligned.

<!-- track:vscode:start -->
Ask Copilot Chat:

> Add a design guide section to copilot-instructions.md describing our retro arcade theme: colors, fonts, animation style
<!-- track:vscode:end -->

<!-- track:cli:start -->
Ask Copilot CLI:

> Update our repository instructions with a short design guide for the retro arcade theme: colors, fonts, animation style, and the rule that new UI should keep the neon aesthetic.
<!-- track:cli:end -->

Commit your updated instructions and design changes once the page looks right.

## ✅ Part 4 Complete

**What you learned:**

- Use planning workflows to sketch a **design system before implementation**
- **Iterate on visual output** with quick follow-up prompts
- **Update instructions after major decisions** so Copilot keeps the visual identity consistent

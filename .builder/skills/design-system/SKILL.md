---
name: design-system
description: >
  Analyzes a project to infer and document its design system, then audits the
  codebase for violations (hardcoded colors, non-standard spacing, typography
  inconsistencies, and inconsistent component patterns). Writes and maintains a
  design system definition at .agents/rules/design-system.mdc. Use when the user
  asks to apply a design system, audit design consistency, find hardcoded colors
  or magic numbers, check spacing or typography violations, document design
  tokens, or enforce visual consistency across the codebase. Also triggers when
  the user says things like "we don't have a design system", "clean up our
  styles", or "standardize our UI".
---

# Design System Skill

## Overview

This skill has two modes that run in sequence:

1. **Infer & document** — Scan the project, extract design tokens, write `.agents/rules/design-system.mdc`
2. **Audit** — Scan for violations of that design system and report them in chat

After reporting violations, offer to fix them on request.

---

## Step 1: Infer the Design System

Scan the project's styles (CSS, SCSS, Tailwind config, CSS-in-JS, inline styles) to extract:

- **Color palette** — Collect every unique color value. Group near-duplicates (within ~10% perceptual distance). Assign semantic names based on usage context (e.g., a color used on `.btn-primary` → `color-primary`).
- **Spacing scale** — Collect all `padding`, `margin`, `gap`, `top/right/bottom/left` values. Identify the base unit (commonly 4px or 8px) and the scale steps.
- **Typography scale** — Collect all `font-size`, `font-weight`, `font-family`, `line-height` values. Group into a type scale (xs, sm, md, lg, xl, etc.).
- **Component patterns** — Identify repeating structural patterns: buttons, cards, inputs, modals, nav items. Note their class naming conventions and structure.

**Important:** Only infer from what actually exists in the codebase. Do not invent tokens not present in the code. When values are ambiguous, include them as-is and flag them for human review.

### Writing .agents/rules/design-system.mdc

Create or overwrite `.agents/rules/design-system.mdc` with:

```markdown
---
description: Design system rules for this project. Enforced by the design-system skill.
globs:
  - "**/*.css"
  - "**/*.scss"
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.ts"
  - "**/*.js"
alwaysApply: false
---

# Design System

## Colors

| Token | Value | Usage |
| ----- | ----- | ----- |
| ...   | ...   | ...   |

## Spacing Scale

Base unit: Xpx
Scale: [list of values]

## Typography

| Token | font-size | font-weight | line-height |
| ----- | --------- | ----------- | ----------- |
| ...   | ...       | ...         | ...         |

## Component Patterns

### Button

[Describe expected structure and class naming]

### Card

...

## Rules

- Never use hardcoded hex/rgb/hsl color values; use design tokens or CSS variables
- Never use spacing values outside the spacing scale
- Never use font sizes outside the type scale
- Component HTML structure must follow the patterns above
```

After writing the file, show the user a summary of what was inferred and ask: **"Does this look right? Should I adjust anything before I run the audit?"**

---

## Step 2: Audit for Violations

Once the design system is confirmed (or already exists in `.agents/rules/design-system.mdc`), scan the codebase for violations.

### What to scan

- All `.css`, `.scss`, `.sass` files
- All `.tsx`, `.jsx`, `.ts`, `.js` files (for inline styles, CSS-in-JS, and Tailwind arbitrary values)
- Template files (`.html`, `.vue`, `.svelte`) if present

### Violation types

**1. Hardcoded colors**
Find any color value that is NOT a CSS variable or design token reference:

- Hex: `#fff`, `#1a2b3c`
- RGB/RGBA: `rgb(...)`, `rgba(...)`
- HSL/HSLA: `hsl(...)`, `hsla(...)`
- Named colors used as values: `color: red` (except `transparent`, `inherit`, `currentColor`)

Exempt: colors inside `design-system.mdc` itself, and colors that ARE the token definitions.

**2. Non-standard spacing**
Find padding, margin, gap, and position offset values not in the inferred spacing scale. Flag magic numbers like `margin: 13px` or `padding: 7px`.

**3. Typography inconsistencies**
Find font-size, font-weight, or font-family values not in the type scale. Flag one-off sizes like `font-size: 13px` or unlisted font families.

**4. Component pattern violations**
Compare button, card, and input elements against the documented patterns. Flag structural deviations (e.g., a button without the expected class, or a card with a different DOM structure).

### Reporting format

Report violations grouped by type in chat:

```
## Design System Violations

### Hardcoded Colors (N found)
- src/components/Button.tsx:42 — `color: #ff3b30` (suggest: var(--color-danger))
- src/styles/global.css:17 — `background: rgb(255,255,255)` (suggest: var(--color-bg))

### Non-standard Spacing (N found)
- src/components/Card.tsx:88 — `padding: 13px` (nearest scale value: 12px or 16px)

### Typography Inconsistencies (N found)
- src/components/Header.tsx:5 — `font-size: 13px` (not in type scale)

### Component Pattern Violations (N found)
- src/components/SubmitButton.tsx — Button missing class `btn`; uses `button-submit` instead
```

Keep it scannable. Include file path, line number, the offending value, and a suggested fix where obvious.

---

## Step 3: Offer to Fix

After reporting, always end with:

> "Would you like me to fix any of these? I can fix a specific violation, a specific file, all violations of one type, or everything at once."

When fixing:

- Replace hardcoded colors with the nearest design token (add as CSS variable if not already defined)
- Replace non-standard spacing with the nearest scale value (round to closest, don't invent new steps)
- Replace typography values with the nearest type scale token
- Refactor component patterns to match the documented structure

Always show a diff or summary of what was changed. Never fix silently.

---

## Gotchas

- **Don't flag CSS variable definitions as violations.** `--color-primary: #3b82f6;` is a token definition, not a hardcoded color violation.
- **Don't flag third-party/node_modules styles.** Only audit project source files.
- **Tailwind arbitrary values** like `text-[13px]` or `bg-[#ff0000]` are violations — flag them.
- **CSS-in-JS** (styled-components, emotion) — scan template literals and object styles, not just `.css` files.
- **Near-duplicate colors** — `#3b82f6` and `#3B82F6` are the same. Normalize to lowercase before deduplication.
- **`.agents/rules/design-system.mdc` path** — This is project-relative. Always write to this exact path, not `agents/rules/` or `.builder/rules/` or anywhere else.
- **If `.agents/rules/` doesn't exist** — create it with `mkdir -p .agents/rules` before writing the file.
- **Skipping Step 1 when the file already exists** — If `.agents/rules/design-system.mdc` already exists, read it first and ask the user: "A design system file already exists. Should I use it as-is, update it, or start fresh?"
- **Large codebases** — If scanning would take too long, tell the user and offer to scope to specific directories.

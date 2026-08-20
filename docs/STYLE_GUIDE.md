# STYLE GUIDE — Terminal UI Tokens

This document defines the reusable style tokens for all UI screens. Change a token value here and in `src/index.css` / `tailwind.config.js` to update all dependent UI elements globally.

---

## Typography Tokens

| Token | CSS Variable | Size | Tailwind Class | Use Case |
|---|---|---|---|---|
| UI XL | `--ui-text-xl` | 1.75rem (28px) | `text-ui-xl` | Page titles, main headers |
| UI LG | `--ui-text-lg` | 1.25rem (20px) | `text-ui-lg` | Section headings, family names |
| UI MD | `--ui-text-md` | 1rem (16px) | `text-ui-md` | Body text, descriptions, paradigm effects |
| UI SM | `--ui-text-sm` | 0.875rem (14px) | `text-ui-sm` | Detail text, labels, captions |
| UI XS | `--ui-text-xs` | 0.75rem (12px) | `text-ui-xs` | Small UI text, counters, meta info |

**Rule:** Use these tokens for all UI screens and detailed sections. Do NOT use them for in-game cards (hand cards, queue cards) — those remain smaller with their own size system.

---

## Type Colors

| Type | CSS Variable | Hex | Tailwind Class |
|---|---|---|---|
| Grounding (A) | `--type-grounding` | #00ff41 | `text-type-grounding`, `border-type-grounding`, `bg-type-grounding` |
| System (B) | `--type-system` | #00ffff | `text-type-system`, `border-type-system`, `bg-type-system` |
| Adaptation (C) | `--type-adaptation` | #a855f7 | `text-type-adaptation`, `border-type-adaptation`, `bg-type-adaptation` |

**Rule:** Always display type names (Grounding/System/Adaptation) in UI — never show "Alignment A/B/C" to the user. The internal keys (A/B/C) remain in code only.

---

## Terminal UI Colors

| Token | CSS Variable | Hex | Tailwind Class | Use Case |
|---|---|---|---|---|
| Background | `--term-bg` | #000000 | `bg-term-bg` | Main background |
| Panel | `--term-bg-panel` | #0a0a0a | `bg-term-panel` | Panels, cards, sections |
| Card BG | `--term-bg-card` | #0d0d12 | `bg-term-card` | Inner card backgrounds |
| Border | `--term-border` | #1a1a2e | `border-term-border` | Default borders |
| Border Hover | `--term-border-hover` | #333333 | `border-term-border-hover` | Hover borders |
| Text | `--term-text` | #e0e0e0 | `text-term-text` | Primary text |
| Text Dim | `--term-text-dim` | #888888 | `text-term-dim` | Secondary text |
| Text Faint | `--term-text-faint` | #555555 | `text-term-faint` | Tertiary/meta text |
| Purple | `--term-purple` | #a855f7 | `text-term-purple` | Purple accent |
| Green | `--term-green` | #00ff41 | `text-term-green` | Green accent |
| Blue | `--term-blue` | #00ffff | `text-term-blue` | Blue accent |

---

## Button Styles

**Primary action button:**
```
px-6 py-3 border-2 rounded text-ui-md font-bold tracking-wider transition-all
border-term-green text-term-green hover:bg-term-green hover:text-term-bg
```

**Secondary button:**
```
px-6 py-3 border-2 rounded text-ui-md font-bold tracking-wider transition-all
border-term-border-hover text-term-dim hover:border-term-dim hover:text-term-text
```

**Type-colored button (replace `type-grounding` as needed):**
```
px-6 py-3 border-2 rounded text-ui-md font-bold tracking-wider transition-all
border-type-grounding text-type-grounding hover:bg-type-grounding hover:text-term-bg
```

---

## Text Highlighting

Bolded/relevant text from source documents should be highlighted:
- **Section headers** (lines ending with `:`): bold + type-colored
- **Key terms** (Terrain, Moral Grounding, Foundation, etc.): bold + type-colored
- **Body text**: `text-term-text` at `text-ui-md` or `text-ui-sm`

---

## Font

All UI uses `font-mono` (monospace) for the retro terminal aesthetic. This is set via the `--font-mono` token and the `font-mono` Tailwind class.
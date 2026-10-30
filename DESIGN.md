# Design Guide - Retro Arcade

New UI must keep the neon arcade look. If something looks like a generic web app, it's wrong.

## Colors
| Token | Default | Alt theme | Use |
|---|---|---|---|
| `--bg` | `#0a0a1a` | same | Page background |
| `--p1` | `#5fed83` (green) | `#00f5ff` (cyan) | Player 1, primary accent |
| `--p2` | `#8a2be2` (purple) | `#ff6b35` (orange) | Player 2, horizon glow |
| `--p2-ink` | `#b98cff` | `#ff8c5e` | Purple/orange text (readable on dark) |
| `--gold` | `#ffd23f` | same | Winner, Battle button, focus ring |
| `--err` | `#ff3864` | same | Errors, K.O. |

Always use the CSS variables, never hard-coded accents, so the alt theme toggle (`data-theme="alt"` on `<html>`) keeps working.

## Type
- `Press Start 2P` (Google Fonts) for everything. Uppercase for labels and UI copy.
- Small sizes only go down to 7px for meta text; body UI is 8-12px.

## Shapes
- Sharp corners everywhere (`border-radius: 0`).
- Panels: 2-3px solid border in the accent color + a hard offset shadow (`6px 6px 0`) + a soft neon glow.
- Buttons press down (translateY) instead of fading.

## Motion
- Animate `transform` and `opacity` only. Glows pulse by fading a pre-blurred layer, not by animating `text-shadow` or `box-shadow`.
- Snappy entrances (`--ease-out`, `--ease-snap`), `steps()` for anything that should feel pixel/8-bit (blink, wipe, flicker).
- Every new animation must be covered by the `prefers-reduced-motion` block.
- Sounds come from `src/scripts/sound.ts` (Web Audio, no files) and respect the mute toggle.

## Code map
- `src/styles/arcade.css` - all styling and keyframes
- `src/scripts/main.ts` - battle flow, rendering, intro, countdown
- `src/pages/api/contributions/[username].ts` - GitHub proxy with in-memory cache

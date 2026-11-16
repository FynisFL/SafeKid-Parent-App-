# SafeKid — DESIGN.md

> Binding visual contract for the Parent App demo. Read with `docs/05_DESIGN_SYSTEM.md`, `docs/14_VISUAL_ART_DIRECTION_AND_ASSET_RULES.md` and `docs/15_MOTION_SPECIFICATION.md`.

## Product-specific design thesis

**A calm safety console for parents, with a friendly growth path for children.**

Grow Safe must feel clear, dependable and low-noise. Grow Independent can feel warmer and more encouraging through the Habit / Task / Reminder / Reward experience. Grow Sustainable and subscription screens remain factual and restrained.

## Reference interpretation

- `assets/reference/reference-habit-app-ui.jpg`: use its clean white mobile screens, generous spacing, simple onboarding, friendly illustration placement, habit cards and calendar/progress hierarchy as the primary visual reference.
- `assets/reference/reference-visual-moodboard.jpg`: use only selected cues such as soft modular surfaces, friendly illustration placement and rounded action groups. It is a collage of unrelated apps, not a coherent visual system.
- `assets/brand/safekid-logo-original.webp`: canonical logo; never redraw, recolor, distort or decompose it.
- `assets/brand/safekid-logo-trimmed.png`: same logo for compact placement; only transparent outer canvas has been trimmed.

Do not copy the references' purple, pink, orange or unrelated app content. SafeKid's locked brand palette overrides all reference colors.

## Tokens

```css
:root {
  --sk-primary: #00C7CA;
  --sk-deep-blue: #2D5568;
  --sk-soft-tint: #EAF4F5;
  --sk-white: #FFFFFF;
  --sk-text: #193744;
  --sk-muted: #71858C;
  --sk-border: #D9E6E8;
  --sk-background: #F6FAFA;
  --sk-success: #168A68;
  --sk-warning: #D98A19;
  --sk-danger: #D94242;
  --sk-info: #387DA0;
}
```

Typography: Plus Jakarta Sans for headings, Inter for body/UI. Use the 8px spacing scale. Main cards 16–20px radius, buttons 12–14px radius, minimum touch target 44×44px.

## Visual language

- White and soft-tint surfaces with deep-blue text and turquoise primary actions.
- Subtle border and elevation; preserve whitespace.
- Use organic illustration shapes sparingly, only where the content benefits from warmth or explanation.
- Use one coherent icon family (`lucide-react` preferred).
- Do not make every element a card; avoid nested cards and repeated identical tiles.
- One dominant focal point and one clear primary action per screen.
- No added mascot family, emoji icon system, random stickers, decorative gradients or unrelated stock photography.
- External assets must be locally bundled and documented in `ASSET_CREDITS.md` with source and license.

## Screen temperament

| Screen family | Personality | Decoration budget |
|---|---|---|
| Home / Location / Alerts / Device | Calm, precise, reassuring | Very low; data and status first |
| Habit / Task / Reminder / Coin | Warm, encouraging, approachable | Moderate but controlled; reward feedback is the signature moment |
| Subscription / Profile / S.F AI | Clear, editorial, trustworthy | Low; comparison and actions first |
| Onboarding / Welcome | Friendly brand introduction | One logo/illustration focal point |
| Concept previews | Product-forward and factual | Low; visible Concept Preview / Coming Soon label |

## Motion

Motion is required by default and must follow `docs/15_MOTION_SPECIFICATION.md`. Use Motion for React (`motion` package, import from `motion/react`) plus CSS for simple feedback. Motion should explain state, navigation, completion, progress or reward. Respect reduced motion and never delay SOS.

## Layout

Mobile-first at 390×844, then verify 360, 430, 768, 1024 and 1440 widths. Keep navigation stable, honor safe areas, use readable content widths, and adapt desktop navigation instead of stretching mobile screens.

## Final design QA

Before a phase is complete, inspect rendered mobile and desktop screenshots. Review hierarchy, spacing, asset relevance, brand color, interaction states, responsive behavior, accessibility, default motion and reduced-motion mode. A successful build alone is not visual QA.

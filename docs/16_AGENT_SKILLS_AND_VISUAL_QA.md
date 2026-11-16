# 16 — Agent Skills and Visual QA Workflow

## 1. Purpose

The Coding Agent must use a deliberate UI/art-direction workflow before implementing the visual layer. The goal is to prevent generic AI-generated UI, clutter, inconsistent assets and decorative motion that does not help parents.

## 2. Recommended Agent Skills

The installed skill catalog available to the authoring assistant did not contain a dedicated decoration/UI/UX skill. The following public Agent Skills were reviewed as external options for a compatible Coding Agent:

### Primary recommendation: `ui-design` + `ui-art-direction`

Repository: <https://github.com/SpellbourneDZ/ui-design-skill>

- `ui-design`: product UI implementation, components, states, responsive behavior and review.
- `ui-art-direction`: concept-first, product-specific visual direction for a new interface or substantial redesign.
- The repository also describes anti-slop and UI-review references within the skill package.

This pair is a good fit because its detailed instructions establish a design-authority order, require product understanding before styling, put hierarchy/grouping/alignment/spacing before decoration, and require realistic component states plus rendered visual review. Its art-direction workflow derives concepts from actual product tasks and rejects concepts that add novelty without improving clarity. It must be used under the SafeKid-specific constraints in this handoff.

Install into a Codex-compatible project:

```bash
npx skills@latest add SpellbourneDZ/ui-design-skill --skill ui-design --skill ui-art-direction -a codex -y
```

Install into a Claude Code-compatible project:

```bash
npx skills@latest add SpellbourneDZ/ui-design-skill --skill ui-design --skill ui-art-direction -a claude-code -y
```

The repository currently documents Node.js 22.20.0 or newer for the current Skills CLI. Check the upstream repository for current requirements before installation. For other agents, first verify whether the Skills CLI supports that agent target; do not assume compatibility. If installation is unsupported, use this handoff as the binding equivalent workflow and record that the external skill was unavailable.

### Optional alternative: `better-design`

Repository: <https://github.com/Moddingflow/better-design>

This optional package includes an interaction kit, motion guidance, accessibility checks and a browser-based motion probe. It can be evaluated if the project needs stronger motion QA. Do not install multiple competing art-direction systems by default. If `better-design` is used, adopt only the relevant interaction/motion validation practices; do not import its optional visual effects pool unless a screen-specific need is approved.

## 3. Required skill workflow

Before implementing a screen:
1. Read `AGENTS.md`, `05_DESIGN_SYSTEM.md`, `14_VISUAL_ART_DIRECTION_AND_ASSET_RULES.md` and `15_MOTION_SPECIFICATION.md`.
2. Inspect the actual supplied files under `assets/brand/` and `assets/reference/`.
3. If the primary skills are installed, read the complete `ui-art-direction/SKILL.md` and `ui-design/SKILL.md`, including the referenced anti-slop and UI-review material. Do not rely only on their README summaries.
4. Use `ui-art-direction` to express a compact SafeKid-specific visual thesis. It may interpret the references but may not replace the locked brand palette or logo.
5. Use `ui-design` during screen/component implementation and review.
6. Create or update a root `DESIGN.md` that records approved tokens, visual principles, asset choices, motion tokens and responsive behavior. `05_DESIGN_SYSTEM.md`, `14...` and `15...` remain authoritative.
7. Implement one representative screen from each family—Safety, Growth and Services—then visually review them before scaling the pattern to all routes.
8. Apply the skill's UI-review/anti-slop checklist at the end of each phase.

## 4. Practical takeaways to apply

- `ui-art-direction` is the concept/visual-direction stage; `ui-design` is the implementation and verification stage. Use art direction before substantial new screen design, then carry the selected concept through components and responsive states.
- Art direction may privately compare different organizing concepts, but should choose one product-grounded direction, not three superficial palette/skin variations. For SafeKid, evaluate concepts against parental task clarity, brand fit, safety-critical predictability, accessibility, responsiveness and engineering cost.
- A quiet, conventional layout is the right choice for GPS, SOS, alerts, billing and settings. Keep expression concentrated in onboarding and the Growth module.
- The UI skill emphasizes minimal useful copy, consistent spacing by role, semantic colors, predictable action locations, realistic content states and screenshot-based review. Its anti-slop reference specifically diagnoses cardification/nested cards, unjustified gradients/glows, automatic bento layouts, universal pills, excessive micro-labels, fake sophistication, generic AI copy, motion everywhere, dashboard-by-default and decorative emptiness. Use these as diagnostics, not as an indiscriminate ban list.
- Its motion guidance requires purposeful state/feedback animation, immediate frequent actions, no blanket `transition: all`, no repeated generic reveals and no animation that blocks keyboard workflows. SafeKid's mandatory motion requirement is implemented through the specific inventory in `15_MOTION_SPECIFICATION.md`.
- Its creative-direction material says that the product task, signature content, brand cue and key action should drive the concept; choose a practical concept only after evaluating task clarity, accessibility, responsive feasibility and the cost of novelty. Its UI review material covers product fit, hierarchy, no nested-card clutter, states, typography/copy, semantic color, responsive layouts, keyboard/touch accessibility, reduced motion and rendered-surface verification.

## 5. Decision limits for the skill

The skill is an aid, not a source of product truth.

It must not:
- Change SafeKid's locked colors or logo.
- Copy the reference product's unrelated feature set.
- add random gradients, neon colors, bento layouts, decorative sticker clusters, blobs, mascots or cards to make a screen appear more elaborate.
- substitute a new component library or framework without approval.
- add unsourced imagery or font files.
- remove required safety disclaimers or reduce the visibility of critical states.
- override the mandatory motion contract or reduced-motion behavior.

If a skill's recommendation conflicts with this handoff, follow the handoff and add a short note to `docs/IMPLEMENTATION_LOG.md`.

## 6. Asset selection and credits

The Agent must maintain `ASSET_CREDITS.md` at the repository root whenever it adds a non-code asset not supplied by the project owner. For each added asset, record:
- Asset file path.
- Intended screen/use.
- Original source URL.
- Creator/author if provided.
- License and any attribution requirement.
- Date retrieved.

Do not ship assets with unclear license terms. Do not hotlink remote images. If the Agent cannot find an appropriate, licensed asset, use the supplied SafeKid mark, a Lucide icon, a simple CSS treatment or no illustration. Do not manufacture an arbitrary mascot to fill the gap.

## 7. Visual QA procedure

For each major route and screen family:
1. Run the app locally with seeded demo data.
2. Capture screenshots at 360×800, 390×844, 430×932, 768×1024, 1024×768 and 1440×900.
3. Capture at least one screenshot with a populated state and one with a relevant empty/error state.
4. Inspect the output against the reference images and brand rules; check layout, spacing, hierarchy, typography, content density and asset relevance.
5. Test default motion and reduced-motion mode.
6. Test touch/keyboard interactions and visible feedback.
7. Fix visual defects before implementing more screens from the same component family.
8. Record screenshots and findings in `docs/visual-qa/` or link them in `docs/IMPLEMENTATION_LOG.md`.

Do not claim visual QA from a successful build alone. A screenshot review or equivalent rendered-surface inspection is required.

## 8. External references

- UI Design Skill: <https://github.com/SpellbourneDZ/ui-design-skill>
- Better Design: <https://github.com/Moddingflow/better-design>
- Apple Motion HIG: <https://developer.apple.com/design/human-interface-guidelines/motion>
- Motion for React accessibility: <https://motion.dev/docs/react-accessibility>
- W3C reduced motion technique: <https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html>

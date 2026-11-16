# 14 — Visual Art Direction and Asset Rules

## 1. Product visual thesis

**SafeKid is a calm, trustworthy family-safety utility with a friendly growth layer.**

The parent must feel that the app is dependable when checking location or responding to an alert. The app can become warmer and more playful in Habit / Task / Reward, but it must never look like a children's game or a noisy social/fintech dashboard.

Use this hierarchy:
1. **Trust and clarity** for safety, device, location, SOS and alerts.
2. **Encouragement and warmth** for Habit, Task, Reminder and Coin.
3. **Product confidence** for subscription, device information and future ecosystem previews.

The visual character should feel light, modern, friendly and carefully edited—not cinematic, not childish, and not decorated for decoration's sake.

## 2. Source-of-truth hierarchy

When instructions or references disagree, use this order:

1. SafeKid brand assets and locked brand tokens in `05_DESIGN_SYSTEM.md`.
2. Product rules, demo-truth constraints and screen behaviors in this handoff.
3. The supplied reference images, only for the specific visual lessons listed below.
4. The installed UI/art-direction skill's recommendations.
5. The Coding Agent's own aesthetic preference.

A skill recommendation must never replace the SafeKid logo, change the locked brand palette, weaken the parent-first information hierarchy, or introduce unsupported product features.

## 3. Supplied visual references

### Reference A — `assets/reference/reference-habit-app-ui.jpg`

Use as the **primary UI mood reference** for:
- Clean white mobile screens with generous spacing.
- A clear onboarding sequence and confident, simple typography.
- Friendly organic illustration shapes used as a small focal point.
- Rounded but restrained task cards and a clear bottom navigation.
- A habit calendar and progress presentation that is easy to scan.
- A shift in emotional tone between onboarding, habit tracking and profile settings.

Do not copy its purple page background or its purple primary buttons. SafeKid's own palette is authoritative. Do not copy its unrelated mascot characters as SafeKid characters.

### Reference B — `assets/reference/reference-visual-moodboard.jpg`

Treat this as a **moodboard, not a single finished design system**. It contains screens from different product categories and different visual languages. Borrow selectively:
- Soft, friendly illustration placement.
- Rounded modular surfaces.
- Well-defined content groups and compact action areas.
- A playful reward/result moment when a task is completed.
- Map and daily-check-in information presented as distinct modules.

Do not copy the collage's cryptocurrency, wallet, music, language-learning or social-product features. Do not combine every style visible in the collage. Do not reproduce its mixed palettes as a SafeKid palette.

### Brand asset — `assets/brand/safekid-logo-original.webp`

This is the supplied SafeKid logo and must be treated as the authoritative brand mark.
- Use `assets/brand/safekid-logo-trimmed.png` for normal UI placement when its tighter transparent bounds are useful.
- Keep the original WebP untouched as the canonical source.
- Preserve proportions, colors, shield, watch, face, heart and star.
- Do not redraw, retype, recolor, crop internal parts, distort, outline, add a glow, make a 3D version, or place it inside another decorative badge.
- Use the full logo on Welcome / Onboarding, app launch or a brand introduction. Use a small mark sparingly in app chrome or relevant empty states. Do not stamp the logo on every card.
- Maintain clear space around the mark. Never force it into a square if the shape would be clipped.

## 4. Color rules

Use the SafeKid palette as the visual foundation:
- Turquoise: `#00C7CA` — primary actions, active navigation, positive product accents.
- Deep Blue: `#2D5568` — headings, primary text emphasis, navigation and strong structural elements.
- Soft Tint: `#EAF4F5` — quiet background fields and selected surfaces.
- White: `#FFFFFF` — primary content surfaces.

Use the supporting text, border and semantic status tokens defined in `05_DESIGN_SYSTEM.md`.

Rules:
- Do not introduce purple, hot pink, neon orange, acid yellow or a second competing brand accent because they appear in the references.
- Semantic red/orange/green may be used only to communicate danger, caution or success; do not use them as arbitrary decoration.
- Growth cards may use controlled tints derived from SafeKid turquoise, deep blue and neutral surfaces. Distinguish categories with icons, labels and layout before adding more colors.
- Do not make every card a different color.
- Gradients are optional and rare. If used, keep them within the existing brand palette and reserve them for a hero/reward moment, not every surface.

## 5. Layout and visual hierarchy

- Mobile-first. Design and verify at 390 × 844 CSS px first, then 360, 430, tablet and desktop.
- Mobile page gutter: target 18–20px; maintain safe-area insets on native devices.
- Use the existing 8px spacing scale. Align headings, card edges, icon centers and navigation consistently.
- One clear primary purpose and one dominant visual focal point per screen.
- Usually one primary CTA per screen. Secondary actions must be visually subordinate.
- Use a card only when it groups related information or creates a meaningful action area. Do not wrap every section in a card.
- Avoid nested card-in-card layouts. Use spacing, headings and dividers for secondary grouping.
- Prefer short, scannable information blocks over large paragraphs.
- Keep bottom navigation stable and thumb-friendly on mobile. Use a sidebar or wider content grid for desktop rather than stretching mobile cards to full width.
- Lists, settings and alert history should look like practical utility interfaces, not stacks of promotional tiles.

## 6. Illustration and element sourcing policy

The Agent is expected to **search, select and integrate appropriate assets**, not invent a random decorative visual language.

### Allowed defaults
- Functional icons: use one consistent icon family, preferably `lucide-react`.
- Brand: use only the supplied SafeKid logo files unless the owner provides a newer approved asset.
- Product render: use an owner-provided/verified watch image or model. If none exists, use a neutral 2D placeholder labelled as a demo/concept; do not invent precise hardware details.
- Growth illustration: first reuse the SafeKid logo/mark in a restrained way. If a separate illustration is genuinely needed, choose one coherent, license-compatible illustration source and record the exact asset, source URL, creator and license in `ASSET_CREDITS.md`.
- Map visuals: use the actual map provider and appropriate map markers, not a decorative 3D map.

### Prohibited defaults
- Do not use Unicode emoji as the primary icon system.
- Do not mix Lucide, Font Awesome, Material Icons, emoji and custom SVGs in the same interface.
- Do not scrape images from Pinterest, Dribbble, Behance, random search results or the supplied screenshots for production assets.
- Do not use the reference screenshots themselves as app backgrounds or screen content.
- Do not add stock photos of unrelated children/families just to fill empty space.
- Do not generate a second mascot family or redraw the SafeKid logo.
- Do not add decorative blobs, stars, confetti, sticker clusters, sparkles or floating badges unless a specific screen spec justifies them.
- Do not use external hotlinked image URLs at runtime. Bundle licensed assets locally.

### Asset decision test
Before adding any visual asset, answer:
1. What user task or product idea does it clarify?
2. Why is this asset more useful than a standard icon or plain text?
3. Does it match the SafeKid brand and the reference direction?
4. Is its source and license documented?
5. Does it improve the screen without competing with the primary action?

If these questions cannot be answered, do not add the asset.

## 7. Screen-specific visual treatment

### Safety surfaces — Home, Location, Safe Zone, Alerts, Device
- Calm, clear, low-decoration utility UI.
- Prioritize location freshness, connection uncertainty, battery and event severity.
- The SOS state must be unmistakable and must not be hidden inside a colorful decorative illustration.
- Never imply simulated status is real.

### Growth surfaces — Habits, Tasks, Reminders, Coins, Progress
- Warmer and friendlier than Safety surfaces.
- Use simple category icons, clear completion states, gentle progress visuals and a small number of encouraging copy moments.
- Keep Coin points visually rewarding without turning the wallet into a game economy or implying monetary value.
- A completed task may receive one small reward animation; no full-screen celebration is required.

### Service surfaces — Subscription, S.F AI, Profile
- Clear, editorial, trustworthy and easy to compare.
- Subscription comparison should prioritize facts, not decorative gradients.
- S.F AI must look like an informational assistant, not an emergency dispatcher or human operator.
- Profile/settings should use compact rows and clear labels.

### Concept surfaces — Watch Passport, Skin, Skill, Trade-in
- Mark as `Concept Preview` or `Coming Soon` in the visible UI.
- Avoid making a concept screen look like an available production service.

## 8. Typography and copy

- Headings: Plus Jakarta Sans.
- Body and controls: Inter.
- Use a clear size/weight hierarchy. Do not use display typography for every label.
- Vietnamese is the default locale. Use concise, natural Vietnamese; do not mix Vietnamese and English randomly. Product terms such as Safe Zone, Grow Safe and S.F AI may remain in English with Vietnamese explanations.
- Prefer direct action labels: `Xem vị trí`, `Tạo nhiệm vụ`, `Xác nhận đã xem`, `Thử SOS (Demo)`.
- Do not write vague labels such as `Explore`, `More`, or `Let's go` when the action can be named precisely.

## 9. Visual review gate

Before calling a screen complete, render it and inspect the actual output at mobile and desktop sizes. Check:
- First-screen hierarchy is obvious within three seconds.
- Logo is crisp and not distorted.
- Brand colors are consistent and not diluted by unrelated accents.
- Only relevant visual assets are present.
- No duplicate headings, nested-card clutter or uneven spacing.
- Primary action is obvious and reachable.
- Loading, empty, error, success and disabled states are designed.
- The screen remains understandable without color or motion.
- The design is recognizably SafeKid, not a direct copy of either moodboard.

If screenshot inspection tools are available, use them after implementation and after major visual changes. Do not rely on code inspection alone for visual QA.

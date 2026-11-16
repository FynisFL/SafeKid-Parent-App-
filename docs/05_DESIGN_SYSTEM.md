# 05 — Design System

## 1. Design direction
**Premium Family Safety Utility with a Friendly Growth Layer** — calm, trustworthy, clear, modern and parent-focused. Use a warm, approachable illustration language only where it supports onboarding or Habit/Task/Reward. The app is not a toy/game UI and should remain lighter and more practical than the cinematic marketing landing page.

The supplied references and strict asset rules are defined in `14_VISUAL_ART_DIRECTION_AND_ASSET_RULES.md`. The mandatory motion system is defined in `15_MOTION_SPECIFICATION.md`. Those documents are part of this design system, not optional inspiration.

## 2. Brand tokens

```css
:root {
  --sk-primary: #00C7CA;
  --sk-deep-blue: #2D5568;
  --sk-soft-tint: #EAF4F5;
  --sk-white: #FFFFFF;
  --sk-text: #193744;
  --sk-muted: #71858C;
  --sk-border: #D9E6E8;
  --sk-surface: #FFFFFF;
  --sk-background: #F6FAFA;
  --sk-success: #168A68;
  --sk-warning: #D98A19;
  --sk-danger: #D94242;
  --sk-info: #387DA0;
}
```

SOS/danger red is reserved for critical states. Do not use red for ordinary actions.

## 3. Typography
- Headings: Plus Jakarta Sans.
- Body/UI: Inter.
- Use local/system fallback stack if font assets are unavailable.
- Body text should be readable at 14–16px; controls should not rely on tiny text.

## 4. Shape, spacing and elevation
- 8px spacing base scale.
- Card radius 16–20px; buttons 12–14px; pills fully rounded only for small status tags.
- Subtle borders and soft shadows; avoid excessive glassmorphism and heavy gradients.
- Maintain generous whitespace and clear grouping.
- Do not wrap every section in a card; avoid nested card-in-card layouts.
- Primary button height target 48–52px; minimum touch target 44x44px.
- Reference A informs friendly organic illustration and Habit UI; Reference B is a selective moodboard only. Neither reference overrides SafeKid brand tokens.

## 5. Components
Build reusable components:
- AppShell, BottomNavigation, DesktopSidebar, TopBar.
- PrimaryButton, SecondaryButton, IconButton.
- StatusBadge, DemoBadge, AlertSeverityBadge.
- ChildAvatar, DeviceStatusCard, BatteryIndicator.
- LocationPreviewCard, TaskCard, HabitCard, CoinBalanceCard.
- AlertListItem, EmptyState, ErrorState, LoadingSkeleton.
- BottomSheet/Drawer, Modal, Toast, FormField, SegmentedControl.
- PlanComparison, AIMessage, QuickPromptChip.

## 6. Status language
Always distinguish:
- `Connected (Demo)` vs real Connected.
- `Simulated location` vs live location.
- `SOS test event` vs real SOS received.
- `Concept Preview` vs available feature.
- `Planned price` vs purchase price.

## 7. Responsive breakpoints
- Small: 0–359px (avoid horizontal overflow; gracefully compact).
- Mobile: 360–767px.
- Tablet: 768–1023px.
- Desktop: 1024px+.

## 8. Motion (mandatory)
- Motion must be visible in the default experience and serve state, feedback, continuity, hierarchy or reward.
- Use Motion for React (`motion` package, imports from `motion/react`) for coordinated transitions; use CSS for simple feedback.
- Required motion coverage and timings are specified in `15_MOTION_SPECIFICATION.md`.
- Route, button, toggle, sheet, task completion, progress, reward, map marker and notification transitions must have purposeful motion.
- Motion must never delay SOS or another critical action.
- Respect `prefers-reduced-motion` with a useful opacity/color or immediate-state fallback. Reduced motion is not a reason to omit motion from the default experience.
- No continuous decorative animation on Home, Location, Alerts or SOS. Lazy-load Three.js and provide a static 2D fallback.

## 9. Accessibility
- WCAG-minded contrast; never rely on color alone.
- Keyboard focus ring and logical tab order on web.
- Labels for icons; accessible names for all icon buttons.
- Respect `prefers-reduced-motion`.
- Screen-reader announcements for newly created demo alerts without excessive repeated announcements.


## 10. Visual authority and asset policy
- Keep `#00C7CA`, `#2D5568`, `#EAF4F5`, `#FFFFFF` as the core brand palette.
- Do not import purple/pink/neon/orange as additional brand colors from the screenshots.
- Use the supplied logo; do not redraw or alter it.
- Use one coherent icon family (prefer `lucide-react`) and do not use emoji as the primary icon system.
- Use external illustrations only when they have a clear product role and a documented license/source in `ASSET_CREDITS.md`.
- Never use the reference screenshots themselves as production UI assets.
- One primary purpose and one dominant focal point per screen. Add no decorative asset unless it clarifies a task or state.
- See `14_VISUAL_ART_DIRECTION_AND_ASSET_RULES.md` for binding details.

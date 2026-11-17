# SafeKid UI Design Guide — V7

## Product experience

SafeKid is a parent companion and family-care app, not a surveillance console. It should communicate clarity, trust and simple next steps. First-run onboarding is a separate no-account local profile setup; it must not look like an already-authenticated application.

## First-run onboarding

- Render outside the application shell until a local parent profile is saved.
- Do not show topbar notification controls, avatar, main navigation or app tabs on the first-run screen.
- On mobile, center a compact setup card and make parent-name input, optional child-name input and the primary “Bắt đầu thiết lập” action the immediate visual hierarchy.
- Keep only a small optional mascot or brand element. Large decorative hero artwork must not push the form below the fold.
- State that there is no account/password and data stays on this device.

## Color and type

- Brand turquoise: `#00C7CA`
- Deep blue: `#2D5568`
- Sky canvas: `#F2F8FF`
- Soft tint: `#EAF4F5`
- Lilac: `#EEEAFE`
- Mint: `#E6F7F0`
- Peach: `#FFF0E7`
- Pink: `#FCEBF2`
- Warm yellow: `#FFF6DC`

Pastel accents are category cues, not replacements for locked brand colors. Body copy and helper text must remain readable against white/sky surfaces. System fonts are used as fallback; Plus Jakarta Sans and Inter are not bundled locally in this variant.

## Navigation and hierarchy

- Phone destinations: Home, Location, SOS, Growth and More.
- More Hub groups Safe Zones/Alerts/Contacts, Watch Passport/Growth subpages and Help/Plans/Profile/Permissions.
- On Home, greeting and useful quick actions precede the compact decorative hero.
- Keep one primary action per view where possible. Use familiar labels rather than exposing raw technical terms.

## Location and Safe Zone distinction

- Location is an observation page: it shows actual parent-phone GPS, accuracy, timestamp and saved Safe Zone overlays. It is read-only for Safe Zone management.
- Safe Zones is the exclusive creation/management destination. Search a place or tap/drag a map pin, tune radius visually, choose schedule and save. Never require parents to type latitude/longitude.
- The live location is the parent's phone, never the child's/watch's location.

## Components

- Cards: white, 20–24 px radius, subtle blue-grey shadow and bright border.
- Actions: pill-shaped primary/secondary buttons with at least 44 × 44 px hit area.
- Inputs: 16 px or larger on mobile to avoid iOS focus zoom, visible labels and validation feedback.
- Modal: bottom sheet on phone, scrollable body, persistent header/action region, initial focus, Tab trap, Escape close and focus restoration.
- Iconography: one inline SVG family, icons in 34–45 px pastel tiles.
- Mascot: locally bundled 3D SafeKid bear. Decorative only; no capability implication.
- Destructive actions: app-owned confirmation UI, never browser-native confirm/prompt.

## Motion

- Use short entrance/hover/press/progress effects on non-critical content only.
- Use hover styling only where the device supports hover; touch devices need visible pressed/focus states.
- Respect `prefers-reduced-motion`.
- SOS route, panel and activation controls have no nonessential entrance/pulse/hover/transform motion.
- Never delay SOS activation, GPS requests, permission prompts or confirmation behind an animation.

## Responsive behavior

- 320–374 px: compact phone refinements, condensed nav labels, full-width form controls, no horizontal scrolling.
- 375–767 px: mobile header, stacked content, floating five-destination nav with safe-area padding.
- 768–1023 px: compact tablet navigation rail and two-column content where suitable.
- 1024–1200 px: desktop sidebar / narrower content grid.
- 1201–1535 px: standard desktop.
- 1536 px+: wide desktop with constrained content width.

These are source/CSS layout ranges; real rendered viewport acceptance must be completed using browser/device UAT. CSS source parsing is not proof of no clipping or overflow.

## Accessibility and privacy

- Semantic labels, visible focus, keyboard operation and live announcements for new alerts.
- Modal focus moves inside, is trapped while open, closes on Escape and returns to the trigger when available.
- Do not display raw coordinates as the primary parent-facing location label; use source, accuracy, timestamp and human-readable place context where available.
- Explain MapTiler map/geocoding network requests and local data storage.
- Preserve parent-phone-only GPS, foreground-only geofence/reminders, same-device SOS and manual Watch Passport truth boundaries.

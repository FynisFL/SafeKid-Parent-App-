# AGENTS.md — SafeKid Parent App

## Mission
Build a polished, mobile-first **functional demo** of SafeKid Parent App that works as a web app and can be wrapped for Android and iOS using Capacitor. This repository is a product demo, not a live child-safety service.

## Mandatory first actions
1. Read every file listed in `README_FIRST.md` in its specified order.
1a. Inspect `assets/brand/` and both files in `assets/reference/`; treat them as supplied design inputs.
1b. Follow the Agent Skills and visual review workflow in `docs/16_AGENT_SKILLS_AND_VISUAL_QA.md`. If compatible UI/art-direction skills are available, read their complete skill files before styling; if unavailable, follow the in-repo specification exactly.
2. Inspect the existing repository before changing it. Preserve useful existing work unless it conflicts with this specification.
3. Summarize the current repository state and propose a small implementation plan before making broad structural changes.
4. Create/maintain `docs/IMPLEMENTATION_LOG.md`, recording completed work, commands run, tests and known blockers.

## Stack contract
- React + TypeScript + Vite.
- Capacitor for Android and iOS packaging.
- PWA for browser access and supported home-screen installation.
- React Router for app routes; Zustand for shared UI/application state.
- IndexedDB for structured local demo records; localStorage only for small preferences/bootstrap flags.
- CSS variables as design tokens; Tailwind may be used for utilities, but do not let utility classes replace the documented design system.
- Leaflet or a compatible map adapter for the initial GPS demo map. Keep the map provider replaceable and show attribution.
- Three.js only for an isolated product/watch 3D viewer. Provide a 2D fallback. Do not use Three.js for standard UI, charts, maps, forms, or navigation.
- Motion for React (`motion` package; imports from `motion/react`) is the default motion layer. Follow `docs/15_MOTION_SPECIFICATION.md`.
- Capacitor Local Notifications and Haptics may be used on native devices. Web behavior must have a capability-aware fallback.

## Product rules
- Audience: parent/guardian of a child aged 3–10.
- Five primary destinations: Home, Location, Growth/Tasks, Alerts, Profile.
- S.F AI is a global assistant entry point, not a replacement for SOS or human support.
- Free must retain core safety access: basic location, SOS and basic two-way calling concept. Never lock SOS behind Plus.
- Plus may display advanced/realtime location, route history (planned 90-day benefit), Safe Zone, speed alerts, enhanced habit reports, multiple parent/device management and enhanced support, subject to the project's plan assumptions.
- Habit/Task/Reminder/Reward must be a usable workflow, not decorative cards.
- All demo data must be local and seeded. No remote account or database is required.
- Use fictional sample people, places and watch identifiers. Never ask for or read the phone owner's location by default.

## Hard demo-truth constraints
- Prominently label simulated GPS, simulated connection, simulated battery, simulated device status and simulated SOS.
- SOS demo events are local UI events only. Never claim that they contact emergency services, the watch, SMS, a real parent, or a safety center.
- AI mock answers may use only the controlled demo knowledge base and current local demo state. Never invent a child's live location or safety status.
- If data is missing, stale or uncertain, display that fact; do not fabricate certainty.
- Subscription is a UI simulation. No payment, purchase or billing flow.
- Human handoff is a demo ticket/contact form or instruction, not a staffed live support channel.

## Visual design rules
- The SafeKid logo supplied in `assets/brand/` is authoritative. Never redraw, recolor, distort or invent a replacement mark.
- The two supplied screenshots are references, not production assets. Use them selectively as defined in `docs/14_VISUAL_ART_DIRECTION_AND_ASSET_RULES.md`.
- Preserve the locked SafeKid palette. Do not introduce extra brand colors from the references.
- Do not invent decorative characters, sticker clusters, blobs, gradients or unrelated stock photos. Search for a suitable licensed asset only when it has a clear product role; otherwise use Lucide icons, the supplied logo or no illustration.
- One coherent icon family only; prefer `lucide-react`. Do not use emoji as the primary icon system.
- Build real hierarchy before decoration. Avoid nested cards and making every content group a separate card.
- Motion is mandatory in the default experience. Implement the motion inventory in `docs/15_MOTION_SPECIFICATION.md`; motion must be purposeful and respect reduced-motion preferences.

## Engineering rules
- Strict TypeScript. Avoid `any`; justify any exception.
- Use feature-first modules and typed service/adapters. Components must not contain seed data or business rules.
- No direct browser-only APIs inside shared feature components. Wrap storage, notification, haptics, map and platform functions behind adapters.
- No secrets or API keys in source control. Use `.env.example` and document configuration.
- Do not make map tiles, external imagery or remote APIs a hard dependency for the app shell. Provide a fallback state.
- Keep the app usable on a 360px-wide viewport and common Android/iPhone sizes; support tablet/desktop web layouts.
- All buttons and links visible in the UI must work, navigate, open a clear disabled/coming-soon explanation, or be removed. No dead controls.
- Provide loading, empty, error, offline and success states for primary features.
- Use semantic HTML, keyboard navigation, visible focus, accessible labels and sufficient contrast.
- Do not omit motion from the default experience. Avoid gratuitous/continuous motion; respect reduced-motion preferences with an equivalent static/opacity response.

## Quality gates
Before declaring completion:
1. `npm run typecheck` passes.
2. `npm run lint` passes.
3. `npm run test` passes.
4. `npm run build` passes.
5. App tested at 360px, 390px, 430px, tablet and desktop widths.
6. On-device Android smoke test completed if Android SDK is available.
7. iOS native project generated and build requirements documented; do not claim an iOS installable build without valid signing.
8. All six usability tasks in the business plan can be completed.
9. Demo Control Center can reset and replay scenarios deterministically.
10. Update `docs/IMPLEMENTATION_LOG.md` and list any unverified native behavior.
11. Complete visual QA using rendered screenshots; verify the asset source/brand fit and mandatory motion/reduced-motion behavior.

## Do not
- Do not migrate to React Native/Expo without an explicit architecture decision.
- Do not add Firebase, Supabase, a cloud database, authentication, analytics SDKs or payment providers to v1.1.
- Do not add a real child tracking feature or request real location permissions for the demo.
- Do not build a separate child mobile app in v1.1.
- Do not turn the product into a game or overly childish interface.
- Do not report mock test results as hardware validation.

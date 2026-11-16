# 06 — Technical Architecture

## 1. Decision
Use a **web-first hybrid architecture**:

- React + TypeScript + Vite for the shared application.
- Capacitor for native Android/iOS runtime and plugin access.
- PWA build for no-install browser access and supported home-screen installation.
- Three.js isolated to optional 3D watch/product visualization.

This is the preferred v1 architecture because the demo needs a high-fidelity web version and native wrappers from one UI/logic codebase. It is not a claim that hybrid is always superior to React Native; React Native/Expo becomes a better reconsideration if production requirements become strongly native (background sensor work, watch connectivity, deep native SDK integration, etc.).

## 2. Why not Three.js as app framework
Three.js is a 3D rendering library. It does not provide navigation, forms, state management, local data persistence, accessibility, app lifecycle or app-store packaging. Use React/CSS for normal screens. Use Three.js only for the watch viewer/3D product presentation. Never build GPS maps with Three.js.

## 3. Runtime layers

```text
Presentation: React routes + design-system components
Application: feature use-cases + Zustand stores
Domain: typed entities + validation + entitlement rules
Services: task, habit, location, device, alert, subscription, AI
Adapters: IndexedDB, map, notification, haptics, platform, clock
Runtime: Browser/PWA OR Capacitor Android/iOS
Future boundary: SafeKid Backend API + approved OEM gateway
```

## 4. Suggested dependencies
Choose current stable versions compatible with one another at implementation time, pin versions and commit the lockfile. Do not blindly install prerelease packages.

- `react`, `react-dom`, `typescript`, `vite`
- `react-router-dom`
- `motion` (Motion for React; import from `motion/react`) for required purposeful UI motion
- `lucide-react` for a single consistent functional icon family
- `zustand`
- `zod` for validation
- `dexie` (IndexedDB wrapper)
- `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`
- `@capacitor/local-notifications`, `@capacitor/haptics`, `@capacitor/status-bar`, `@capacitor/splash-screen`, `@capacitor/preferences` where needed
- `vite-plugin-pwa` or equivalent maintained PWA integration
- `leaflet` + React bindings or a maintained React map integration
- `three` only for optional viewer; React Three Fiber may be considered on web if useful
- `vitest`, React Testing Library, Playwright for web smoke/e2e

Avoid adding a UI component library that dictates a generic dashboard appearance. Build a small custom design system from the tokens in `05_DESIGN_SYSTEM.md`.

## 5. Feature-first folder structure

```text
src/
  app/
    App.tsx
    router.tsx
    providers/
    layouts/
  components/
    ui/
    navigation/
    feedback/
  features/
    onboarding/
    home/
    location/
    safe-zones/
    alerts/
    device/
    contacts/
    growth/
      habits/
      tasks/
      reminders/
      coins/
      progress/
    subscription/
    assistant/
    sustainable/
    demo-control/
  domain/
    entities/
    enums/
    rules/
    validation/
  services/
    device/
    location/
    alerts/
    growth/
    subscription/
    assistant/
  adapters/
    storage/
    notifications/
    haptics/
    maps/
    platform/
    clock/
  data/
    seed/
    knowledge-base/
  styles/
    tokens.css
    global.css
  assets/
    icons/
    images/
    models/
  tests/
```

## 6. Storage
- IndexedDB is the primary local store for structured data (profiles, tasks, habits, events, zones, transactions).
- localStorage may hold lightweight preferences (theme, onboarding complete, selected locale).
- Create `StorageAdapter` interface so future cloud sync can be introduced without replacing feature components.
- Include schema version and migration path from the first release.
- Seed data is created once on first run; reset is explicit.
- **Important:** browser/PWA storage and each installed native app container are separate local environments. The same code and seed scenarios are shared, but edits made in the web demo will not automatically appear in the Android/iOS app without a backend/sync layer. Explain this in test instructions.
- No remote database or account system in v1.

## 7. Platform capability adapter
Never call Capacitor APIs directly inside feature components. Expose interfaces such as:
- `NotificationAdapter`: request permissions, schedule reminder, show immediate local notification, cancel scheduled notification, capability status.
- `HapticsAdapter`: light/medium/heavy impact when supported.
- `PlatformAdapter`: platform name, native/web capability flags, open settings where supported.
- `MapAdapter`: render map, add marker/zone/route and fallback state.
- `ClockAdapter`: now(), schedule abstractions and deterministic test clock.

Web fallbacks must be documented. Web Notifications require browser permission and do not guarantee native-style scheduled delivery or background reliability. In-app toast/sound while foreground is the fallback.

## 8. Map architecture
- Use Leaflet initially because the v1 use case is a 2D map, marker, circle, route polyline and bottom sheet.
- Keep tile URL/provider in environment configuration, with visible attribution.
- Public OpenStreetMap tile endpoints are not a production SLA; for public traffic select a compliant tile provider or host tiles.
- Provide a schematic/static fallback if tiles fail or network is unavailable.
- Use fictional fixed coordinates in seed data; never collect the parent's coordinates by default.

## 9. Notifications architecture
- Task reminders are locally scheduled on native platforms if permission is granted. Capacitor local notification behavior is OS-dependent; Android 13+ requires notification permission, and exact alarm scheduling on Android 12+ has additional permission/settings constraints.
- SOS simulation triggered by the app produces an in-app alert and optional local notification.
- Web foreground fallback: in-app toast/banner + optional sound after user gesture/permission.
- There is no remote push from a watch in v1. Real remote SOS would require watch-to-backend event delivery and push infrastructure later.
- Android notification channels and iOS authorization must be configured and tested on real devices. Do not promise identical behavior across platforms.

## 10. Motion architecture
- Use Motion for React for route transitions, presence/exit, bottom sheets and coordinated state feedback.
- Use CSS transitions for simple hover/focus/pressed color changes.
- Place a shared `MotionConfig reducedMotion="user"` near the app root.
- Use `useReducedMotion()` for special behavior such as map marker movement, reward cues and optional mascot idle motion.
- Keep motion tokens and patterns centralized; do not scatter arbitrary per-component durations.
- Do not introduce a second animation framework without documenting a specific requirement.
- See `15_MOTION_SPECIFICATION.md` for the mandatory inventory and QA gate.

## 11. Three.js architecture
- Feature module: `features/sustainable/watch-viewer`.
- Lazy-load renderer and model assets.
- Use compressed/glTF model if supplied; never invent a production-accurate watch model from an unverified reference.
- Fallback to static product render or simple CSS illustration if WebGL unavailable, context lost, reduced motion, or low-performance device.
- Do not block app startup on 3D assets.

## 12. Future backend/OEM integration boundary
Create service interfaces now but implement only mock/local adapters in v1. Later adapter can consume a verified backend API and OEM protocol. Do not implement or assume K26 command semantics based only on a translated protocol document. Firmware compatibility, rights and supported commands must be confirmed first.

## 13. Environment configuration
Include `.env.example` with placeholders only:
- `VITE_APP_ENV=demo`
- `VITE_MAP_TILE_URL=`
- `VITE_MAP_ATTRIBUTION=`
- `VITE_ENABLE_3D_VIEWER=true`
- `VITE_DEMO_MODE=true`

Never commit tokens, private keys, signing files or credentials.

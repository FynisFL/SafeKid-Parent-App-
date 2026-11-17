# SafeKid Parent App — V7 Mobile-first UX remediation

> **Release status:** V7 is a tested web/PWA implementation baseline, not a production-certified product. Automated domain/source checks and a static build pass. Browser-driven screenshots/E2E and physical-device behavior remain unverified because the test environment blocks Chromium navigation. Read `docs/QA_REPORT.md`, `docs/KNOWN_LIMITATIONS.md` and `docs/UAT_CHECKLIST.md` before deployment.

## V7 scope delivered

V7 completes the five UX remediation phases approved after the V6 audit:

1. **First-run onboarding:** onboarding is rendered outside the application shell. No topbar, notifications, avatar or bottom navigation appears before local profile setup. The parent profile form and primary action are prioritized above the fold on phone layouts. This is local profile setup, not account login; no email, password, Google sign-in or backend account was added.
2. **Mobile navigation and dashboard:** phone navigation is Home, Location, SOS, Growth and More. The More Hub contains less-frequent tools. Dashboard quick actions are surfaced ahead of the decorative family hero, which is compact on phone widths.
3. **Safe Zone Builder:** create/manage is limited to the dedicated Safe Zones section. The builder supports MapTiler place search, map tap/drag marker, a live radius circle, location label and weekday/time schedule. Latitude/longitude are stored internally but are not typed by parents. Empty coordinates are rejected; no implicit `0,0` point can be saved.
4. **SOS hardening:** one open SOS event at a time, including acknowledged-but-unresolved events. A synchronous activation lock blocks double taps while storage is pending. The local repeating two-note alarm remains user-gesture initiated, can be muted/re-enabled and stops on acknowledgement/resolution. SOS remains same-device only.
5. **Global UX polish:** conditional reminder-time controls, weekday chips, a Settings Hub, in-page settings shortcuts that do not change the hash route, custom destructive-action confirmations and modal focus management (initial focus, Tab trap, Escape close and focus return).

## Product boundaries

- **Location Map is view-only.** It shows the parent phone's real location and already-created Safe Zone overlays. It has no create/edit/pause/delete Safe Zone controls.
- **Safe Zones is the only create/manage area.** All create/edit/pause/resume/delete actions are guarded to the `/safe-zones` route and persistence function.
- The live location is the phone running the app, never the child's or watch's location.
- Geofence evaluation and reminders run only while the app is open/visible. No background monitoring is claimed.
- SOS is stored and optionally sounded/notified on this device only. It does not alert another device or an emergency service.
- Watch Passport is manual; it does not pair with or verify a physical watch.

## What is included

- Vietnamese-first / English switch, no-login onboarding and parent/optional child profile.
- Dashboard, phone GPS, MapLibre / MapTiler Streets V4 Pastel map, permissions and view-only Location Map.
- Safe Zones with MapTiler Geocoding search, direct map selection, draggable marker, radius and schedule editor.
- Local SOS, alerts, contact `tel:` / `sms:` links, repeating two-tone alarm and acknowledgement/resolution.
- Growth tasks, occurrences, habits, reminders while open, coins, calendar and progress.
- Manual Watch Passport Lite, settings, privacy, local backup ZIP export/import, delete data, FAQ and constrained local S.F AI.
- Web manifest, service worker, local mascot and brand assets.

## Run locally

Requirements: Node.js 20 or newer. The current source has no npm runtime dependencies; no `npm install` is required.

```bash
npm run dev
```

Open `http://localhost:4173`. Localhost is treated as a secure context for geolocation by modern browsers.

## MapTiler configuration

The supplied MapTiler Streets V4 Pastel style URL is bundled as the default so static hosting does not depend on `.env` injection. To override it, copy `.env.example` to `.env` and set:

```dotenv
VITE_MAP_STYLE_URL=https://api.maptiler.com/maps/streets-v4-pastel/style.json?key=YOUR_RESTRICTED_KEY
```

`window.SAFEKID_MAP_STYLE_URL` can also override the bundled default before the app module loads. The browser key is visible in network requests. Restrict allowed HTTPS origins/referrers in MapTiler before publishing. Safe Zone place search calls MapTiler Geocoding; a selected map point can still be saved if reverse geocoding is unavailable. Search query/selected place data are sent to MapTiler for search/address resolution; parent/child profile names are not included.

The map uses MapLibre GL JS `5.24.0` and the vector `style.json` endpoint, not an iframe or the raster PNG URL. MapLibre is loaded from jsDelivr with unpkg fallback. A regional basemap can render before GPS permission, but no current-location marker is drawn until a real phone fix exists. A map centered on GPS can disclose the viewed map area to the provider; the privacy screen explains this.

```bash
npm run build
npm run preview
```

## Build and QA commands

```bash
npm run typecheck  # JavaScript syntax checks only; not TypeScript compilation
npm run lint       # privacy-oriented source lint
npm test           # deterministic domain + source regression tests
npm run build      # static deployable bundle in dist/
npm run test:e2e   # Playwright flow and viewport suite; needs browser navigation access
```

## Architecture caveat

This V7 deliverable remains the dependency-free JavaScript SPA inherited from the previous baseline. It is **not** the originally specified React + TypeScript + Vite + Tailwind + React Router + Zustand + Zod + Dexie stack. `typecheck` is a JavaScript syntax check, not a TypeScript compiler. The fallback was retained to avoid replacing working product flows with an unbuildable dependency set in an environment without registry access. See `docs/KNOWN_LIMITATIONS.md`.

## Deploy

1. Run `npm run build`.
2. Publish the **contents** of `dist/` to the HTTPS document root; do not upload the source tree as the web root.
3. Restrict the browser MapTiler key to the deployed origin.
4. Load the app online once so service worker revision `safekid-pwa-v7-full-ux-fix` replaces older caches.
5. Complete the V7 owner acceptance checks in `docs/UAT_CHECKLIST.md` on real iOS Safari and Android Chrome.

## Data and safety

IndexedDB is local browser storage and is not encrypted at rest by the app. Back up before clearing site data or changing devices. Emergency call and SMS links open the OS handlers only after a user action and confirmation. S.F AI is a local rules/approved-content matcher, not an LLM or cloud service.

## Project map

```text
src/
  adapters/   browser capability adapters and IndexedDB repositories
  config/     bundled MapTiler default
  data/       approved FAQ/Brand copy loader
  domain/     geofence, growth, SOS, Safe Zone validation, S.F AI
  services/   backup and MapTiler forward/reverse geocoding
  main.js     hash routes, rendering and interactions
  styles.css  responsive design system and mobile-first overrides
content/      approved Vietnamese/English copy
assets/       official logo, mascot and PWA assets
docs/         decisions, implementation, known limits, QA, UAT and design guide
tests/        domain and source regression tests
scripts/      build, privacy lint, syntax validation and Playwright suite
dist/         generated static deployment output after build
```

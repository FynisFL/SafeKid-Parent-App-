# Known limitations — V7

This release contains the five approved UX remediation phases and passes its automated/source-level quality gates. It is not a production certification. Keep the following limitations visible to anyone deploying or extending the project.

## Architecture and dependencies

- The app remains a dependency-free JavaScript SPA with hash routing, not the originally specified React + TypeScript + Vite + Tailwind + React Router + Zustand + Zod + Dexie architecture.
- `npm run typecheck` runs Node syntax checks; it is not a TypeScript compiler and provides no TypeScript type guarantees.
- No React component tests or framework-level accessibility tests are present.
- Capacitor Core and its Geolocation, Haptics, Local Notifications, Preferences and App plugins are not installed. No Android/iOS project was generated. Native background geofencing remains out of scope for this web phase.
- IndexedDB uses a hand-written schema and versioning; Dexie migrations are not present.
- Plus Jakarta Sans and Inter are preferred CSS names but are not bundled locally in this fallback. Font rendering depends on platform availability/system fallbacks.
- Some UI copy is still inline; full translation-key parity is not build-enforced.

## Product capabilities

- Geofence evaluation and reminders run only while the app is open/visible. Browser timers can be throttled; no background delivery is guaranteed.
- Safe Zone place search requires MapTiler Geocoding/network access. The map uses MapLibre GL JS 5.24.0 from jsDelivr with unpkg fallback and the user-supplied MapTiler vector style. Live provider authorization, search quality and tile rendering were not browser-verified in this environment.
- MapTiler browser key is visible in browser requests. Restrict allowed origins/referrers to the HTTPS deployment origin before public deployment. Avoid committing `.env`.
- Search query/selected map point can be sent to MapTiler for place/address resolution. The current text-search flow does not share parent GPS as proximity. Map tiles centered on the phone fix can still expose viewed map area to the provider; privacy copy discloses this.
- Notification, audio and vibration behavior varies by browser/OS. SOS persists locally if audio is blocked, but the repeating alarm cannot be guaranteed after the page/app is backgrounded, suspended or closed.
- No native background notifications or system scheduled reminders.
- Task templates still have limited editing/archiving behavior; habit tracking remains a lightweight list/record model.
- Watch Passport is manual. It does not pair with, verify, warranty-check or erase a physical watch.
- Backup ZIP is local and has stored-entry import constraints. Import replaces local data after validation; there is no merge/preview workflow.
- IndexedDB is not encrypted at rest. Backups contain personal data and need secure handling.

## UX and QA verification

- Automated tests pass 66/66. JavaScript syntax validation passes 25 files. Privacy lint passes 25 files. Static build passes.
- Playwright navigation to local V7 app is blocked by the environment (`ERR_BLOCKED_BY_ADMINISTRATOR`) before the first page loads. The E2E suite is authored but no E2E journey is claimed as passed.
- No valid screenshots or computed `scrollWidth` measurements were captured. Breakpoint CSS is parsed and source-reviewed, but the visual matrix at phone/tablet/desktop widths remains unverified.
- Modal focus behavior is implemented and source-regression-tested; keyboard operation and screen reader behavior need actual browser/assistive-tech UAT.
- No physical-device test has verified GPS permissions, MapTiler rendering, notifications, sound/haptics, PWA installation, safe-area behavior or geofence transitions.
- The app must be served via HTTPS (or localhost) for browser geolocation and PWA installation.

## Do not claim

Do not call this app production-ready, certified, encrypted-at-rest, background-monitoring, connected to a watch, capable of locating a child, or capable of sending SOS to another device/emergency service.

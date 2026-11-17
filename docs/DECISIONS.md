# Architecture and product decisions

Date: 2026-11-17  
Current UX baseline: V7

## Binding product decisions

1. **Web/PWA phase only.** No native projects, backend, accounts, remote database, cloud sync, payments, analytics, cloud AI or watch pairing are part of this release.
2. **No account login.** First-run onboarding is local parent-profile setup only. Do not add email/password or third-party sign-in unless the product owner explicitly changes scope.
3. **Truthful location scope.** Browser geolocation is the location of the parent phone, never the child's or watch's location.
4. **Location Map is view-only.** `/location` displays actual parent-phone location and already-created Safe Zone overlays. It must not expose create/edit/pause/resume/delete actions.
5. **Safe Zones has exclusive management ownership.** `/safe-zones` is the only route that can create, edit, pause/resume or delete Safe Zones. Both UI actions and persistence handlers enforce the route boundary.
6. **Same-device SOS.** SOS persists locally and may use sound/haptics/notification on the same device only. No automatic call/SMS or remote alert is sent.
7. **Foreground-only monitoring.** Geofence evaluation and reminders operate only while the app is open/visible. No background monitoring or scheduled-delivery claim is made.
8. **Safe Zone defaults.** Spec §17.6 defaults remain: fix age 120 seconds, accuracy ≤50 m, two qualifying confirmation fixes, 25 m exit hysteresis, 5-minute dwell, 10-minute per-zone cooldown and 500 m default radius. Haversine distance is used.
9. **Task model.** Task templates generate dated occurrences. Completion/reward is idempotent; coins derive from ledger entries. Reminders only run while the app is open/visible.
10. **Local-first storage.** IndexedDB is used directly in this dependency-free implementation. No remote persistence. Local backup export/import and delete-data action are available; browser site-data clearing can remove records.
11. **S.F AI is local and constrained.** It selects approved FAQ/Brand material only; it is not an LLM and makes no cloud calls. Emergency/out-of-scope/unmatched questions use approved safety/help copy.
12. **Watch Passport is manual.** Provenance is user-entered. The app does not verify serials, pair with a watch or erase watch data.

## V7 UX decisions

13. **Onboarding is a separate experience.** When no parent profile exists, render onboarding outside the app shell. Hide app topbar, notification bell, avatar, desktop navigation and mobile bottom navigation until setup succeeds. Parent name is required; child profile name is optional. The first action and fields must be the visual priority on mobile.
14. **Mobile navigation destinations.** Phone navigation is Home, Location, SOS, Growth and More. Secondary screens live in More Hub or relevant feature shortcuts. Tablet rail and desktop sidebar remain available at wider breakpoints.
15. **Mobile-first hierarchy.** Quick actions precede decorative content on Home. The family hero is compact on phones; important information and primary actions are prioritized over decoration.
16. **Hybrid Safe Zone Builder.** Parents can search a named place/address or select a point by tapping/dragging a marker on the map. The builder displays a live radius circle and schedule controls. Coordinates are internal data, never a manual requirement.
17. **No implicit coordinate.** Empty coordinate strings are rejected before numeric conversion. A Safe Zone cannot be saved without a real selected point or a valid explicit phone-location action.
18. **Geocoding privacy.** Text place search does not send the current parent-phone GPS fix as proximity. Search term and selected point can be sent to MapTiler for address resolution; this is disclosed in the builder.
19. **SOS lifecycle.** Both `active` and `acknowledged` are unresolved/open. A second SOS is blocked until the previous event is resolved. A synchronous pending lock prevents double activation during async writes.
20. **Modal accessibility.** Opening a modal moves focus inside, Tab/Shift+Tab remain in the dialog, Escape closes it where appropriate and focus returns to the opener when still available.

## Map decisions

21. **Map renderer.** Use MapLibre GL JS `5.24.0` with the user-supplied MapTiler Streets V4 Pastel vector `style.json`. Do not use the iframe or raster PNG tiles. A regional basemap can load before GPS permission; no live marker appears without an actual parent-phone fix. Display MapTiler and OpenStreetMap attribution.
22. **Bundled style fallback.** The supplied style URL is bundled as the default because static hosting may not inject `.env`. `VITE_MAP_STYLE_URL` or `window.SAFEKID_MAP_STYLE_URL` can override it.
23. **Map key.** The browser key is visible in requests. Restrict allowed HTTPS origins/referrers in MapTiler. Never commit `.env`.
24. **Map privacy.** Map tiles centered on phone GPS can reveal the viewed map area to the map provider. This is disclosed in privacy copy.

## Motion and safety decisions

25. **Family-first visual language.** Sky-blue/white foundation, soft pastel category accents, rounded cards, consistent SVG iconography and local 3D mascot. Artwork never implies unsupported live child/watch state.
26. **Safety visual hierarchy.** SOS is high-contrast rose/red with same-device disclosure. SOS activation is excluded from nonessential entrance, pulse, hover and transform motion.
27. **Reduced motion.** Honor `prefers-reduced-motion`; do not delay SOS, GPS permission, native/browser prompts or confirmation behind animation.
28. **Alarm behavior.** SOS uses a repeating local two-note alarm when enabled/supported. Audio is prepared in a user gesture and starts before async persistence/notification work. Acknowledgement/resolution or mute stops it; audio failure never blocks local SOS persistence.

## Architecture / environment deviations

- The originally specified React + TypeScript + Vite + Tailwind + React Router + Zustand + Zod + Dexie + Motion + Vitest/RTL/Playwright stack could not be installed in the constrained environment. The inherited dependency-free JavaScript SPA and static build pipeline remain. This is a documented deviation, not stack compliance.
- `npm run typecheck` performs JavaScript syntax checks only; it is not TypeScript typechecking.
- IndexedDB uses a hand-written schema. Dexie migrations and native adapters are not implemented.
- Plus Jakarta Sans and Inter are preferred font names in CSS but are not bundled locally.
- Browser E2E/visual screenshot validation and real device UAT are blocked/unverified in the current environment. See QA report and UAT checklist.

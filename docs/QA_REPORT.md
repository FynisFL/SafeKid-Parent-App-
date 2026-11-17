# SafeKid Parent App — V7 UX/UI Remediation QA Report

Date: 2026-11-17  
Baseline: V6 Mobile/SOS release  
Release scope: all five phases approved from the V6 UX/UI audit.

## 1. Executive result

| Gate | Result | Evidence / limit |
|---|---|---|
| Domain + source regression | **PASS — 78/78** | `npm test`; geofence, Growth, S.F AI, geocoding, Safe Zone validation, view-only route boundary, SOS lifecycle/audio, onboarding, navigation, modal keyboard behavior and responsive source checks. |
| JavaScript syntax | **PASS — 26 files** | `npm run typecheck`; syntax validation only, not TypeScript. |
| Privacy lint | **PASS — 25 files** | `npm run lint`. |
| Static PWA build | **PASS** | `npm run build`; `dist/` regenerated and MapTiler default style injected. |
| CSS parser | **PASS** | PostCSS parsed 1,662 rules, 38 media queries and 11 keyframes with no parser error. |
| Local HTTP smoke | **PASS — 8/8 HTTP 200** | `/`, `/src/main.js`, Safe Zone and SOS domain modules, geocoding service, mascot, `/sw.js`, `/manifest.webmanifest`. |
| Playwright E2E | **PASS** | GitHub Actions run #44116845251: ten routes × six mobile viewport configurations, horizontal-overflow and bottom-navigation clearance assertions, Plans/Free-Plus transparency, S.F AI composer visibility; 37 screenshots uploaded. |
| Rendered screenshot / computed overflow | **PASS — CI matrix** | Playwright captured 17 screenshots and measured `scrollWidth` / fixed-nav geometry for the route matrix. The map is a local fixture; live provider rendering remains separate. |
| MapTiler live render/geocoding | **NOT VERIFIED** | Source configuration and mocked-flow test exist; live browser network/tile rendering requires a permitted browser and restricted valid key. |
| Physical phone GPS, notification and SOS alarm | **NOT VERIFIED** | Requires real HTTPS deploy and iOS Safari/Android Chrome devices. |

## 2. Fix register by approved phase

### Phase 1 — Onboarding isolation and above-the-fold profile form

- First run renders `renderOnboarding()` directly, not `renderShell(renderPage())`.
- Topbar, notification bell, avatar, app bottom navigation and signed-in application chrome are absent until local parent profile creation succeeds.
- Mobile first-run view centers one compact setup panel, shows the SafeKid identity, concise product value, parent name input, optional child name, start action and local storage/no account notice.
- No email/password/Google login or remote account creation was introduced.
- Route guard prevents an existing profile from reopening the onboarding route as if it were a login page; delete local data returns to first-run onboarding.

**Automated verification:** onboarding route/source assertions pass. Responsive browser screenshot and “CTA visible above fold” geometry remain unverified because the browser did not start navigation.

### Phase 2 — Mobile navigation and dashboard hierarchy

- Phone destinations are Home, Location, SOS, Growth and More.
- More Hub groups secondary safety, contacts, device, support and settings destinations.
- Dashboard quick actions are promoted before the decorative hero; hero is compact on phone.
- Settings Hub shortcuts open the proper accordion and scroll within the same route; they no longer change hash router state.
- Existing tablet rail and desktop sidebar breakpoints are retained.

**Automated verification:** route/icon/static CSS assertions pass. Full computed visibility and overflow across 320–1920 px remain unverified.

### Phase 3 — Safe Zone Builder and Location boundary

- `/location` is explicitly view-only and has no Safe Zone creation/edit/pause/delete actions. It shows parent-phone GPS and previously saved Safe Zone circles, with a route link to the dedicated manager.
- `/safe-zones` is the only route that renders and accepts Safe Zone management actions. Route checks are applied to UI action handling and `createZone()` persistence.
- Builder uses MapTiler Geocoding for place/address search; parents can choose a search result or tap/drag a marker on the map.
- Radius range and circle update together. Schedule uses selectable weekday chips and time controls.
- Raw latitude/longitude are hidden from parent-facing form; location is described in ordinary language.
- Blank coordinate strings are rejected before numeric conversion, preventing `Number('') === 0` from creating a false `0,0` Safe Zone. Bounds, radius range and paired schedule endpoints are independently validated.
- Parent phone position is not sent as `proximity` during text search; the user explicitly chooses search result, tap point or the “use current phone location” action.
- A disclosure explains place search/reverse geocoding can send query/selected point to MapTiler for address resolution; profile names are not included.

**Automated verification:** Safe Zone validation, geocoder URL/provider error and view-only boundary tests pass. Live map tile loading, search endpoint authorization and marker dragging require browser/network UAT.

### Phase 4 — SOS lifecycle and alarm safety

- `active` and `acknowledged` are treated as open states. A new SOS is not offered until the prior event is resolved.
- A synchronous pending lock prevents double activation while IndexedDB operations are pending.
- AudioContext prepares in the initiating user gesture. The repeating two-note alarm starts before asynchronous storage/notification work.
- Alarm can be muted/re-enabled; acknowledge, resolve or global sound-off stops it. Audio failure does not block the same-device SOS event.
- SOS remains same-device only, with the required disclosure. No entrance, pulse, hover or transform motion delays the emergency action.

**Automated verification:** SOS domain and mocked Web Audio adapter tests pass. Actual audibility, autoplay policy, phone volume and page background behavior require real device testing.

### Phase 5 — Global UX polish and keyboard behavior

- Reminder-time control appears only when reminders are enabled.
- Weekly task schedule exposes weekday chips instead of requiring a comma-separated numeric entry.
- Settings Hub makes family, notifications, privacy and data backup sections discoverable.
- Destructive actions use app-owned confirmation dialogs instead of browser-native `confirm()`/`prompt()`.
- Modal opens with focus moved to a useful control; Tab/Shift+Tab stays inside; Escape closes; focus returns to the triggering control when still available.
- Vietnamese labels, helper copy and responsive UI affordances were reviewed in affected flows.
- `prefers-reduced-motion` rules remain; SOS route/hold affordance is not animated.

**Automated verification:** source assertions and keyboard-modal static regression test pass. Actual VoiceOver/TalkBack and keyboard browser operation remain manual UAT.

## 3. Breakpoint/source review

| Width | Intended shell |
|---|---|
| 320–374 px | Compact phone refinement |
| 375–767 px | Mobile header, stacked content, floating five-item bottom navigation |
| 768–1023 px | Compact tablet navigation rail |
| 1024–1200 px | Desktop sidebar / narrower content grid |
| 1201–1535 px | Standard desktop |
| 1536 px+ | Wide desktop |

CSS parsing completed with 1,662 rules, 38 media queries and 11 keyframes. Source rules include safe-area bottom padding, 16 px mobile form text, bottom-sheet modals, coarse-pointer hit areas, compact-nav labels and reduced-motion fallbacks. This is not equivalent to a real computed layout/screenshot check. No no-overflow claim is made for rendered browsers.

## 4. Newly discovered defects fixed during V7

| Defect | Why it mattered | Correction |
|---|---|---|
| Tests required `.env` | Clean handoff intentionally omits private `.env` | Tests accept absent optional file and use `.env.example`/bundled default; secret not restored. |
| Cache regression expected V6 | Stale test would fail after valid PWA revision bump | Test now expects V7 cache and additional precached modules. |
| Settings shortcuts used hash-like anchors | Router navigated to invalid route rather than section | Replaced with buttons opening/scrolling accordion in-place. |
| Empty coordinates coerced to 0,0 | Could save false geofence at Null Island | Dedicated validation rejects empty values before `Number()`. |
| Acknowledged SOS allowed duplicate | User could create another SOS while first unresolved | Acknowledged remains an open state; synchronous pending latch. |
| Modal keyboard focus unmanaged | Keyboard user could tab into background and lose context | Initial focus, Tab trap, Escape close and focus restoration. |
| Place search sent current phone proximity | Unnecessary location disclosure for a text query | Geocoding call omits phone-fix proximity unless future consented flow is added. |
| Safe Zone default radius was 200 m | Master Spec §17.6 requires `defaultRadiusMeters = 500` | Form, draft and radius preview now use the spec constant; 200 m remains an explicit preset. |

## 5. Commands and results

```text
npm test          PASS — 66/66
npm run typecheck PASS — 25 JavaScript syntax files
npm run lint      PASS — 25 JavaScript files
npm run build     PASS — static PWA generated in dist/
npm run test:e2e PASS — GitHub Actions run #44115276941; 10 routes × 6 phone viewports; 37 screenshots
```

HTTP smoke test: 8/8 resources returned HTTP 200. Build output includes `safekid-pwa-v7-mobile-shell-r2` and the bundled MapTiler style URL. `.env` is excluded from source distribution.


## 7. Mobile-first redesign follow-on (PR #9)

### Phase 0 — Baseline and branch safety
- Redesign remained isolated on `redesign/mobile-first-ux-v11`; production `main` was not changed during implementation.
- The branch was validated against the existing V7 source and product boundaries before merging.

### Phase 1 — Shared mobile shell
- Five primary destinations remain Home, Location, SOS, Growth and More.
- Mobile text-entry focus hides the fixed bottom navigation and restores it after blur; modal sizing follows the dynamic viewport.
- Modal initial focus no longer steals focus from a form control already selected by the user.
- Service Worker precaches the mobile refinement stylesheet and uses cache revision `safekid-pwa-v7-mobile-shell-r2`.

### Phase 2 — Core screen redesign
- Mobile layouts cover Home, Location, Safe Zones, SOS, Growth, More, FAQ, S.F AI, Plans and Profile/Settings.
- Browser checks cover 320×720, 320×780, 360×800, 375×812, 390×844 and 430×932, plus the existing tablet/desktop matrix.
- Fixed bottom navigation clearance and horizontal overflow are measured, not inferred from CSS parsing alone.

### Phase 3 — Freemium and content alignment
- Free explicitly includes parent-phone GPS, core Safe Zones, same-device SOS, Growth basics and local data.
- Plus remains a planned, not-for-sale extension. No checkout, payment, renewal or feature lock is active.
- SOS and core Safe Zones remain Free; the app does not imply child/watch tracking or background geofencing.

### Phase 4 — Forms, accessibility and motion
- Keyboard-aware shell and modal focus behavior are covered by regression/E2E tests.
- Reduced-motion styles remain in place; SOS activation has no entrance/pulse/hover transform.
- SOS hold button now uses a darker emergency fill with white labels. A contrast regression test checks both gradient colors against WCAG AA 4.5:1 for normal text.

### Phase 5 — UAT and regression
- Regression suite: 78/78 tests pass in GitHub Actions run #44116845251.
- Browser E2E checks ten routes across six mobile viewport configurations and captures 37 screenshots.
- Real MapTiler tiles/geocoding, physical Android/iOS GPS/notifications/audio/haptics and VoiceOver/TalkBack remain manual device UAT; they are not claimed as passed.

## 6. Release interpretation

All five V7 remediation phases are implemented at source level and automated/source regression gates pass. This release is **not certified production-ready**: browser-based E2E/screenshot geometry, real MapTiler rendering, phone GPS permission behavior, notification behavior, alarm audibility and assistive-technology review must be completed using a browser/device environment that permits access to the deployed HTTPS app. The project remains a dependency-free JavaScript SPA rather than the specified React/TypeScript stack.

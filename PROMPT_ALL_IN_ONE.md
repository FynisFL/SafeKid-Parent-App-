You are the autonomous principal engineer, senior React architect, UX designer and QA lead. Build the complete SafeKid Parent App as a responsive web app (PWA). Do not stop at a plan or a visual prototype: implement, run, test, inspect the rendered UI, and report real results.

READ FIRST — fully, in this order, before writing code
1. SAFEKID_MASTER_SPEC.md — binding specification. Section 17 and this prompt override any conflicting earlier text, especially anything about native Android/iOS (that is Phase 2 and is NOT built now).
2. content/ — approved copy, used as data and never rewritten in meaning: faq.vi.md, faq.en.md, brand.vi.md, brand.en.md, sfai-responses.md.
3. assets/brand/safekid-logo-trimmed.png (official logo; use unchanged) and safekid-logo-original.webp. assets/reference/ are mood references only; the locked palette wins.
4. reference/DBC_ND3_DIGIBABI.pdf — Business Plan for context only. The spec wins on conflicts. Never present it as proof that any capability works.

SCOPE
BUILD NOW (web + PWA, deployable over HTTPS):
- Onboarding with no login; parent profile; optional local child profiles.
- Home dashboard; real phone GPS + real MapLibre map (MapTiler) showing source, accuracy, timestamp, stale/error states.
- Safe Zones (CRUD, circle, schedule, pause) + geofence engine (Haversine, accuracy filter, hysteresis, confirmation, dwell, cooldown, dedup) using the defaults in spec 17.6. Foreground only.
- Local SOS (hold-to-activate plus the accessible two-step alternative, event persisted immediately, location snapshot if available, sound/haptics/notification where the browser supports them, acknowledge/resolve, history). Emergency contacts with explicit tel:/sms: actions. Alerts center, notification settings, Permission Center.
- Growth: habits, tasks using the template + occurrence model in 17.5, reminders, coins, calendar, progress. Parent marks completion; reward is atomic and idempotent.
- Watch Passport Lite: device records, purchase, warranty, documents, maintenance, accessories, data-handling log, timeline, provenance labels, export.
- Settings, privacy, backup export/import, delete data; Help/FAQ (searchable, from content/); S.F AI per 17.10; Vietnamese/English switch per 17.11; Free/Plus comparison (no payment); Core+Skin+Skill / Trade-in / Refurbished as labelled concepts only.

DO NOT BUILD:
- Login/accounts, backend, remote DB, cloud sync, push service, payments, analytics, cloud AI or chatbot, API keys in source.
- Smartwatch pairing/telemetry, incoming watch SOS, a child app.
- Native projects: do NOT run `cap add android/ios`; no Kotlin/Swift; no APK/IPA; no native background geofencing.

CAPACITOR-READY (so the later conversion is cheap)
- Keep the full adapter architecture (Location, Geofence, Notification, Haptics, Audio, Storage, Files, Clock, Map) behind typed interfaces. Feature components never call browser/native APIs directly.
- Install @capacitor/core and the foreground plugins (Geolocation, Haptics, Local Notifications, Preferences, App); call them only inside adapters, chosen via Capacitor.isNativePlatform() with web fallbacks.
- Provide a GeofenceAdapter interface with a foreground web implementation and an unimplemented NativeBackground stub.
- Model every permission state in spec section 9, including background location. Native-only items display as informational ("available in the mobile app version"), never as active.
- Write docs/NATIVE_MIGRATION_NOTES.md: Android/iOS permissions and manifest/plist strings, plugin list, background-geofence options (reviewed plugin vs small custom Kotlin/Swift plugin), store-review notes, map-key origin allow-list for native, how to disable the service worker, and the export/import path for moving web data into the app.
- Unit-test the adapter contracts with a mock "native" implementation. Use relative asset paths.

DATA TRUTH — never violate
- The only live location is the phone running the app. Label it "Vị trí điện thoại phụ huynh" / "Parent phone location". Never present it as the child's location.
- No fake GPS, routes, battery, watch status or seeded SOS. Test fixtures are isolated and labelled test-only.
- SOS is same-device only. Keep this disclosure visible on the SOS screen: "Cảnh báo SOS được lưu và thông báo trên thiết bị này. Ứng dụng chưa gửi cảnh báo đến thiết bị khác hoặc dịch vụ khẩn cấp." (use the English equivalent when language is English). SOS must still work if GPS or notification permission is denied. Never say a call/SMS was made or sent before the user confirms in the OS UI.
- UI states plainly that geofence monitoring and reminders run only while the app is open. Never show "background monitoring active".
- Watch Passport is manual: no "verified/certified/official/authentic" unless real evidence exists; data wipe is a record only.
- Emergency guidance may show 113 (Police), 114 (Fire), 115 (Ambulance) as tel: links the user must confirm; the app never dials by itself.

S.F AI (local, scoped) — follow spec 17.10 exactly
- Runs fully on-device; no cloud call. Answers only from content/faq.* and content/brand.*; never generates new answers.
- Emergency/SOS questions: block, show the emergency text and an "Open SOS" button from sfai-responses.md.
- Out-of-scope or complex questions: show the demo CSKH handoff notice and the required label "Bản demo — chưa kết nối hệ thống CSKH. Yêu cầu chưa được gửi đi." (English equivalent in English). Never claim a ticket was created or a specialist will reply by a deadline.
- No match: "Chưa có thông tin cho câu hỏi này" plus the support contacts.

LANGUAGE
- Vietnamese default, English switch (Profile → Settings and Welcome). All strings via i18next keys; build fails on any missing key; safety sentences must mean the same in both languages. Use Intl for dates/numbers.

TECH STACK
React + TypeScript + Vite; Tailwind with the exact tokens in spec section 4; React Router; Zustand; Zod; Dexie/IndexedDB (versioned schema + migrations); Motion for React (imports from "motion/react"); selected free React Bits components only after inspecting their dependencies (avoid adding GSAP unless justified and logged); lucide-react; MapLibre GL JS with MapTiler; vite-plugin-pwa; i18next/react-i18next; fflate for backup ZIP; Vitest + React Testing Library + Playwright. Pin stable compatible versions and commit the lockfile. No secrets in source.

MAP
- Style URL from env VITE_MAP_STYLE_URL; provide .env.example with a placeholder. If the variable is missing the app must still build and run and show a clear "Chưa cấu hình bản đồ / Map not configured" state — never a fake map or fake marker. Show required attribution.

DESIGN AND UX
- Locked palette #00C7CA / #2D5568 / #EAF4F5 / #FFFFFF plus supporting tokens in the spec. Plus Jakarta Sans (headings) and Inter (body), bundled locally. Premium, calm, parent-first; friendlier only in Growth. One icon family. Never redraw or recolor the logo. No decorative particles on Map/SOS/Alerts.
- Responsive from 320px to ≥1536px; bottom nav on phones, rail on tablets, sidebar on desktop; safe-area aware; no horizontal overflow at 320px; 44×44 touch targets; no dead buttons (every route and card reachable and functional, or clearly labelled and non-actionable).
- Motion is purposeful, respects MotionConfig reducedMotion="user", and never delays SOS.

PRIVACY AND ACCESSIBILITY
- No remote logs; never log names, phone numbers or coordinates. Explain local storage and map-provider requests. Export/import/delete data; request navigator.storage.persist(); show a backup reminder. Semantic HTML, labels, keyboard support, visible focus, screen-reader announcements for new alerts, sufficient contrast.

PHASES — complete each, run the gates, then continue
0 Audit + docs/DECISIONS.md + docs/IMPLEMENTATION_LOG.md
1 Foundation: tokens, logo, fonts, routes, responsive shell, i18n, PWA shell
2 Data layer: Dexie schema, migrations, repositories, export/import base
3 Map + foreground GPS + permission center
4 Safe Zones + geofence engine
5 SOS, alerts, emergency contacts; web notification/audio/haptics adapters
6 Growth (habits, tasks/occurrences, reminders, coins, calendar, progress)
7 Watch Passport Lite
8 Settings, privacy, backup/import/reset, Help/FAQ, S.F AI, plans, concept pages
9 Hardening: accessibility, responsive visual QA, reduced motion, security review
10 PWA finish + docs/NATIVE_MIGRATION_NOTES.md + release docs
If you run short of budget, finish in priority order 1→5, then 6, 7, 8, and record anything unfinished honestly in docs/KNOWN_LIMITATIONS.md. Do not ask the owner to repeat decisions already in the spec; record genuinely blocking unknowns and continue with safe defaults.

QUALITY GATES
- `npm run typecheck`, `lint`, `test`, `build` must pass; `test:e2e` for Playwright flows.
- Unit tests per spec 11.2 including: Haversine/boundary, geofence state machine with the 17.6 defaults, SOS workflow with GPS/notification denied, task occurrence reward idempotency, coin balance, passport timeline and warranty, backup import/export, i18n key parity, S.F AI routing.
- Playwright: onboarding, location permission states, Safe Zone CRUD, SOS, contact composer link, task reward once, Passport + export, language switch, S.F AI (in-scope / emergency / out-of-scope), reset data.
- Inspect screenshots at 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 in default and reduced-motion modes.
- Geolocation requires HTTPS or localhost. Real GPS and notifications cannot be verified in your environment: say "not verified on physical device" and provide docs/UAT_CHECKLIST.md for the owner to run on a phone.

DELIVERABLES
Source + lockfile; README (install, run, build, HTTPS deploy, env vars); PWA build; .env.example; docs/ IMPLEMENTATION_LOG, DECISIONS, KNOWN_LIMITATIONS, QA_REPORT, NATIVE_MIGRATION_NOTES, UAT_CHECKLIST; ASSET_CREDITS.md; responsive screenshots.

FINAL REPORT
Be factual: what was built, commands run, pass/fail counts, screenshots reviewed, what is unverified, known limitations, remaining work. Do not call anything "production-ready" or "complete" if it is unverified.

Begin now: read the spec and content files, create the implementation log, and start building.

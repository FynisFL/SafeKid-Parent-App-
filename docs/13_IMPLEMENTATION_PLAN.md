# 13 — Implementation Plan for the Coding Agent

## Phase 0 — Repository and toolchain audit
- Inspect repo; identify existing code and preserve it where possible.
- Check Node, package manager, TypeScript, Vite and Capacitor versions.
- Create implementation log and task checklist.
- Confirm web build first before native packaging.

**Exit gate:** baseline repo runs; architecture documented; no unrelated destructive refactor.

## Phase 1 — Foundation
- Complete the skill/art-direction workflow in `16_AGENT_SKILLS_AND_VISUAL_QA.md` before styling.
- Create/refresh root `DESIGN.md` from the SafeKid tokens, visual rules and motion contract.
- Initialize/repair Vite React TypeScript app.
- Configure strict TS, lint, tests, environment file and scripts.
- Build design tokens, the shared MotionConfig/reduced-motion setup and reusable UI primitives.
- Configure router, app shell, responsive navigation.
- Implement onboarding and local parent/child profiles.
- Implement IndexedDB persistence and seed/reset.

**Exit gate:** onboarding persists, routes work on web at mobile/desktop sizes, and the representative Safety/Growth/Service screens pass the first visual direction review.

## Phase 2 — Grow Safe
- Implement device status mock service.
- Implement map adapter and fallback.
- Implement location screen/history preview.
- Implement Safe Zone CRUD and 500m scenario.
- Implement alert service and SOS detail/acknowledge flow.
- Implement notification/haptics adapters and permission UX.
- Implement approved contacts and device management.

**Exit gate:** six safety interactions work in demo; all data labelled simulated.

## Phase 3 — Grow Independent
- Implement habits, tasks, reminder preferences/scheduling, Coin wallet and progress.
- Implement duplicate-safe completion transaction.
- Implement simulator action for child completion.

**Exit gate:** full create → assign → reminder → simulated complete → reward → progress flow passes tests.

## Phase 4 — Services and ecosystem
- Implement Free/Plus configuration and subscription screens.
- Implement S.F AI FAQ engine and human handoff simulation.
- Implement Watch Passport/Skin/Skill/Trade-in previews.
- Add optional 3D watch viewer only if an approved model/render asset exists; otherwise use static fallback.

**Exit gate:** pricing/entitlements are centralized; SOS remains Free; unsupported AI queries are safe.

## Phase 5 — Demo Control Center and QA
- Implement manual simulator controls and six curated scenarios.
- Implement reset and optional local test log export.
- Run acceptance tests, required motion checks and responsive visual QA using screenshots/rendered output.
- Generate web production build.
- Add Capacitor platforms, configure app ID/icons/splash and native notification settings.
- Generate Android APK if toolchain available.
- Generate iOS project/build instructions; use TestFlight/Ad Hoc only with valid signing.

**Exit gate:** QA report complete; web demo deployable; Android/iOS status accurately documented.

## Agent execution behavior
- Work in small, reviewable increments.
- After each phase, run required checks and update `docs/IMPLEMENTATION_LOG.md`.
- If a required asset/API/credential is missing, implement a documented fallback and create an item in `docs/OPEN_QUESTIONS.md`; do not block the entire project or fabricate the missing input.
- Do not stop after a static mockup. The deliverable is an interactive functional demo.

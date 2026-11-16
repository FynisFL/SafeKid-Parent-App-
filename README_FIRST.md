# SafeKid Parent App — Coding Agent Handoff v1.1

This package is the implementation contract for the SafeKid Parent App demo. The v1.1 update adds owner-supplied visual references, explicit asset governance, mandatory purposeful motion and a UI/art-direction skill workflow. It is designed to be given to an AI Coding Agent together with an empty or existing repository.

## What the agent is building

A mobile-first parent companion app for the SafeKid children's smartwatch concept. The demo must run in three forms from one shared codebase:

1. **Web demo** — accessible by URL in a browser; the primary no-install testing route.
2. **Android APK** — installable release build for direct device testing and demonstrations.
3. **iOS app build** — packaged through Capacitor and distributed to testers through Apple-approved signing/distribution routes such as TestFlight or registered-device Ad Hoc testing.

## Architecture decision

Use **React + TypeScript + Vite + Capacitor + PWA** as the default implementation architecture. Three.js is an optional, isolated 3D product-viewer capability; it is not the app framework and must not render ordinary UI or GPS maps.

## Read order — mandatory

1. `AGENTS.md`
2. `docs/00_PROJECT_CHARTER.md`
3. `docs/01_PRODUCT_REQUIREMENTS.md`
4. `docs/02_INFORMATION_ARCHITECTURE.md`
5. `docs/03_USER_FLOWS.md`
6. `docs/04_SCREEN_SPECIFICATIONS.md`
7. `docs/05_DESIGN_SYSTEM.md`
8. `DESIGN.md`
9. `docs/14_VISUAL_ART_DIRECTION_AND_ASSET_RULES.md`
10. `docs/15_MOTION_SPECIFICATION.md`
11. `docs/16_AGENT_SKILLS_AND_VISUAL_QA.md`
12. `docs/06_TECHNICAL_ARCHITECTURE.md`
13. `docs/07_DATA_MODEL.md`
14. `docs/08_MOCK_SERVICES_AND_ADAPTERS.md`
15. `docs/09_DEMO_CONTROL_CENTER.md`
16. `docs/10_PRIVACY_ACCESSIBILITY_AND_TRUST.md`
17. `docs/11_QA_AND_ACCEPTANCE_CRITERIA.md`
18. `docs/12_BUILD_AND_DISTRIBUTION.md`
19. `docs/13_IMPLEMENTATION_PLAN.md`
20. `prompts/MASTER_CODING_AGENT_PROMPT.md`

## Product truth / demo boundary

- SafeKid's business plan describes a proposed ecosystem, not a completed commercial product.
- The current project state described in the November 2026 Business Plan is concept/prototype stage. The watch/OEM integration, real GPS, real SOS delivery, and production backend have not been verified as complete.
- This handoff therefore specifies a **functional simulation**, not a production child-safety monitoring service.
- Every simulated device, location, connection, SOS, notification event, and AI answer must be clearly identified as demo/simulated wherever a user could reasonably mistake it for a live safety signal.
- Do not state or imply that a simulated SOS has contacted emergency services, a parent, a watch, or a monitoring center.

## Business-plan alignment

- Product audience: parents/guardians of children aged 3–10.
- Product values: Grow Safe, Grow Independent, Grow Sustainable.
- P0: device pairing concept, location, basic calling concept, SOS flow, battery/device status.
- P1: Parent App management, approved contacts, current location and Safe Zone where supported by OEM.
- P2: advanced Habit–Task–Reward, reports, Watch Passport and S.F AI.
- The demo deliberately includes a basic, interactive Habit–Task–Reminder–Reward experience and S.F AI mock assistant even though the business plan positions these as later-stage capabilities. That is a demo/pitch scope decision, not a claim of production readiness.
- Visual direction is governed by `docs/05`, `docs/14` and the supplied assets. The reference screenshots are mood references only; the supplied SafeKid logo is the brand source of truth.
- Motion is mandatory in the default experience and governed by `docs/15`; reduced-motion support is also mandatory.

## Deliverables expected from the Coding Agent

- Running Vite web app.
- PWA metadata and installability where supported.
- Capacitor Android project and signed APK build instructions/output.
- Capacitor iOS project and TestFlight/Ad Hoc build instructions; an IPA is not promised unless signing credentials and Apple developer setup exist.
- Complete functional demo screens and flows defined by this package.
- Automated tests and a written build/test report.
- No backend, remote database, user authentication, or payment integration in v1.1.

## How to resolve ambiguity

Use the following priority order:

1. Safety, privacy and demo-truth constraints in `AGENTS.md` and `docs/10...`.
2. Product requirements and package entitlements in `docs/01...`.
3. Screen and design specifications.
4. Architecture and implementation convenience.

Do not invent product claims, device capabilities, OEM support, pricing, warranty terms, legal compliance, or real-world safety guarantees. Record unresolved questions in `docs/OPEN_QUESTIONS.md` rather than silently guessing.

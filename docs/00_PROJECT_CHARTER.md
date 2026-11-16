# 00 — Project Charter

## Product name
**SafeKid Parent App**

Tagline: **Stay Connected. Help Them Grow.**

Brand master tagline remains: **Protected to grow. Growing to protect.**

## Product definition
A parent-facing companion app for a children's smartwatch concept for children aged 3–10. It helps a parent understand the child's simulated device/location status, manage approved contacts and safe places, receive safety/activity alerts, assign constructive tasks, and access support information.

## Why this demo exists
1. Demonstrate the intended parent experience before OEM/watch integration is confirmed.
2. Let stakeholders and parents test the UX without buying or pairing a real watch.
3. Present the full 3G concept in a coherent app.
4. Provide a codebase that can later swap mock services for approved OEM/backend services.
5. Deliver a single shared product across browser, Android and iOS packaging.

## Target users
- Primary: parent/guardian aged approximately 25–40, managing a child aged 3–10.
- Secondary: a family member who may later be granted guardian access (multi-parent is an advanced/Plus concept, simulated in v1).
- Child: wears the watch and completes assigned tasks; there is no separate child app in v1. Child task completion is simulated by a controlled demo action.

## Product pillars
### Grow Safe
Basic location, SOS flow, Safe Zone concept, approved contacts, calling concept, battery/connection/device state.

### Grow Independent
Habit, Task, Reminder, Reward (Coin), completion history and lightweight progress summary.

### Grow Sustainable
Concept previews for Core + Skin + Skill, Watch Passport, warranty/repair history, Trade-in and Refurbished. Most of this is a future-facing preview, not a live operational service.

## Success criteria for v1 demo
- A first-time user can create a local parent profile in under one minute.
- User can understand the child's demo status from Home.
- User can locate the child on the map and create a 500m Safe Zone.
- User can trigger, acknowledge and inspect a clearly simulated SOS event.
- User can create a task with reminder and Coin reward, simulate completion and see reward balance/history update exactly once.
- User can understand Free vs Plus and see that SOS remains included in Free.
- User can ask supported S.F AI questions and see controlled answers or a human-handoff path.
- Demo scenarios can be reset and replayed reliably.
- Web works without app installation; Android and iOS native wrappers can be built when signing/toolchains are available.

## Explicit exclusions
No live watch integration, OEM protocol implementation, real-time tracking, real emergency communication, backend/cloud, login/authentication, payment, child account, public rewards store, production support operation, or production privacy certification.

## Source-of-truth note
The November 2026 SafeKid Business Plan is the product source. It describes the project as a prototype/concept stage and says watch/OEM integration and core hardware performance are not yet verified. This implementation must maintain that distinction.

# 01 — Product Requirements Document (PRD)

## 1. Goals
- Build a coherent mobile-first parent app demo.
- Support browser-first testing, Android APK packaging and iOS native packaging.
- Demonstrate Grow Safe, Grow Independent and Grow Sustainable.
- Make all core demo flows interactive and deterministic.
- Keep the v1 architecture replaceable: mock implementation now, future API adapter later.

## 2. Priorities

### P0 — safety and connection concepts
- Demo device onboarding/status card.
- Simulated current location.
- Simulated battery and connection state.
- SOS event simulation and acknowledgement.
- Basic calling/contact concept UI.

### P1 — parent management concepts
- Parent and child local profile.
- Map and location history preview.
- Safe Zone creation and entry/exit simulation.
- Approved contact CRUD.
- Notification center and notification preferences.

### P2 — growth and ecosystem extensions
- Habit/Task/Reminder/Reward module.
- Coin balance and transaction history.
- Basic progress report; advanced habit report preview.
- S.F AI controlled FAQ assistant and human handoff simulation.
- Subscription comparison/switcher.
- Watch Passport, Skin/Skill, Trade-in and Refurbished previews.

**Demo scope override:** Basic interactive Habit–Task–Reminder–Reward and S.F AI are included in v1 demo despite being future/advanced capabilities in the business plan. This is for product demonstration and usability testing only.

## 3. Entitlements — demo assumptions
The plan table in the business plan is a planning model, not a released commercial entitlement contract. Implement entitlement definitions in one central config file so the team can change them without rewriting screens.

| Benefit | Free | SafeKid Plus |
|---|---|---|
| Basic location | Included | Included |
| SOS | Included | Included |
| Basic two-way calling concept | Included | Included |
| Advanced/realtime location | Not included | Included |
| Route history (planned 90 days) | Limited/preview | Included |
| Safe Zone | Basic preview or Plus-gated demo based on the currently approved project package; configure centrally | Included |
| Speed alerts | Not included | Included |
| Basic Habit/Task features | Included | Included |
| Advanced habit reports | Not included | Included |
| Multiple parents/devices | Not included | Included (simulated) |
| Enhanced support | Not included | Included (simulated) |

**Project package lock:** The project owner previously confirmed Free = basic GPS + SOS free; Plus = realtime GPS, Safe Zone, speed alerts and advanced utilities. Preserve this as the default. The business plan additionally proposes 90-day history, advanced habit reports and multi-parent/device management for Plus. Do not place SOS behind a paywall under any circumstances.

Pricing shown only as a planning assumption: Free = 0 VND; Plus = 55,000 VND/month or 449,000 VND/year. Add “planned demo pricing / not available for purchase” wording.

## 4. Feature requirements

### FR-01 Onboarding and local profile
- Welcome screen.
- Parent enters a display name; no email/password/phone/account.
- Create local profile and retain it on the device/browser.
- Optional child demo profile fields: display name, age, avatar.
- Seed a child and watch for first-time presentation; user can edit them.
- Provide a full reset action.

### FR-02 Home dashboard
- Parent greeting.
- Child identity card.
- Watch demo connection and battery state.
- Last simulated sync time.
- Safety summary (SOS, Safe Zone, connection).
- Location preview.
- Today's task progress and Coin balance.
- Recent alerts/activity.
- Current subscription card.
- Shortcut to S.F AI.

### FR-03 Location and map
- Show fictional sample child location on a map.
- Clearly label all location values as simulated.
- Show last updated time and demo accuracy label.
- Add location marker and Safe Zone circles.
- Allow create/edit/delete/toggle Safe Zones.
- Default usability test: create a 500m Safe Zone around a fictional location.
- Allow deterministic route playback and location-state switching through Demo Control Center.
- Do not request the parent phone's geolocation by default.
- Provide a map fallback if tile provider/network unavailable.

### FR-04 SOS and alerts
- Create a simulated SOS event via Demo Control Center or a clearly labelled “Test SOS” action.
- Show urgent in-app event state; provide sound/haptics when supported and permission granted.
- On acknowledge, record who/when in local demo history.
- Include simulated Safe Zone entry/exit, low battery, disconnected device, speed alert, task reminder and task reward events.
- Filters: All, SOS, Safety, Device, Tasks.
- Mark read/unread and open associated detail screen.
- Never say an emergency service or real person has been contacted.

### FR-05 Device and approved contacts
- Show demo watch model, ID, connection, battery, last sync and firmware placeholder.
- Allow simulated connection/battery changes.
- Approved contacts CRUD with fictional sample records.
- Explain that actual calls and watch-side contact synchronization are not implemented.

### FR-06 Habit / Task / Reminder / Reward
- Habit: reusable routine/category (e.g. Morning Routine, Learning Time, Responsibility).
- Task: one actionable activity assigned to a child.
- Reminder: scheduled local reminder concept; native local notification when supported, in-app/web fallback otherwise.
- Reward: Coin amount earned after task completion.
- Parent can create/edit/complete/cancel task, set date/repeat/reminder/reward/category/note.
- Child completion is represented by Demo Control Center “Simulate child completion”; do not falsely imply the child watch has sent a completion signal.
- On simulated completion, task becomes completed, Coin is credited exactly once, a transaction is written and progress updates.
- Show daily/weekly completion and habit streak as simple derived metrics.
- Do not build a redemption marketplace in v1.

### FR-07 Subscription
- Compare Free and Plus in clear language.
- Display current plan.
- Demo-only plan switcher.
- Show planned price; no checkout, purchase, billing or payment details.
- Preserve core safety benefits including SOS for both plans.

### FR-08 S.F AI
- Global assistant entry point.
- Quick prompts: pair watch, GPS/Safe Zone help, low battery, task creation, Free/Plus, warranty.
- Answer only from controlled FAQ/knowledge and local demo state.
- For unsupported questions, say it cannot verify and offer a simulated human support handoff.
- For SOS/emergency requests, immediately direct the user to the app's SOS/help instructions and state that AI is not an emergency responder. Do not attempt to triage or decide emergency severity.

### FR-09 Grow Sustainable previews
- Watch Passport device identity/history preview.
- Core + Skin + Skill overview.
- Skin Collection preview.
- Trade-in/Refurbished “Coming Soon” pages.
- These must be visually marked as concept previews, not active programs.

### FR-10 Demo Control Center
- Hidden developer/demo route protected by a simple in-app demo toggle, not security authentication.
- Set connection, battery, location, safe-zone state, route, SOS, task completion, Coin event and plan.
- Reset to seed state.
- Replay curated scenarios.

## 5. Non-functional requirements
- Mobile-first; usable at 360px width.
- Responsive web at tablet and desktop breakpoints.
- Fast initial load; lazy-load 3D and map where practical.
- Offline local core functionality after first successful load where PWA caching permits.
- Local data survives app restart; reset is explicit.
- App shell and critical screens must not depend on 3D assets or map tiles.
- TypeScript strict mode, testable services, no secrets in source.
- Web accessibility: keyboard, focus, semantic controls, labels and reduced motion.

## 6. Product analytics
No third-party analytics in v1. For usability sessions, provide an optional local-only test log (task started/completed, time, help request, error) that can be exported manually as JSON/CSV. No personal child data should be included by default.

## 7. Business-plan source alignment
Relevant sections: Executive Summary pp.10–11; solution and MVP pp.18–22; Free/Plus pp.20–21; technology/AI/privacy pp.48–50; prototype usability protocol pp.69–70.

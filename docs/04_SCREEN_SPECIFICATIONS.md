# 04 — Screen-by-Screen Specifications

Each screen must implement default, loading, empty, error and success states where relevant. Every visible control must have a defined behavior.

## Global shell
- Brand mark and app title.
- Five-tab navigation: Home, Location, Growth, Alerts, Profile.
- S.F AI shortcut.
- Demo-status indicator: “DEMO MODE” in a persistent but unobtrusive location.
- Responsive layout; on mobile respect safe-area insets.

## S01 Welcome / Onboarding
- SafeKid logo, short value proposition, demo disclosure.
- CTA: Get Started.
- Secondary: Explore Demo (creates a “Guest Parent” local profile).

## S02 Parent Profile Setup
- Parent display name input (required; trim whitespace; 2–40 chars).
- Avatar initial generated from name.
- CTA: Continue.
- No account, email, phone or password fields.

## S03 Child & Watch Setup (optional)
- Child display name, age (3–10), avatar.
- Watch nickname/model and fictional Device ID.
- Default sample values are editable and labelled sample/demo.
- CTA: Save & Continue; Skip.

## S04 Home Dashboard
- Greeting.
- Child identity card.
- Demo device status card: connection, battery, last sync.
- Safety summary tiles: SOS, Safe Zone, connection.
- Location preview and View Map action.
- Today's task progress and View Tasks action.
- Recent activity list.
- Current Free/Plus card.
- S.F AI shortcut.
- State variants: no child profile, device disconnected, low battery, SOS active, no tasks.

## S05 Location Map
- Map canvas, marker, child avatar, Safe Zone circle(s).
- Last update label; “Simulated location” label always visible.
- Bottom sheet: child name, fictional place, timestamp, demo accuracy, battery.
- Actions: Recenter, Safe Zones, Route History.
- Fallback map when tile/network unavailable; map attribution visible when tiles used.

## S06 Route History
- Day selector; route polyline/ordered location events.
- Free plan: show a limited/current-day preview and explain Plus planned history.
- Plus plan: display seeded 7-day sample; label 90-day benefit “planned entitlement”, not a real archived route database.
- No actual continuous tracking.

## S07 Safe Zone List
- List saved zones with name, radius, active toggle and schedule.
- Add zone CTA.
- Empty state with example.

## S08 Safe Zone Create/Edit
- Name, preset location or map marker, radius slider/input, enabled toggle, optional schedule.
- Default radius 500m for the usability-test scenario.
- Save/cancel/delete.
- Include “Demo geofence — not synced to a watch” helper text.

## S09 Growth Dashboard
- Child name and date selector.
- Today progress (completed/total).
- Task cards grouped by habit/category.
- Coin balance.
- CTA Create Task.
- Tabs/segmented controls: Today, Habits, Progress, Coins.

## S10 Create/Edit Task
Fields:
- Task name (required).
- Description (optional).
- Category/habit (preset or create habit).
- Child assignment (single demo child in v1).
- Date and repeat pattern (once, daily, selected weekdays).
- Reminder time and enabled toggle.
- Reward Coin amount (integer, bounded 0–100).
- Parent note/message (optional).
- Save, cancel; validation messages.

## S11 Task Detail
- Task description, schedule, reminder, reward, status, history.
- Edit/cancel while not completed.
- Show a badge explaining that child completion is simulated in parent demo.
- Demo completion control should be placed in Demo Control Center, not masquerade as child action in normal app.

## S12 Habits
- Habit groups and linked tasks.
- Create/edit habit: name, icon, description, active status.
- Habit detail shows derived progress from completed task records.

## S13 Progress Report
- Daily/weekly summary.
- Completed vs assigned tasks, completion percentage, Coin earned, habit streak.
- No claims about developmental outcomes or proven behavior change.
- Plus-only advanced report may show a preview lock, but basic task completion must remain available in Free.

## S14 Coin Wallet
- Current balance.
- Transaction list (earned/spent; v1 supports earned only).
- Explain Coins are demo points and have no cash value or redemption in v1.

## S15 Alerts Center
- Filter chips: All, SOS, Safety, Device, Tasks.
- List with icon, category, timestamp, read state and demo label.
- SOS appears visually prominent without decorative overuse.

## S16 Alert Detail
- Event type, timestamp, description, simulated location if applicable, source=Demo Simulator.
- SOS: acknowledge action and acknowledged state.
- No emergency services/real recipient wording.

## S17 Device Management
- Device name, demo Device ID, status, battery, last sync, firmware placeholder.
- Actions: View 3D model (optional), Demo settings shortcut, unpair concept (local only).
- Explicit label: device is not connected to real watch.

## S18 Approved Contacts
- Contact list: display name, relationship, allowed status.
- Add/edit/delete, mark approved.
- Phone values may be masked fictional placeholders; do not initiate real calls by default.
- Explain watch sync/calling is not implemented.

## S19 Subscription
- Current plan card.
- Feature comparison table.
- Monthly/yearly planned price display.
- Demo switch action with no-payment confirmation.
- Explicitly state SOS remains included in Free.

## S20 S.F AI Assistant
- Chat transcript, quick prompts, input field, typing indicator.
- Controlled FAQ engine and demo-state context only.
- “Contact support” opens simulated handoff form/instructions.
- Persistent notice that AI is informational and not emergency response.

## S21 Profile / Settings
- Parent profile editor.
- Child profile editor.
- Device/contact shortcuts.
- Notification settings by category.
- Language placeholder (Vietnamese default; English strings can be enabled if full localization exists).
- Privacy and demo disclosure.
- Reset demo data.

## S22 Grow Sustainable / Watch Passport
- Device ID, model, warranty/repair entries as fictional examples.
- “Concept Preview” badge.
- No claims of real warranty lookup, certification or data wipe.

## S23 Skin & Skill / Trade-in
- Skin collection showcase and software skill cards.
- Trade-in / Refurbished cards labelled “Coming Soon / Concept”.
- Optional Three.js product viewer, lazy-loaded and with static image fallback.

## S24 Demo Control Center (hidden)
- Scenario presets and manual controls defined in `09_DEMO_CONTROL_CENTER.md`.
- Reset, seed state, export test log.
- Always visible demo-only warning.

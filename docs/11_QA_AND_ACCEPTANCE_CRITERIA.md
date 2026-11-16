# 11 — QA and Acceptance Criteria

## 1. Automated gates
- TypeScript strict check passes.
- ESLint passes.
- Unit tests pass.
- Production Vite build passes.
- Playwright smoke test can launch app, create local profile and navigate primary routes.
- No console errors on the primary demo paths.

Suggested scripts:
- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`
- `npm run preview`

## 2. Required business-plan usability tasks
The six tasks below must be tested without the moderator explaining the UI first:

1. Find the child's location on the map.
2. Create a Safe Zone with 500m radius around a fictional place.
3. Understand the simulated SOS flow.
4. Create a task and assign a Coin reward.
5. Compare Free and Plus; correctly identify that SOS remains free.
6. Ask/find a FAQ answer in S.F AI and recognize when human support is needed.

Capture task completion, time-on-task, error/help rate, usefulness/ease/purchase-intention Likert scores and open feedback. The Business Plan proposes 20–30 parents, 20–30 minutes each; this is a planned test protocol, not a completed study.

## 3. Functional acceptance tests

### Onboarding
- Empty storage routes to Welcome.
- Name is required and validated.
- Profile persists after refresh/app restart.
- No auth fields or network login request.

### Home
- Demo child/device state renders.
- Status cards update when simulator changes device state.
- Empty/low battery/disconnected/SOS state is understandable.

### Map/Safe Zone
- Map shows demo marker and explicit simulated label.
- 500m Safe Zone can be created, edited, toggled and deleted.
- Simulated entry/exit generates exactly one event.
- If map provider fails, fallback is usable.

### SOS/Alerts
- Trigger produces one event.
- Critical UI is visible and accessible.
- Acknowledging updates event state/time.
- Event appears in history.
- No remote request or claim of real dispatch.

### Growth
- Can create/edit/cancel a task.
- Reminder state is persisted.
- Simulated completion changes status once.
- Coin transaction is awarded once even if completion control is triggered repeatedly.
- Balance and progress are derived correctly.

### Subscription
- Can compare Free and Plus.
- Demo switch changes entitlements.
- SOS stays available in both tiers.
- No payment collection or checkout.

### AI
- Supported FAQ returns grounded response.
- Unsupported query does not invent facts.
- Sensitive/support issue gives handoff path.
- SOS query does not route through AI as an emergency responder.

### Reset
- Restore seed works.
- Clear generated local notifications where possible.
- Full reset returns to onboarding.

## 4. Visual QA
Check at widths 360, 390, 430, 768, 1024 and 1440 px. Validate portrait first; landscape gracefully. Check safe-area, scroll, bottom nav overlap, modal overflow and keyboard behavior.

## 5. Motion and design acceptance
- All applicable motion rows in `15_MOTION_SPECIFICATION.md` are implemented.
- Button/toggle/card/sheet/task/progress/reward/notification feedback is visible and consistent.
- SOS content is immediate; motion/audio/haptics do not delay the acknowledgement control.
- Reduced-motion browser setting is tested and removes large/spatial movement while preserving state feedback.
- No decorative loop runs on Location, Alerts or SOS screens.
- Supplied logo is used without distortion; external visual assets have source/license records.
- Screens are inspected at the defined viewport sizes; a successful build alone does not count as visual QA.

## 6. Native QA matrix
Android physical device:
- APK installs and launches.
- Notification permission flow works on supported Android version.
- Local reminder and test alert behavior is documented.
- Haptic works only if capability/permission allows.

iOS physical device:
- Signed build launches.
- Notification authorization flow works.
- TestFlight/Ad Hoc distribution documented.
- Any simulator-only result is not described as real-device validation.

## 7. Release report
Coding Agent must produce `docs/RELEASE_REPORT.md` containing:
- commit/hash or version,
- environment/toolchain,
- commands and test outcomes,
- web URL/build location if deployed,
- APK artifact location,
- iOS build status and signing limitation,
- known issues and unverified behavior.

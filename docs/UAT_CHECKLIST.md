# SafeKid Parent App — V7 Owner Acceptance Checklist

Use this checklist to record device results for the build being tested. Web coverage requires HTTPS and map coverage requires access to MapTiler.

## Test setup

- [ ] Deploy the contents of `dist/` to an HTTPS origin (do not deploy source root as the web root).
- [ ] Restrict the browser MapTiler key to the exact HTTPS origin/referrer.
- [ ] Open the web app once online so its current service worker can cache the app shell.
- [ ] Use a fresh browser profile for first-run tests; record device model, OS, browser version and date.
- [ ] Use only safe test locations and test contacts. Export a backup before destructive reset/import scenarios.
- [ ] Run a second pass with OS/browser reduced-motion enabled.

## Phase 1 — Onboarding / first-run critical path

- [ ] Clear site data or use a fresh browser profile. Open the app at 320×640, 360×800, 375×812, 390×844 and 430×932.
- [ ] Confirm the first-run screen has no app topbar, notification bell, avatar, desktop sidebar or bottom navigation.
- [ ] Confirm the parent-name input and primary setup action are visible on the initial viewport without first scrolling.
- [ ] Confirm child-profile name is optional and can be left blank.
- [ ] Confirm no email, password, Google sign-in or account creation is requested.
- [ ] Submit parent profile; confirm app shell/navigation appears only after save succeeds.
- [ ] Reload and confirm local profile persists.
- [ ] Attempt to navigate to `#/onboarding` with an existing profile; confirm it returns to the app rather than acting like a login screen.
- [ ] Switch language Vietnamese ↔ English; ensure no data is lost.
- [ ] Delete local app data after backing up; confirm onboarding returns with no app shell.

## Phase 2 — Mobile navigation and Home

- [ ] At 320, 360, 375, 390, 430 and 767 px, confirm five destinations: Home, Location, SOS, Growth, More.
- [ ] Confirm all nav labels/icons fit, selected state follows the current route and no button is clipped by safe area.
- [ ] Open More Hub and reach Safe Zones, Alerts, Contacts, Watch Passport, Calendar, Progress, Help, Plans, Profile and Permissions.
- [ ] Confirm Home quick actions appear before the compact family hero and remain usable on 320 px.
- [ ] Confirm SOS is visually prominent but not animated in a way that delays/obscures activation.
- [ ] At 768, 1024, 1280, 1440 and 1920 px, confirm the tablet rail/desktop sidebar transition is correct and content does not stretch excessively.

## Phase 3 — Location Map and Safe Zone Builder

### Location Map is view-only

- [ ] Open Location. Confirm the page explicitly says it shows the parent phone's location, not the child's/watch's.
- [ ] Confirm Location shows actual phone GPS state, accuracy and timestamp only when a real fix exists.
- [ ] Confirm no create/edit/pause/resume/delete Safe Zone controls exist on Location.
- [ ] Confirm saved Safe Zone circles can be seen and Location links to the dedicated Safe Zones section.
- [ ] Tap/drag/pan/zoom map on Location; confirm these actions do not create or mutate Safe Zones.

### Safe Zones is the only create/manage place

- [ ] Open More → Safe Zones (or the Safe Zones quick action).
- [ ] Create a zone by searching a school/home/place name. Verify MapTiler results are labelled and a selected result moves the map marker.
- [ ] Create another zone by tapping the map at a location with no searchable place name.
- [ ] Drag the selected marker and confirm the preview follows it.
- [ ] Confirm a new Safe Zone starts at the Master Spec default of 500 m. Change radius with the slider and quick presets; confirm the circle changes with the selected radius.
- [ ] Confirm the form never asks the parent to type latitude/longitude.
- [ ] Attempt to save before selecting a location; confirm the app rejects it and no zone is created (must not create at 0°,0°).
- [ ] Use current phone location only after explicitly tapping the button and granting GPS; confirm the selected point is from the parent phone.
- [ ] Set name/category, weekday chips and start/end time; save and verify the summary.
- [ ] Edit, pause/resume and delete only from the Safe Zones section.
- [ ] Try changing the hash route or invoking a stale Safe Zone action from Location; confirm mutation is blocked.
- [ ] Test overnight schedule and foreground-only notice. Background the app; do not expect monitoring to continue.
- [ ] Test MapTiler search 401/403/network failure; the UI must explain failure and retain map-tap selection as an alternative. No invented result may appear.

## Phase 4 — SOS lifecycle and alarm

- [ ] Deny GPS and notifications; verify the SOS workflow remains usable and persists locally.
- [ ] Hold SOS for 1.5 seconds; confirm the event is saved and the two-note alarm repeats when sound is enabled/available.
- [ ] Release before 1.5 seconds; confirm no event/alarm is created.
- [ ] Use the accessible two-step alternative; confirm activation and alarm after explicit confirmation.
- [ ] Immediately tap twice / repeat activation while persistence is pending; confirm only one SOS event is created.
- [ ] While SOS is active, confirm a second SOS cannot start.
- [ ] Acknowledge the event; confirm it remains open and another SOS is still blocked.
- [ ] Resolve the event; confirm alarm stops and a new SOS is then possible.
- [ ] Mute/re-enable the alarm; confirm muting does not acknowledge or delete SOS.
- [ ] Disable global sound while SOS is open; confirm alarm stops but event remains.
- [ ] Test unsupported/blocked Web Audio; SOS must still persist and explain sound limitation.
- [ ] Repeat on real iOS Safari and Android Chrome with phone volume audible. Record autoplay/user-gesture and page background behavior.
- [ ] Confirm same-device disclosure is visible and app never claims remote notification or emergency dispatch.
- [ ] Confirm 113/114/115 and contact `tel:`/`sms:` actions open OS UI only after user action; no automatic call/message is sent.

## Phase 5 — Growth, Settings, forms and accessibility

- [ ] Create one-time, daily, weekdays and selected-weekday weekly tasks.
- [ ] Confirm weekly weekday chips appear only for weekly recurrence and require at least one day.
- [ ] Confirm reminder time appears only after enabling reminder; save without reminder and ensure no time remains active.
- [ ] Complete an occurrence twice; verify one coin award only.
- [ ] Verify reminder checks only while app is visible/open.
- [ ] Open Profile / Settings Hub. Tap Family, Notifications, Privacy and Backup shortcuts; confirm the page stays on the same route and the corresponding section opens/scrolls into view.
- [ ] Delete a Safe Zone/contact/document and import backup; verify custom confirmation explains the consequences.
- [ ] Open every modal with keyboard and touch. Confirm focus moves inside, Tab/Shift+Tab remain within, Escape closes, and focus returns to the opener where it remains present.
- [ ] Complete keyboard-only navigation; verify visible focus on links/buttons/inputs.
- [ ] Verify reduced-motion: nonessential entrance, hover and continuous effects stop; state changes remain immediate; SOS has no blocking motion.
- [ ] Run VoiceOver (iOS), TalkBack (Android) or desktop screen reader for headings, input labels, dialogs, alerts and status announcements.

## Mobile redesign follow-up — Freemium transparency and S.F AI mobile composer

- [ ] Open Plans from More. Confirm Free includes parent-phone GPS, core Safe Zones, same-device SOS, Growth basics and local storage.
- [ ] Confirm Plus is labelled planned / not available for purchase; no checkout, payment, renewal or locked safety feature is presented.
- [ ] Confirm the Plans page explains that SafeKid Plus is inactive in this web version and does not change geofence thresholds.
- [ ] Open S.F AI at 320×720, 320×780, 360×800, 390×844 and 430×932. Confirm the message composer remains visible above the fixed bottom navigation without scrolling.
- [ ] Focus the S.F AI input. Confirm the bottom navigation yields while typing and returns after blur; the composer remains reachable.
- [ ] Confirm the S.F AI disclaimer is visible and accurately says messages are processed from approved on-device content, are not sent to SafeKid staff, and cannot locate a child or dispatch emergency help.

## Cross-screen visual matrix

- [ ] Review onboarding at 320×640, 360×800, 375×812, 390×844, 430×932.
- [ ] Review Home, Location, Safe Zones, SOS, Growth, More, Profile and representative modal at 320×720, 360×800, 390×844, 430×932 and 767×900.
- [ ] Review tablet at 768×1024 and 1024×768.
- [ ] Review desktop at 1280×800, 1440×900 and 1920×1080.
- [ ] Repeat representative screens with reduced-motion enabled.
- [ ] Verify no horizontal overflow, clipped controls, overlapping content, obscured CTA, bottom-nav collision, keyboard-hidden submit action or unreadably long text.
- [ ] Confirm all touch targets are at least 44×44 px where applicable.

## Data, S.F AI, Passport and PWA regression

- [ ] Export backup; import into a test profile and verify expected records and attached documents.
- [ ] Reject malformed/unsupported backup files safely; confirm no partial replacement on validation failure.
- [ ] Confirm FAQ/S.F AI only uses approved content; emergency questions route to SOS; out-of-scope notice says request was not sent; unknown query shows no-answer copy.
- [ ] Confirm Watch Passport labels manual/user-entered/unverified and does not imply watch pairing or remote wipe.
- [ ] Install PWA and verify icon/name, update behavior, offline shell and local records.
- [ ] Verify local delete returns to onboarding and removes all local profile data after confirmation.

## Android APK

- [ ] Record the APK build and Android version. Install the test APK and verify launch, GPS permission, notification permission and local task alerts.
- [ ] Confirm the status bar, bottom navigation and keyboard leave form controls visible.
- [ ] Hold a navigation tab or motion setting on a touch screen. Confirm no WebView highlight, text selection or link menu appears. Confirm text selection still works in entry fields.
- [ ] Trigger and resolve a local test SOS. Check sound and local notification behavior with permissions granted and denied.
- [ ] Export a backup and confirm the Android share sheet can save or share it.

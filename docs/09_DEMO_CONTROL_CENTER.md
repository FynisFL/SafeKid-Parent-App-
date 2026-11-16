# 09 — Demo Control Center

## Purpose
A hidden control panel for the project team to demonstrate complete interactions without a real watch or backend. It is not a customer-facing safety control.

## Access
- Open through a non-obvious app gesture or a Settings → Demo Tools entry enabled by a local demo flag.
- No real authentication. Do not describe the hidden route as secure.
- Persistent top warning: “SIMULATION CONTROLS — changes affect demo data only”.

## Manual controls
1. Device connection: Connected / Disconnected.
2. Battery: 0–100% slider and Low Battery quick action.
3. Location preset: Home / School / Moving / Outside Safe Zone.
4. Route playback: Start / Pause / Reset.
5. Safe Zone: Enter / Exit trigger.
6. SOS: Trigger simulated SOS / Clear active alert.
7. Task: Select task / Simulate child completion.
8. Coin: create a clearly labelled demo adjustment only if enabled; normal completion flow should award Coin automatically.
9. Subscription: Free / Plus.
10. App notification: test sound/haptic/local notification permissions.
11. Reset: restore all data or profile-only reset.

## Curated scenarios

### Scenario 1 — School arrival
- Device Connected; battery 85%.
- Location moves from Family Home to ABC Primary School.
- Generate safe-zone entry event.
- Home and map reflect arrival.

### Scenario 2 — Safe Zone exit
- Start child inside School zone.
- Trigger exit.
- Generate high-priority alert.
- Tap alert → map shows simulated location outside zone.

### Scenario 3 — SOS test
- Trigger SOS.
- Generate critical alert with fixed timestamp/location.
- Show sound/haptic/local notification if platform permits.
- Acknowledge and preserve history.

### Scenario 4 — Low battery and disconnect
- Set battery to 15% and connection to Disconnected.
- Generate device alerts.
- Home status updates.

### Scenario 5 — Task earned reward
- Select an assigned task.
- Simulate completion.
- Mark completed and credit Coin exactly once.
- Progress and wallet update.

### Scenario 6 — Free-to-Plus comparison
- Open subscription page.
- Switch Free → Plus in demo.
- Show Plus entitlements; verify SOS remains available.

## Reset behavior
- `Reset Demo Data`: restores child/device/location/zone/tasks/alerts/coins/subscription to seed state; preserve parent display name.
- `Reset Everything`: clears parent profile and onboarding state too.
- Both require a confirmation dialog.
- Reset must clear pending local notifications created by the demo and restore simulator state.

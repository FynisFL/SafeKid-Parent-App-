# 03 — Key User Flows

## Flow A — First launch
1. Open app.
2. Show demo disclosure on Welcome.
3. User enters parent display name.
4. Create local profile.
5. Show optional child/watch setup screen prefilled with fictional demo values; user may edit or skip.
6. Seed local app data.
7. Navigate to Home.
8. Do not request notifications until a contextual explanation and user action.

Acceptance: user can enter app without account creation, email, phone or password.

## Flow B — Find child location
1. Open Location.
2. See simulated map marker and last update.
3. Open child location sheet.
4. View address label, timestamp, demo accuracy and connection state.
5. Optionally open route history preview.

Acceptance: location is marked “Simulated”; no parent-device geolocation permission is requested.

## Flow C — Create Safe Zone
1. Location → Safe Zones → Add.
2. Enter zone name.
3. Choose a fictional saved place or place marker on the map.
4. Set radius; 500m is the default scenario.
5. Choose enabled status and optional time window.
6. Save.
7. Zone appears on map and in Safe Zone list.
8. Demo Control Center can simulate enter/exit and generate an alert.

Acceptance: zone persists locally; no assertion that watch geofence has been configured.

## Flow D — Simulated SOS
1. Trigger Test SOS in Demo Control Center (preferred) or a clearly labelled test action.
2. Create event with deterministic demo child/location/time.
3. If in foreground, show an urgent in-app alert and play sound/haptic when available.
4. If native notification permissions exist, also issue a local notification.
5. Parent opens alert detail and location preview.
6. Parent acknowledges; event gets acknowledged timestamp.
7. Event remains in local history.

Acceptance: all screens say “SIMULATED SOS / DEMO ONLY”; no network request or external emergency dispatch is made.

## Flow E — Create and complete a Mini Task
1. Growth → Create Task.
2. Enter task name, optional description/note, category/habit, schedule/repeat, reminder and Coin reward.
3. Save as Assigned.
4. Reminder is scheduled through platform adapter where supported; otherwise show in-app reminder state.
5. Use Demo Control Center → Simulate Child Completion.
6. Task changes to Completed.
7. Coin transaction is created exactly once.
8. Balance, daily progress and history update.

Acceptance: parent cannot accidentally award duplicate Coins by repeating the simulation; task details identify completion as simulated.

## Flow F — Free vs Plus
1. Profile → Subscription.
2. View current plan and compare matrix.
3. SOS is visibly included in both plans.
4. Tap Upgrade or Switch Plan.
5. Show a demo confirmation stating no payment occurs.
6. Update local plan state and UI entitlements.

Acceptance: changing plan does not remove SOS/basic safety access.

## Flow G — S.F AI FAQ
1. Open assistant.
2. Select quick question or type supported question.
3. Classify intent against the static knowledge base and current demo state.
4. Return constrained answer.
5. For support-sensitive issue, present simulated human handoff path.
6. For SOS/emergency prompt, state AI is not emergency support and route to relevant safety UI; do not use an AI-generated diagnosis.

Acceptance: response is traceable to a known FAQ/demo state; unknown answers are not fabricated.

## Flow H — Reset demo
1. Open Demo Control Center.
2. Choose Reset Demo.
3. Show confirmation and list what will be reset.
4. Restore seeded sample data and default Free plan.
5. Clear generated alerts/tasks/coin events and reset simulator.
6. Preserve parent display name unless user chooses “Reset profile too”.

Acceptance: reset is deterministic and repeatable.

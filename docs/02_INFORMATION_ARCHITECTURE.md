# 02 — Information Architecture and Routes

## 1. Primary navigation
Five primary destinations, optimized for one-handed use:

1. **Home** — dashboard.
2. **Location** — map, route history and Safe Zone.
3. **Growth** — Habit, Tasks, Reminder, Coins and progress.
4. **Alerts** — notification/event center.
5. **Profile** — parent, child, watch, contacts, subscription and settings.

S.F AI is a global floating/toolbar entry point, not a sixth primary tab. Demo Control Center is hidden from normal navigation.

## 2. Route map

```text
/
├── /onboarding/welcome
├── /onboarding/parent-profile
├── /home
├── /location
│   ├── /location/history
│   ├── /location/safe-zones
│   └── /location/safe-zones/new
│       /location/safe-zones/:zoneId
├── /growth
│   ├── /growth/tasks/new
│   ├── /growth/tasks/:taskId
│   ├── /growth/habits
│   ├── /growth/habits/:habitId
│   ├── /growth/coins
│   └── /growth/progress
├── /alerts
│   └── /alerts/:alertId
├── /profile
│   ├── /profile/parent
│   ├── /profile/child
│   ├── /profile/device
│   ├── /profile/contacts
│   ├── /profile/subscription
│   ├── /profile/settings
│   └── /profile/grow-sustainable
│       /profile/watch-passport
│       /profile/skin-skill
│       /profile/trade-in
├── /assistant
└── /demo-control (hidden)
```

## 3. Navigation behavior
- App routes must support refresh/deep-link fallback in the web build.
- Preserve tab selection when navigating to tab subpages.
- Back returns to the previous logical screen, not always Home.
- SOS detail should be reachable from notification click and Alerts list.
- Task deep links should open the relevant task detail.
- Unknown routes show a branded Not Found page and a Home action.

## 4. Mobile layout
- Bottom navigation fixed above safe-area inset.
- Page content scrolls independently of the tab bar.
- Primary actions reachable with thumb; critical SOS controls are never hidden under navigation.
- Use a top app bar with page title and contextual actions.

## 5. Web layout
- Below 768px: match mobile navigation behavior.
- 768–1023px: compact navigation rail or adaptive bottom navigation.
- 1024px+: desktop sidebar, top bar and content grid; map can occupy a larger pane.
- Keep the same route/feature functionality; do not build a separate web product.

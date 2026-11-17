# SAFEKID PARENT APP — MASTER IMPLEMENTATION SPECIFICATION

**Document version:** 2.3 (web-first, Capacitor-ready)  
**Prepared:** 17 November 2026  
**Product:** SafeKid Parent App  
**Owner / brand:** DigiBabi — SafeKid  
**Target implementation:** Responsive Web App + PWA now. Capacitor-ready (Android/iOS packaging is a later phase and is NOT built in this iteration)  
**Delivery model:** One shared React codebase; local-first; native-ready  
**Primary language:** Vietnamese (default) with English switch  
**Status:** Build specification — this is not evidence that the app or any safety capability has already been implemented or validated.

> **PRODUCT NORTH STAR**  
> Build a real, usable parent companion application with working phone GPS, a real map, locally evaluated Safe Zones, an on-device SOS workflow, local notifications, audio/haptics, activity history, family growth tools and Watch Passport Lite. It must not be a static UI prototype or a fake smartwatch monitoring simulator.

---

# 0. START HERE — NON-NEGOTIABLE PRODUCT DECISIONS

> **PRECEDENCE (v2.3).** Section 17 and the prompt in Section 15 override any conflicting text elsewhere in this document. In particular: every native Android/iOS item (Capacitor projects, native background geofencing, APK/IPA, device QA) is **Phase 2 and is NOT built in this iteration**; it is kept only as roadmap and as design constraints so the web code stays native-ready. The phase list in Section 15 is authoritative over the table in Section 12.

This document is the **single current source of truth for the rebuild**. It supersedes the old `SafeKid_Coding_Agent_Handoff_v1.1` wherever the old package describes simulated GPS, simulated watch connectivity, simulated SOS or a demo-only app.

## 0.1 What must be built

Build a complete, responsive SafeKid Parent App using:

- React + TypeScript + Vite.
- Tailwind CSS or an equivalent token-driven styling system.
- React Bits for selected, purposeful animated components and visual treatments.
- Motion for React for app-level transitions, gestures, presence and state animation.
- Capacitor as the native runtime for Android and iOS.
- A real map provider rendered through MapLibre GL JS or a justified equivalent.
- Real foreground GPS from the phone running the app.
- Real local Safe Zone calculations from the phone's coordinates.
- Native geofencing for background Enter/Exit/Dwell events in packaged apps, subject to OS permissions and documented platform constraints.
- Local SOS activation, local event creation, local notification on the same device, sound/haptics where allowed, activity history and explicit call/SMS composer actions for emergency contacts.
- Local structured persistence for profiles, zones, events, tasks and Watch Passport Lite.
- PWA/web deployment and later Android/iOS packaging from the same codebase.

## 0.2 Explicit exclusions

Do **not** implement these in this version:

- User registration, login, authentication or account recovery.
- Remote database, cloud sync or server-side user records.
- Smartwatch pairing, firmware communication, OEM protocol implementation or live watch telemetry.
- Incoming SOS events from a child's watch.
- Push notifications to another person's device.
- Silent SMS sending or automatic calls without the user's explicit system action.
- Payment processing, subscription billing or purchase flows.
- A separate child application.

A local structured database such as IndexedDB is still required. “No database” in the product scope means **no remote/server database**; local persistence is mandatory for the app to work.

## 0.3 Critical source-of-data truth

The phone currently running SafeKid is the only live location source available in this scope.

- Label live coordinates as **“Vị trí điện thoại phụ huynh”** / **“Parent phone location”**.
- Never label the parent phone's location as the child's location.
- A Child Profile is a locally maintained profile, not a connected child device.
- Safe Zones in this release monitor the phone running the app, not a remote child/watch.
- SOS in this release is triggered by a user inside the app and creates an on-device event. It does not notify a remote parent, child, monitoring center or emergency service.
- An in-app event, local notification, call composer or SMS composer must never be described as successful remote delivery.
- Never seed a fake coordinate, fake route, fake battery or fake watch telemetry as if it were live data.

If the product owner later enables a watch or backend, add a new data provider behind the existing service interfaces. Do not rewrite the current UI and domain rules.

## 0.4 SOS delivery truth — especially important

This release can provide a **real local SOS workflow**:

1. User activates SOS inside the app.
2. App creates a local SOS event and captures the phone's current location if permission is granted.
3. App presents an urgent in-app screen and stores the event locally.
4. On native builds, app attempts a same-device local notification through the operating system; it may also trigger permitted sound and haptics.
5. App offers explicit actions to call an emergency contact or open the SMS composer with a prepared message and location link/text.
6. The user reviews and confirms the call/message in the native phone/SMS interface.

**This is not remote SOS delivery.** Another device cannot receive an alert without an external communication channel such as a backend/push service, SMS provider, or approved OEM/watch event channel. Those are outside this version. Do not hide this limitation in the UI or documentation.

## 0.5 Business Plan crosswalk — what is retained and what is re-scoped

The new app specification follows the Business Plan's product intent but deliberately changes the technical boundary to match the owner's latest decision (no login, no remote database/backend and no smartwatch connection).

| Business Plan reference | Source intent | Treatment in this rebuild |
|---|---|---|
| Page 13–14 | 3G pillars: Grow Safe, Grow Independent, Grow Sustainable | All three pillars are retained; Grow Safe is the first delivery priority. |
| Pages 18–20 | Three-part ecosystem; P0/P1/P2; Parent App role; Free/Plus planning | Parent App scope is retained. Watch/backend-dependent features are re-scoped to phone-local behavior or future interfaces. |
| Page 21 | Core + Skin + Skill and Watch Passport as lifecycle direction | Watch Passport Lite is implemented locally now; Core/Skin/Skill remain factual concept content. |
| Page 22–23 | Existing SOS website interaction is Local Demo Only and is not proof of real SOS/GPS/watch delivery | The rebuild must replace the old mock with a real local SOS workflow and real parent-phone GPS. It must not claim remote SOS delivery. |
| Pages 48–50 | K26 protocol not yet confirmed against firmware; Y76 API/backend uncertain; SOS must not depend on AI; child data/privacy principles | No OEM protocol is integrated. SOS stays independent of AI. Data minimization, provenance and privacy controls are applied to local records. |
| Page 50–51 | Certified Data Wipe is a target process, not a validated capability | Lite records evidence/provenance only; it does not wipe a physical watch or issue certification. |
| Page 59–60 | OEM integration, SOS, GPS, child-data and operational risks | These risks are converted into explicit permission, capability, error, privacy and release gates. |
| Pages 61–63 | Staged roadmap and Go/No-go criteria | The phased implementation sequence is adapted for web-first local functionality and later native validation. |
| Pages 69–72 | Usability protocol and OEM test list | Parent UX tasks are retained and expanded into app QA; hardware/OEM test cases remain future work until a watch is selected. |

Important: the Business Plan describes a proposed product and future roadmap. It does not prove that GPS, watch pairing, SOS delivery, background geofencing, certified wipe or OEM integrations are already operational.

## 0.6 Source hierarchy and conflict resolution

1. This Master Specification v2.0.
2. SafeKid Business Plan `DBC_ND3_DIGIBABI.pdf` for product intent, 3G pillars, MVP rationale, Watch Passport definition and risk controls.
3. Owner-supplied brand assets in `assets/brand/`.
4. Previous v1.1 package only for reusable brand tokens, typography, responsive principles, motion principles and visual references. Its simulated-data product behavior is superseded.

If a detail is not specified, choose the smallest safe implementation, document the assumption in `docs/DECISIONS.md`, and do not invent OEM capability, warranty coverage, safety guarantees or legal certification.

---

# 1. PRODUCT DEFINITION AND OUTCOMES

## 1.1 Product definition

SafeKid Parent App is a parent-facing family safety and child-development companion for families with children aged approximately 3–10. In this build, it is a **standalone local-first application** that provides real phone-level location and safety utilities, family routines, and a locally maintained Watch Passport record.

The app is built web-first but must be structured so Capacitor can expose supported native features without duplicating the React UI.

## 1.2 Product pillars — preserve SafeKid 3G

### Grow Safe — primary priority

- Phone GPS and real map.
- Safe Zone setup and local geofence detection.
- On-device SOS workflow.
- Emergency contacts and explicit call/SMS actions.
- Local alert center and activity history.
- Permission, freshness, accuracy and availability status.

### Grow Independent — functional companion features

- Child profile stored locally.
- Habit, Task, Reminder and Reward/Coin.
- Parent-managed completion because there is no child app/watch connection.
- Progress summaries based on actual local task records.

### Grow Sustainable — implement Watch Passport Lite now

- Locally maintained device/product records.
- Purchase and warranty details entered by the owner.
- Repair, maintenance and accessory history.
- Locally stored receipts/photos/documents.
- Data-handling / data-wipe record with explicit verification provenance.
- Future Core + Skin + Skill, QR verification, Trade-in and Refurbished concepts clearly separated from operational features.

## 1.3 Success outcomes

The application is not considered complete until a user can:

1. Open the app without creating an account.
2. Complete onboarding and create a local parent profile.
3. Create or edit a local child profile without implying watch connectivity.
4. Grant location permission and view the phone's real position on a real map.
5. See timestamp, accuracy and source for each location update.
6. Create, edit, enable, pause and delete circular Safe Zones.
7. Detect Enter/Exit/Dwell from real phone-location events while the app is open (web foreground only). Background geofencing is Phase 2 (native) and must be shown as unavailable, never as active.
8. Activate SOS and see a real local event, same-device native notification where supported, sound/haptics where permitted, and emergency-contact action options.
9. Review, acknowledge and resolve an SOS event without losing its event history.
10. Create and manage emergency contacts locally.
11. Create Habits and Tasks with schedules, reminders and Coin rewards.
12. Complete a task as the parent, with duplicate rewards prevented.
13. Review activity and progress derived from stored records.
14. Create and manage Watch Passport Lite records, attach proof documents locally and inspect the lifecycle timeline.
15. Export, import and delete local data.
16. Use the same functional routes at phone, tablet and desktop widths.
17. Run the web app as an HTTPS-deployable PWA, switch Vietnamese/English, use S.F AI within its approved scope, and find `docs/NATIVE_MIGRATION_NOTES.md` describing the Phase 2 native path.

---

# 2. FEATURE SCOPE AND PRIORITIES

Priorities represent implementation order, not permission to omit the feature. All features explicitly listed as “in scope now” must be implemented. Future-only capabilities must be clearly marked and must not masquerade as working features.

## 2.1 P0 — Core Safety (must work end-to-end)

| Module | Requirements | Source / state truth |
|---|---|---|
| Onboarding | Intro, parent profile, optional child profile, permission education | Local only; no login |
| Home Dashboard | Safety overview, phone location freshness, active Safe Zones, latest local events, next tasks | No fake child/watch status |
| Location & Map | Real phone location, MapLibre/provider map, recenter, accuracy, timestamp, permission/error states | Source clearly says parent phone |
| Safe Zones | CRUD, map selection, radius, schedule, enable/pause, local geofence state | Applies to parent phone only |
| Geofence Engine | Enter/Exit/Dwell, accuracy filtering, transition confirmation, debounce/cooldown, event log | Web foreground; native background where supported |
| SOS Center | Hold-to-activate, event creation, location snapshot, acknowledgement/resolution | Local-only SOS; no remote dispatch |
| Emergency Contacts | Local CRUD, validation, explicit dial/SMS composer links | No silent send |
| Notifications | In-app alert center, native local notifications, notification preferences | Same-device notifications only |
| Sound & Haptics | Audible/haptic feedback when platform permissions and context allow | Do not promise critical alert bypass |
| Activity History | Immutable event history for local actions/geofence events | Local persistence |
| Permission Center | Location, background location, notifications, sound/haptics capabilities | Explain state and remediation |

## 2.2 P1 — Family Growth & Daily Management (must work)

| Module | Requirements | Rules |
|---|---|---|
| Child Profile | Name, age, avatar, notes, optional preferences | Parent-entered local data; not a connected endpoint |
| Habit | Create/edit/archive categories and goals | Local |
| Task | Create/edit/cancel, assign to local child profile, description, due date, repeat | Parent-managed |
| Reminder | Time-based local reminder, schedule/cancel, permission handling | Web fallback must be explicit |
| Reward / Coin | Reward amount, ledger, balance, history | Derived balance; no cash value |
| Progress | Daily/weekly completion and habit progress | Derived only from local records |
| Calendar | Task and reminder calendar | Local |
| Alerts Center | Filter by SOS, Safe Zone, permission/system, tasks | Clear severity and read/acknowledged states |

## 2.3 P1 — Watch Passport Lite (must be included)

Implement a real, useful local product/device record system, not merely a “Coming Soon” card.

| Module | Requirements |
|---|---|
| Device Registry | Create/edit/archive a local product record; name, manufacturer, model, serial/device ID if known, category, owner/child association (local profile reference), status |
| Identity | Unique local record ID; optional serial/IMEI/device code is user-entered and unverified |
| Purchase Record | Purchase date, seller/store, order/reference number, price/currency, notes |
| Warranty | Start/end date, provider/seller, warranty reference, terms summary, reminder before expiry |
| Documents | Attach receipt, invoice, warranty card, product photo and repair documents; store locally and export with backup |
| Maintenance | Create maintenance/repair entries with date, type, description, provider, cost, parts replaced, notes and evidence attachment |
| Accessories / Skin | Record strap/case/accessory, purchase date, condition, compatibility notes and replacement history |
| Lifecycle Timeline | Chronological view of purchase, warranty, maintenance, accessory changes and data-handling records |
| Data Handling / Wipe Log | Record intended/performed wipe, date, operator/provider, scope, evidence, outcome and verification level |
| Export | Export one Passport record or full local backup including linked records/files |
| Provenance | Every field/event indicates user-entered, evidence-attached or service-provider-documented status |

### Watch Passport Lite trust rules

- Show a visible state: **“Hồ sơ nhập thủ công — chưa kết nối đồng hồ”**.
- Do not auto-populate real firmware, battery, GPS, connectivity or device health.
- Do not show “Verified”, “Certified”, “Official” or “Authentic” unless an actual verification source and process exist.
- A manually entered serial number is not verified by the app.
- “Data Wipe” is a record/checklist in Lite, not a command that wipes a physical watch.
- Do not issue a “Certified Data Wipe” certificate. The app may store evidence of a service provider's reported wipe, clearly labelled with source and verification level.
- Warranty dates/terms are user-entered and do not establish that a seller/OEM will honor a claim.
- Trade-in and Refurbished are future operations; no valuation, purchase, certification or resale workflow in this version.

## 2.4 P2 — Useful service surfaces (implement lightweight, local-first)

| Module | Scope |
|---|---|
| Plan Comparison | Explain Free/Plus strategy with no payment, billing or enforced subscription gating |
| FAQ / Help Center | Searchable static product FAQ; unknown questions must not receive fabricated answers |
| Privacy & Data Management | Export, import, clear/reset, notification privacy and data-source explanations |
| Core + Skin + Skill | Factual concept page; clearly labelled future direction, not functional hardware customisation |
| Trade-in / Refurbished | Concept preview only, no live operation |
| S.F AI | Trợ lý cục bộ (xem mục 17.10): chỉ trả lời câu hỏi thuộc FAQ và Brand từ nội dung đã duyệt; không gọi AI đám mây, không dùng API key; không xử lý SOS hay quyết định khẩn cấp; câu hỏi ngoài phạm vi hiển thị thông báo chuyển CSKH (bản demo) |

## 2.5 Free / Plus product strategy

The Business Plan describes these as proposed entitlements, not a launched commercial contract. Implement one central, editable entitlement configuration and a comparison UI. There is no payment or server entitlement check in this release.

| Benefit | Free direction | Plus direction in Business Plan | Current app implementation |
|---|---|---|---|
| Basic location | Included | Included | Real phone GPS available to all users |
| SOS | Included | Included | Local SOS available to all users; never paywall SOS |
| Basic calling | Planned watch capability | Included | Not implemented as watch call; emergency contacts can open phone dialer |
| Advanced/realtime watch tracking | — | Planned | Not available without watch/backend |
| Safe Zone | Depends on final plan | Planned Plus benefit | Implement as local phone geofencing in this no-payment build; do not lock essential safety function behind a fake plan switch |
| Route history | Basic/limited | Planned 90-day history | Local phone location history only when user enables recording; clearly label source and retention |
| Habit reports | Basic | Advanced | Implement basic local progress; advanced report may remain concept preview |
| Multi-parent/device | — | Planned | Not available without account/cloud infrastructure |

Do not create a “Plus unlock” switch that pretends to process payment. Present pricing only as **planned pricing** if the product owner wants it displayed; the plan's proposed figures are 55,000 VND/month or 449,000 VND/year and must be labelled planned, not currently purchasable.

---

# 3. USER EXPERIENCE, NAVIGATION AND SCREENS

## 3.1 Primary navigation

Mobile bottom navigation (five items):

1. **Tổng quan** — Home dashboard.
2. **Bản đồ** — Real phone location and Safe Zones.
3. **Phát triển** — Habits, tasks, reminders, coins and progress.
4. **Cảnh báo** — SOS/geofence/system/task events.
5. **Hồ sơ** — Parent/child profiles, contacts, Watch Passport, settings and privacy.

SOS must also have a clearly reachable contextual action from Home and Alerts. It must not be hidden behind a settings menu. Do not add a floating SOS button that covers map controls or navigation; choose a deliberate, accessible placement.

Desktop (>=1024px): persistent sidebar, top bar and adaptable content grid. Location can use a larger map pane with a details panel.

## 3.2 Required route map

```text
/
├── /onboarding
├── /setup/parent
├── /setup/child
├── /home
├── /location
│   ├── /location/permissions
│   ├── /location/history
│   └── /location/safe-zones
│       ├── /location/safe-zones/new
│       └── /location/safe-zones/:zoneId
├── /sos
│   └── /sos/:eventId
├── /alerts
│   └── /alerts/:eventId
├── /contacts
│   ├── /contacts/new
│   └── /contacts/:contactId
├── /growth
│   ├── /growth/habits
│   ├── /growth/habits/:habitId
│   ├── /growth/tasks/new
│   ├── /growth/tasks/:taskId
│   ├── /growth/calendar
│   ├── /growth/progress
│   └── /growth/coins
├── /watch-passport
│   ├── /watch-passport/new
│   ├── /watch-passport/:deviceRecordId
│   │   ├── /purchase
│   │   ├── /warranty
│   │   ├── /maintenance
│   │   ├── /accessories
│   │   └── /data-handling
├── /ecosystem
├── /plans
├── /help
│   └── /help/sfai
├── /profile
└── /settings
    ├── /settings/permissions
    ├── /settings/notifications
    ├── /settings/privacy
    └── /settings/data
```

All routes must support browser refresh/deep-link fallback. Back navigation returns to the previous logical screen. Provide a branded not-found screen.

## 3.3 Screen specifications

### A. Onboarding

- Use the supplied SafeKid logo.
- Explain the app runs locally and does not connect a watch in this release.
- Parent display name field only; no email/password/login.
- Optional local Child Profile setup.
- Permission prompts are contextual: explain why location or notification permission is requested before showing OS prompt.
- Do not request location at first render before the user understands the feature.

### B. Home Dashboard

Show:
- Greeting and parent profile shortcut.
- Location status of the parent phone: current permission, freshness and accuracy.
- Active Safe Zone count and current local geofence state.
- Latest SOS/local alert state.
- Emergency contact shortcut.
- Today's task progress and next reminders.
- Watch Passport summary (number of local records / expiry soon), not live watch status.
- Recent activity.

Avoid fake battery, fake watch connection or fake child location cards. Use real empty/setup states if no data exists.

### C. Location Map

- Real map with visible attribution.
- Current phone marker, heading if available, accuracy circle, timestamp and source.
- Safe Zone circles and names.
- Recenter button, map style control if supported, Safe Zone management shortcut.
- Clear state for permission denied, GPS disabled, unsupported browser, stale fix, poor accuracy, no network/map tiles and loading.
- Do not render a made-up default location. If no permission/fix exists, display an explanatory empty state and optionally allow manual map exploration without marking a fake current position.

### D. Safe Zone List and Editor

Fields:
- Name (required).
- Type: Home / School / Other.
- Center coordinate: choose current location, tap map, search place if provider supports it, or enter coordinates.
- Radius in meters; provide presets and numeric input. Default 500m is retained as a Business Plan usability-test scenario, not a universal minimum.
- Active/paused toggle.
- Optional weekdays/time range.
- Save/cancel/delete.

List displays radius, center, schedule, state and last transition. Map displays all enabled zones.

### E. SOS Center

- Large hold-to-activate control, accessible by keyboard and touch.
- Avoid accidental trigger but do not add a lengthy animation or block the action. Proposed hold threshold: 1.5–2 seconds; make it testable and documented.
- On activation: create immutable SOS event immediately; capture location snapshot if available; show accuracy/time/source; trigger permitted haptic/audio; send a same-device local notification on native platform if permission allows.
- Display clear actions: “Gọi liên hệ”, “Mở tin nhắn”, “Sao chép thông tin vị trí”, “Đã xử lý”.
- `tel:` opens dialer; `sms:` opens messaging composer where supported. Never claim call/SMS has been made/sent before user confirms it in OS UI.
- Event state: Active → Acknowledged → Resolved or Cancelled. Preserve event record and timestamps.
- If location permission is unavailable, SOS can still create the local event and show “Không lấy được vị trí”; do not block SOS.
- Include always-visible disclosure: “Cảnh báo SOS được lưu và thông báo trên thiết bị này. Ứng dụng chưa gửi cảnh báo đến thiết bị khác hoặc dịch vụ khẩn cấp.”

### F. Alerts Center

Filters: All / SOS / Safe Zone / System & Permissions / Reminders / Growth.

Each item shows type, severity, source, timestamp and state. SOS visually prominent. Read, acknowledge and resolve states must persist. Avoid repeated duplicate events.

### G. Emergency Contacts

- Local create/edit/delete.
- Name, relationship, phone number, optional notes and preferred order.
- Normalize/validate phone number without uploading it.
- Actions open system dialer/SMS composer; do not send automatically.
- Show “Liên hệ chỉ được lưu trên thiết bị này.”

### H. Growth

- Habit CRUD; category and active status.
- Task CRUD: title, details, category/habit, due date, repeat pattern, reminder time, reward Coins and parent notes.
- Parent marks task completed because no child-side app or watch sync exists.
- Coin ledger is append-only; balance derives from valid transactions.
- Completion + reward transaction must be atomic and idempotent; a task cannot earn twice.
- Calendar and daily/weekly summaries.
- Explain Coins are family reward points, not money and not redeemable in this release.

### I. Watch Passport Lite

- Empty state prompts “Tạo hồ sơ thiết bị”.
- Device list with model/name, record status, warranty countdown and last updated.
- Device detail tabs/sections: Overview, Purchase, Warranty, Maintenance, Accessories, Data Handling, Documents, Timeline.
- Allow users to add multiple local device records even though none is paired.
- Each record shows source/provenance labels: User-entered / Evidence attached / Provider document.
- Attach images/PDFs to local storage; provide file preview, remove, export and size validation.
- Warranty reminder is a local reminder, not an OEM warranty lookup.
- Data wipe section records checklist/evidence only. State explicitly that no physical device is being wiped by this app.
- Timeline is chronologically derived from purchase, warranty, maintenance, accessory and data-handling events.

### J. Profile, Settings, Privacy, Data

- Parent profile edit.
- Local child profiles list/edit.
- Emergency contact shortcut.
- Permission Center for precise location, background location, notifications and audio/haptic capability.
- Notification preferences by category, sound and haptics.
- Ngôn ngữ: Tiếng Việt mặc định, có nút chuyển sang Tiếng Anh và ngược lại (xem 17.11).
- Privacy explanation: local storage, map provider network requests, no server sync, data export/deletion.
- Export all app data + documents in a versioned backup package.
- Import with validation, preview, conflict strategy and confirmation.
- Clear/reset local data with a clear warning; offer backup before delete.

### K. Plan Comparison and Ecosystem

- Present Free and SafeKid Plus strategy factually.
- No checkout, billing, trial or actual subscription change.
- Never lock SOS.
- Show Core + Skin + Skill, QR Passport verification, Trade-in and Refurbished as planned concepts, not operational services.

### L. Help / FAQ

- Searchable static FAQ with source-controlled answers.
- Emergency questions must route to SOS/contacts guidance; FAQ is not emergency support.
- Unknown query: say answer is not available and direct to contact/help instructions; do not hallucinate.
- S.F AI: khung chat cục bộ, theo đúng mục 17.10. Nút S.F AI nằm trong Help và trong Hồ sơ.
- Mọi nội dung Help/FAQ có phiên bản Tiếng Việt và Tiếng Anh (xem 17.11).
- Thông tin hỗ trợ (cố định, hiển thị ở Help và Privacy):
  - Email: safekid.digibabi@gmail.com (liên kết `mailto:`)
  - Điện thoại: 0377430400
  - Fanpage: https://www.facebook.com/DigiBabi
- Không thêm thông tin liên hệ nào khác. Nếu cần, hãy hỏi chủ sản phẩm.

---

# 4. BRAND IDENTITY AND DESIGN SYSTEM

## 4.1 Brand asset source of truth

Use the owner-supplied logo assets included in this package:

- `assets/brand/safekid-logo-trimmed.png` — preferred placement asset, transparent outer canvas trimmed.
- `assets/brand/safekid-logo-original.webp` — original/canonical supplied artwork.

**Logo rules:**
- Do not redraw, recreate, recolor, skew, crop into a different mark, add gradients, add outlines or replace with an AI-generated logo.
- Preserve transparent background and original aspect ratio.
- Scale proportionally only.
- Use the trimmed PNG for app shell/brand placements and generate required platform icon sizes only by proportional raster resizing/cropping with transparent padding as required by platform specs. Do not change the logo artwork.
- No external logo or mascot may replace the supplied logo.

## 4.2 Locked brand palette

Core colors are locked:

| Token | Hex | Use |
|---|---|---|
| SafeKid Turquoise | `#00C7CA` | Primary action, active states, positive brand accents |
| SafeKid Deep Blue | `#2D5568` | Primary text, navigation, trusted surfaces |
| SafeKid Soft Tint | `#EAF4F5` | Soft surface, selected background, subtle section fill |
| White | `#FFFFFF` | Main surface and contrast |

Supporting tokens from the previous approved design system:

| Token | Hex | Use |
|---|---|---|
| Text | `#193744` | Default body text |
| Muted | `#71858C` | Secondary labels |
| Border | `#D9E6E8` | Dividers and outlines |
| Background | `#F6FAFA` | Main page background |
| Success | `#168A68` | Confirmed success only |
| Warning | `#D98A19` | Caution states |
| Danger | `#D94242` | SOS/critical error only |
| Info | `#387DA0` | Informational statuses |

CSS variables (source of truth):

```css
:root {
  --sk-primary: #00C7CA;
  --sk-deep-blue: #2D5568;
  --sk-soft-tint: #EAF4F5;
  --sk-white: #FFFFFF;
  --sk-text: #193744;
  --sk-muted: #71858C;
  --sk-border: #D9E6E8;
  --sk-background: #F6FAFA;
  --sk-success: #168A68;
  --sk-warning: #D98A19;
  --sk-danger: #D94242;
  --sk-info: #387DA0;
}
```

Do not introduce unrelated purple, pink, neon, orange or gradient-heavy brand colors. Semantic danger red is reserved for critical states, not ordinary buttons.

## 4.3 Typography

- Headings: **Plus Jakarta Sans**.
- Body, controls and data: **Inter**.
- Prefer locally bundled font packages if used, avoiding runtime dependence on third-party font CDNs.
- Body text 14–16px minimum for normal content; form labels must remain legible.
- Vietnamese is the primary locale. Use natural Vietnamese UI copy; retain product terms such as Safe Zone, Watch Passport, Grow Safe and SafeKid Plus where useful, with Vietnamese explanations.

## 4.4 Visual direction

**Design thesis: Premium Family Safety Utility with a Friendly Growth Layer.**

- Calm, precise, trustworthy, modern and parent-focused.
- Grow Safe screens are low-noise, data-first and operational.
- Grow Independent can be warmer and more encouraging, but not childish or game-like.
- Watch Passport should feel like a tidy digital product record / ownership log.
- Plenty of whitespace, clear hierarchy and restrained surfaces.
- Use an 8px spacing base scale.
- Card radius 16–20px; button radius 12–14px; pills only for compact statuses.
- Primary button target height 48–52px; touch targets minimum 44×44px.
- Subtle borders and shadows; avoid nested card-in-card layouts.
- One primary action and one dominant focal point per screen.
- Use a single icon family, preferably `lucide-react`; do not use emoji as the main icon system.
- Avoid generic dashboard card overload, excessive glassmorphism, random blobs, decorative stickers, floating stars, confetti, unrelated stock photos and decorative mascots.

## 4.5 Reference images in package

The `assets/reference/` folder contains two owner-supplied mood references from the earlier handoff:

- `reference-habit-app-ui.jpg`: optional reference for whitespace, approachable task/habit hierarchy and mobile composition.
- `reference-visual-moodboard.jpg`: optional selective reference for modular soft surfaces and gentle illustration placement.

These are **mood references only**, not production assets or exact UI templates. Do not copy their colors or unrelated content. SafeKid's locked palette and functional clarity take precedence.

## 4.6 Responsive system

Use fluid responsive behavior, not just a scaled-down desktop dashboard.

| Range | Target | Layout behavior |
|---|---|---|
| 320–359px | Small phones | Compact, no horizontal overflow, wrap labels, preserve critical controls |
| 360–767px | Phones | Mobile-first; bottom navigation; full-width content; map-first surfaces |
| 768–1023px | Tablets | Adaptive navigation rail or compact sidebar; two-pane layouts where useful |
| 1024–1279px | Small desktop | Sidebar + top bar; compact dashboard grid |
| 1280–1535px | Desktop | Full dashboard and larger map pane |
| ≥1536px | Large desktop | Constrained readable content width; do not stretch text lines excessively |

Also implement:
- `100dvh`/dynamic viewport handling where appropriate.
- `env(safe-area-inset-*)` for notches and home indicators.
- Keyboard-open behavior and scroll-into-view for forms.
- Portrait and landscape handling.
- Touch-friendly controls and hover fallbacks.
- No hover-only essential actions.
- No horizontal overflow at 320px.

---

# 5. MOTION AND REACT BITS STANDARD

## 5.1 Use React Bits intentionally

React Bits is a source-component library, not the product design system. Choose a small set of components that improve the app's experience, inspect the source and dependencies of each selected component, and copy/install only what is needed.

Potential uses:
- A restrained SplitText/reveal treatment on Welcome or onboarding headline.
- A subtle, low-intensity background treatment only on Welcome or a non-critical empty state.
- Micro-interaction components for non-critical toggles/cards/buttons where they improve feedback.
- A small progress/reward enhancement in Growth, if performant and not excessive.

Do **not** use shader-heavy backgrounds, cursor trails, parallax, continuous particles or showy effects in Map, SOS, Alerts, permission or emergency contact screens.

Prefer the free/open-source React Bits components. Do not use React Bits Pro-only registries, blocks or assets unless the project owner provides a valid license. Keep required third-party licenses/credits in `ASSET_CREDITS.md`.

## 5.2 Motion for React is the app motion layer

- Use `motion` package and imports from `motion/react`.
- Use Motion for route transitions, layout transitions, bottom sheets, state change, gestures and purposeful micro-interactions.
- Use simple CSS transitions for hover/focus/border/color states.
- Avoid adding GSAP or a second animation framework without a documented need.
- Do not let React Bits and Motion both animate the same property at the same time.

## 5.3 Motion tokens

```ts
export const motionTokens = {
  instant: 90,
  micro: 120,
  standard: 200,
  enter: 220,
  emphasis: 300,
  sheet: 280,
  reward: 480,
  progress: 520,
  stagger: 35,
};
```

Use `easeOut` / `cubic-bezier(0.2, 0, 0, 1)` as the standard easing. Restrained springs are acceptable for sheets and small tactile feedback.

## 5.4 Required motion inventory

| Surface | Motion | Constraint |
|---|---|---|
| Route change | 180–220ms crossfade/small translate | Never block navigation |
| Bottom navigation | 180–220ms active marker | Immediate state update |
| Primary button | 90–140ms press response | No delayed action |
| Switch/checkbox | 140–200ms | Clear state without animation |
| Dashboard | Small first-entry stagger | No perpetual motion |
| Bottom sheet/modal | 240–300ms | Focus management and escape/back support |
| Progress | 450–520ms on meaningful change | Do not replay on rerender |
| Task completion | 180–240ms | State update persists once |
| Coin reward | 350–500ms, once per valid transaction | No confetti storm |
| Map marker | Smooth update only for real location event | Do not fake movement |
| Safe Zone circle | 180–260ms on create/update | Respect reduced motion |
| New alert | 180–240ms enter | Critical text is immediate |
| SOS | Render critical content immediately | No flashing; no animation dependency |
| Watch Passport timeline | Short reveal on explicit navigation | Avoid scroll hijack |

## 5.5 Accessibility and reduced motion

- Wrap app with `MotionConfig reducedMotion="user"`.
- Use `useReducedMotion()` for complex transitions.
- Honor CSS `prefers-reduced-motion`.
- When reduced motion is active, use instant state change, opacity/color and explicit labels.
- Animate transforms/opacity preferentially.
- Avoid `transition: all`, layout thrashing, strobing, rapid pulsing, large parallax and full-screen blur.
- No continuous animation in Location, SOS or Alerts.
- SOS event, sound/haptic and local notification must be fired independently of animation completion.

---

# 6. TECHNICAL ARCHITECTURE

## 6.1 Architecture decision

Use **Web-first, Local-first, Native-ready**:

- React + TypeScript + Vite.
- Capacitor for Android/iOS.
- PWA for browser access and supported installation.
- Dexie/IndexedDB for local structured records.
- Zustand for shared UI state; domain state remains in services/repositories.
- Zod for validation.
- React Router for navigation.
- MapLibre GL JS (or a justified alternative) for real map rendering.
- Motion for React + selected React Bits source components.
- Vitest + React Testing Library + Playwright for automated tests.

Pin compatible stable versions in the lockfile. Do not use `@latest` as an unpinned production dependency. Inspect current official docs before adding third-party native plugins.

## 6.2 Layered architecture

```text
Presentation Layer
  React routes, pages, shared UI, design tokens, React Bits, Motion
        │
Application / Use-case Layer
  use cases: create Safe Zone, activate SOS, record location,
  create task, award reward, add Passport record
        │
Domain Layer
  typed entities, validation, geofence state machine,
  event rules, entitlement definitions, lifecycle rules
        │
Service Layer
  LocationService, GeofenceService, MapService, SOSService,
  AlertService, NotificationService, AudioService, HapticsService,
  GrowthService, PassportService, ExportImportService
        │
Platform / Persistence Adapters
  Web APIs | Capacitor plugins | custom native Android/iOS adapter
  IndexedDB | local document storage | map/tile provider
```

Feature components must not call `navigator.geolocation`, Capacitor plugins, IndexedDB or native APIs directly. All calls go through typed service interfaces/adapters.

## 6.3 Suggested folder structure

```text
src/
  app/
    App.tsx
    router.tsx
    providers/
    layouts/
  components/
    ui/
    navigation/
    feedback/
    maps/
  features/
    onboarding/
    home/
    location/
    safe-zones/
    sos/
    alerts/
    contacts/
    growth/
      habits/
      tasks/
      reminders/
      coins/
      progress/
      calendar/
    watch-passport/
      devices/
      purchase/
      warranty/
      maintenance/
      accessories/
      data-handling/
      documents/
      timeline/
    ecosystem/
    plans/
    help/
    settings/
      permissions/
      notifications/
      privacy/
      data-management/
  domain/
    entities/
    enums/
    rules/
    validation/
  services/
    location/
    geofencing/
    sos/
    alerts/
    growth/
    passport/
    export-import/
  adapters/
    platform/
    geolocation/
    geofencing/
    notifications/
    audio/
    haptics/
    maps/
    storage/
    files/
    clock/
  data/
    faq/
    sfai/
    seeds/
  i18n/
    vi.json
    en.json
  styles/
    tokens.css
    global.css
  tests/
    unit/
    integration/
    e2e/
```

Native code, if needed, should live in Capacitor platform projects or a maintained local plugin package; keep the contract stable for React.

## 6.4 Suggested core packages

- `react`, `react-dom`, `typescript`, `vite`
- `react-router-dom`
- `tailwindcss` (current Vite-compatible configuration)
- `motion`
- selected React Bits components installed/copied from official docs/source
- `lucide-react`
- `zustand`
- `zod`
- `dexie`
- `i18next` and `react-i18next` (vi/en)
- `fflate` (backup ZIP) or equivalent
- `maplibre-gl` and React integration if useful
- `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`
- `@capacitor/geolocation` for foreground device location only
- `@capacitor/local-notifications`
- `@capacitor/haptics`
- `@capacitor/app`, `@capacitor/network`, `@capacitor/device`, `@capacitor/preferences`, `@capacitor/filesystem` as needed
- `vite-plugin-pwa` or maintained equivalent
- `vitest`, `@testing-library/react`, `@testing-library/user-event`, `playwright`

Do not blindly install every package. Verify compatibility and license. Do not add Firebase, Supabase, remote database, auth provider, analytics SDK or payment SDK in this scope.

## 6.5 Storage strategy

- IndexedDB via Dexie is the primary structured local store.
- localStorage is only for tiny preferences/bootstrap flags, not core entities.
- Use a versioned schema and migrations from the first build.
- Store files/blobs locally through IndexedDB or Capacitor Filesystem; keep metadata references and manage quota.
- Export/import full backup as a versioned ZIP/JSON bundle, including attached documents where possible.
- Validate backup schema, file size and entity relationships before import.
- Explain that browser storage and each installed app container are separate. No automatic web ↔ APK ↔ IPA sync exists.
- Provide a visible “Export backup” and “Delete local data” function.
- Do not claim IndexedDB is encrypted at rest. Minimize stored data and explain the device-local model honestly.

## 6.6 Location provider

Create a common interface such as:

```ts
export interface LocationFix {
  latitude: number;
  longitude: number;
  accuracyMeters: number | null;
  altitudeMeters?: number | null;
  speedMetersPerSecond?: number | null;
  headingDegrees?: number | null;
  capturedAt: string;
  source: 'parent_phone_web' | 'parent_phone_native' | 'manual';
}

export interface LocationProvider {
  getCurrentPosition(options?: LocationOptions): Promise<LocationFix>;
  watchPosition(
    options: LocationOptions,
    onFix: (fix: LocationFix) => void,
    onError: (error: LocationError) => void
  ): Promise<() => void>;
  getCapabilities(): Promise<LocationCapabilities>;
  requestPermission(level: 'when-in-use' | 'always'): Promise<PermissionResult>;
}
```

Requirements:
- Request location only after contextual explanation and user action.
- Validate coordinates and accuracy.
- Show timestamp/accuracy/source with every displayed fix.
- Track stale/no-fix/denied/disabled/unavailable states.
- Never infer a location if GPS fails.
- Web Geolocation API requires secure context (HTTPS/localhost) and user permission; browser support and behavior vary.

## 6.7 Web vs Native capability boundary

| Capability | Web/PWA | Capacitor Android/iOS |
|---|---|---|
| Real current phone GPS | Yes, foreground with permission | Yes, foreground with permission |
| Continuous foreground watch | Yes while page/app is active; browser-managed | Yes via platform API/plugin |
| Safe Zone evaluation while app open | Yes | Yes |
| Reliable background geofencing | Do not promise; not reliably available on mobile web | Native geofence adapter using OS APIs, permission and OS limits |
| Same-device local notification | Browser support varies; foreground/in-app fallback | Native local notifications |
| Scheduled task reminder | Browser/PWA limits; capability detection | Native local notifications, OS rules apply |
| Haptics | Limited/non-standard | Native haptics plugin |
| Background audio | Not reliable | OS- and permission-constrained; design fallback |
| Call/SMS composer | `tel:`/`sms:` link behavior varies | Native URL/open action; user confirms |
| Local storage | IndexedDB per origin | WebView/app container IndexedDB or native storage adapter |

The web product remains a useful real foreground app, but native-only background functions must show a platform capability label and setup guidance rather than a fake “active” state.

## 6.8 Native geofencing strategy

- Android: implement a dedicated adapter using the supported Android Geofencing APIs; request the correct location permissions for the minimum necessary behavior. Test actual background delivery and OS behavior.
- iOS: implement a dedicated adapter using Core Location region monitoring / appropriate background modes and permission strings. Confirm the current platform limits before implementation.
- Do not use high-frequency continuous GPS if OS-level geofencing can meet the use case with lower battery cost.
- Do not promise instant or guaranteed delivery in all background, low-power, permission-revoked, reboot or force-quit conditions.
- If a third-party Capacitor plugin is chosen, review maintenance activity, supported OS versions, required permissions, license and actual background behavior before adopting it. Otherwise implement a small custom Capacitor plugin in Swift/Kotlin.
- Provide native capability tests and a documented unsupported state for each platform.

## 6.9 Geofence domain engine

Each Safe Zone is circular in this release. Use a geodesic distance calculation (e.g. Haversine) from the real location fix to the configured center.

States:

- `unknown`
- `outside`
- `inside`
- `pending_enter`
- `pending_exit`
- `dwell`

Requirements:
- Consider reported location accuracy; reject or defer low-confidence fixes.
- Use enter/exit hysteresis so GPS drift around the boundary does not cause rapid toggles.
- Require configurable confirmation duration or consecutive fixes before transition.
- Add per-zone debounce/cooldown and event deduplication.
- Respect schedules and paused zones.
- Record the location fix used for a transition, accuracy, transition confidence, source and timestamp.
- Provide deterministic unit tests around the radius/boundary conditions.
- Background native events should be normalized to the same domain event model as foreground fixes.

Proposed default tuning values are configuration, not universal truth: 500m default for the initial user test; confirmation window and accuracy threshold must be configurable and tested on real devices. Do not hardcode a claim of GPS accuracy.

## 6.10 Map provider and tiles

- Render real maps with MapLibre GL JS or an equivalent provider-backed renderer.
- **Đã chốt (v2.1): MapTiler** (gói miễn phí, tương thích MapLibre GL JS). Trước khi lên production, agent và chủ sản phẩm phải kiểm tra lại hạn mức, điều khoản thương mại, yêu cầu ghi nguồn và giới hạn key hiện hành trên trang chính thức của MapTiler; không tự giả định các con số này.
- Biến môi trường: `VITE_MAP_STYLE_URL` (style URL có key). Không commit key vào repo; `.env.example` chỉ chứa placeholder.
- Key phải giới hạn theo domain HTTPS của bản web. Khi chuyển sang Capacitor (giai đoạn 2), thêm origin của app native vào danh sách cho phép.
- Keep the style URL and public browser token in environment configuration; restrict keys by domain/app bundle where supported.
- Do not commit private API keys. A browser-visible map token is not a secret; restrict its scope.
- Display required attribution.
- Provide explicit offline/no-tile fallback; do not silently switch to a fake map or fake location.

## 6.11 Notifications, audio and haptics

Implement one `NotificationService` with Web and Native adapters.

- Local notifications are generated on the same device. No remote push provider is configured.
- Ask permission contextually.
- Register Android notification channels and iOS categories as appropriate.
- Check permission status and exact-alarm constraints where relevant.
- Handle notification tap/deep-link into event detail.
- Local notification sound and vibration depend on platform/OS settings, channel settings, device mute/Focus/DND and permission. Do not promise a guaranteed critical-alert bypass; iOS Critical Alerts requires a separate entitlement/approval.
- For foreground SOS, play a bundled short alert sound only after a valid user gesture/context and provide a mute preference.
- Haptics should be brief and meaningful; respect system and app preferences.
- Never use infinite alarm loops or inaccessible flashing UI.

## 6.12 SOS domain and service

Proposed model:

```ts
export type SosStatus = 'active' | 'acknowledged' | 'resolved' | 'cancelled';
export type DeliveryScope = 'same_device_local_only';

export interface SosEvent {
  id: string;
  status: SosStatus;
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  cancelledAt?: string;
  locationSnapshot?: LocationFix;
  locationUnavailableReason?: string;
  deliveryScope: DeliveryScope;
  localNotificationAttempted: boolean;
  localNotificationResult?: 'delivered' | 'permission_denied' | 'unsupported' | 'failed';
  contactAction?: 'none' | 'dialer_opened' | 'sms_composer_opened';
  notes?: string;
}
```

Activation workflow:
1. Hold control reaches threshold.
2. Immediately persist event locally.
3. Capture available location snapshot without delaying event creation.
4. Show SOS active screen.
5. Fire same-device native local notification if possible.
6. Trigger sound/haptic according to capabilities/settings.
7. Offer contact actions.
8. Record acknowledgement/resolution.

If notification permission is denied or location is unavailable, SOS must still create the local event and explain the limitation.

## 6.13 Watch Passport service and local documents

- `PassportService` manages local records and timeline projection.
- Document blobs/files must be stored locally and linked by stable IDs.
- Validate file type and size; show storage usage if possible.
- Export/import must preserve document references.
- Every data-handling event has source/provenance and verification status.
- Never label user-entered details as OEM verified.

## 6.14 Security, privacy and local-only data

- Data minimization: only collect fields needed for the features.
- No remote telemetry/analytics by default.
- No secrets or API keys in the bundle.
- Avoid including child names or precise coordinates in lock-screen notification content unless the user explicitly enables it.
- Do not send location to map services beyond normal map tile/style/network requests; document the map provider and privacy terms.
- Provide local data export and deletion.
- Avoid logging phone numbers, names, exact GPS coordinates or attached document contents to console or test logs.
- No claim of end-to-end encryption, certified wipe, legal compliance or child-data certification unless independently implemented and verified.

---

# 7. DOMAIN DATA MODEL

Use strict TypeScript types, Zod schemas and versioned local persistence. IDs should be UUIDs; timestamps ISO 8601. Do not duplicate derived values as separate sources of truth.

## 7.1 Core entities

```ts
export type DataOrigin =
  | 'local_user_action'
  | 'parent_phone_web'
  | 'parent_phone_native'
  | 'manual_entry'
  | 'provider_document';

export type PermissionState = 'unknown' | 'granted' | 'denied' | 'restricted' | 'unsupported';
export type GeofenceState = 'unknown' | 'outside' | 'inside' | 'pending_enter' | 'pending_exit' | 'dwell';
export type AlertType = 'sos' | 'safe_zone_enter' | 'safe_zone_exit' | 'safe_zone_dwell' | 'location_permission' | 'location_unavailable' | 'reminder' | 'task_completed' | 'warranty_expiry';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'normal';
export type PassportVerification = 'user_entered' | 'evidence_attached' | 'provider_documented' | 'independently_verified';
export type WipeStatus = 'not_started' | 'planned' | 'reported_performed' | 'evidence_attached' | 'provider_documented' | 'independently_verified';

export interface ParentProfile {
  id: string;
  displayName: string;
  avatarInitial?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChildProfile {
  id: string;
  displayName: string;
  birthYear?: number;               // age is derived from birthYear, never stored
  avatarKey?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  dataOrigin: 'local_user_action';
}

export interface EmergencyContact {
  id: string;
  displayName: string;
  relationship?: string;
  phoneE164?: string;
  notes?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationFix {
  id: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number | null;
  altitudeMeters?: number | null;
  speedMetersPerSecond?: number | null;
  headingDegrees?: number | null;
  capturedAt: string;
  source: 'parent_phone_web' | 'parent_phone_native' | 'manual';
}

export interface SafeZone {
  id: string;
  name: string;
  category: 'home' | 'school' | 'other';
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  enabled: boolean;
  schedule?: { startTime?: string; endTime?: string; weekdays?: number[] };
  currentState: GeofenceState;
  lastTransitionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeofenceEvent {
  id: string;
  safeZoneId: string;
  transition: 'enter' | 'exit' | 'dwell';
  locationFixId?: string;
  occurredAt: string;
  confidence: 'high' | 'medium' | 'low';
  source: 'web_foreground' | 'native_background' | 'native_foreground';
}

export interface AlertEvent {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  occurredAt: string;
  readAt?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  origin: DataOrigin;
  deliveryScope: 'same_device_local_only' | 'in_app_only';
  relatedEntityId?: string;
  locationFixId?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: 'morning' | 'learning' | 'responsibility' | 'health' | 'other';
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;                       // template id
  title: string;
  description?: string;
  category: Habit['category'];
  habitId?: string;
  childProfileId?: string;
  rewardCoins: number;              // reward per completed occurrence
  repeat: 'once' | 'daily' | 'weekdays' | 'weekly';   // 'custom' deferred
  startDate: string;                // local date YYYY-MM-DD
  endDate?: string;                 // optional, local date
  weekdays?: number[];              // 1-7 (ISO), used when repeat = 'weekly'
  reminderEnabled: boolean;
  reminderTime?: string;            // local HH:mm
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskOccurrence {
  id: string;
  taskId: string;
  dueDate: string;                  // local date YYYY-MM-DD
  status: 'pending' | 'completed' | 'cancelled';   // 'overdue' is derived, never stored
  rewardCoins: number;              // snapshot of Task.rewardCoins at generation
  completedAt?: string;
  rewardTransactionId?: string;
  completionOrigin?: 'parent_marked';
  createdAt: string;
  updatedAt: string;
}

export interface CoinTransaction {
  id: string;
  taskOccurrenceId?: string;        // unique: at most one earned transaction per occurrence
  type: 'earned' | 'adjustment';
  amount: number;
  reason: string;
  createdAt: string;
}

export interface PassportDeviceRecord {
  id: string;
  displayName: string;
  manufacturer?: string;
  model?: string;
  serialOrDeviceCode?: string;
  category?: string;
  childProfileId?: string;
  purchaseDate?: string;
  seller?: string;
  orderReference?: string;
  purchasePrice?: number;
  currency?: string;
  warrantyStart?: string;
  warrantyEnd?: string;
  warrantyProvider?: string;
  warrantyReference?: string;
  warrantyTerms?: string;
  condition: 'new' | 'used' | 'refurbished' | 'unknown';
  recordState: 'active' | 'archived';
  verification: PassportVerification;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface PassportMaintenanceEvent {
  id: string;
  passportDeviceId: string;
  eventDate: string;
  type: 'inspection' | 'repair' | 'battery' | 'screen' | 'strap' | 'software' | 'other';
  description: string;
  provider?: string;
  cost?: number;
  currency?: string;
  partsReplaced?: string[];
  verification: PassportVerification;
  documentIds: string[];
  createdAt: string;
}

export interface PassportAccessoryEvent {
  id: string;
  passportDeviceId: string;
  name: string;
  type?: 'strap' | 'case' | 'charger' | 'other';
  eventDate: string;
  action: 'added' | 'replaced' | 'removed';
  condition?: string;
  cost?: number;
  notes?: string;
  documentIds: string[];
}

export interface PassportDataHandlingEvent {
  id: string;
  passportDeviceId: string;
  eventDate: string;
  action: 'unpair_requested' | 'data_wipe_planned' | 'data_wipe_reported' | 'data_wipe_checked' | 'transfer';
  status: WipeStatus;
  performedBy?: string;
  scope?: string;
  outcome?: string;
  evidenceDocumentIds: string[];
  verification: PassportVerification;
  disclaimerAcknowledged: boolean;
  notes?: string;
}

export interface LocalDocument {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  blobKey: string;
  linkedEntityType: 'passport_device' | 'maintenance' | 'accessory' | 'data_handling';
  linkedEntityId: string;
  addedAt: string;
}

export interface AppPreferences {
  locale: 'vi' | 'en';
  theme: 'light' | 'system';
  notificationPreferences: {
    sos: boolean;
    safeZone: boolean;
    system: boolean;
    reminders: boolean;
    sound: boolean;
    haptics: boolean;
    hideSensitiveLockScreenContent: boolean;
  };
  locationHistoryEnabled: boolean;
  locationHistoryRetentionDays: number;
}
```

Additional entities may be added when required, but preserve the data-origin and provenance concepts.

## 7.2 Derived-state rules

- Coin balance = sum of valid CoinTransactions. Do not store a manually editable balance as a second source of truth.
- Task completion and reward transaction creation happen atomically in one storage transaction.
- A reward is granted only once for a task completion transition; duplicate UI action or rerender cannot create duplicate reward transactions.
- Habit progress derives from tasks linked to the habit within the date range.
- Safe Zone transition requires a valid fix and geofence rules; do not create an event just because a map circle was drawn.
- Stale location remains stale; do not fabricate a new timestamp.
- Dashboard safety state is derived from current permissions, latest fix and active local events.
- Passport timeline derives from linked lifecycle events; do not maintain a separate manually edited timeline list.
- Passport verification display derives from `verification` and attached proof; never upgrade provenance automatically.

## 7.3 Seed data

- Do not seed a fake current GPS fix or fake child location.
- Seed only harmless sample tasks/habits if needed, and label them as examples until edited.
- Do not seed fake SOS as a real active emergency.
- Watch Passport may start with an empty state; optionally include one clearly labelled sample record that the user can delete. Prefer empty state for first-run production-like experience.
- Do not use the device owner's real location without explicit permission and clear purpose.

---

# 8. USER FLOWS AND ACCEPTANCE CRITERIA

## 8.1 First launch

1. Show Welcome with SafeKid logo and a concise local-data explanation.
2. User enters parent display name.
3. User optionally enters child profile details.
4. App creates local records.
5. App lands on Dashboard with GPS not yet requested.
6. First use of Map/Location explains the phone-location source and requests permission after user action.

Pass criteria: no login, email, password or backend request is required.

## 8.2 Location flow

1. User opens Map.
2. App explains it will read this phone's position.
3. User grants location access.
4. App gets a real position fix.
5. Map displays marker and accuracy; screen shows `Vị trí điện thoại phụ huynh` and last updated time.
6. User can refresh/recenter and open Permission Center.

Pass criteria: source and timestamp are visible. Denied/unsupported/stale states are tested. No fake marker is shown as current location.

## 8.3 Safe Zone flow

1. User opens Safe Zones and chooses Add.
2. User names zone and selects a center from current position, map tap, search or coordinates.
3. User sets radius and optional schedule.
4. Save writes to local store.
5. When phone location changes into/out of region, the Geofence Engine evaluates accuracy/hysteresis and creates one event after confirmation.
6. Notification service sends the supported same-device alert.

Pass criteria: unit tests validate distance and edge cases; web foreground transition works; native background behavior is tested on physical devices and marked unavailable until validated.

## 8.4 SOS flow

1. User holds SOS button for configured threshold.
2. Event is persisted immediately.
3. App takes location snapshot if possible, without blocking event creation.
4. UI shows SOS active and same-device scope disclosure.
5. Native local notification is attempted if permission exists.
6. Sound/haptics are attempted where supported and enabled.
7. User can open dialer, SMS composer or copy location.
8. User acknowledges/resolves; record remains in history.

Pass criteria: SOS still works if GPS/notification permission is denied; no claim of remote dispatch; no animation blocks SOS.

## 8.5 Growth flow

1. Parent creates a habit.
2. Parent creates a task and optional reminder/reward.
3. App persists task and schedules supported local reminder.
4. Parent marks task complete.
5. One Coin transaction is created atomically.
6. Progress, balance and timeline update.

Pass criteria: duplicate completion does not award twice; repeat schedules are correctly generated/handled.

## 8.6 Watch Passport Lite flow

1. Parent opens Profile → Watch Passport.
2. App shows empty state or labelled sample record.
3. User adds a device record and enters identity/purchase data.
4. User adds warranty details and optional local expiry reminder.
5. User uploads invoice/photo/PDF evidence.
6. User adds maintenance/accessory events.
7. User records data-handling/wipe details if relevant, including who reported/performed it and evidence.
8. Timeline updates based on the linked entities.
9. User exports record/full backup and can restore it.

Pass criteria: no real watch connection implied; all user-entered details retain provenance; data wipe is record-only.

---

# 9. PERMISSION, ERROR, EMPTY AND OFFLINE STATES

Every primary module must have designed loading, success, empty, error, unsupported, permission-denied and offline states where relevant.

## 9.1 Location states

- `permission_unknown`
- `permission_denied`
- `permission_granted`
- `location_services_disabled`
- `unsupported`
- `waiting_for_fix`
- `fix_available`
- `poor_accuracy`
- `stale_fix`
- `network_unavailable_map_tiles`
- `background_location_unavailable`

## 9.2 Notification states

- Not requested.
- Granted.
- Denied.
- Unsupported (web/browser).
- Scheduled.
- Delivered/reported by OS callback where available.
- Failed/unknown.

Avoid saying “delivered to the person” for a local notification. It is a same-device operating-system notification.

## 9.3 Geofencing states

- Native background support available and permission granted.
- Foreground-only (web or native permission limited).
- Permission denied.
- Device/OS restriction.
- Zone paused.
- Accuracy insufficient.

Never show a green “Background monitoring active” badge unless the corresponding native capability and permission have been verified at runtime.

## 9.4 Offline behavior

- Core local records and screens remain usable offline.
- Map tiles may not load offline unless a compliant offline tile strategy is deliberately added; show a map-unavailable state rather than fake tiles.
- Location capture may still work depending on platform/device services.
- Local events and tasks continue to persist.
- External calls/SMS and map search may require network/OS app availability.

---

# 10. PRIVACY, ACCESSIBILITY AND SAFETY UX

## 10.1 Privacy basics

- No login or remote account data.
- All local records remain in the current browser origin/app container.
- Web, Android and iOS local stores do not sync automatically.
- Map tile provider receives normal network requests; document selected provider and relevant privacy links.
- Phone numbers, child profile data and exact location must not be sent to analytics or logs.
- Provide export/delete controls and explain local persistence.
- Lock-screen notification copy should minimize sensitive child/location information by default.

## 10.2 Accessibility

- Semantic HTML and form labels.
- Keyboard support for every control and SOS activation path.
- Visible focus rings.
- Accessible names for icon buttons.
- Contrast sufficient for text/status; never rely on color alone.
- Minimum 44×44px touch target.
- Screen-reader announcement for new alerts, without repeated announcements.
- Reduced-motion support.
- Text scaling and long Vietnamese labels tested.

## 10.3 Safety copy rules

Preferred labels:
- “Vị trí điện thoại phụ huynh”.
- “Theo dõi vùng an toàn trên điện thoại này”.
- “SOS cục bộ — thông báo trên thiết bị này”.
- “Mở ứng dụng Tin nhắn để gửi”.
- “Hồ sơ Watch Passport nhập thủ công”.
- “Chưa kết nối đồng hồ”.
- “Chưa xác minh với nhà cung cấp”.

Forbidden claims:
- “Đang theo dõi vị trí con” when the app only knows the parent's phone position.
- “Đã gửi SOS đến phụ huynh/đồng hồ/trung tâm” without a real verified communication channel.
- “Đã gửi SMS” before the user sends it in the system composer.
- “Certified Data Wipe” based only on a manually entered record.
- “GPS chính xác tuyệt đối”, “cảnh báo tức thì 100%” or similar guarantees.

---

# 11. QA, TEST STRATEGY AND RELEASE GATES

## 11.1 Automated quality gates

Before each phase is accepted, run:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run test:e2e` if configured

No unresolved TypeScript/lint/build failures may be silently passed. Record any blocker and continue on independent tasks where possible.

## 11.2 Unit tests

Required unit coverage:

- Haversine distance and coordinate validation.
- Geofence inside/outside/boundary cases.
- Accuracy thresholds and hysteresis.
- Enter/Exit/Dwell confirmation and cooldown.
- Duplicate event prevention.
- SOS state transitions and fallback behavior.
- Task reward idempotency and atomic transaction.
- Coin balance derivation.
- Passport warranty expiry calculations.
- Passport timeline projection and provenance rules.
- Export/import schema validation and migration.
- Task template + occurrence generation, per-occurrence reward idempotency, edit/archive rules (17.5).
- i18n key parity vi/en (build fails on any missing key).
- S.F AI routing: in-scope answer from approved content; emergency → block + 113/114/115 + SOS button; out-of-scope → demo CSKH notice with the required "demo / not sent" label; never invents answers or claims a ticket was created.

## 11.3 Integration tests

- Location service with mocked provider adapter (test-only; production UI must show mock status when used).
- Notification adapter permission/failure paths.
- Storage repository CRUD and migrations.
- SOS workflow with GPS available/unavailable and notification granted/denied.
- Geofence foreground event to alert history.
- Passport record + document attachment + export/import.

## 11.4 E2E tests

1. Onboard without login.
2. Open map and handle location permission.
3. Create Safe Zone.
4. Trigger test-only geofence boundary scenario through a development-only test harness; this is not production GPS data.
5. Activate local SOS and resolve it.
6. Add/edit emergency contact and open composer action (verify link/intent only; do not send real messages in automated tests).
7. Create habit/task/reminder and ensure reward once.
8. Create Watch Passport record, upload evidence, add maintenance event and export.
9. Clear local data and verify empty state.
10. Switch language vi↔en mid-session without data loss; no overflow at 320px.
11. S.F AI: one in-scope question, one emergency question, one out-of-scope question.

Any test harness or simulated coordinate injection must be separated from production and labelled as test-only. It must not feed user-facing live safety status.

## 11.5 Responsive visual QA

Capture and inspect at minimum:

- 320×720
- 360×800
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1280×800
- 1440×900
- 1920×1080

Review populated, empty, permission-denied, error and SOS states. Check horizontal overflow, sticky navigation, map viewport, bottom sheet, keyboard, safe areas, and long Vietnamese strings.

## 11.6 Native QA (Phase 2 — not in current scope)

Physical device testing is required for claims about native behavior.

Android:
- Real location permission paths.
- Android 13+ notification permission.
- Background/foreground geofence transitions.
- App swiped away, reboot, battery saver, location disabled and permission revoked cases.
- Notification channel sound/vibration settings.

iOS:
- When-In-Use / Always permission paths where justified.
- Region monitoring with app backgrounded.
- Notification authorization and Focus/silent behavior.
- Background capability and app lifecycle handling.
- Permission revoked / location disabled cases.

If physical testing is not possible, say “not verified on device”. Do not call the feature production-ready.

## 11.7 Release gates

- Web build runs and is tested over HTTPS.
- PWA installability verified in supported browsers.
- Native packaging (Android APK / iOS IPA) is Phase 2 and out of scope now. Do not run `cap add`. Never claim APK/IPA exists.
- All feature limitations are documented.

---

# 12. PHASED IMPLEMENTATION PLAN

The agent must not stop after producing a plan. It must implement all in-scope phases in sequence, verify each phase, then produce a final report. If a platform-native blocker arises, complete all independent web/domain work and clearly report the exact blocker.

| Phase | Scope | Exit criteria |
|---|---|---|
| 00 — Audit & Decision Lock | Inspect repo, assets, scripts, toolchain; write decisions and technical plan | Existing project understood; `docs/DECISIONS.md` and implementation log created |
| 01 — Foundation & Brand | React/Vite/TS, Tailwind, tokens, fonts, logo, router, app shell, PWA shell | App runs; logo/palette/typography applied; route shell works |
| 02 — Responsive UX | Mobile bottom nav, tablet adaptive layout, desktop sidebar; core pages and states | QA screenshots at mobile/tablet/desktop; no overflow |
| 03 — Local Data Layer | Dexie schema, migrations, repositories, export/import base | CRUD tests and persistence across reload |
| 04 — Location & Map | Real map provider, parent-phone location, permission center and error states | Real foreground fix appears with source/accuracy/time on HTTPS and native |
| 05 — Safe Zone Engine | Zone CRUD, map circles, distance/hysteresis, foreground transitions | Unit/integration tests pass; web foreground behavior verified |
| 06 — Native Safety | **DEFERRED to Phase 2 — not built now.** Keep GeofenceAdapter interface + NativeBackground stub only | Documented in NATIVE_MIGRATION_NOTES.md |
| 07 — SOS & Alerts | Local SOS workflow, event history, same-device notification, contact actions | Local SOS works even with location/notification denied; no remote claims |
| 08 — Growth | Habits, tasks, reminders, coins, calendar, progress | End-to-end task/reward idempotency passes |
| 09 — Watch Passport Lite | Device records, purchase, warranty, documents, maintenance, accessories, wipe log, timeline | CRUD, provenance and backup/restore pass |
| 10 — Settings & Ecosystem | Help/FAQ, S.F AI (scoped), vi/en language switch, plan comparison, privacy/data controls, concept surfaces | No dead buttons; no payment/remote AI claims; i18n parity |
| 11 — Hardening & QA | Accessibility, performance, motion, visual QA, security review, device tests | Quality gates and release report completed |
| 12 — Packaging & Release | **PWA only now.** Capacitor/APK/IPA deferred to Phase 2 | PWA builds and deploys over HTTPS |

## 12.1 Implementation management files

Maintain:
- `README.md` — setup, run, build and deployment.
- `docs/IMPLEMENTATION_LOG.md` — phase, files changed, tests and outcome.
- `docs/DECISIONS.md` — assumptions, decisions and rationale.
- `docs/KNOWN_LIMITATIONS.md` — web/native scope, unsupported capabilities and safety boundaries.
- `docs/QA_REPORT.md` — automated and manual test results.
- `docs/RELEASE_REPORT.md` — web/PWA/Android/iOS build status.
- `ASSET_CREDITS.md` — any third-party images/fonts/sounds and their license/source.

---

# 13. DEFINITION OF DONE

The rebuild is done only when all of the following are true:

- All P0 and P1 features specified in this document are implemented, not just drawn.
- Watch Passport Lite is functional and local.
- No remote database, login or smartwatch connection has been added.
- No fake child location or fake watch telemetry is presented as real.
- GPS obtains a real phone location with permission and source labeling.
- Real map displays the location and Safe Zone geometries.
- Safe Zone engine is tested with real location fixes and deterministic unit tests.
- Native background geofencing is documented as Phase 2 (not built); the UI never claims background monitoring.
- Vietnamese and English have 100% key parity; S.F AI answers only from approved content and handles emergency / out-of-scope cases exactly as in Section 17.10.
- Local SOS event works independently of GPS and notification permission; local notification/sound/haptics report capability/results honestly.
- Emergency contact actions open system UI and do not silently send.
- All local records persist, export, import and delete correctly.
- Habit/task/reward data is consistent and idempotent.
- Watch Passport provenance is maintained; no fake certifications.
- Responsive UX works across required widths.
- Motion is purposeful and respects Reduced Motion.
- Brand logo and palette are correct.
- `typecheck`, `lint`, tests and production build pass.
- Visual QA screenshots have been inspected.
- `docs/NATIVE_MIGRATION_NOTES.md` exists with Android/iOS permissions, plugins, background-geofence options and store-review notes.
- No buttons, cards or tabs are dead. Future features are either functional or clearly marked and non-actionable.

---

# 14. OFFICIAL TECHNICAL REFERENCES

The coding agent must check current official documentation before implementing native APIs or selecting plugins. These references explain the intended integration boundaries:

- React Bits source/docs: https://reactbits.dev/ and https://github.com/DavidHDev/react-bits
- Motion for React: https://motion.dev/docs/react
- Motion accessibility: https://motion.dev/docs/react-accessibility
- Capacitor: https://capacitorjs.com/docs
- Capacitor plugins: https://capacitorjs.com/docs/plugins
- Capacitor Geolocation: https://capacitorjs.com/docs/apis/geolocation
- Capacitor Local Notifications: https://capacitorjs.com/docs/apis/local-notifications
- Capacitor Haptics: https://capacitorjs.com/docs/apis/haptics
- MapLibre GL JS: https://maplibre.org/maplibre-gl-js/docs/
- Android Geofencing: https://developer.android.com/develop/sensors-and-location/location/geofencing
- Apple Core Location region monitoring: https://developer.apple.com/documentation/corelocation/monitoring-the-user-s-proximity-to-geographic-regions
- Apple background location updates: https://developer.apple.com/documentation/corelocation/handling-location-updates-in-the-background
- Dexie / IndexedDB: https://dexie.org/docs/
- Vite PWA plugin: https://vite-pwa-org.netlify.app/

Implementation caveats to preserve:
- Capacitor's standard Geolocation plugin is for obtaining/tracking device position and does not, by itself, provide the complete background geofencing solution required here. Evaluate or implement a native background adapter.
- Android background geofencing is OS-managed and can be delayed/restricted by background limits, permissions and battery policies.
- iOS region monitoring/background location requires Core Location configuration and permissions; OS behavior is not a hard real-time guarantee.
- Capacitor Local Notifications schedules notifications on the local device without a server, but permission, OS channel settings and exact delivery constraints apply.
- iOS Critical Alerts require a separate entitlement; do not promise that the app can bypass Focus or the silent switch.
- React Bits components are source components; inspect each component's code/dependencies and use selectively. Do not rely on React Bits for the whole application shell or business logic.

---

# 15. ALL-IN-ONE PROMPT FOR THE AI CODING AGENT (v2.3, web-first)

Paste the prompt below into the coding agent after uploading the whole ZIP. The same text is in `PROMPT_ALL_IN_ONE.md`.

```text
You are the autonomous principal engineer, senior React architect, UX designer and QA lead. Build the complete SafeKid Parent App as a responsive web app (PWA). Do not stop at a plan or a visual prototype: implement, run, test, inspect the rendered UI, and report real results.

READ FIRST — fully, in this order, before writing code
1. SAFEKID_MASTER_SPEC.md — binding specification. Section 17 and this prompt override any conflicting earlier text, especially anything about native Android/iOS (that is Phase 2 and is NOT built now).
2. content/ — approved copy, used as data and never rewritten in meaning: faq.vi.md, faq.en.md, brand.vi.md, brand.en.md, sfai-responses.md.
3. assets/brand/safekid-logo-trimmed.png (official logo; use unchanged) and safekid-logo-original.webp. assets/reference/ are mood references only; the locked palette wins.
4. reference/DBC_ND3_DIGIBABI.pdf — Business Plan for context only. The spec wins on conflicts. Never present it as proof that any capability works.

SCOPE
BUILD NOW (web + PWA, deployable over HTTPS):
- Onboarding with no login; parent profile; optional local child profiles.
- Home dashboard; real phone GPS + real MapLibre map (MapTiler) showing source, accuracy, timestamp, stale/error states.
- Safe Zones (CRUD, circle, schedule, pause) + geofence engine (Haversine, accuracy filter, hysteresis, confirmation, dwell, cooldown, dedup) using the defaults in spec 17.6. Foreground only.
- Local SOS (hold-to-activate plus the accessible two-step alternative, event persisted immediately, location snapshot if available, sound/haptics/notification where the browser supports them, acknowledge/resolve, history). Emergency contacts with explicit tel:/sms: actions. Alerts center, notification settings, Permission Center.
- Growth: habits, tasks using the template + occurrence model in 17.5, reminders, coins, calendar, progress. Parent marks completion; reward is atomic and idempotent.
- Watch Passport Lite: device records, purchase, warranty, documents, maintenance, accessories, data-handling log, timeline, provenance labels, export.
- Settings, privacy, backup export/import, delete data; Help/FAQ (searchable, from content/); S.F AI per 17.10; Vietnamese/English switch per 17.11; Free/Plus comparison (no payment); Core+Skin+Skill / Trade-in / Refurbished as labelled concepts only.

DO NOT BUILD:
- Login/accounts, backend, remote DB, cloud sync, push service, payments, analytics, cloud AI or chatbot, API keys in source.
- Smartwatch pairing/telemetry, incoming watch SOS, a child app.
- Native projects: do NOT run `cap add android/ios`; no Kotlin/Swift; no APK/IPA; no native background geofencing.

CAPACITOR-READY (so the later conversion is cheap)
- Keep the full adapter architecture (Location, Geofence, Notification, Haptics, Audio, Storage, Files, Clock, Map) behind typed interfaces. Feature components never call browser/native APIs directly.
- Install @capacitor/core and the foreground plugins (Geolocation, Haptics, Local Notifications, Preferences, App); call them only inside adapters, chosen via Capacitor.isNativePlatform() with web fallbacks.
- Provide a GeofenceAdapter interface with a foreground web implementation and an unimplemented NativeBackground stub.
- Model every permission state in spec section 9, including background location. Native-only items display as informational ("available in the mobile app version"), never as active.
- Write docs/NATIVE_MIGRATION_NOTES.md: Android/iOS permissions and manifest/plist strings, plugin list, background-geofence options (reviewed plugin vs small custom Kotlin/Swift plugin), store-review notes, map-key origin allow-list for native, how to disable the service worker, and the export/import path for moving web data into the app.
- Unit-test the adapter contracts with a mock "native" implementation. Use relative asset paths.

DATA TRUTH — never violate
- The only live location is the phone running the app. Label it "Vị trí điện thoại phụ huynh" / "Parent phone location". Never present it as the child's location.
- No fake GPS, routes, battery, watch status or seeded SOS. Test fixtures are isolated and labelled test-only.
- SOS is same-device only. Keep this disclosure visible on the SOS screen: "Cảnh báo SOS được lưu và thông báo trên thiết bị này. Ứng dụng chưa gửi cảnh báo đến thiết bị khác hoặc dịch vụ khẩn cấp." (use the English equivalent when language is English). SOS must still work if GPS or notification permission is denied. Never say a call/SMS was made or sent before the user confirms in the OS UI.
- UI states plainly that geofence monitoring and reminders run only while the app is open. Never show "background monitoring active".
- Watch Passport is manual: no "verified/certified/official/authentic" unless real evidence exists; data wipe is a record only.
- Emergency guidance may show 113 (Police), 114 (Fire), 115 (Ambulance) as tel: links the user must confirm; the app never dials by itself.

S.F AI (local, scoped) — follow spec 17.10 exactly
- Runs fully on-device; no cloud call. Answers only from content/faq.* and content/brand.*; never generates new answers.
- Emergency/SOS questions: block, show the emergency text and an "Open SOS" button from sfai-responses.md.
- Out-of-scope or complex questions: show the demo CSKH handoff notice and the required label "Bản demo — chưa kết nối hệ thống CSKH. Yêu cầu chưa được gửi đi." (English equivalent in English). Never claim a ticket was created or a specialist will reply by a deadline.
- No match: "Chưa có thông tin cho câu hỏi này" plus the support contacts.

LANGUAGE
- Vietnamese default, English switch (Profile → Settings and Welcome). All strings via i18next keys; build fails on any missing key; safety sentences must mean the same in both languages. Use Intl for dates/numbers.

TECH STACK
React + TypeScript + Vite; Tailwind with the exact tokens in spec section 4; React Router; Zustand; Zod; Dexie/IndexedDB (versioned schema + migrations); Motion for React (imports from "motion/react"); selected free React Bits components only after inspecting their dependencies (avoid adding GSAP unless justified and logged); lucide-react; MapLibre GL JS with MapTiler; vite-plugin-pwa; i18next/react-i18next; fflate for backup ZIP; Vitest + React Testing Library + Playwright. Pin stable compatible versions and commit the lockfile. No secrets in source.

MAP
- Style URL from env VITE_MAP_STYLE_URL; provide .env.example with a placeholder. If the variable is missing the app must still build and run and show a clear "Chưa cấu hình bản đồ / Map not configured" state — never a fake map or fake marker. Show required attribution.

DESIGN AND UX
- Locked palette #00C7CA / #2D5568 / #EAF4F5 / #FFFFFF plus supporting tokens in the spec. Plus Jakarta Sans (headings) and Inter (body), bundled locally. Premium, calm, parent-first; friendlier only in Growth. One icon family. Never redraw or recolor the logo. No decorative particles on Map/SOS/Alerts.
- Responsive from 320px to ≥1536px; bottom nav on phones, rail on tablets, sidebar on desktop; safe-area aware; no horizontal overflow at 320px; 44×44 touch targets; no dead buttons (every route and card reachable and functional, or clearly labelled and non-actionable).
- Motion is purposeful, respects MotionConfig reducedMotion="user", and never delays SOS.

PRIVACY AND ACCESSIBILITY
- No remote logs; never log names, phone numbers or coordinates. Explain local storage and map-provider requests. Export/import/delete data; request navigator.storage.persist(); show a backup reminder. Semantic HTML, labels, keyboard support, visible focus, screen-reader announcements for new alerts, sufficient contrast.

PHASES — complete each, run the gates, then continue
0 Audit + docs/DECISIONS.md + docs/IMPLEMENTATION_LOG.md
1 Foundation: tokens, logo, fonts, routes, responsive shell, i18n, PWA shell
2 Data layer: Dexie schema, migrations, repositories, export/import base
3 Map + foreground GPS + permission center
4 Safe Zones + geofence engine
5 SOS, alerts, emergency contacts; web notification/audio/haptics adapters
6 Growth (habits, tasks/occurrences, reminders, coins, calendar, progress)
7 Watch Passport Lite
8 Settings, privacy, backup/import/reset, Help/FAQ, S.F AI, plans, concept pages
9 Hardening: accessibility, responsive visual QA, reduced motion, security review
10 PWA finish + docs/NATIVE_MIGRATION_NOTES.md + release docs
If you run short of budget, finish in priority order 1→5, then 6, 7, 8, and record anything unfinished honestly in docs/KNOWN_LIMITATIONS.md. Do not ask the owner to repeat decisions already in the spec; record genuinely blocking unknowns and continue with safe defaults.

QUALITY GATES
- `npm run typecheck`, `lint`, `test`, `build` must pass; `test:e2e` for Playwright flows.
- Unit tests per spec 11.2 including: Haversine/boundary, geofence state machine with the 17.6 defaults, SOS workflow with GPS/notification denied, task occurrence reward idempotency, coin balance, passport timeline and warranty, backup import/export, i18n key parity, S.F AI routing.
- Playwright: onboarding, location permission states, Safe Zone CRUD, SOS, contact composer link, task reward once, Passport + export, language switch, S.F AI (in-scope / emergency / out-of-scope), reset data.
- Inspect screenshots at 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 in default and reduced-motion modes.
- Geolocation requires HTTPS or localhost. Real GPS and notifications cannot be verified in your environment: say "not verified on physical device" and provide docs/UAT_CHECKLIST.md for the owner to run on a phone.

DELIVERABLES
Source + lockfile; README (install, run, build, HTTPS deploy, env vars); PWA build; .env.example; docs/ IMPLEMENTATION_LOG, DECISIONS, KNOWN_LIMITATIONS, QA_REPORT, NATIVE_MIGRATION_NOTES, UAT_CHECKLIST; ASSET_CREDITS.md; responsive screenshots.

FINAL REPORT
Be factual: what was built, commands run, pass/fail counts, screenshots reviewed, what is unverified, known limitations, remaining work. Do not call anything "production-ready" or "complete" if it is unverified.

Begin now: read the spec and content files, create the implementation log, and start building.
```

---

# 16. PACKAGE CONTENTS

```text
SafeKid_Parent_App_Handoff_v2_3/
├── README_START_HERE.md
├── PROMPT_ALL_IN_ONE.md
├── SAFEKID_MASTER_SPEC.md
├── .env.example
├── content/
│   ├── faq.vi.md
│   ├── faq.en.md
│   ├── brand.vi.md
│   ├── brand.en.md
│   └── sfai-responses.md
├── assets/
│   ├── brand/  (safekid-logo-trimmed.png, safekid-logo-original.webp)
│   └── reference/  (mood references only)
└── reference/
    └── DBC_ND3_DIGIBABI.pdf
```

**Final product boundary reminder:** this build provides real phone-level functionality and local records in a web app. It does not monitor a remote child, connect to a smartwatch, send remote SOS or synchronize data across devices. Those require future hardware and/or backend infrastructure. Native Android/iOS packaging is Phase 2.

---

# 17. QUYẾT ĐỊNH ĐÃ CHỐT (v2.3 — ưu tiên cao nhất)

Các quyết định dưới đây ghi đè mọi mục khác trong tài liệu khi có mâu thuẫn.

## 17.1 Bản đồ
- Nhà cung cấp: **MapTiler**, gói miễn phí, dùng với MapLibre GL JS.
- Key và style URL đặt trong biến môi trường, không commit lên repo.
- Hạn mức và điều khoản phải được xác minh trên trang chính thức trước khi lên production.

## 17.2 Thông tin hỗ trợ
- Email: safekid.digibabi@gmail.com
- Điện thoại: 0377430400
- Fanpage: https://www.facebook.com/DigiBabi

## 17.3 Phạm vi giai đoạn này: Web/PWA trước, sẵn sàng Capacitor
- Giai đoạn này chỉ build web app và PWA. Không chạy `cap add android/ios`, không tạo APK/IPA, không viết code native (Kotlin/Swift).
- Phần native trong mục 6.7, 6.8, 6.11 và Phase 5, 11 là **roadmap giai đoạn 2, chưa build**. Ghi rõ "chưa build trong bản này" ở các mục đó.
- Giữ đầy đủ kiến trúc adapter. Cài `@capacitor/core` và các plugin nền tảng (Geolocation, Haptics, Local Notifications, Preferences, App). Chỉ gọi chúng bên trong adapter, chọn nhánh bằng `Capacitor.isNativePlatform()` và có fallback cho web.
- Có `GeofenceAdapter` kiểu dữ liệu rõ ràng, một bản triển khai foreground cho web và một stub `NativeBackground` chưa triển khai.
- Permission Center phải thể hiện đủ trạng thái ở mục 9, kể cả vị trí nền. Các mục chỉ có trên app native hiển thị là "có trong phiên bản ứng dụng di động", không hiển thị là đang hoạt động.
- UI phải nói rõ: theo dõi vùng an toàn và nhắc nhở chỉ chạy khi ứng dụng đang mở. Không bao giờ hiển thị trạng thái "đang giám sát nền".
- Thông báo và rung trên web dùng kiểm tra khả năng của trình duyệt. Trên iOS, thông báo web cần PWA đã được thêm vào Màn hình chính.
- Gọi `navigator.storage.persist()`, hiện nhắc sao lưu định kỳ và nút Xuất dữ liệu rõ ràng.
- Test kỹ luồng Export/Import, vì đây là đường di chuyển dữ liệu từ web sang app native sau này.
- Dùng đường dẫn tài nguyên tương đối. Service worker phải dễ tắt khi build native.
- Viết `docs/NATIVE_MIGRATION_NOTES.md`: quyền Android/iOS cần khai báo, chuỗi mô tả trong manifest/plist, danh sách plugin, các phương án geofence nền và lưu ý khi duyệt store.
- Viết unit test cho adapter bằng một bản triển khai "native" giả lập để kiểm tra hợp đồng giao diện.
- Ghi trong KNOWN_LIMITATIONS: GPS và thông báo chưa được kiểm chứng trên thiết bị thật.

## 17.4 Trạng thái các việc đã mở ở v2.1
- Mô hình Task lặp lại: **đã chốt** (mục 17.5).
- Ngưỡng geofence: **đã đặt giá trị mặc định** (mục 17.6), cần kiểm chứng thực địa.
- Business Plan: **đã đính kèm** và đối chiếu (mục 17.8).
- FAQ: **do đội dự án soạn** (mục 17.9).

## 17.5 Mô hình Task lặp lại (quyết định của dự án)
- **Task là mẫu (template)**: tiêu đề, phần thưởng, quy tắc lặp, giờ nhắc. **TaskOccurrence là từng lần thực hiện** theo ngày cụ thể. Phần thưởng và trạng thái hoàn thành nằm ở occurrence, không nằm ở Task.
- Quy tắc lặp: `once`, `daily`, `weekdays`, `weekly` (chọn thứ). `custom` bị hoãn sang giai đoạn sau.
- Tạo occurrence theo cửa sổ cuộn: khi mở app, sinh occurrence cho hôm nay đến 14 ngày tới. Không có tiến trình nền.
- Trạng thái `overdue` là giá trị suy ra từ ngày đến hạn và trạng thái hiện tại, không lưu vào DB. Occurrence đã quá hạn không tự chuyển sang ngày sau.
- Ràng buộc duy nhất: `(taskId, dueDate)`. Hoàn thành occurrence và tạo giao dịch Coin phải nằm trong cùng một transaction của Dexie. Khi đã có `rewardTransactionId`, không tạo thêm.
- Sửa Task lặp: thay đổi chỉ áp dụng cho occurrence chưa hoàn thành và tương lai. Occurrence đã hoàn thành giữ nguyên `rewardCoins` đã snapshot.
- Xóa Task: đặt `archived = true`, không xóa lịch sử occurrence và giao dịch Coin.
- Ngày và giờ theo múi giờ của thiết bị. Lịch Safe Zone qua nửa đêm: nếu `endTime < startTime` thì khoảng thời gian kéo sang ngày hôm sau.
- Test bắt buộc: lặp hằng ngày qua 3 ngày, đánh dấu hoàn thành hai lần liên tiếp không thưởng hai lần, chuyển múi giờ, sửa Task đang lặp.

## 17.6 Ngưỡng geofence mặc định
Các giá trị dưới đây là **cấu hình ban đầu** để test. Phải kiểm chứng lại bằng thử nghiệm thực địa trước khi coi là đúng.

```ts
export const GEOFENCE_DEFAULTS = {
  maxFixAgeSeconds: 120,          // fix cũ hơn thì coi là stale, không đánh giá
  maxAccuracyMeters: 50,          // fix có accuracy lớn hơn bị loại, trạng thái poor_accuracy
  enterConfirmFixes: 2,           // cần 2 fix liên tiếp đạt điều kiện vào vùng
  exitConfirmFixes: 2,
  exitHysteresisMeters: 25,       // ra khỏi vùng khi khoảng cách > radius + 25 m
  dwellMinutes: 5,                // ở trong vùng >= 5 phút thì phát sự kiện dwell
  cooldownMinutesPerZone: 10,     // cùng loại sự kiện trong 10 phút chỉ tạo một lần
  defaultRadiusMeters: 500,
} as const;
```

Quy tắc đánh giá: khoảng cách dùng công thức Haversine. Fix đạt điều kiện vào vùng khi `distance <= radius`, ra khỏi vùng khi `distance > radius + exitHysteresisMeters`. Fix có `accuracyMeters > maxAccuracyMeters` không được tính vào chuyển trạng thái.

## 17.7 Gói Plus và độ chính xác
- Business Plan (bản v5.1, mục 3.3) ghi Plus gồm "định vị nâng cao, lịch sử lộ trình 90 ngày, Safe Zone và cảnh báo tốc độ theo cấu hình khả dụng". Tài liệu **không** định nghĩa mức độ chính xác GPS khác nhau theo gói.
- Trong bản web hiện tại **không có thanh toán và không khóa tính năng**. Ngưỡng geofence áp dụng giống nhau cho mọi người dùng.
- Ngưỡng `maxAccuracyMeters` không làm GPS chính xác hơn. Nó chỉ quyết định fix nào được dùng để đánh giá. Đây là giới hạn của phần cứng và hệ điều hành, không phải của ứng dụng.
- Nếu sau này muốn tách gói: chỉ tách các tính năng tiện ích như lịch sử lộ trình 90 ngày và báo cáo. Không tách SOS, Safe Zone cơ bản hay ngưỡng an toàn, vì spec cấm khóa chức năng an toàn sau gói trả phí.
- Đề xuất gói Plus để chủ sản phẩm cân nhắc: `maxAccuracyMeters` chặt hơn (ví dụ 30 m), chấp nhận bỏ nhiều fix hơn. Hiện chỉ ghi nhận trong tài liệu, chưa kích hoạt.

## 17.8 Tài liệu tham chiếu
- Nguồn: `DBC_ND3_DIGIBABI.pdf` (SafeKid Final Business Plan Version 5.1, 73 trang PDF, Digital Business Contest 2026). Tên file trong spec v2.0 (`DBC_ND3_DIGIBABI.pdf`) được thay bằng tên này.
- Các số trang trong spec là số trang in ở chân trang ("Trang N"), có thể lệch 1 so với số trang PDF. Khi đọc phải kiểm tra theo chân trang.
- Các thông tin về SOS chỉ là mô phỏng, K26 và Y76 chưa được xác nhận, và chưa có kiểm thử trên thiết bị thật được nêu trong Business Plan. Spec này không coi đó là bằng chứng đã hoạt động.

## 17.9 FAQ
- Nội dung FAQ và Brand do đội dự án soạn: `content/faq.vi.md`, `content/faq.en.md`, `content/brand.vi.md`, `content/brand.en.md`. Agent không được thêm câu trả lời nào ngoài các file này. Câu hỏi không có trong file phải trả lời: "Chưa có thông tin cho câu hỏi này. Vui lòng liên hệ hỗ trợ." (hoặc bản tiếng Anh tương ứng).

## 17.10 S.F AI — trợ lý cục bộ có phạm vi giới hạn
**Phạm vi trả lời:** chỉ FAQ (`content/faq.vi.md`, `content/faq.en.md`) và Brand (tên SafeKid, DigiBabi, mô tả sản phẩm trong spec, so sánh Free/Plus ở mức thông tin, thông tin liên hệ hỗ trợ).

**Cách hoạt động:**
- Chạy hoàn toàn trên thiết bị. Không gọi AI đám mây, không có API key, không gửi nội dung câu hỏi ra ngoài.
- Khớp câu hỏi với các mục nội dung đã duyệt bằng từ khóa và danh sách mẫu câu (cả Tiếng Việt và Tiếng Anh). Không sinh câu trả lời mới.
- Mỗi câu trả lời phải có nguồn là một mục trong file FAQ hoặc Brand. Nếu không khớp, trả lời theo mục 17.10.3.

**Quy tắc chặn và chuyển:**
1. **Khẩn cấp hoặc SOS:** S.F AI không trả lời nội dung. Hiển thị ngay hướng dẫn: "Trong tình huống khẩn cấp, hãy gọi 113, 114 hoặc 115, hoặc dùng màn hình SOS và liên hệ khẩn cấp trên điện thoại này." Thêm nút mở màn hình SOS.
2. **Ngoài phạm vi hoặc phức tạp** (khiếu nại, lỗi thiết bị, tài khoản, quyền riêng tư, bảo hành cụ thể, thanh toán, dữ liệu của một gia đình cụ thể, yêu cầu gặp người thật): hiển thị thông báo chuyển CSKH (mục 17.10.3).
3. **Không có trong nội dung:** hiển thị "Chưa có thông tin cho câu hỏi này" và đưa thông tin liên hệ hỗ trợ.

**17.10.3 Thông báo chuyển CSKH (bản demo):**
- Hiển thị theo mẫu trong `content/sfai-responses.md`.
- Phải gắn nhãn **"Bản demo — chưa kết nối hệ thống CSKH. Yêu cầu chưa được gửi đi."**
- Không được viết rằng nhân viên đã nhận yêu cầu, sẽ phản hồi trong thời gian nhất định, hay đã tạo phiếu. Đây là thông báo mô phỏng, chưa có kênh chuyển thật.
- Hiển thị kèm kênh liên hệ thật hiện có: email, điện thoại, fanpage (mục 17.2).

**Giới hạn đã nêu trong Business Plan (mục 9.2):** S.F AI là công cụ hỗ trợ thông tin, không phải hệ thống tự quyết định. Các vấn đề về an toàn, tài khoản, quyền riêng tư và lỗi thiết bị phải có người chịu trách nhiệm. Spec không được mô tả S.F AI là đã xử lý được yêu cầu thực tế.

## 17.11 Chuyển đổi ngôn ngữ Tiếng Việt / Tiếng Anh
- Hai ngôn ngữ: `vi` (mặc định) và `en`. Lưu trong `AppPreferences.locale`, có nút chuyển ở Hồ sơ → Cài đặt và ở màn hình Welcome.
- **Mọi chuỗi giao diện** đi qua một bộ khóa dịch (ví dụ `t('sos.disclaimer')`). Không hard-code chuỗi trong component.
- Build fail nếu thiếu bất kỳ khóa nào trong `en`. Chỉ khi đủ 100% khóa mới bật nút chuyển.
- Nội dung phải dịch đầy đủ cả hai ngôn ngữ: FAQ, S.F AI, nhãn trạng thái (mục 10.3), thông báo, disclosure SOS và mọi thông báo lỗi. Nghĩa của các câu an toàn phải giống nhau giữa hai ngôn ngữ.
- Ngày, giờ, số: format theo locale bằng `Intl`. Tiền vẫn là VND.
- Font Plus Jakarta Sans và Inter đều hỗ trợ dấu tiếng Việt. Đóng gói font trong bundle.
- Test: chuyển ngôn ngữ giữa lúc đang dùng không làm mất dữ liệu; chuỗi tiếng Anh dài không tràn layout ở 320px.

## 17.12 Số khẩn cấp
- Spec dùng 113 (Công an), 114 (Cứu hỏa), 115 (Cấp cứu) là số khẩn cấp quốc gia của Việt Nam.
- Business Plan không đề cập các số này. Chủ sản phẩm đã ủy quyền dùng mặc định này; nên xác nhận lại trước khi phát hành công khai.
- Ứng dụng không được tự gọi các số này. Chỉ hiển thị để người dùng tự gọi, qua liên kết `tel:` cần người dùng xác nhận.

## 17.13 Quyết định mặc định (chủ sản phẩm ủy quyền cho agent)
- Chuyển ngôn ngữ vi/en bật ngay ở bản đầu, với điều kiện đủ 100% khóa dịch.
- Thông báo demo CSKH dùng đúng lời trong `content/sfai-responses.md`.
- Gói Plus dùng cùng ngưỡng geofence với Free (mục 17.7).
- Hold-to-activate SOS có phương án thay thế không cần giữ: nút "SOS" mở hộp xác nhận 2 bước (nút xác nhận lớn, có thể hủy), dùng được bằng bàn phím và trình đọc màn hình.
- Nội dung Brand cho S.F AI nằm trong `content/brand.vi.md` và `content/brand.en.md`. Agent chuyển các file `content/*.md` thành dữ liệu có kiểu (JSON/TS) lúc build; không sửa nghĩa.
- Biến môi trường: `VITE_MAP_STYLE_URL`. Nếu thiếu, app vẫn build và chạy, bản đồ hiển thị trạng thái "Chưa cấu hình bản đồ" (không dùng bản đồ giả).


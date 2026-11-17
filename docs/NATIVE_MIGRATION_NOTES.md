# Native migration notes — Phase 2 planning

This file is a migration checklist, not evidence that a native app exists. No `cap add android` or `cap add ios` command has been run, and no native code is included.

## Adapter boundary to preserve

Keep feature/domain code independent of platform APIs. Before native migration, define typed contracts for:

- `LocationAdapter`: permission state, current fix, watch start/stop, background-location capability.
- `GeofenceAdapter`: evaluate foreground fixes; expose whether background monitoring exists.
- `NotificationAdapter`: permission, immediate local notification, scheduled local notification and cancellation.
- `HapticsAdapter` and `AudioAdapter`: SOS feedback with user preferences and capability reporting.
- `StorageAdapter`: repositories, schema version, transactions and backup migration.
- `FilesAdapter`: document import/export and sharing.
- `ClockAdapter`: device-local dates and monotonic scheduling where required.
- `MapAdapter`: style/provider configuration, attribution and native/web key restrictions.

Select native implementations behind `Capacitor.isNativePlatform()` in adapter modules only. Feature views must never call Capacitor or native APIs directly. Add adapter contract tests against a mock native adapter before switching.

## Candidate Capacitor packages to evaluate

Pin mutually compatible stable versions after reviewing current Capacitor major-version compatibility:

- `@capacitor/core`, `@capacitor/cli`
- `@capacitor/geolocation`
- `@capacitor/haptics`
- `@capacitor/local-notifications`
- `@capacitor/preferences`
- `@capacitor/app`
- Optional file-system/share plugins if required for documents and backups.

The present browser implementation does not import these packages. Do not add them until the app is moved to the intended React/TypeScript build and native behavior is validated.

## Android permission and manifest review

Review the actual plugin manifests and target SDK before adding permissions. Candidate Android declarations may include:

- `android.permission.ACCESS_COARSE_LOCATION`
- `android.permission.ACCESS_FINE_LOCATION`
- `android.permission.POST_NOTIFICATIONS` (Android 13+ runtime permission)
- `android.permission.VIBRATE`
- `android.permission.RECEIVE_BOOT_COMPLETED` only if a reviewed scheduling design genuinely requires it.
- `ACCESS_BACKGROUND_LOCATION` only if background geofencing is explicitly approved, implemented, justified to users and compliant with current Play policy. It is not required for this web phase.

Do not request background location merely to keep the web prototype running. Do not add foreground-service location permissions unless a reviewed native service architecture requires them. Update Android permission rationale screens and test denied, approximate, one-time and revoked states.

## iOS Info.plist review

Potential purpose strings to review with product/legal before inclusion:

- `NSLocationWhenInUseUsageDescription` — explain parent-phone location and foreground Safe Zone behavior.
- `NSLocationAlwaysAndWhenInUseUsageDescription` — only if background location is actually implemented and approved.
- `NSUserNotificationsUsageDescription` is not a standard iOS Info.plist permission key; request notification permission through `UNUserNotificationCenter` with an in-app rationale.
- `NSPhotoLibraryUsageDescription` / `NSCameraUsageDescription` only if the selected evidence-attachment flow actually needs those native access paths.

No background location mode should be enabled until the approved feature, user disclosures, power behavior and App Store policy case are documented.

## Background geofencing decision

Evaluate two options before implementation:

1. A maintained Capacitor geofencing plugin with clear OS-version support, maintenance history, permission behavior, battery characteristics and event-delivery semantics.
2. A small custom Kotlin/Swift bridge around the platform location/geofencing APIs if no maintained plugin meets the requirements.

For either option, specify enter/exit/dwell behavior, persistence across process death, reboot handling, permission revocation, approximate location, offline behavior, duplicate suppression, stale events and battery impact. Keep the current §17.6 thresholds as initial values only; field-test them. Never display background monitoring as active unless the native implementation confirms registration and permission state.

## Map keys and attribution

- Keep web `VITE_MAP_STYLE_URL` restricted to the production HTTPS origin.
- Use a separate native-restricted key or provider mechanism for Android/iOS; do not reuse a broadly unrestricted browser key.
- Confirm MapTiler's current terms, billing/quota and required attribution for the selected style/tiles.
- Preserve provider and OpenStreetMap attribution in every native map surface.

## Service worker in native shells

A native WebView does not need the PWA service worker by default. Add an explicit native build flag that skips service-worker registration and unregisters any previously installed worker on migration. Test cache invalidation, deep links and offline behavior separately in web and native targets.

## Moving local data into the native app

1. Before migration, export a SafeKid backup ZIP in the web app.
2. In the native app, use a tested file picker/share/import path to read the backup JSON entry.
3. Validate app identifier, schema version, required stores and record structure before writing.
4. Convert existing IndexedDB rows to the native storage schema in a versioned transaction; preserve record IDs, timestamps, provenance and taskOccurrence/reward links.
5. Convert document blobs without losing MIME type or metadata.
6. Do not merge or overwrite silently. Show the user a preview and explicit restore confirmation.
7. Verify row counts/checksums and allow export after migration. Retain the original backup until the user confirms success.

## Store-review and privacy checklist

- Provide clear foreground/background location explanations and permission rationale.
- Describe same-device SOS limitations plainly; do not imply emergency-service delivery.
- Explain notification, audio, haptics and data retention behavior.
- Request only permissions necessary for implemented features.
- Ensure no account/analytics/network collection is introduced without an explicit privacy/design decision.
- Review App Store/Play policies current to the actual release date.

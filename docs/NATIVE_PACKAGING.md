# SafeKid: packaging the current main web app for Android and iOS

This is a **packaging-only** approach. The HTML, CSS, breakpoints, route logic, and JavaScript app are unchanged. There is no backend, LTE/watch emulation or new native SOS/location implementation.

## Outputs

- Android GitHub Actions job: **debug APK** in the `safekid-android-debug-apk` artifact (for local installation/testing).
- iOS job: **unsigned Simulator .app** in `safekid-ios-simulator-app` (not installable on a physical iPhone). Building a signed app for a real iPhone requires macOS, Xcode and appropriate Apple code signing / provisioning; App Store distribution requires Apple Developer Program membership.

## Build locally

Requires Node.js 22+, Android Studio/SDK for Android, macOS/Xcode for iOS.

```bash
npm run build
npm install --no-save --no-package-lock @capacitor/core@7 @capacitor/cli@7 @capacitor/android@7 @capacitor/ios@7
npx cap add android
npx cap add ios # run on macOS
npx cap sync
npx cap open android
npx cap open ios # run on macOS
```

The GitHub Action generates native project folders only in its ephemeral runner; this repository intentionally doesn't commit generated native projects.

## Viewports and responsive design

Capacitor uses a native WebView; existing CSS media queries still respond to its viewport width. The original `viewport-fit=cover` meta tag and the four CSS files remain unchanged. This does **not** establish actual device compatibility. Check small phones (320/360/390/430 CSS px), larger phones, tablets, landscape, status bars, safe areas, virtual keyboards, map rendering, and all routes on actual Android/iOS devices before release.

## Limitations retained from main

- GPS and Safe Zones refer to the **parent phone**, not a child's watch.
- SOS is local to the running device and does not send emergency alerts remotely.
- Web notification/audio APIs may behave differently in native WebViews. Background geofencing, background alerts, LTE pairing and push are not implemented.
- IndexedDB storage is isolated per app installation; data in an existing browser PWA does not automatically migrate to the native shell.
- Maps use MapLibre/MapTiler and require live connectivity / compatible API key restrictions.
- Browser service workers and file download/import may not behave identically in WebViews. Test them before relying on them for offline/backup functionality.
- The workflow builds only debug Android and unsigned iOS Simulator outputs. No signed iOS IPA is generated.

## Workflow

Open GitHub Actions -> "Package SafeKid Android and iOS" -> Run workflow on the packaging branch. Inspect BOTH job logs and artifacts. A green web test suite is not a replacement for on-device tests. Merge the packaging config only after successful QA.

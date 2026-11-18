# SafeKid Parent App

[Tiếng Việt](../README.md) · [Web app](https://fynisfl.github.io/SafeKid-Parent-App-/) · [Android test builds](https://github.com/FynisFL/SafeKid-Parent-App-/actions/workflows/native-package.yml)

SafeKid is a local-first JavaScript SPA for parents, available as a web/PWA build and as a Capacitor Android test app. Profiles, events and settings are stored in IndexedDB on the current device. Web and APK storage are separate, and the app does not encrypt IndexedDB at rest. Use Settings to export and restore backups.

## Current capabilities

- **Location and Safe Zones.** The map shows the phone running SafeKid. Manage boundaries in Safe Zones. Entry and exit evaluation requires location access while the app is open.
- **SOS.** Events, alarms and supported notifications are local to the device. SOS does not notify another device or emergency services. Call and message links use system handlers after user action.
- **Growth.** Manage routines, tasks and family rewards. The Android app can schedule local reminders with permission. The web app checks reminders while open.
- **Watch Passport Lite** stores manually entered device records without pairing. **S.F AI** answers from approved content and local rules and can suggest app destinations.

## Web development

Use Node.js 22 to match CI. No npm dependency installation is needed for the web server, static build or JavaScript checks.

```bash
npm run dev
npm run build
npm run preview
```

Dev and preview listen on [localhost:4173](http://localhost:4173). Deploy the contents of `dist/` over HTTPS. The GitHub Pages workflow deploys from `main`. To override the bundled map style, copy `.env.example` to `.env` and set `VITE_MAP_STYLE_URL`. Restrict the public browser key in MapTiler. Map and place search requests can reveal the viewed area or query to the provider and require network access.

## Android test app

Download the `safekid-android-phone-test` artifact from a successful [Android workflow run](https://github.com/FynisFL/SafeKid-Parent-App-/actions/workflows/native-package.yml). To build locally, install Node.js 22, JDK 21 and the Android SDK. Skip `npx cap add android` on subsequent builds if `android/` already exists.

```bash
npm ci
npm run build:native
npx cap add android
npx cap sync android
node scripts/configure-native.mjs
cd android
./gradlew assembleDebug
```

Use `.\gradlew.bat assembleDebug` in Windows PowerShell. The APK is generated at `android/app/build/outputs/apk/debug/app-debug.apk`. Its package ID is `com.safekid.parent.test`. CI debug signatures may differ across builds. Back up data before uninstalling an older build if Android rejects an update. The repository has Capacitor configuration for iOS but no iOS device distribution workflow.

## Source layout and checks

`src/main.js` wires startup, state, routes and rendering. `src/domain/` holds pure rules, `src/adapters/` wraps platform and storage APIs, `src/services/` handles geocoding and backups, and `src/ui/` holds reusable interaction behavior. `native/` contains the Capacitor entry point and Android customization. CSS loads from `styles.css`, `mobile-refinements.css`, `motion.css` and `responsive.css` in that order. Update browser module entries and the cache revision in `sw.js` when adding a module to the app shell.

Run `npm run typecheck` (JavaScript syntax), `npm run lint`, `npm test` and `npm run build`. For browser E2E, install Python Playwright and Chromium, start `npm run dev` and run `npm run test:e2e` separately. Browser fixtures do not validate real map provider behavior, system permissions or device audio. See the [device checklist](UAT_CHECKLIST.md) and [source audit](SOURCE_AUDIT.md).

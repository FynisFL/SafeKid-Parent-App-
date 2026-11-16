# 12 — Build and Distribution

## 1. Prerequisites
- Node.js 22 or newer (use the supported project toolchain and record exact version).
- npm (or another single package manager; choose one and commit its lockfile).
- Android Studio + Android SDK for local Android native builds.
- macOS + Xcode for local iOS native builds. Cloud build services may build iOS, but Apple signing credentials and distribution setup are still required.
- Apple Developer Program membership for standard TestFlight/App Store/Ad Hoc distribution.

## 2. Web demo
- Build with `npm run build`.
- Deploy the `dist/` output to a static host (e.g. Vercel, Netlify, Cloudflare Pages or an existing project host).
- Configure SPA route rewrites to `index.html`.
- Enable HTTPS.
- Provide QR code to the root URL.
- PWA manifest, icons, theme color and service-worker strategy must be configured.

## 3. Android APK
- Add Capacitor Android platform.
- Sync web build into native project.
- Build a signed release APK with Android Studio/Gradle.
- APK must use a stable application ID and version code.
- Share APK through a trusted download host with version and SHA-256 checksum.
- For Google Play distribution, produce an AAB instead of the directly installable APK.

## 4. iOS
An `.ipa` is a signed distribution package, not a universal file that can be downloaded and installed by any iPhone without provisioning.

Recommended routes:
- **TestFlight:** preferred for external demo testers. Upload signed build to App Store Connect, create external test group, and distribute invitation/public link after required beta review.
- **Ad Hoc:** for a small set of known devices registered in the Apple Developer account; provisioning limits apply.
- **App Store:** later public release after App Review and required product/privacy preparation.

Do not treat Apple Developer Enterprise distribution as a general public sideloading method; it is intended for qualifying internal organizational use.

## 5. PWA notes
- Web demo is the universal fallback for users who cannot or do not want to install the native app.
- Home-screen installation behavior and browser APIs vary by platform.
- PWA does not equal an iOS IPA and should not be described as identical to native app capabilities.
- Web notification behavior varies; use in-app alert fallback and do not promise reliable background SOS delivery.

## 6. Capacitor commands (illustrative)
The Coding Agent must verify commands against the installed Capacitor major version and project configuration.

```bash
npm install
npm run build
npx cap add android
npx cap add ios
npx cap sync
npx cap open android
npx cap open ios
```

## 7. Environment and signing
- Keep signing credentials outside Git.
- Include `.env.example`, never real secrets.
- Document Android keystore ownership/backup securely.
- Document Apple bundle ID, team ID and provisioning setup without committing certificates/private keys.
- Do not claim APK/IPA creation is complete until the artifact exists and installs on a physical device.

## 8. Release naming
Use semantic app versions plus build number, e.g. `1.0.0-demo.1`. Display “Demo” in settings/build metadata until production release.

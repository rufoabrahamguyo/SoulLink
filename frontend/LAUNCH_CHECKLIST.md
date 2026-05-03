# SoulLink — store launch checklist

All mobile app paths live under **`frontend/`** (React Native / Expo).

The API lives under **`backend/`** (Django). Run `python3 -m pip install -r backend/requirements.txt`, then `npm run api` from the repo root (or `cd backend && python3 manage.py runserver 0.0.0.0:8000`).

Use this before first Google Play and App Store submissions.

## Identity and versioning

- [ ] Confirm `expo.ios.bundleIdentifier` and `expo.android.package` in **`frontend/app.json`** match the IDs registered in Apple Developer and Google Play Console.
- [ ] Bump `expo.version` for each user-facing release.
- [ ] Bump `ios.buildNumber` and `android.versionCode` for each store upload (or rely on EAS `autoIncrement` for production builds).

## Secrets and config

- [ ] Keep real keys only in `.env` (gitignored). Use `.env.example` as the template.
- [ ] **Google Sign-In:** `.env` has `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (Web client) and `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` (iOS OAuth client). Android OAuth client uses **release** package name + **Play App Signing** SHA-1. `iosUrlScheme` in `app.json` plugin matches the iOS client’s reversed scheme.
- [ ] Do not commit `google-services.json`, keystores, or App Store Connect API keys unless you use a documented secrets workflow.

## EAS (recommended for builds)

1. From repo root: `npm install`. For EAS: `cd frontend && npx eas login`
2. From **`frontend/`**: `npx eas init` — links the project and can add `extra.eas.projectId` to `app.json`
3. **Internal testing:** `cd frontend && npx eas build --profile preview --platform android` (or `ios`)
4. **Store release:** `cd frontend && npx eas build --profile production --platform all`
5. **Submit:** `cd frontend && npx eas submit --profile production --platform android` (and `ios` after Apple setup)

## Google Play

- [ ] Play Console app created with the same `applicationId` as `android.package`
- [ ] Privacy policy URL (required if you collect data or use sign-in)
- [ ] Data safety form, content rating, store listing (graphics, descriptions)
- [ ] Upload **AAB** (production profile uses `app-bundle`)

## App Store

- [ ] App ID registered in App Store Connect with the same bundle ID as `ios.bundleIdentifier`
- [ ] `ITSAppUsesNonExemptEncryption` in `app.json` — set to `false` only if you do not use non-exempt encryption beyond standard HTTPS (adjust if you add custom crypto)
- [ ] Privacy nutrition labels, App Privacy details, screenshots, review notes
- [ ] Paid Apple Developer Program membership

## Quality

- [ ] Test release builds on real devices (not only Expo Go).
- [ ] Crash reporting (e.g. Sentry) for production.
- [ ] Terms of service / privacy policy URLs in-app or on the store listing as required by your jurisdiction and store policies.

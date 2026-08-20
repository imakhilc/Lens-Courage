# Lens Courage

Android-first React Native app for building camera confidence through small, private daily recording challenges.

## Phase 1 delivery plan

Work follows the milestones in `LENS_COURAGE_PHASE1_SPEC.md`; a milestone is only considered complete after its acceptance path is verified.

1. **App shell** — React Native CLI TypeScript project, Android theme and navigation, Firebase bootstrap, Google authentication, onboarding persistence, challenge seeding, and Today landing state.
2. **Core challenge experience** — Today and Path, challenge detail, VisionCamera recording/preview/retry/accept, and local session creation.
3. **Authoritative progression** — idempotent callable completion, Courage Points, local-date streaks, progression unlock, and immediate celebration independent of AI.
4. **Gamification** — deterministic daily quests, Monday–Sunday weekly challenge, badges, Progress/Me views, and reduced-motion-aware reward animation.
5. **AI coach** — Android `MediaExtractor`/`MediaMuxer` audio extraction, temporary audio-only upload, Genkit/Gemini structured feedback, retries, and local/cloud cleanup.
6. **Notifications and polish** — reminder permission/scheduling, FCM, Remote Config, Analytics, Crashlytics, App Check, accessibility, offline queues, and explicit error recovery.
7. **Release candidate QA** — physical Android, low-end device, permissions, offline/interruption, AI timeout, restart, and timezone-boundary checks.

Current status: **Milestone 1 complete; Milestone 2 in progress.** The live Firestore project contains all 30 seeded challenges. Today and Path consume that catalog, challenge detail is implemented, and the Android VisionCamera record/preview/retry/accept flow works on a physical device. Audio playback, automatic maximum-duration stop, and local-session restoration after a full app restart are verified. Keep-awake and background-interruption handling remain before Milestone 2 is marked complete.

No Phase 1 feature is intentionally omitted. Items that cannot be completed safely will be recorded in **Blockers and TODOs** below with the affected acceptance criterion.

## Dependency choices

The project uses npm with a committed lockfile and pins direct dependencies to exact versions. The initial baseline is:

- React Native CLI `0.87.0`, React `19.2.3`, TypeScript `6.0.3`, Hermes, Android min SDK 26, target SDK 36, and compile SDK 37 (the RN 0.87 template default, compatible with the target-36 requirement).
- React Navigation 7: `@react-navigation/native` `7.3.17`, `@react-navigation/native-stack` `7.18.9`, and `@react-navigation/bottom-tabs` `7.18.17`, backed by `react-native-screens` `4.27.0` and `react-native-safe-area-context` `5.9.1`.
- Firebase native SDK bridge `@react-native-firebase/*` `26.2.0` for App, Auth, Firestore, Storage, Functions, Analytics, Crashlytics, Messaging, Remote Config, and App Check; Google login uses `@react-native-google-signin/google-signin` `16.1.4`.
- Camera: `react-native-vision-camera` `5.2.2`, `react-native-nitro-modules` `0.36.5`, and `react-native-nitro-image` `0.15.1`. Recorded-take playback uses the new-architecture `react-native-video` `7.0.0-beta.11`; v6 targets Media3 1.8 while VisionCamera's CameraX stack resolves Media3 1.9, which causes a native `DefaultLoadControl` linkage crash on preview. The full Android native build succeeds on React Native `0.87.0`.
- Motion/state/local persistence: React Native Animated/Reanimated 4 (added when Milestone 4 begins), Zustand `5.0.15`, and `@react-native-async-storage/async-storage` `3.1.1`.
- Icons: `lucide-react-native` `1.33.0` with `react-native-svg` `15.15.5`; no copied third-party brand or mascot assets.
- Cloud Functions: Firebase Functions v2, Admin SDK, Genkit, and the Google AI Genkit plugin, with Zod schemas and Vitest tests.

If the generated React Native template or peer dependency metadata requires a patch-level adjustment, `package.json` and this section will be updated together and the reason documented.

## UI implementation notes

- The supplied `ui_reference/` mockups define hierarchy, spacing, rounded surfaces, and visual tone.
- Primary actions on onboarding, challenge detail, and similar focused flows use a reusable safe-area-aware floating action dock just above the bottom of the screen.
- Tab screens render edge-to-edge behind the floating four-item pill tab bar while their scroll content retains safe start/end spacing.
- Raw video remains local by default. Only temporary extracted audio is uploaded for coach processing.

## Firebase setup

Milestone 1 requires an Android Firebase app configuration at `android/app/google-services.json`. The file is intentionally gitignored. Without project credentials the app runs a clearly labelled local preview mode for UI development; anonymous authentication and Firestore persistence require the real configuration.

Challenge data is sourced from `seed/challenges.json`, never duplicated in screen components. The seed command and emulator/project instructions are added with the Milestone 1 implementation.

## Commands

From the repository root:

```sh
npm install
npm run android
npm run lint
npm test
npm run seed:challenges
npm run typecheck
```

## Blockers and TODOs

- **Firebase console setup:** Google must be enabled under Authentication → Sign-in method, and the debug/release SHA-1 fingerprints must be registered for `studio.brittle.lenscourage`. Firestore must have a `(default)` database before profile creation can complete.
- **Dependency audit:** npm reports nine high-severity `image-size` denial-of-service advisories through React Native 0.87's pinned Metro toolchain. npm's only automatic remedy currently downgrades `@react-native/metro-config` to 0.86.2, a breaking template mismatch, so no unsafe `npm audit fix --force` was applied. Recheck when the RN 0.87 Metro patch is published; this parser is build tooling and receives no app/user media at runtime.
- **Milestone 2 remaining work:** implement and physically verify keep-awake behavior and safe background/interruption handling while recording. Physical-device audio playback, automatic maximum-duration stop, and accepted local-session restoration after a full app restart are verified.
- Milestones 3–7 remain pending. The current Milestone 2 accepted-take screen intentionally does not award CP or advance progression; those mutations become idempotent and server-authoritative in Milestone 3.
# Lens-Courage

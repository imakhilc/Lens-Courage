# Codex start prompt

Build the Android Phase 1 of **Lens Courage** in React Native + TypeScript.

Before writing code, read these files in full:

1. `LENS_COURAGE_PHASE1_SPEC.md`
2. `ui_reference/00_contact_sheet.png`
3. All individual PNGs in `ui_reference/`
4. `seed/challenges.json`
5. `firebase/firestore.rules`
6. `firebase/storage.rules`

Important constraints:

- Android first. Do not implement iOS yet.
- Firebase is the backend: Auth, Firestore, Storage, Functions, Analytics, Crashlytics, Messaging, Remote Config, App Check.
- Use anonymous Firebase Auth for the first-run MVP.
- Use React Native VisionCamera for recording unless there is a documented compatibility blocker.
- Keep raw video local by default. Upload only temporary extracted audio for AI coach processing.
- Use Cloud Functions + Firebase Genkit/Gemini for structured AI feedback.
- The main product loop is: challenge → camera → accept take → instant reward → AI feedback → next path node.
- AI failure must never prevent challenge completion, CP, streak, or progression.
- Build the gamification specified in the spec: Courage Points, streak, levels, daily quests, weekly challenge, badges, stage path, boss challenges.
- Do not copy Duolingo assets, characters, branding, or exact UI. Use the Lens Courage mockups as the source of truth for visual direction.
- Keep authoritative progression/rewards server-side and idempotent.
- Do not silently omit scope. Document blockers/TODOs.

Work milestone-by-milestone as defined in the spec. First create/update the project README with the implementation plan and exact dependency choices, then begin Milestone 1.

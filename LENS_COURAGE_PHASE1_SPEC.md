# Lens Courage — Phase 1 Android Product + Engineering Specification

> **Purpose:** This document is intended to be handed directly to Codex to build the first Android version of Lens Courage in React Native.
>
> **Core promise:** Help camera-shy people become comfortable recording themselves and eventually vlogging in public through small, progressively harder camera challenges, game-like progression, streaks, rewards, and lightweight AI coaching.

---

## 0. Codex instructions — read this first

Build **Phase 1 only**. Do not add social feeds, followers, public profiles, leaderboards, iOS support, subscriptions, or complicated computer vision yet.

The Phase 1 app should prove one loop extremely well:

**Open app → see today's challenge → record → finish → receive AI feedback → earn Courage Points → progress on path → return tomorrow.**

Priorities, in order:

1. Reliable Android camera/video recording.
2. Delightful challenge completion flow.
3. Duolingo-like progression/gamification without copying Duolingo branding or visual assets.
4. Firebase-backed state and content.
5. Lightweight AI feedback on speaking.
6. Clean, polished UI matching the reference direction in `/ui_reference`.
7. Resilient offline/error behavior.

If an implementation detail in this document conflicts with a library limitation, choose the simplest reliable implementation and document the change in the project README.

---

# 1. Product overview

## Product name

Working name: **Lens Courage**

This can be renamed later. Do not over-couple code to the display name.

Suggested Android package placeholder:

`com.lenscourage.app`

## One-line pitch

**A daily confidence game that trains you to become comfortable talking to a camera — from your bedroom to a busy public place.**

## Target user

Primary:

- Wants to vlog, make Reels/Shorts, create UGC, or speak on camera.
- Feels awkward watching themselves or speaking to a lens.
- Avoids recording in public because they feel watched.
- Wants a structured progression rather than generic advice.

Secondary:

- People improving presentation confidence.
- New creators.
- Students/job-seekers who dislike recording themselves.

## Main transformation

The app should feel like:

> **Day 1:** “Say one sentence to the camera alone.”
>
> **Day 30:** “Record a real 2-minute mini-vlog in a public place.”

The product is the progression from low-pressure private recording to comfortable public recording.

---

# 2. Phase 1 goals

Phase 1 must answer these questions:

1. Do users complete camera-confidence challenges repeatedly?
2. Do streaks, XP-style rewards, badges, and progression increase return rate?
3. Does simple AI coaching make users want to do another recording?
4. Does the 30-level progression feel achievable instead of intimidating?

## Phase 1 success behavior

A successful user session looks like:

1. User opens app.
2. Home immediately shows one obvious CTA: **Start today's challenge**.
3. User reads a simple mission.
4. User records 10–120 seconds.
5. App marks challenge complete even if AI processing fails.
6. Celebration animation appears.
7. User earns Courage Points.
8. AI feedback appears shortly after.
9. Next path node unlocks.
10. User sees progress toward streak/badge/weekly chest.

---

# 3. Phase 1 non-goals

Do **not** build these yet:

- iOS.
- App Store / Play subscriptions.
- RevenueCat.
- Public profiles.
- Followers/friends.
- Social feed.
- Competitive leaderboard.
- User-to-user messaging.
- Live coaching.
- Face-emotion recognition.
- “Confidence percentage” inferred from facial expression.
- Posture scoring.
- Hand gesture computer vision.
- Background-person detection.
- Automatic verification that a user is truly outside/in a café.
- Advanced video editing.
- Cloud video library.
- Public video sharing.
- AI-generated scripts longer than short challenge prompts.

Architect code cleanly so subscriptions and iOS can be added later.

---

# 4. Design direction

The source images supplied with this handoff are in `/source_refs`.

Use them only as **interaction/design inspiration**, not as assets to copy.

### We want to borrow

From the Soft75-style reference:

- Airy background.
- Large rounded cards.
- Clear “Day X” identity.
- Friendly gradients.
- One obvious primary action.
- Progress visually visible near the top.

From Duolingo-style references:

- Strong progression.
- Daily quests.
- Weekly goals.
- Streak milestones.
- Reward moments.
- Badge collection.
- Locked/unlocked path nodes.
- Chunky buttons that feel tappable.

### We must NOT copy

- Duolingo owl or characters.
- Duolingo exact colors/layout.
- Duolingo wording.
- Exact badge art.
- Exact quest presentation.
- Exact streak UI.

Lens Courage needs its own identity.

---

# 5. Lens Courage visual system

Use these as implementation tokens.

## Colors

```ts
export const colors = {
  background: '#F6F7FB',
  surface: '#FFFFFF',
  ink: '#252B3A',
  muted: '#7D859B',
  border: '#E8EAF1',

  primary: '#7259FF',
  primaryDark: '#5B45E6',
  primarySoft: '#EEEAFE',

  coral: '#FF6B72',
  teal: '#3BC5B5',
  yellow: '#FFC857',
  blue: '#5C91F2',
  green: '#48B97A',

  cameraBlack: '#111218',
  danger: '#E8505B',
};
```

## Typography

Android first. Use system font / Roboto.

Recommended hierarchy:

- Display: 30–34sp, weight 800.
- Screen title: 26–30sp, weight 800.
- Card title: 20–22sp, weight 700/800.
- Body: 15–17sp, weight 400/500.
- Caption: 12–14sp, weight 500/600.
- Button: 16–18sp, weight 800.

Avoid thin font weights.

## Shape

- Main cards: radius 24dp.
- Small cards: radius 18dp.
- Primary buttons: radius 18dp.
- Chips: radius 999dp.
- Path nodes: circular.

## Buttons

Primary buttons should feel game-like:

- Filled primary color.
- Slightly darker 4dp bottom edge/shadow.
- Pressed state moves down ~2dp and reduces bottom edge.
- Strong label.
- Minimum 52dp height.

## Motion

Phase 1 should have lightweight animations:

- XP number count-up.
- Path node unlock bounce.
- Challenge completion confetti.
- Streak badge pulse.
- Progress bar animate from old to new value.
- Button press scale 0.98.

Do not block interaction with long animations.

---

# 6. Navigation

Use React Navigation.

## Root stack

```txt
Splash
OnboardingStack
MainTabs
ChallengeDetail
Recording
Processing
Feedback
Celebration
BadgeDetail
Settings
```

## Bottom tabs

Phase 1 has four tabs:

1. **Today**
2. **Path**
3. **Progress**
4. **Me**

Do not create a fifth tab unless necessary.

---

# 7. React Native technical stack

## Base

- React Native CLI.
- TypeScript.
- Android first.
- Hermes enabled.
- `minSdk` 26.
- Use a current Play-compliant compile/target SDK supported by the React Native version; prefer 36 when compatible.

## Suggested libraries

```txt
@react-navigation/native
@react-navigation/native-stack
@react-navigation/bottom-tabs

react-native-vision-camera
react-native-permissions (if required by chosen camera setup)
react-native-reanimated
react-native-safe-area-context
react-native-screens

@react-native-async-storage/async-storage

@react-native-firebase/app
@react-native-firebase/auth
@react-native-firebase/firestore
@react-native-firebase/storage
@react-native-firebase/functions
@react-native-firebase/analytics
@react-native-firebase/crashlytics
@react-native-firebase/messaging
@react-native-firebase/remote-config
@react-native-firebase/app-check
```

For icons, use a maintained vector icon package or local SVG icons.

Do not bring in a heavy UI kit.

## State management

Keep it simple.

Recommended:

- React Context for auth/bootstrap.
- Zustand for transient app state OR plain hooks if sufficient.
- Firestore remains source of truth for user progress.

Do not mirror the entire Firestore database into Redux.

---

# 8. Firebase architecture

The user wants Firebase to be the backbone of Phase 1.

Use:

- **Firebase Authentication** — anonymous auth initially; optional Google upgrade can be added behind a feature flag.
- **Cloud Firestore** — challenges, progress, sessions, badges, settings.
- **Firebase Storage** — temporary audio uploaded for AI analysis.
- **Cloud Functions for Firebase** — server-authoritative rewards and AI processing.
- **Firebase Genkit + Gemini** — AI speech feedback.
- **Firebase Analytics** — funnel and retention events.
- **Firebase Crashlytics** — crash reporting.
- **Firebase Cloud Messaging** — challenge reminder notifications.
- **Firebase Remote Config** — experiment values and feature flags.
- **Firebase App Check** — protect callable functions/storage where practical.

## Important privacy rule

**Do not upload the user's recorded video by default.**

The raw video remains on the Android device.

For AI feedback:

1. Record video locally.
2. Extract the audio track locally into a temporary `.m4a`/AAC file using a small Android native module built with `MediaExtractor`/`MediaMuxer` if needed.
3. Upload only the temporary audio file to Firebase Storage.
4. Run AI analysis.
5. Persist text/metrics result in Firestore.
6. Delete the cloud audio object automatically after successful/failed processing.
7. Delete the local temporary audio file.

If local audio extraction becomes the only thing blocking MVP delivery, Phase 1 may temporarily upload the locally recorded file for server-side analysis, but this must be clearly marked as a temporary implementation and the object must auto-delete. Prefer audio-only.

---

# 9. Authentication and onboarding

## Authentication strategy

On first launch:

1. Firebase initializes.
2. If no user exists, sign in anonymously.
3. Create `users/{uid}`.
4. Show onboarding.

This removes login friction.

Future Google sign-in should link the anonymous account rather than create duplicate progress.

## Onboarding screens

### Screen O1 — Welcome

Headline:

**Get comfortable on camera, one tiny challenge at a time.**

Supporting text:

“No posting. No audience. Just small daily reps that get a little braver.”

CTA: **Start my first rep**

### Screen O2 — Current comfort

Question:

**How does talking to a camera feel right now?**

Options:

- 😵 I avoid it.
- 😬 I can do it alone.
- 🙂 I can record, but I overthink it.
- 😎 I want public-vlogging confidence.

Store numeric `startingComfortLevel` 1–4.

This changes copy only in Phase 1; do not build complex personalization yet.

### Screen O3 — Goal

Question:

**What do you want Lens Courage to help with most?**

Options:

- Vlogging in public.
- Talking naturally to camera.
- Making Reels/Shorts.
- All of the above.

### Screen O4 — Reminder

Question:

**When should we nudge you?**

Options:

- Morning.
- Afternoon.
- Evening.
- Choose time.
- Not now.

Request notification permission only after the user chooses to receive reminders.

### Screen O5 — First challenge preview

Show Challenge #1 card and CTA:

**Begin Day 1**

---

# 10. Core gameplay loop

## User loop

```txt
HOME
 ↓
CHALLENGE DETAIL
 ↓
CAMERA / RECORD
 ↓
COMPLETE
 ↓
CELEBRATION + CP
 ↓
AI PROCESSING
 ↓
FEEDBACK
 ↓
NEXT NODE UNLOCKED
```

## Important rule

Completing the recording completes the challenge.

AI is a bonus layer and must never prevent completion.

If AI fails:

- award Courage Points anyway;
- preserve streak;
- unlock next challenge;
- show “Coach feedback is taking longer than usual” with retry.

---

# 11. Gamification model

The app should feel inspired by successful learning games but stay psychologically supportive.

We are not punishing users with lives/hearts in Phase 1.

## Currency: Courage Points (CP)

CP is Lens Courage's XP.

### Default rewards

- Complete a normal challenge: **+20 CP**.
- Boss challenge: **+40 CP**.
- First challenge of the day: included in the base reward; do not double-award.
- Finish a designated one-take challenge without restarting: **+5 CP bonus**.
- Review AI feedback: **+5 CP**, once per session.
- Complete all 3 daily quests: **+20 CP chest bonus**.

Rewards must be server-authoritative through a callable Cloud Function or Firestore transaction.

## Player level

Simple Phase 1 formula:

```txt
Level 1 = 0–99 CP
Level 2 = 100–199 CP
Level 3 = 200–299 CP
...
```

`level = floor(totalCP / 100) + 1`

Display progress to next level.

## Streak

A streak day is earned when the user completes at least one unlocked main challenge on that local calendar date.

Fields:

- `currentStreak`
- `longestStreak`
- `lastStreakDate` in `YYYY-MM-DD` using stored timezone.

Rules:

- Same date completion does not increase streak more than once.
- Consecutive local date increments by 1.
- If one or more calendar days were missed, streak resets to 1 on next completion.
- Do not implement streak freeze in Phase 1.

## Daily quests

Show three daily quests on the Today screen.

Phase 1 quest pool examples:

1. Complete today's main challenge.
2. Review your coach feedback.
3. Complete one practice retry OR record at least 30 seconds total.
4. Complete a no-retake challenge if currently available.
5. Earn 25 CP today.

Daily quests reset based on user's timezone.

Do not make quest generation random on the client. Generate/select server-side or deterministic by date.

## Weekly challenge

One simple weekly mission:

**Complete 5 main challenges this week.**

Progress: `0 / 5`.

Reward:

- Weekly chest animation.
- +75 CP.
- “Five Reps Week” badge the first time.

Week should use locale-independent Monday–Sunday logic for Phase 1.

## Badges

Phase 1 badges:

1. **First Rep** — complete first challenge.
2. **Three in a Row** — 3-day streak.
3. **Seven-Day Lens** — 7-day streak.
4. **One-Take Wonder** — finish a one-take challenge.
5. **Outside Voice** — complete first outdoor-stage challenge.
6. **People Exist** — complete first “people around” stage challenge.
7. **Five Reps Week** — complete weekly challenge.
8. **Halfway Brave** — complete challenge 15.
9. **Public Mode** — complete challenge 22.
10. **Lens Courage Graduate** — complete challenge 30.

Badge art should be abstract camera/lens/light/motion symbols — no mascot required in Phase 1.

## Boss challenges

Every stage ends with a visually special challenge node.

Boss challenges:

- #7
- #14
- #21
- #30

Use larger path node, special gradient, +40 CP.

---

# 12. Challenge progression

The progression is challenge-based, not calendar-locked.

If the user misses three days, they continue from their next challenge; they do not skip content.

## Stage 1 — Solo Lens

Goal: remove initial discomfort of seeing yourself and speaking directly to a lens.

Challenges 1–7.

## Stage 2 — One Take

Goal: reduce perfectionism and retake dependency.

Challenges 8–14.

## Stage 3 — Step Outside

Goal: move recording from fully private spaces into low-pressure outdoor settings.

Challenges 15–21.

## Stage 4 — People Around

Goal: continue recording even when other people may be nearby.

Challenges 22–30.

Full seed data is supplied separately in `/seed/challenges.json`.

---

# 13. 30 challenge content summary

## Stage 1 — Solo Lens

### 1. Just Say Hi

Duration: 10–20 sec.

Prompt:

“Look into the lens and say your name, then one thing you did today.”

Rules:

- Front camera.
- No need to rewatch.

### 2. Twenty Seconds

“Talk for 20 seconds about something you like.”

### 3. Your Day in 30

“Tell the camera the most interesting part of your day in 30 seconds.”

### 4. No Delete

“Record 30 seconds. Finish the thought before judging it.”

One-take bonus enabled.

### 5. Explain a Favorite

“Pick a movie, food, game, place, or hobby. Explain why you like it.”

### 6. Stand Up

“Record standing up and keep your eyes near the lens.”

### 7. Boss: One-Minute Recap

“Give a one-minute recap of your day in one recording.”

---

## Stage 2 — One Take

### 8. Start Immediately

“Press record and begin your first sentence within three seconds.”

### 9. No ‘Hey Guys’

“Start a video without ‘hey guys’, ‘so’, or an apology.”

### 10. Tiny Story

“Tell a story with a beginning, middle, and end in 60 seconds.”

### 11. Use the Pause

“After your first sentence, pause for one full second before continuing.”

### 12. Slow It Down

“Explain something simple while deliberately speaking 10% slower.”

### 13. Hands in Frame

“Record with your hands naturally visible. Don't force gestures.”

No automated hand analysis in Phase 1; this is an instruction only.

### 14. Boss: 90 Seconds, One Take

“Talk for 90 seconds about something you genuinely care about. No restart.”

---

## Stage 3 — Step Outside

Users can tap **Swap challenge** if a location is unsafe/unavailable. Phase 1 can provide one fallback prompt for outdoor challenges.

### 15. Near the Outside

“Record near an open window, balcony, or doorway for 30 seconds.”

### 16. Just Outside

“Step outside your room/home/building and record 30 seconds.”

### 17. Quiet Outdoor Spot

“Find a comfortable outdoor spot and talk for 45 seconds.”

### 18. Walk and Talk

“Walk slowly while recording for 30 seconds.”

### 19. Let the Background Move

“Record somewhere with normal movement behind you. Keep talking.”

### 20. Public Place, Quiet Corner

“Record a short clip from a low-pressure public place.”

Examples in supporting copy: park, building lobby, quiet café corner, campus.

### 21. Boss: Outdoor One-Take

“Record 60 seconds outside without restarting.”

---

## Stage 4 — People Around

Every challenge should say:

**Choose a safe place and respect other people's privacy. You never need to film strangers directly.**

### 22. Someone Might Notice

“Record while another person is somewhere in the environment, without pointing the camera at them.”

### 23. Café Courage

“Record 30 seconds in a café or similar public place. A quiet corner counts.”

Fallback: mall/common area/park bench.

### 24. Keep Talking

“Continue your sentence while someone passes nearby.”

No automatic verification.

### 25. One Minute in Public

“Stand or sit in a public place and record for one minute.”

### 26. Show Me Where You Are

“Give the camera a short introduction to the place you're in.”

### 27. Creator Intro

“Give a 15-second hook, then continue for another 30 seconds.”

### 28. A Little Busier

“Record somewhere slightly busier than your previous public challenge.”

### 29. 90-Second Public One-Take

“Keep recording for 90 seconds. No restart.”

### 30. Final Boss: Mini Vlog

“Make a two-minute mini-vlog in a public place: intro → what you're doing → one observation → sign-off.”

Reward:

- +40 CP.
- Graduate badge.
- Celebration screen.
- Show Day 1 vs Day 30 compilation teaser for a future feature, but do not build automatic compilation in Phase 1 unless time remains.

---

# 14. Screen specifications

Generated UI references are supplied in `/ui_reference`.

## S1 — Splash / bootstrap

Display logo mark + Lens Courage.

Tasks:

- Initialize Firebase.
- Restore auth.
- Anonymous sign-in if required.
- Fetch Remote Config.
- Fetch user document.
- Route to onboarding or main app.

Never show spinner indefinitely. After 8 seconds, offer Retry.

---

## S2 — Welcome onboarding

Reference: `01_welcome.png`

Elements:

- Small lens/star mark.
- Strong value proposition.
- Illustration area made from abstract UI shapes; no need for custom character art.
- Three tiny benefits:
  - Private reps.
  - Daily progression.
  - AI coach after you finish.
- Primary CTA.

---

## S3 — Baseline onboarding

Reference: `02_baseline.png`

Elements:

- Step indicator “1 of 3”.
- Question card.
- 4 selectable comfort cards.
- Continue button disabled until selection.

Store response in Firestore onboarding object.

---

## S4 — Today/Home

Reference: `03_home.png`

This is the most important screen.

Top area:

- Lens Courage title/logo.
- Current streak chip.
- Current Courage Points chip.
- “Challenge 6 / 30” or “Day 6” pill.

Hero card:

- Stage name.
- Challenge title.
- Prompt summary.
- Expected duration.
- Reward.
- Primary CTA **Start challenge**.

Below hero:

### Daily quests card

Three quest rows with progress bars/checkmarks.

### Weekly challenge card

“Complete 5 challenges this week” progress + chest icon.

### Small motivation card

One short sentence, remotely configurable.

Do not make the home screen extremely long. The main challenge must stay above the fold on common Android devices.

---

## S5 — Path

Reference: `04_path.png`

Show vertically scrollable progression path.

Header:

- Current stage.
- Overall `x / 30`.
- Progress bar.

Path:

- Nodes 1–30 grouped into stages.
- Complete node: check.
- Current node: pulsing primary ring.
- Locked node: muted lock.
- Boss nodes: larger and special gradient.

Tap:

- Complete challenge → show summary.
- Current challenge → ChallengeDetail.
- Locked challenge → small toast: “Finish Challenge X first.”

Auto-scroll to current node when screen opens.

---

## S6 — Challenge detail

Reference: `05_challenge_detail.png`

Elements:

- Stage pill.
- Challenge number.
- Challenge title.
- Large mission statement.
- “Your rules” section.
- Duration chip.
- Reward chip.
- AI coach explanation.
- Safety/privacy note if outdoor/public.
- Primary CTA **Open camera**.

For one-take challenges, clearly show:

**One-take bonus +5 CP**

---

## S7 — Camera / recording

Reference: `06_recording.png`

Use front camera by default.

Top:

- Close button.
- Challenge title.
- Optional front/back camera toggle if desired, but front is default.

Preview overlay:

- Timer.
- Short prompt card.
- Small hint “Look at the lens, not your preview.” where relevant.

Bottom:

Before recording:

- Big record button.
- “Start when you're ready.”

During recording:

- Elapsed timer.
- Red recording indicator.
- Stop button.

After stopping:

- Preview recorded clip.
- **Use this take** primary CTA.
- **Try again** secondary CTA unless challenge is one-take locked.

For one-take challenges:

- User may still cancel before recording.
- Once they finish, “Try again” can exist but forfeits +5 CP. Do not trap the user.

## Camera rules

- Portrait orientation only in Phase 1.
- Record 720p or 1080p depending device capability; prioritize stable storage size.
- H.264/AAC MP4 is preferred.
- Keep screen awake while recording.
- Record microphone audio.
- No beauty filter.
- No cloud upload of raw video by default.
- Maximum recording length 2:30 for Phase 1.

---

## S8 — Celebration

This screen appears immediately after accepting a take, before waiting for AI.

Reference can reuse visual direction from Home/Feedback.

Show:

- Confetti.
- “Challenge complete!”
- `+20 CP` animated count-up.
- Streak update if applicable.
- Quest progress updates.
- New badge if earned.

CTA:

**See coach feedback**

If AI is still processing, navigate to Processing.

Important: user must feel rewarded immediately.

---

## S9 — Processing

Keep this light and playful.

Copy examples:

- “Your coach is listening…”
- “Finding one useful thing for your next rep…”

Show 3-step mini status:

1. Uploading audio.
2. Listening.
3. Preparing feedback.

If >20 seconds:

“It's taking a little longer. You can leave — we'll save the feedback here.”

Allow Back/Home.

Do not lock the app on this screen.

---

## S10 — AI feedback

Reference: `07_feedback.png`

Feedback should be short enough to read in under 30 seconds.

### Header

- “Nice rep.” or “Challenge complete.”
- CP earned.
- Streak.

### Objective-ish metrics

Show only metrics with defensible inputs:

- Duration.
- Word count.
- Approx. words/min.
- Filler words count from transcript.
- Completed in one take: yes/no.

Do not show fake facial-confidence percentages.

### Coach cards

1. **What worked**
2. **One thing to focus on**
3. **Try this next time**

Only one main improvement recommendation.

Example:

> **One thing to focus on**
>
> Your first sentence started quickly, but the middle sped up. Try adding one deliberate pause after your second sentence.

### CTA

Primary: **Continue**

Secondary: **Practice once more**

“Practice once more” does not advance the challenge again or award full challenge CP. It can count toward a daily quest.

---

## S11 — Progress

Reference: `08_progress.png`

Top:

- Current streak.
- Longest streak.
- Total CP.
- Level progress.

Sections:

### This week

7-day row showing completed challenge dates.

### Journey

- Challenges completed `x / 30`.
- Stage progress.

### Speaking trend

Phase 1 simple metrics:

- Average recording duration.
- Average WPM over recent sessions.
- Filler words per 100 words trend, only if enough data.

Do not claim these equal confidence.

---

## S12 — Badges / Me

Reference: `09_badges.png`

Me tab includes:

- Avatar placeholder circle (initial / lens icon).
- Level.
- CP.
- Streak.
- Badges grid.
- Settings button.

Badge state:

- Earned: vivid.
- Locked: monochrome/low opacity.

Tap badge → explanation + earned date.

---

## S13 — Settings

Phase 1 settings:

- Reminder enabled toggle.
- Reminder time.
- Keep recordings after challenge: ON by default? Prefer **OFF by default** for privacy/storage unless user explicitly turns it on.
- Delete local recordings.
- Privacy explanation.
- Reset app progress (requires confirm).
- About.
- App version.

If `keepRecordings` is OFF:

- app may retain the accepted video temporarily until AI processing is complete;
- delete after processing or a safe timeout.

If ON:

- save to app-private local storage, not Gallery by default.

---

# 15. AI feedback architecture

## Principle

AI is a coach, not a judge.

Avoid:

- “You look nervous.”
- “You lack confidence.”
- Diagnosing anxiety.
- Personality judgments.
- Appearance critique.

Focus on observable speaking behavior.

## Flow

```txt
Accepted video saved locally
  ↓
Extract AAC/M4A audio locally
  ↓
Upload temporary audio to Firebase Storage
  ↓
Create analysis job
  ↓
Callable/triggered Cloud Function
  ↓
Firebase Genkit + Gemini
  ↓
Structured JSON result
  ↓
Firestore session updated
  ↓
Temporary cloud audio deleted
  ↓
Client receives Firestore update
```

## Session states

```ts
type AnalysisStatus =
  | 'not_started'
  | 'extracting_audio'
  | 'uploading'
  | 'queued'
  | 'analyzing'
  | 'complete'
  | 'failed';
```

## AI output contract

```ts
interface CoachAnalysis {
  transcript: string;
  wordCount: number;
  fillerWords: {
    total: number;
    items: Array<{ word: string; count: number }>;
  };
  approximateWpm: number;
  whatWorked: string;
  focus: string;
  nextTry: string;
  shortSummary: string;
  safetyFlags?: string[];
}
```

`approximateWpm` can be calculated server-side from transcript words / actual recording duration rather than trusted from the model.

## Prompt requirements

System behavior:

- The user is practicing speaking naturally on camera.
- Be encouraging but specific.
- Mention at most one primary weakness.
- Prefer actionable instruction over praise.
- Do not comment on attractiveness, body, ethnicity, disability, age, or inferred mental state.
- Never diagnose anxiety/ADHD or other conditions.
- Keep each feedback field short.
- Return strict structured output.

Suggested maximums:

- `whatWorked`: 25 words.
- `focus`: 35 words.
- `nextTry`: 25 words.
- `shortSummary`: 20 words.

## Model failure

If AI response fails validation:

- retry once server-side;
- then mark failed;
- client lets user retry feedback manually;
- never revoke completion reward.

---

# 16. Firebase Firestore schema

Use server timestamps wherever appropriate.

## `users/{uid}`

```ts
interface UserDoc {
  createdAt: Timestamp;
  updatedAt: Timestamp;

  onboardingComplete: boolean;
  startingComfortLevel?: 1 | 2 | 3 | 4;
  primaryGoal?: 'vlogging' | 'natural_camera' | 'short_form' | 'all';
  timezone: string;

  currentChallengeOrder: number; // 1..30
  completedChallengeCount: number;

  totalCP: number;
  currentStreak: number;
  longestStreak: number;
  lastStreakDate?: string; // YYYY-MM-DD in user's timezone

  reminderEnabled: boolean;
  reminderLocalTime?: string; // HH:mm

  keepRecordings: boolean;
  currentStage: number;
}
```

Do not allow client to freely write `totalCP`, streak, badge awards, or completion count.

## `challenges/{challengeId}`

```ts
interface ChallengeDoc {
  id: string;
  order: number;
  stage: 1 | 2 | 3 | 4;
  stageName: string;
  title: string;
  shortPrompt: string;
  fullPrompt: string;
  tips: string[];

  minDurationSec: number;
  targetDurationSec: number;
  maxDurationSec: number;

  rewardCP: number;
  boss: boolean;
  oneTakeBonus: boolean;
  outdoor: boolean;
  publicSpace: boolean;

  fallbackPrompt?: string;
  active: boolean;
}
```

Challenges are read-only to clients.

## `users/{uid}/sessions/{sessionId}`

```ts
interface SessionDoc {
  challengeId: string;
  challengeOrder: number;

  createdAt: Timestamp;
  completedAt?: Timestamp;

  durationMs: number;
  retryCount: number;
  oneTakeQualified: boolean;

  completionStatus: 'recorded' | 'completed';
  rewardGranted: boolean;
  rewardCP: number;

  analysisStatus: AnalysisStatus;
  analysisErrorCode?: string;

  transcript?: string;
  wordCount?: number;
  approximateWpm?: number;
  fillerWords?: {
    total: number;
    items: Array<{ word: string; count: number }>;
  };
  whatWorked?: string;
  focus?: string;
  nextTry?: string;
  shortSummary?: string;

  feedbackViewedAt?: Timestamp;
  feedbackViewRewardGranted?: boolean;
}
```

Do **not** store a raw local filesystem URI in Firestore.

## `users/{uid}/badges/{badgeId}`

```ts
interface UserBadgeDoc {
  badgeId: string;
  earnedAt: Timestamp;
  source: string;
}
```

## `badges/{badgeId}`

```ts
interface BadgeDoc {
  name: string;
  description: string;
  iconKey: string;
  sortOrder: number;
}
```

## `users/{uid}/dailyQuests/{yyyyMMdd}`

```ts
interface DailyQuestSet {
  localDate: string;
  generatedAt: Timestamp;
  quests: Array<{
    id: string;
    type: string;
    title: string;
    current: number;
    target: number;
    completed: boolean;
  }>;
  chestClaimed: boolean;
}
```

## `users/{uid}/weekly/{yyyyWeek}`

```ts
interface WeeklyProgress {
  weekKey: string;
  completedMainChallenges: number;
  target: 5;
  rewardClaimed: boolean;
}
```

---

# 17. Firebase Storage layout

Only temporary AI analysis audio in Phase 1.

```txt
analysis-audio/
  {uid}/
    {sessionId}.m4a
```

Metadata should contain:

- `uid`
- `sessionId`
- `challengeId`

Delete object automatically after analysis.

A scheduled cleanup function should delete analysis audio older than 24 hours in case a job crashes.

---

# 18. Cloud Functions

Recommended callable/server functions:

## `completeChallenge`

Input:

```ts
{
  sessionId: string;
  challengeId: string;
  durationMs: number;
  retryCount: number;
}
```

Server validates:

- authenticated uid.
- challenge exists and active.
- challenge is user's current challenge OR valid retry scenario.
- reasonable duration.
- session not already rewarded.

Transaction:

- mark session complete.
- calculate CP.
- update total CP.
- update current challenge.
- update streak.
- update weekly progress.
- update daily quests.
- award earned badges.

Return:

```ts
{
  cpEarned: number;
  totalCP: number;
  newLevel: number;
  currentStreak: number;
  unlockedChallengeOrder: number;
  newlyEarnedBadges: string[];
  dailyQuestUpdates: unknown[];
  weeklyProgress: number;
}
```

## `startAnalysis`

Input:

```ts
{
  sessionId: string;
  storagePath: string;
}
```

Validates object belongs to uid.

Sets analysis state and triggers Genkit flow.

## `markFeedbackViewed`

Grants +5 CP only once if eligible.

## `claimWeeklyReward`

Server validates weekly target and one-time claim.

## `resetProgress`

Optional server function; destructive action requiring client confirmation.

---

# 19. Firestore security principles

Starter rules are included in `/firebase/firestore.rules`.

Principles:

- User can read/write non-authoritative preference fields on their own user document.
- User cannot directly set CP, streak, challenge progression, badges, rewards.
- Challenge catalog is authenticated read-only.
- Sessions belong to user.
- AI/reward fields should be server-written.
- Badge catalog authenticated read-only.

Where fine-grained field rules become cumbersome, route authoritative mutations through Cloud Functions.

---

# 20. Storage security principles

Starter rules are included in `/firebase/storage.rules`.

- Auth required.
- User can upload only under their uid.
- Restrict reasonable maximum file size.
- Restrict MIME type to expected audio types.
- Users should not list other users' files.

---

# 21. Local video lifecycle

## Default behavior

`keepRecordings = false`.

Accepted recording:

1. Video exists in app cache/private files.
2. Extract audio.
3. Complete challenge immediately.
4. Analyze audio.
5. After analysis is finished, delete video unless user explicitly enabled keeping recordings.

If user closes app during processing:

- session state remains in Firestore;
- local cleanup can happen on next startup;
- temporary files older than 48 hours are automatically cleaned.

## Future Day 1 vs Day 30 compilation

Do not depend on it in Phase 1 because default local deletion conflicts with compilation.

Add a future-facing setting/copy only if desired:

“Save milestone clips for progress montages.”

Do not implement unless Phase 1 core is stable.

---

# 22. Permissions

Android permissions likely required:

- Camera.
- Record audio.
- Notifications on supported Android versions.

Avoid broad storage permissions.

Use app-private storage.

## Permission UX

Do not request camera/mic permission on first launch.

Request camera + mic when user taps **Open camera** for the first time.

Show custom pre-permission explanation first:

> “Lens Courage needs camera and microphone access so you can record your private practice reps.”

If permanently denied:

- show Settings shortcut.
- do not crash.

---

# 23. Notifications

Use FCM for remote messaging support, but daily reminder can be implemented with local scheduled notification for reliability.

If the requirement is strictly Firebase-only infrastructure, store reminder settings in Firebase and use FCM where practical; however, device-local daily scheduling is preferable for an exact personal reminder.

Phase 1 reminder copy examples:

- “Your next tiny camera rep is ready 🎥”
- “Keep the lens streak alive — today's challenge takes 30 seconds.”
- “One rep. No posting required.”

Never shame users for missing days.

---

# 24. Remote Config

Suggested keys:

```txt
phase1_ai_feedback_enabled = true
phase1_weekly_challenge_enabled = true
phase1_daily_quests_enabled = true
phase1_badges_enabled = true
phase1_public_stage_enabled = true
home_motivation_copy = "One rep is enough for today."
ai_feedback_timeout_seconds = 30
max_recording_seconds = 150
```

This lets features be disabled without shipping an update.

---

# 25. Analytics events

Use Firebase Analytics.

## Onboarding

```txt
onboarding_started
onboarding_comfort_selected
onboarding_goal_selected
onboarding_reminder_selected
onboarding_completed
```

## Main funnel

```txt
home_viewed
challenge_detail_viewed
challenge_started
recording_started
recording_stopped
recording_retried
recording_accepted
challenge_completed
celebration_viewed
feedback_processing_started
feedback_completed
feedback_failed
feedback_viewed
practice_retry_started
```

## Gamification

```txt
cp_earned
streak_incremented
streak_reset
badge_earned
daily_quest_completed
daily_quest_chest_claimed
weekly_challenge_completed
weekly_reward_claimed
stage_completed
journey_completed
```

Do not send transcript or spoken content to Analytics.

Recommended event params:

- `challenge_order`
- `challenge_id`
- `stage`
- `duration_bucket`
- `retry_count`
- `one_take_qualified`

No raw user speech.

---

# 26. Crashlytics logging

Record non-sensitive breadcrumbs:

- screen.
- challenge ID/order.
- camera initialization status.
- recording start/stop state.
- audio extraction state.
- upload state.
- function error codes.

Never log transcript/audio content.

---

# 27. Offline behavior

The app should remain usable for recording when network temporarily disappears.

## If offline before challenge

- Display previously cached current challenge.
- Allow recording.
- Save pending session locally.
- Show “We'll sync this when you're back online.”

## When network returns

- sync session completion once.
- guard against duplicate rewards server-side.
- perform AI analysis.

If full offline completion creates too much Phase 1 complexity, minimum acceptable behavior is:

- challenge catalog cached by Firestore;
- recording works offline;
- accepted recording remains pending;
- sync/award happens automatically later.

---

# 28. Error states

Handle these explicitly:

## No camera device

Show friendly error + retry.

## Camera permission denied

Explain and link to settings.

## Microphone permission denied

Cannot record challenge; explain why.

## Recording fails

Do not advance challenge. Offer retry.

## App backgrounds during recording

Stop/save safely if library supports it; otherwise cancel with clear message.

## Audio extraction fails

Challenge still completes. AI feedback shows retry option.

## Upload fails

Queue retry.

## AI fails

Challenge completion remains intact.

## Duplicate function call

Server idempotency prevents duplicate CP.

## User changes timezone

Update `timezone` at app start when system timezone differs. Do not retroactively rewrite old streak dates.

---

# 29. Accessibility

- Respect font scaling within reasonable card layouts.
- Minimum 44–48dp tap areas.
- Icons accompanied by labels where meaning is important.
- Do not rely only on color for locked/completed states.
- Add screen-reader labels to record/stop controls.
- Provide captions/text for audio-based coach results.
- Avoid rapid flashing celebration effects.
- Reduce Motion setting should minimize bounce/confetti motion.

---

# 30. Privacy UX

Camera confidence is sensitive because users may film inside their home.

Make privacy a product advantage.

Suggested onboarding line:

**Your video stays on your phone by default. Only temporary audio is used to create coach feedback.**

If implementation temporarily uploads full media, this copy must be changed to accurately describe the real behavior.

Settings privacy page should explain:

- what stays local;
- what is uploaded;
- why audio is processed;
- how temporary cloud files are deleted;
- how to delete local recordings/progress.

---

# 31. Main UI copy

Use confident, short copy.

Avoid therapy language.

Good:

- “One tiny rep.”
- “Your lens is ready.”
- “No audience. Just practice.”
- “Nice. You finished the take.”
- “Keep talking even if it feels awkward.”
- “You don't need to post this.”
- “Try one deliberate pause next time.”

Avoid:

- “Cure your camera anxiety.”
- “Fix your social anxiety.”
- “You are anxious.”
- “You look insecure.”
- “Become fearless.”

---

# 32. UI reference mapping

Generated files:

```txt
/ui_reference/01_welcome.png
/ui_reference/02_baseline.png
/ui_reference/03_home.png
/ui_reference/04_path.png
/ui_reference/05_challenge_detail.png
/ui_reference/06_recording.png
/ui_reference/07_feedback.png
/ui_reference/08_progress.png
/ui_reference/09_badges.png
/ui_reference/00_contact_sheet.png
```

The mockups are visual guidance, not pixel-perfect specifications.

Codex should prioritize:

1. Hierarchy.
2. Spacing.
3. Rounded card language.
4. Gamification clarity.
5. Main CTA visibility.

Do not hardcode based on screenshot pixel dimensions; build responsive Android layouts.

---

# 33. Suggested source structure

```txt
src/
  app/
    App.tsx
    navigation/
      RootNavigator.tsx
      MainTabs.tsx

  screens/
    SplashScreen.tsx
    onboarding/
      WelcomeScreen.tsx
      ComfortScreen.tsx
      GoalScreen.tsx
      ReminderScreen.tsx
      FirstChallengeScreen.tsx
    TodayScreen.tsx
    PathScreen.tsx
    ProgressScreen.tsx
    MeScreen.tsx
    ChallengeDetailScreen.tsx
    RecordingScreen.tsx
    CelebrationScreen.tsx
    ProcessingScreen.tsx
    FeedbackScreen.tsx
    SettingsScreen.tsx

  components/
    PrimaryButton.tsx
    Card.tsx
    ProgressBar.tsx
    CPChip.tsx
    StreakChip.tsx
    ChallengeCard.tsx
    DailyQuestRow.tsx
    WeeklyChallengeCard.tsx
    PathNode.tsx
    BadgeTile.tsx
    MetricCard.tsx

  features/
    auth/
    challenges/
    recording/
    gamification/
    feedback/
    notifications/

  firebase/
    index.ts
    auth.ts
    firestore.ts
    functions.ts
    storage.ts
    analytics.ts
    remoteConfig.ts

  hooks/
    useCurrentUser.ts
    useCurrentChallenge.ts
    useChallengePath.ts
    useRecordingSession.ts

  native/
    AudioExtractor.ts

  theme/
    colors.ts
    spacing.ts
    typography.ts
    shadows.ts

  types/
    challenge.ts
    user.ts
    session.ts
    badge.ts

  utils/
    dates.ts
    streak.ts
    fileCleanup.ts
    logger.ts
```

Cloud Functions:

```txt
functions/
  src/
    index.ts
    completeChallenge.ts
    startAnalysis.ts
    markFeedbackViewed.ts
    claimWeeklyReward.ts
    cleanupAudio.ts
    gamification/
      streak.ts
      badges.ts
      quests.ts
    ai/
      coachFlow.ts
      schema.ts
```

---

# 34. Seed strategy

Do not hardcode all challenge copy in screen files.

Use `/seed/challenges.json` to seed Firestore `challenges` collection.

During development, provide an npm script or Firebase Admin seed script:

```txt
npm run seed:challenges
```

The client should consume challenge documents from Firestore and rely on local Firestore cache.

---

# 35. Phase 1 implementation order

## Milestone 1 — App shell

- Create RN project.
- Theme.
- Navigation.
- Firebase setup.
- Anonymous auth.
- Onboarding.
- Firestore challenge seed.

Acceptance:

User can install fresh app, complete onboarding, land on Today.

## Milestone 2 — Core challenge experience

- Today screen.
- Path screen.
- Challenge detail.
- VisionCamera.
- Record/preview/retry/use take.
- Local session creation.

Acceptance:

User can finish Challenge 1 end-to-end without AI.

## Milestone 3 — Server-authoritative progression

- `completeChallenge` function.
- CP.
- streak.
- progression unlock.
- celebration.

Acceptance:

Closing/reopening app preserves progression and duplicate calls cannot double-award CP.

## Milestone 4 — Gamification

- Daily quests.
- Weekly challenge.
- badges.
- Progress/Me screens.
- animations.

Acceptance:

Completing challenges visibly updates all relevant progress.

## Milestone 5 — AI coach

- audio extraction.
- temporary Storage upload.
- Cloud Function + Genkit.
- structured feedback.
- cleanup.
- failure/retry.

Acceptance:

A completed recording can receive short feedback without raw video being stored in Firebase.

## Milestone 6 — Notifications + polish

- reminder permission UX.
- local/FCM reminder strategy.
- Remote Config.
- Analytics.
- Crashlytics.
- accessibility.
- error states.
- loading skeletons.

## Milestone 7 — QA release candidate

- physical Android testing.
- low-end device test.
- airplane mode test.
- camera permission denial.
- mic permission denial.
- interrupted upload.
- AI timeout.
- app kill/reopen.
- timezone/date transition.

---

# 36. Phase 1 acceptance criteria

The app is Phase-1 complete when all are true:

- [ ] Fresh install creates anonymous Firebase user.
- [ ] Onboarding writes preferences to Firestore.
- [ ] Today screen shows next unlocked challenge.
- [ ] User can open front camera and record video with microphone.
- [ ] User can preview, retry, and accept a recording.
- [ ] Accepted recording awards CP server-side.
- [ ] Challenge progression is stored server-side.
- [ ] Streak increments correctly by local date.
- [ ] Next challenge unlocks.
- [ ] Path visually shows complete/current/locked/boss nodes.
- [ ] Daily quests update.
- [ ] Weekly challenge updates.
- [ ] Badges can be earned.
- [ ] Progress screen shows streak/CP/journey.
- [ ] AI feedback produces transcript-derived metrics + three short coaching fields.
- [ ] AI failure does not lose completion/reward.
- [ ] Temporary cloud analysis files are deleted.
- [ ] Raw video is not uploaded by default.
- [ ] Camera/mic permission denial has recovery UX.
- [ ] No duplicate CP reward from retries/network duplication.
- [ ] Firebase Analytics events exist for major funnel steps.
- [ ] Crashlytics is enabled.
- [ ] User can choose reminder time.
- [ ] UI visually resembles supplied Lens Courage reference mockups.
- [ ] Android physical device test passes.

---

# 37. Phase 2 hooks — architect now, do not implement

These are intentionally deferred but code should not block them.

## Monetization

Future Lens Courage Pro can unlock:

- Levels 31–90.
- Personalized challenge paths.
- Unlimited AI coach retries.
- Specialized programs: Vlogging, Reels, Interviews, Presentations.
- Weekly detailed report.
- Day 1 → Day 30/60/90 transformation montage.
- Advanced audio coaching.

Keep entitlement checks behind a future `EntitlementService` interface rather than scattering `isPro` booleans everywhere.

## iOS

Avoid Android-only business logic except camera/audio extraction native implementation.

Keep platform-specific code behind services.

## Future AI video analysis

Possible later:

- gaze direction estimate;
- camera framing;
- pacing/energy from audio;
- posture/gesture coaching.

Not Phase 1.

---

# 38. Product principle to protect

When choosing between more features and a better daily loop, choose the better daily loop.

Lens Courage should not feel like an analytics dashboard.

It should feel like:

> **“Give me one small camera challenge I can actually do today.”**

The reward after completing it should make the user curious enough to come back for the next one.

---

# 39. Final Codex build request

Implement the Android Phase 1 product described above as a production-quality React Native TypeScript app.

Before coding:

1. Read this entire document.
2. Inspect `/ui_reference/00_contact_sheet.png` and each individual screen mockup.
3. Inspect `/seed/challenges.json`.
4. Inspect Firebase starter rules.
5. Create a concise implementation plan in the repo README.
6. Implement milestone by milestone.
7. Do not silently omit features. If something cannot be implemented, leave a clearly documented TODO explaining why.

The primary benchmark is not “how many features exist.”

The benchmark is whether **Challenge 1 → recording → reward → feedback → Challenge 2** feels polished and addictive enough to repeat.

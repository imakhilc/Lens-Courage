export type ComfortLevel = 1 | 2 | 3 | 4;
export type PrimaryGoal = 'vlogging' | 'natural_camera' | 'short_form' | 'all';
export interface OnboardingDraft {
  startingComfortLevel?: ComfortLevel;
  primaryGoal?: PrimaryGoal;
  reminderEnabled?: boolean;
  reminderLocalTime?: string;
}
export interface UserProfile extends OnboardingDraft {
  uid: string;
  displayName?: string;
  onboardingComplete: boolean;
  timezone: string;
  currentChallengeOrder: number;
  completedChallengeCount: number;
  totalCP: number;
  currentStreak: number;
  longestStreak: number;
  keepRecordings: boolean;
  currentStage: number;
  previewMode?: boolean;
}
export interface Challenge {
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
export interface LocalSession {
  id: string;
  uid: string;
  challengeId: string;
  challengeOrder: number;
  createdAt: string;
  durationMs: number;
  retryCount: number;
  oneTakeQualified: boolean;
  completionStatus: 'recorded';
  localVideoPath: string;
}

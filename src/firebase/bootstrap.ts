import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from '@react-native-firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';
import { OnboardingDraft, UserProfile } from '../types/models';

GoogleSignin.configure({
  webClientId:
    '345906972620-lhibl411m54s8tadiidjnp0rtnj5h6ri.apps.googleusercontent.com',
});

const timezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
const defaultProfile = (uid: string): UserProfile => ({
  uid,
  displayName: getAuth(getApp()).currentUser?.displayName ?? undefined,
  onboardingComplete: false,
  timezone: timezone(),
  currentChallengeOrder: 1,
  completedChallengeCount: 0,
  totalCP: 0,
  currentStreak: 0,
  longestStreak: 0,
  reminderEnabled: false,
  keepRecordings: false,
  currentStage: 1,
});

async function loadProfile(uid: string): Promise<UserProfile> {
  const app = getApp();
  const firestore = getFirestore(app);
  const ref = doc(firestore, 'users', uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    const initial = defaultProfile(uid);
    await setDoc(ref, {
      ...initial,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return initial;
  }
  const profile = {
    ...defaultProfile(uid),
    ...snapshot.data(),
    uid,
  } as UserProfile;
  if (profile.timezone !== timezone()) {
    profile.timezone = timezone();
    await setDoc(
      ref,
      { timezone: profile.timezone, updatedAt: serverTimestamp() },
      { merge: true },
    );
  }
  return profile;
}

export async function bootstrapUser(): Promise<UserProfile | undefined> {
  const auth = getAuth(getApp());
  const firebaseUser = auth.currentUser;
  if (firebaseUser?.isAnonymous) {
    await signOut(auth);
    return undefined;
  }
  return firebaseUser ? loadProfile(firebaseUser.uid) : undefined;
}

export async function signInWithGoogle(): Promise<UserProfile | undefined> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Clear only the SDK's remembered account so an explicit login action always
  // presents Google's account chooser. This does not revoke account access.
  await GoogleSignin.signOut();
  const response = await GoogleSignin.signIn();
  if (response.type !== 'success') {
    return undefined;
  }
  const idToken = response.data.idToken;
  if (!idToken) {
    throw new Error(
      'Google did not return an ID token. Check the Web OAuth client configuration.',
    );
  }
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(getAuth(getApp()), credential);
  return loadProfile(result.user.uid);
}

export async function finishOnboarding(
  profile: UserProfile,
  draft: OnboardingDraft,
) {
  const updated: UserProfile = {
    ...profile,
    ...draft,
    onboardingComplete: true,
  };
  await setDoc(
    doc(getFirestore(getApp()), 'users', profile.uid),
    { ...draft, onboardingComplete: true, updatedAt: serverTimestamp() },
    { merge: true },
  );
  return updated;
}

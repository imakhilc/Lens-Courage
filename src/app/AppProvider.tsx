import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { NativeModules } from 'react-native';
import {
  bootstrapUser,
  finishOnboarding,
  saveOpeningPhrasePreference,
  signInWithGoogle as authenticateWithGoogle,
} from '../firebase/bootstrap';
import { LocalSession, OnboardingDraft, UserProfile } from '../types/models';
import { Challenge } from '../types/models';
import { fetchChallenges } from '../firebase/challenges';
import { clearLocalSessions, getLocalSessions } from '../storage/localSessions';
import {
  clearOpeningPhrase,
  getOpeningPhrase,
  saveOpeningPhrase,
} from '../storage/openingPhrase';

type AppContextValue = {
  loading: boolean;
  signingIn: boolean;
  error?: string;
  user?: UserProfile;
  challenges: Challenge[];
  challengesLoading: boolean;
  challengesError?: string;
  localSessions: LocalSession[];
  localDataLoading: boolean;
  openingPhrase?: string;
  draft: OnboardingDraft;
  setDraft: (value: Partial<OnboardingDraft>) => void;
  signInWithGoogle: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  registerLocalSession: (session: LocalSession) => void;
  chooseOpeningPhrase: (phrase: string) => Promise<void>;
  clearDevData: () => Promise<void>;
  refreshData: () => void;
  retry: () => void;
};
const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [signingIn, setSigningIn] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(false);
  const [challengesError, setChallengesError] = useState<string>();
  const [user, setUser] = useState<UserProfile>();
  const [localSessions, setLocalSessions] = useState<LocalSession[]>([]);
  const [localDataLoading, setLocalDataLoading] = useState(true);
  const [openingPhrase, setOpeningPhrase] = useState<string>();
  const [draft, updateDraft] = useState<OnboardingDraft>({});
  const [attempt, setAttempt] = useState(0);
  const [dataAttempt, setDataAttempt] = useState(0);
  const openingPhraseSaveQueue = useRef<Promise<void>>(Promise.resolve());
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(undefined);
    const timeout = setTimeout(
      () => alive && setError('Setup is taking longer than expected.'),
      8000,
    );
    bootstrapUser()
      .then(value => {
        if (alive) {
          setUser(value);
          setLoading(false);
          clearTimeout(timeout);
        }
      })
      .catch((cause: unknown) => {
        if (alive) {
          setError(
            cause instanceof Error
              ? cause.message
              : 'Lens Courage could not start.',
          );
          setLoading(false);
          clearTimeout(timeout);
        }
      });
    return () => {
      alive = false;
      clearTimeout(timeout);
    };
  }, [attempt]);
  useEffect(() => {
    if (!user?.onboardingComplete) return;
    let alive = true;
    setChallengesLoading(true);
    setChallengesError(undefined);
    fetchChallenges()
      .then(value => {
        if (alive) setChallenges(value);
      })
      .catch(cause => {
        if (alive)
          setChallengesError(
            cause instanceof Error
              ? cause.message
              : 'Challenges could not be loaded.',
          );
      })
      .finally(() => {
        if (alive) setChallengesLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [dataAttempt, user?.onboardingComplete]);
  useEffect(() => {
    if (!user?.uid) {
      setLocalSessions([]);
      setOpeningPhrase(undefined);
      setLocalDataLoading(false);
      return;
    }
    let alive = true;
    setLocalDataLoading(true);
    Promise.all([getLocalSessions(user.uid), getOpeningPhrase(user.uid)])
      .then(([sessions, phrase]) => {
        if (!alive) return;
        setLocalSessions(sessions);
        const resolvedPhrase = user.openingPhrase ?? phrase ?? undefined;
        setOpeningPhrase(resolvedPhrase);
        if (user.openingPhrase && user.openingPhrase !== phrase) {
          void saveOpeningPhrase(user.uid, user.openingPhrase);
        }
      })
      .finally(() => {
        if (alive) setLocalDataLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [dataAttempt, user?.openingPhrase, user?.uid]);
  const setDraft = useCallback(
    (value: Partial<OnboardingDraft>) =>
      updateDraft(old => ({ ...old, ...value })),
    [],
  );
  const signInWithGoogle = useCallback(async () => {
    setSigningIn(true);
    setError(undefined);
    try {
      const profile = await authenticateWithGoogle();
      if (profile) {
        setUser(profile);
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Google sign-in failed.',
      );
    } finally {
      setSigningIn(false);
    }
  }, []);
  const completeOnboarding = useCallback(async () => {
    if (user) {
      setUser(await finishOnboarding(user, draft));
    }
  }, [draft, user]);
  const clearDevData = useCallback(async () => {
    if (!__DEV__ || !user) return;
    const removedSessions = await getLocalSessions(user.uid);
    const devData = NativeModules.LensCourageDevData as {
      deleteLocalRecordings: (paths: string[]) => Promise<number>;
    } | null;
    await devData?.deleteLocalRecordings(
      removedSessions.map(session => session.localVideoPath),
    );
    await clearLocalSessions(user.uid);
    await clearOpeningPhrase(user.uid);
    setLocalSessions([]);
    setOpeningPhrase(undefined);
  }, [user]);
  return (
    <AppContext.Provider
      value={{
        loading,
        signingIn,
        error,
        user,
        challenges,
        challengesLoading,
        challengesError,
        localSessions,
        localDataLoading,
        openingPhrase,
        draft,
        setDraft,
        signInWithGoogle,
        completeOnboarding,
        registerLocalSession: session =>
          setLocalSessions(existing => [
            session,
            ...existing.filter(item => item.id !== session.id),
          ]),
        chooseOpeningPhrase: async phrase => {
          if (!user) return;
          const phraseIsLocked =
            user.completedChallengeCount > 0 ||
            user.currentChallengeOrder > 1 ||
            localSessions.some(session => session.openingPhrase);
          if (phraseIsLocked && openingPhrase !== phrase) {
            throw new Error(
              'Your signature opening is locked after your first completed challenge.',
            );
          }

          // Reflect the choice immediately; remote persistence must not make
          // this small interaction feel network-bound.
          setUser(profile =>
            profile ? { ...profile, openingPhrase: phrase } : profile,
          );
          setOpeningPhrase(phrase);

          const saveTask = openingPhraseSaveQueue.current
            .catch(() => undefined)
            .then(async () => {
              await Promise.all([
                saveOpeningPhrasePreference(user.uid, phrase),
                saveOpeningPhrase(user.uid, phrase),
              ]);
            });
          openingPhraseSaveQueue.current = saveTask;
          await saveTask;
        },
        clearDevData,
        refreshData: () => setDataAttempt(value => value + 1),
        retry: () => setAttempt(x => x + 1),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return value;
}

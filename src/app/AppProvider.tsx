import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  bootstrapUser,
  finishOnboarding,
  signInWithGoogle as authenticateWithGoogle,
} from '../firebase/bootstrap';
import { LocalSession, OnboardingDraft, UserProfile } from '../types/models';
import { Challenge } from '../types/models';
import { fetchChallenges } from '../firebase/challenges';
import { getLocalSessions } from '../storage/localSessions';

type AppContextValue = {
  loading: boolean;
  signingIn: boolean;
  error?: string;
  user?: UserProfile;
  challenges: Challenge[];
  challengesLoading: boolean;
  challengesError?: string;
  localSessions: LocalSession[];
  draft: OnboardingDraft;
  setDraft: (value: Partial<OnboardingDraft>) => void;
  signInWithGoogle: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  registerLocalSession: (session: LocalSession) => void;
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
  const [draft, updateDraft] = useState<OnboardingDraft>({});
  const [attempt, setAttempt] = useState(0);
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
  }, [user?.onboardingComplete]);
  useEffect(() => {
    if (!user?.uid) {
      setLocalSessions([]);
      return;
    }
    let alive = true;
    getLocalSessions(user.uid).then(sessions => {
      if (alive) setLocalSessions(sessions);
    });
    return () => {
      alive = false;
    };
  }, [user?.uid]);
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
        draft,
        setDraft,
        signInWithGoogle,
        completeOnboarding,
        registerLocalSession: session =>
          setLocalSessions(existing => [
            session,
            ...existing.filter(item => item.id !== session.id),
          ]),
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

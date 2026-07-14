import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  subscribeToAuthChanges,
  getCurrentUser,
  signOut as authSignOut,
  updateStoredUser,
  markOnboardingComplete,
  hasCompletedOnboarding,
  isProfileComplete,
  type StoredUser,
} from '../services/auth';
import { syncProfile } from '../services/api';

export type AppPhase =
  | 'loading'
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'username'
  | 'emotion'
  | 'main';

interface AuthContextValue {
  user: StoredUser | null;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  phase: AppPhase;
  refreshUser: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUser: (updates: Partial<StoredUser>) => Promise<StoredUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function computePhase(
  isLoading: boolean,
  hasSeenOnboarding: boolean,
  user: StoredUser | null,
  showSplash: boolean,
): AppPhase {
  if (isLoading || showSplash) return showSplash ? 'splash' : 'loading';
  if (!hasSeenOnboarding) return 'onboarding';
  if (!user) return 'auth';
  if (!user.username?.trim()) return 'username';
  if (!user.emotion?.trim()) return 'emotion';
  return 'main';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const refreshUser = useCallback(async () => {
    const current = await getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const [seen, current] = await Promise.all([
        hasCompletedOnboarding(),
        getCurrentUser(),
      ]);
      if (!mounted) return;
      setHasSeenOnboarding(seen);
      setUser(current);
      setIsLoading(false);
    };

    init();

    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      if (mounted) setUser(nextUser);
    });

    const splashTimer = setTimeout(() => {
      if (mounted) setShowSplash(false);
    }, 2000);

    return () => {
      mounted = false;
      unsubscribe();
      clearTimeout(splashTimer);
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    await markOnboardingComplete();
    setHasSeenOnboarding(true);
  }, []);

  const updateUser = useCallback(async (updates: Partial<StoredUser>) => {
    const updated = await updateStoredUser(updates);
    if (updated) {
      setUser(updated);
      if (updated.username) {
        await syncProfile({
          username: updated.username,
          email: updated.email,
          auth_method: updated.authMethod,
          emotion: updated.emotion,
        });
      }
    }
    return updated;
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
  }, []);

  const phase = computePhase(isLoading, hasSeenOnboarding, user, showSplash);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      hasSeenOnboarding,
      phase,
      refreshUser,
      completeOnboarding,
      updateUser,
      signOut,
      isProfileComplete: isProfileComplete(user),
    }),
    [
      user,
      isLoading,
      hasSeenOnboarding,
      phase,
      refreshUser,
      completeOnboarding,
      updateUser,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  saveUser,
  getUser,
  clearUser,
  saveToken,
  getToken,
  setOnboardingSeen,
  getOnboardingSeen,
  type StoredUser,
  type AuthMethod,
} from '../utils/storage';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogleToken,
  loginWithAppleToken,
  fetchMe,
  type ApiProfile,
} from './api';

export type { StoredUser, AuthMethod };

function profileToStored(profile: ApiProfile): StoredUser {
  return {
    id: profile.id,
    email: profile.email || undefined,
    username: profile.username || '',
    authMethod: (profile.auth_method as AuthMethod) || 'email',
    emotion: profile.emotion || undefined,
    createdAt: profile.created_at,
  };
}

async function persistSession(token: string, profile: ApiProfile): Promise<StoredUser> {
  const user = profileToStored(profile);
  await saveToken(token);
  await saveUser(user);
  notifyAuthChanged(user);
  return user;
}

type AuthListener = (user: StoredUser | null) => void;
const authListeners = new Set<AuthListener>();

function notifyAuthChanged(user: StoredUser | null) {
  authListeners.forEach((listener) => listener(user));
}

export function subscribeToAuthChanges(
  callback: (user: StoredUser | null) => void,
): () => void {
  authListeners.add(callback);
  let cancelled = false;
  (async () => {
    const user = await getCurrentUser();
    if (!cancelled) callback(user);
  })();
  return () => {
    cancelled = true;
    authListeners.delete(callback);
  };
}

export async function getCurrentUser(): Promise<StoredUser | null> {
  const token = await getToken();
  if (!token) {
    await clearUser();
    return null;
  }
  const me = await fetchMe();
  if (!me) {
    const local = await getUser();
    return local;
  }
  const user = profileToStored(me);
  await saveUser(user);
  return user;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ success: true; user: StoredUser } | { success: false; message: string }> {
  const result = await loginWithEmail(email.trim(), password);
  if (!result.ok) {
    return { success: false, message: result.error };
  }
  const user = await persistSession(result.data.token, result.data.user);
  return { success: true, user };
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<{ success: true; user: StoredUser } | { success: false; message: string }> {
  const result = await registerWithEmail(email.trim(), password);
  if (!result.ok) {
    return { success: false, message: result.error };
  }
  const user = await persistSession(result.data.token, result.data.user);
  return { success: true, user };
}

export async function resetPassword(
  _email: string,
): Promise<{ success: boolean; message: string }> {
  return {
    success: false,
    message: 'Password reset is not available yet. Contact support or create a new account.',
  };
}

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

const DEV_BUILD_MESSAGE =
  'Google Sign-In needs a development build. From the repo root run: npm run ios or npm run android (not Expo Go).';

type GoogleSigninType = typeof import('@react-native-google-signin/google-signin').GoogleSignin;

let googleSignIn: GoogleSigninType | null | undefined;
let googleConfigured = false;

export function isGoogleSignInAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  if (TurboModuleRegistry.get('RNGoogleSignin') != null) return true;
  return NativeModules.RNGoogleSignin != null;
}

function getGoogleSignIn(): GoogleSigninType | null {
  if (googleSignIn !== undefined) return googleSignIn;
  if (!isGoogleSignInAvailable()) {
    googleSignIn = null;
    return null;
  }
  try {
    googleSignIn =
      require('@react-native-google-signin/google-signin').GoogleSignin as GoogleSigninType;
  } catch {
    googleSignIn = null;
  }
  return googleSignIn;
}

function ensureGoogleConfigured(GoogleSignin: GoogleSigninType) {
  if (googleConfigured) return;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    offlineAccess: false,
  });
  googleConfigured = true;
}

export async function signInWithGoogle(): Promise<
  | { success: true; user: StoredUser }
  | { success: false; cancelled: boolean; message?: string }
> {
  const GoogleSignin = getGoogleSignIn();
  if (!GoogleSignin) {
    return { success: false, cancelled: false, message: DEV_BUILD_MESSAGE };
  }

  try {
    ensureGoogleConfigured(GoogleSignin);
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    const response = await GoogleSignin.signIn();
    if (response.type === 'cancelled') {
      return { success: false, cancelled: true };
    }
    if (response.type !== 'success' || !response.data?.idToken) {
      return {
        success: false,
        cancelled: false,
        message: 'Google did not return an ID token.',
      };
    }

    const result = await loginWithGoogleToken(response.data.idToken);
    if (!result.ok) {
      return { success: false, cancelled: false, message: result.error };
    }
    const user = await persistSession(result.data.token, result.data.user);
    return { success: true, user };
  } catch (err) {
    let message = err instanceof Error ? err.message : String(err);
    if (message.includes('DEVELOPER_ERROR')) {
      message =
        'Android: add package com.rufoabrahamguyo.soullink and debug SHA-1 in Google Cloud.';
    }
    return { success: false, cancelled: false, message };
  }
}

export async function signInWithApple(): Promise<
  | { success: true; user: StoredUser }
  | { success: false; cancelled: boolean; message?: string }
> {
  if (Platform.OS !== 'ios') {
    return { success: false, cancelled: false, message: 'Apple Sign-In is only available on iOS.' };
  }

  try {
    const available = await AppleAuthentication.isAvailableAsync();
    if (!available) {
      return { success: false, cancelled: false, message: 'Apple Sign-In is not available.' };
    }

    const appleCred = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!appleCred.identityToken) {
      return { success: false, cancelled: false, message: 'No identity token from Apple.' };
    }

    const result = await loginWithAppleToken(appleCred.identityToken, appleCred.email);
    if (!result.ok) {
      return { success: false, cancelled: false, message: result.error };
    }
    const user = await persistSession(result.data.token, result.data.user);
    return { success: true, user };
  } catch (err) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      err.code === 'ERR_REQUEST_CANCELED'
    ) {
      return { success: false, cancelled: true };
    }
    return {
      success: false,
      cancelled: false,
      message: err instanceof Error ? err.message : 'Apple sign in failed',
    };
  }
}

export async function signOut(): Promise<void> {
  const GoogleSignin = getGoogleSignIn();
  if (GoogleSignin) {
    try {
      await GoogleSignin.signOut();
    } catch {
      // not signed in with Google
    }
  }
  await clearUser();
  notifyAuthChanged(null);
}

export async function updateStoredUser(
  updates: Partial<StoredUser>,
): Promise<StoredUser | null> {
  const current = await getUser();
  if (!current) return null;
  const updated = { ...current, ...updates };
  await saveUser(updated);
  return updated;
}

export async function markOnboardingComplete(): Promise<void> {
  await setOnboardingSeen(true);
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  return getOnboardingSeen();
}

export function isProfileComplete(user: StoredUser | null): boolean {
  return Boolean(user?.username?.trim() && user?.emotion?.trim());
}

export function needsUsername(user: StoredUser | null): boolean {
  return Boolean(user && !user.username?.trim());
}

export function needsEmotion(user: StoredUser | null): boolean {
  return Boolean(user?.username?.trim() && !user?.emotion?.trim());
}

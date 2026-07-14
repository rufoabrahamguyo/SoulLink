import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'soullink_user';
const TOKEN_KEY = 'soullink_token';
const ONBOARDING_KEY = 'soullink_onboarding_seen';
const REMEMBER_KEY = 'soullink_remember_email';

const isWeb = Platform.OS === 'web';

const saveToWebStorage = async (key: string, value: string): Promise<void> => {
  if (typeof localStorage === 'undefined') {
    throw new Error('localStorage is not available');
  }
  localStorage.setItem(key, value);
};

const getFromWebStorage = async (key: string): Promise<string | null> => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem(key);
};

const deleteFromWebStorage = async (key: string): Promise<void> => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.removeItem(key);
};

async function storageSet(key: string, value: string): Promise<void> {
  if (isWeb) {
    await saveToWebStorage(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function storageGet(key: string): Promise<string | null> {
  if (isWeb) {
    return getFromWebStorage(key);
  }
  return SecureStore.getItemAsync(key);
}

async function storageDelete(key: string): Promise<void> {
  if (isWeb) {
    await deleteFromWebStorage(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export type AuthMethod = 'email' | 'google' | 'apple' | 'anonymous';

export interface StoredUser {
  id: string;
  username: string;
  email?: string;
  authMethod: AuthMethod;
  emotion?: string;
  createdAt: string;
}

export const saveUser = async (user: StoredUser): Promise<void> => {
  try {
    await storageSet(USER_KEY, JSON.stringify(user));
  } catch (err) {
    throw new Error(`Failed to save user data: ${err instanceof Error ? err.message : String(err)}`);
  }
};

function isValidStoredUser(obj: unknown): obj is StoredUser {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'username' in obj &&
    'authMethod' in obj &&
    'createdAt' in obj &&
    typeof (obj as StoredUser).id === 'string' &&
    typeof (obj as StoredUser).username === 'string'
  );
}

export const getUser = async (): Promise<StoredUser | null> => {
  try {
    const data = await storageGet(USER_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as unknown;
    return isValidStoredUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const clearUser = async (): Promise<void> => {
  try {
    await storageDelete(USER_KEY);
    await storageDelete(TOKEN_KEY);
  } catch {
    // Ignore
  }
};

export const saveToken = async (token: string): Promise<void> => {
  await storageSet(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return storageGet(TOKEN_KEY);
};

export const clearToken = async (): Promise<void> => {
  await storageDelete(TOKEN_KEY);
};

export const setOnboardingSeen = async (seen: boolean): Promise<void> => {
  if (seen) {
    await storageSet(ONBOARDING_KEY, '1');
  } else {
    await storageDelete(ONBOARDING_KEY);
  }
};

export const getOnboardingSeen = async (): Promise<boolean> => {
  const val = await storageGet(ONBOARDING_KEY);
  return val === '1';
};

export const setRememberedEmail = async (email: string): Promise<void> => {
  await storageSet(REMEMBER_KEY, email);
};

export const getRememberedEmail = async (): Promise<string | null> => {
  return storageGet(REMEMBER_KEY);
};

export const clearRememberedEmail = async (): Promise<void> => {
  await storageDelete(REMEMBER_KEY);
};

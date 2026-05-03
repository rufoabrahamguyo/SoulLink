import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'soullink_user';

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

export interface StoredUser {
  id: string;
  username: string;
  authMethod: 'anonymous' | 'google' | 'phone';
  createdAt: string;
}

export const saveUser = async (user: StoredUser): Promise<void> => {
  try {
    const serializedUser = JSON.stringify(user);
    if (isWeb) {
      await saveToWebStorage(USER_KEY, serializedUser);
      return;
    }
    await SecureStore.setItemAsync(USER_KEY, serializedUser);
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
    const data = isWeb
      ? await getFromWebStorage(USER_KEY)
      : await SecureStore.getItemAsync(USER_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as unknown;
    return isValidStoredUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const clearUser = async (): Promise<void> => {
  try {
    if (isWeb) {
      await deleteFromWebStorage(USER_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    // Ignore - key may not exist
  }
};

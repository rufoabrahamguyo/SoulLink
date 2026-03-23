import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'soullink_user';

export interface StoredUser {
  id: string;
  username: string;
  authMethod: 'anonymous' | 'google' | 'phone';
  createdAt: string;
}

export const saveUser = async (user: StoredUser): Promise<void> => {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
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
    const data = await SecureStore.getItemAsync(USER_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as unknown;
    return isValidStoredUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const clearUser = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    // Ignore - key may not exist
  }
};

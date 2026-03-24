import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { generateRandomLettersUsername } from '../constants/auth';
import { saveUser, StoredUser } from './storage';

/**
 * Google Cloud → APIs & Services → Credentials
 * - Web application → EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (required for server token / Android)
 * - iOS → EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID (required on iOS native Sign-In)
 */
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

let isConfigured = false;

function ensureConfigured() {
  if (isConfigured) return;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    offlineAccess: false,
  });
  isConfigured = true;
}

export type GoogleSignInResult =
  | { success: true; user: StoredUser }
  | { success: false; cancelled: boolean };

/**
 * Signs in with Google. Shows the native account picker.
 * On success: generates random letters username, saves user, returns StoredUser.
 * User is navigated to EmotionSelection (skip UsernameSelection).
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  try {
    ensureConfigured();

    const response = await GoogleSignin.signIn();

    if (response.type === 'cancelled') {
      return { success: false, cancelled: true };
    }

    if (response.type !== 'success' || !response.data) {
      return { success: false, cancelled: false };
    }

    const { user } = response.data;
    const username = generateRandomLettersUsername(10);

    const storedUser: StoredUser = {
      id: user.id,
      username,
      authMethod: 'google',
      createdAt: new Date().toISOString(),
    };

    await saveUser(storedUser);
    return { success: true, user: storedUser };
  } catch {
    return { success: false, cancelled: false };
  }
}

import { Platform } from 'react-native';
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
  | { success: false; cancelled: boolean; message?: string };

/**
 * Signs in with Google. Shows the native account picker.
 * On success: generates random letters username, saves user, returns StoredUser.
 * User is navigated to EmotionSelection (skip UsernameSelection).
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  try {
    ensureConfigured();

    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    const response = await GoogleSignin.signIn();

    if (response.type === 'cancelled') {
      return { success: false, cancelled: true };
    }

    if (response.type !== 'success' || !response.data) {
      return {
        success: false,
        cancelled: false,
        message: 'Unexpected response from Google Sign-In.',
      };
    }

    const profile = response.data.user;
    const id =
      profile?.id?.trim() ||
      profile?.email?.trim() ||
      `google_${Date.now()}`;

    const username = generateRandomLettersUsername(10);

    const storedUser: StoredUser = {
      id,
      username,
      authMethod: 'google',
      createdAt: new Date().toISOString(),
    };

    try {
      await saveUser(storedUser);
    } catch (err) {
      console.warn('[googleAuth] saveUser failed (continuing to app):', err);
    }

    return { success: true, user: storedUser };
  } catch (err) {
    let message = err instanceof Error ? err.message : String(err);
    if (message.includes('DEVELOPER_ERROR')) {
      message =
        'Android: In Google Cloud, add package com.rufoabrahamguyo.soullink and the SHA-1 from :app:signingReport → Variant debug (`frontend/android/app/debug.keystore`). If it still fails, add BOTH SHA-1s from npm run android:signing — app uses a different keystore than ~/.android/debug.keystore.';
    }
    console.warn('[googleAuth] signInWithGoogle:', err);
    return { success: false, cancelled: false, message };
  }
}

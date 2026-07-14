import { Platform } from 'react-native';
import { getToken } from '../utils/storage';

const DEFAULT_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

/** On Android emulators, localhost is the emulator — rewrite to the host machine. */
function resolveApiBaseUrl(raw: string): string {
  const url = raw.replace(/\/$/, '');
  if (Platform.OS === 'android') {
    return url
      .replace('://localhost', '://10.0.2.2')
      .replace('://127.0.0.1', '://10.0.2.2');
  }
  return url;
}

export const API_BASE_URL = resolveApiBaseUrl(
  process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL,
);

export interface ApiProfile {
  id: string;
  username: string;
  email: string;
  auth_method: string;
  emotion: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: ApiProfile;
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { auth?: boolean },
): Promise<{ ok: true; data: T } | { ok: false; error: string; status: number }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> | undefined),
    };
    if (options?.auth !== false) {
      const token = await getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    const { auth: _auth, ...fetchOpts } = options ?? {};
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOpts,
      headers,
    });
    const data = (await res.json().catch(() => ({}))) as T & { error?: string };
    if (!res.ok) {
      return {
        ok: false,
        error: typeof data.error === 'string' ? data.error : `Request failed (${res.status})`,
        status: res.status,
      };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: 'Could not reach SoulLink API', status: 0 };
  }
}

export async function registerWithEmail(
  email: string,
  password: string,
): Promise<{ ok: true; data: AuthResponse } | { ok: false; error: string }> {
  const result = await apiFetch<AuthResponse>('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    auth: false,
  });
  return result.ok ? { ok: true, data: result.data } : { ok: false, error: result.error };
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<{ ok: true; data: AuthResponse } | { ok: false; error: string }> {
  const result = await apiFetch<AuthResponse>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    auth: false,
  });
  return result.ok ? { ok: true, data: result.data } : { ok: false, error: result.error };
}

export async function loginWithGoogleToken(
  idToken: string,
): Promise<{ ok: true; data: AuthResponse } | { ok: false; error: string }> {
  const result = await apiFetch<AuthResponse>('/api/auth/google/', {
    method: 'POST',
    body: JSON.stringify({ id_token: idToken }),
    auth: false,
  });
  return result.ok ? { ok: true, data: result.data } : { ok: false, error: result.error };
}

export async function loginWithAppleToken(
  identityToken: string,
  email?: string | null,
): Promise<{ ok: true; data: AuthResponse } | { ok: false; error: string }> {
  const result = await apiFetch<AuthResponse>('/api/auth/apple/', {
    method: 'POST',
    body: JSON.stringify({ identity_token: identityToken, email: email ?? '' }),
    auth: false,
  });
  return result.ok ? { ok: true, data: result.data } : { ok: false, error: result.error };
}

export async function fetchMe(): Promise<ApiProfile | null> {
  const result = await apiFetch<{ user: ApiProfile }>('/api/auth/me/');
  return result.ok ? result.data.user : null;
}

export async function checkUsernameAvailable(
  username: string,
  userId?: string,
): Promise<boolean> {
  const params = new URLSearchParams({ username });
  if (userId) params.set('user_id', userId);
  const result = await apiFetch<{ available: boolean }>(
    `/api/username/available/?${params}`,
    { auth: false },
  );
  return result.ok ? result.data.available : true;
}

export async function syncProfile(profile: {
  username: string;
  email?: string;
  auth_method: string;
  emotion?: string;
}): Promise<ApiProfile | null> {
  const result = await apiFetch<ApiProfile>('/api/profile/', {
    method: 'POST',
    body: JSON.stringify(profile),
  });
  return result.ok ? result.data : null;
}

export async function fetchMatches(emotion: string): Promise<ApiProfile[]> {
  const params = new URLSearchParams({ emotion });
  const result = await apiFetch<{ matches: ApiProfile[] }>(`/api/matches/?${params}`);
  return result.ok ? result.data.matches : [];
}

export async function checkApiHealth(): Promise<boolean> {
  const result = await apiFetch<{ ok: boolean }>('/api/health/', { auth: false });
  return result.ok && result.data.ok === true;
}

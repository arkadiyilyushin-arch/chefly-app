import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const LOCAL_VAULT = 'chefly.remoteVault.v1';

export type SyncPayload = {
  userId: string;
  followingIds: string[];
  savedPostIds: string[];
  updatedAt: number;
};

function apiBase(): string | null {
  const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  const url = (fromEnv || extra?.apiUrl || '').replace(/\/$/, '');
  return url || null;
}

/** Push engagement vault to remote Worker if configured, else local mirror. */
export async function pushSync(payload: SyncPayload): Promise<{ ok: boolean; remote: boolean }> {
  const base = apiBase();
  await AsyncStorage.setItem(LOCAL_VAULT, JSON.stringify(payload));
  if (!base) return { ok: true, remote: false };

  try {
    const res = await fetch(`${base}/v1/sync/${encodeURIComponent(payload.userId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, remote: true };
  } catch {
    return { ok: false, remote: true };
  }
}

export async function pullSync(userId: string): Promise<SyncPayload | null> {
  const base = apiBase();
  if (base) {
    try {
      const res = await fetch(`${base}/v1/sync/${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = (await res.json()) as SyncPayload;
        await AsyncStorage.setItem(LOCAL_VAULT, JSON.stringify(data));
        return data;
      }
    } catch {
      // fall through to local
    }
  }
  const raw = await AsyncStorage.getItem(LOCAL_VAULT);
  return raw ? (JSON.parse(raw) as SyncPayload) : null;
}

export function hasRemoteApi() {
  return !!apiBase();
}

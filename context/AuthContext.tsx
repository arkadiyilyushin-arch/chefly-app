import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const USERS_KEY = 'chefly.users';
const SESSION_KEY = 'chefly.session';

export type User = {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, 'name' | 'bio' | 'avatar'>>) => Promise<void>;
};

type StoredUser = User & { password: string };

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop';

async function readUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as StoredUser[]) : [];
}

async function writeUsers(users: StoredUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const session = await AsyncStorage.getItem(SESSION_KEY);
        if (session) {
          const parsed = JSON.parse(session) as User;
          setUser(parsed);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const users = await readUsers();
        const found = users.find(
          (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
        );
        if (!found || found.password !== password) {
          throw new Error('Неверный email или пароль');
        }
        const next: User = {
          id: found.id,
          name: found.name,
          email: found.email,
          bio: found.bio,
          avatar: found.avatar,
        };
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
        setUser(next);
      },
      async register(name, email, password) {
        const users = await readUsers();
        const exists = users.some(
          (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
        );
        if (exists) {
          throw new Error('Пользователь с таким email уже есть');
        }
        if (password.length < 4) {
          throw new Error('Пароль должен быть не короче 4 символов');
        }
        const nextStored: StoredUser = {
          id: `u_${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          bio: 'Люблю готовить и делиться рецептами.',
          avatar: DEFAULT_AVATAR,
        };
        await writeUsers([nextStored, ...users]);
        const next: User = {
          id: nextStored.id,
          name: nextStored.name,
          email: nextStored.email,
          bio: nextStored.bio,
          avatar: nextStored.avatar,
        };
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
        setUser(next);
      },
      async logout() {
        await AsyncStorage.removeItem(SESSION_KEY);
        setUser(null);
      },
      async updateProfile(patch) {
        if (!user) return;
        const next = { ...user, ...patch };
        setUser(next);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
        const users = await readUsers();
        const updated = users.map((u) =>
          u.id === user.id ? { ...u, ...patch } : u
        );
        await writeUsers(updated);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

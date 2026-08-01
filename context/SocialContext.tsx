import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppNotification, chefs } from '@/data/mockData';
import { Colors } from '@/constants/theme';

const SOCIAL_KEY = 'chefly.social.v1';
const CLOUD_KEY = 'chefly.cloud.engagement.v1';

type SocialState = {
  followingIds: string[];
  savedPostIds: string[];
  notifications: AppNotification[];
  cloudSyncedAt: number | null;
};

type SocialContextValue = {
  followingIds: string[];
  savedPostIds: string[];
  notifications: AppNotification[];
  unreadCount: number;
  cloudSyncedAt: number | null;
  isFollowing: (authorId: string) => boolean;
  toggleFollow: (authorId: string, authorName: string) => void;
  isSaved: (postId: string) => boolean;
  toggleSave: (postId: string, postTitle: string) => void;
  pushNotification: (n: Omit<AppNotification, 'id' | 'createdAt' | 'timeAgo' | 'read'>) => void;
  markAllRead: () => void;
  syncCloud: () => Promise<void>;
};

const empty: SocialState = {
  followingIds: ['chef_elena', 'chef_marco'],
  savedPostIds: [],
  notifications: [
    {
      id: 'n0',
      type: 'post',
      title: 'Добро пожаловать в Chefly',
      body: 'Подписывайтесь на шефов и сохраняйте рецепты в избранное.',
      timeAgo: 'сейчас',
      read: false,
      createdAt: Date.now(),
    },
  ],
  cloudSyncedAt: null,
};

const SocialContext = createContext<SocialContextValue | null>(null);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SocialState>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [local, cloud] = await Promise.all([
        AsyncStorage.getItem(SOCIAL_KEY),
        AsyncStorage.getItem(CLOUD_KEY),
      ]);
      let next = empty;
      if (local) next = { ...empty, ...(JSON.parse(local) as SocialState) };
      // Merge cloud engagement (saved + following) as shared vault on device
      if (cloud) {
        const c = JSON.parse(cloud) as Partial<SocialState>;
        next = {
          ...next,
          followingIds: Array.from(new Set([...(c.followingIds ?? []), ...next.followingIds])),
          savedPostIds: Array.from(new Set([...(c.savedPostIds ?? []), ...next.savedPostIds])),
          cloudSyncedAt: c.cloudSyncedAt ?? next.cloudSyncedAt,
        };
      }
      setState(next);
      setReady(true);
    })();
  }, []);

  const persist = useCallback(async (next: SocialState) => {
    setState(next);
    await AsyncStorage.setItem(SOCIAL_KEY, JSON.stringify(next));
  }, []);

  const value = useMemo<SocialContextValue>(() => {
    return {
      followingIds: state.followingIds,
      savedPostIds: state.savedPostIds,
      notifications: state.notifications,
      unreadCount: state.notifications.filter((n) => !n.read).length,
      cloudSyncedAt: state.cloudSyncedAt,
      isFollowing: (authorId) => state.followingIds.includes(authorId),
      toggleFollow: (authorId, authorName) => {
        const on = state.followingIds.includes(authorId);
        const followingIds = on
          ? state.followingIds.filter((id) => id !== authorId)
          : [...state.followingIds, authorId];
        const note: AppNotification = {
          id: `n_${Date.now()}`,
          type: 'follow',
          title: on ? 'Отписка' : 'Новая подписка',
          body: on ? `Вы отписались от ${authorName}` : `Вы подписались на ${authorName}`,
          timeAgo: 'сейчас',
          read: false,
          createdAt: Date.now(),
        };
        void persist({
          ...state,
          followingIds,
          notifications: [note, ...state.notifications].slice(0, 50),
        });
      },
      isSaved: (postId) => state.savedPostIds.includes(postId),
      toggleSave: (postId, postTitle) => {
        const on = state.savedPostIds.includes(postId);
        const savedPostIds = on
          ? state.savedPostIds.filter((id) => id !== postId)
          : [...state.savedPostIds, postId];
        const note: AppNotification = {
          id: `n_${Date.now()}`,
          type: 'save',
          title: on ? 'Убрано из избранного' : 'Сохранено в избранное',
          body: postTitle,
          timeAgo: 'сейчас',
          read: false,
          createdAt: Date.now(),
          postId,
        };
        void persist({
          ...state,
          savedPostIds,
          notifications: [note, ...state.notifications].slice(0, 50),
        });
      },
      pushNotification: (n) => {
        const note: AppNotification = {
          ...n,
          id: `n_${Date.now()}`,
          createdAt: Date.now(),
          timeAgo: 'сейчас',
          read: false,
        };
        void persist({
          ...state,
          notifications: [note, ...state.notifications].slice(0, 50),
        });
      },
      markAllRead: () => {
        void persist({
          ...state,
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        });
      },
      async syncCloud() {
        const syncedAt = Date.now();
        const cloudPayload = {
          followingIds: state.followingIds,
          savedPostIds: state.savedPostIds,
          cloudSyncedAt: syncedAt,
          chefsKnown: chefs.map((c) => c.id),
        };
        await AsyncStorage.setItem(CLOUD_KEY, JSON.stringify(cloudPayload));
        await persist({ ...state, cloudSyncedAt: syncedAt });
      },
    };
  }, [state, persist]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocial() {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error('useSocial must be used within SocialProvider');
  return ctx;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppNotification, chefs } from '@/data/mockData';
import { Colors } from '@/constants/theme';
import { pullSync, pushSync } from '@/services/syncApi';

const SOCIAL_KEY = 'chefly.social.v2';
const CLOUD_KEY = 'chefly.cloud.engagement.v2';

export type Collection = {
  id: string;
  name: string;
  postIds: string[];
};

export type Challenge = {
  postId: string;
  joined: boolean;
  cookCount: number;
};

export type FeedPrefs = {
  muteByDefault: boolean;
  wifiOnlyAutoplay: boolean;
};

type SocialState = {
  followingIds: string[];
  savedPostIds: string[];
  notifications: AppNotification[];
  cloudSyncedAt: number | null;
  collections: Collection[];
  mutedAuthorIds: string[];
  lessAuthorIds: string[];
  challenges: Challenge[];
  ratings: Record<string, number>;
  prefs: FeedPrefs;
};

type SocialContextValue = {
  followingIds: string[];
  savedPostIds: string[];
  notifications: AppNotification[];
  unreadCount: number;
  cloudSyncedAt: number | null;
  collections: Collection[];
  mutedAuthorIds: string[];
  lessAuthorIds: string[];
  challenges: Challenge[];
  ratings: Record<string, number>;
  prefs: FeedPrefs;
  isFollowing: (authorId: string) => boolean;
  toggleFollow: (authorId: string, authorName: string) => void;
  isSaved: (postId: string) => boolean;
  toggleSave: (postId: string, postTitle: string) => void;
  addToCollection: (collectionId: string, postId: string) => void;
  removeFromCollection: (collectionId: string, postId: string) => void;
  createCollection: (name: string) => void;
  muteAuthor: (authorId: string) => void;
  showLessOfAuthor: (authorId: string) => void;
  unmuteAuthor: (authorId: string) => void;
  joinChallenge: (postId: string) => void;
  isInChallenge: (postId: string) => boolean;
  getChallengeCount: (postId: string) => number;
  rateRecipe: (postId: string, stars: number) => void;
  getRating: (postId: string) => number | undefined;
  setPrefs: (patch: Partial<FeedPrefs>) => void;
  pushNotification: (n: Omit<AppNotification, 'id' | 'createdAt' | 'timeAgo' | 'read'>) => void;
  markAllRead: () => void;
  syncCloud: () => Promise<void>;
};

const defaultCollections: Collection[] = [
  { id: 'col_breakfast', name: 'Завтраки', postIds: [] },
  { id: 'col_guests', name: 'Гости', postIds: [] },
  { id: 'col_quick', name: 'Быстрое', postIds: [] },
];

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
  collections: defaultCollections,
  mutedAuthorIds: [],
  lessAuthorIds: [],
  challenges: [
    { postId: '3', joined: false, cookCount: 128 },
    { postId: '1', joined: false, cookCount: 64 },
  ],
  ratings: {},
  prefs: { muteByDefault: true, wifiOnlyAutoplay: false },
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
      if (local) {
        const parsed = JSON.parse(local) as Partial<SocialState>;
        next = {
          ...empty,
          ...parsed,
          collections: parsed.collections?.length ? parsed.collections : defaultCollections,
          prefs: { ...empty.prefs, ...(parsed.prefs ?? {}) },
          challenges: parsed.challenges?.length ? parsed.challenges : empty.challenges,
        };
      }
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
      collections: state.collections,
      mutedAuthorIds: state.mutedAuthorIds,
      lessAuthorIds: state.lessAuthorIds,
      challenges: state.challenges,
      ratings: state.ratings,
      prefs: state.prefs,
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
        const collections = on
          ? state.collections.map((c) => ({
              ...c,
              postIds: c.postIds.filter((id) => id !== postId),
            }))
          : state.collections;
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
          collections,
          notifications: [note, ...state.notifications].slice(0, 50),
        });
      },
      addToCollection: (collectionId, postId) => {
        const collections = state.collections.map((c) =>
          c.id === collectionId && !c.postIds.includes(postId)
            ? { ...c, postIds: [...c.postIds, postId] }
            : c
        );
        const savedPostIds = state.savedPostIds.includes(postId)
          ? state.savedPostIds
          : [...state.savedPostIds, postId];
        void persist({ ...state, collections, savedPostIds });
      },
      removeFromCollection: (collectionId, postId) => {
        const collections = state.collections.map((c) =>
          c.id === collectionId ? { ...c, postIds: c.postIds.filter((id) => id !== postId) } : c
        );
        void persist({ ...state, collections });
      },
      createCollection: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        void persist({
          ...state,
          collections: [
            ...state.collections,
            { id: `col_${Date.now()}`, name: trimmed, postIds: [] },
          ],
        });
      },
      muteAuthor: (authorId) => {
        if (state.mutedAuthorIds.includes(authorId)) return;
        void persist({
          ...state,
          mutedAuthorIds: [...state.mutedAuthorIds, authorId],
        });
      },
      showLessOfAuthor: (authorId) => {
        if (state.lessAuthorIds.includes(authorId)) return;
        void persist({
          ...state,
          lessAuthorIds: [...state.lessAuthorIds, authorId],
        });
      },
      unmuteAuthor: (authorId) => {
        void persist({
          ...state,
          mutedAuthorIds: state.mutedAuthorIds.filter((id) => id !== authorId),
          lessAuthorIds: state.lessAuthorIds.filter((id) => id !== authorId),
        });
      },
      joinChallenge: (postId) => {
        const existing = state.challenges.find((c) => c.postId === postId);
        let challenges: Challenge[];
        if (existing) {
          if (existing.joined) return;
          challenges = state.challenges.map((c) =>
            c.postId === postId ? { ...c, joined: true, cookCount: c.cookCount + 1 } : c
          );
        } else {
          challenges = [...state.challenges, { postId, joined: true, cookCount: 1 }];
        }
        const note: AppNotification = {
          id: `n_${Date.now()}`,
          type: 'post',
          title: 'Вы в челлендже',
          body: 'Приготовьте рецепт до конца недели',
          timeAgo: 'сейчас',
          read: false,
          createdAt: Date.now(),
          postId,
        };
        void persist({
          ...state,
          challenges,
          notifications: [note, ...state.notifications].slice(0, 50),
        });
      },
      isInChallenge: (postId) => !!state.challenges.find((c) => c.postId === postId)?.joined,
      getChallengeCount: (postId) =>
        state.challenges.find((c) => c.postId === postId)?.cookCount ?? 0,
      rateRecipe: (postId, stars) => {
        void persist({
          ...state,
          ratings: { ...state.ratings, [postId]: stars },
        });
      },
      getRating: (postId) => state.ratings[postId],
      setPrefs: (patch) => {
        void persist({ ...state, prefs: { ...state.prefs, ...patch } });
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
          collections: state.collections,
          cloudSyncedAt: syncedAt,
          chefsKnown: chefs.map((c) => c.id),
        };
        await AsyncStorage.setItem(CLOUD_KEY, JSON.stringify(cloudPayload));
        // Optional remote Worker + local vault mirror
        const userId = 'device';
        const remote = await pullSync(userId);
        let followingIds = state.followingIds;
        let savedPostIds = state.savedPostIds;
        if (remote) {
          followingIds = Array.from(new Set([...remote.followingIds, ...followingIds]));
          savedPostIds = Array.from(new Set([...remote.savedPostIds, ...savedPostIds]));
        }
        await pushSync({
          userId,
          followingIds,
          savedPostIds,
          updatedAt: syncedAt,
        });
        await persist({ ...state, followingIds, savedPostIds, cloudSyncedAt: syncedAt });
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

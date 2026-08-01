import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { feedPosts as seedPosts, type FeedPost } from '@/data/mockData';

const POSTS_KEY = 'chefly.posts';

type FeedContextValue = {
  posts: FeedPost[];
  loading: boolean;
  addPost: (post: Omit<FeedPost, 'id' | 'likes' | 'comments' | 'shares' | 'timeAgo' | 'liked'>) => Promise<FeedPost>;
  toggleLike: (id: string) => void;
  getPost: (id: string) => FeedPost | undefined;
};

const FeedContext = createContext<FeedContextValue | null>(null);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<FeedPost[]>(seedPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(POSTS_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as FeedPost[];
          // User posts first, then seed (dedupe by id)
          const ids = new Set(saved.map((p) => p.id));
          setPosts([...saved, ...seedPosts.filter((p) => !ids.has(p.id))]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function persist(next: FeedPost[]) {
    setPosts(next);
    const userPosts = next.filter((p) => p.id.startsWith('local_'));
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(userPosts));
  }

  const value = useMemo<FeedContextValue>(
    () => ({
      posts,
      loading,
      async addPost(input) {
        const post: FeedPost = {
          ...input,
          id: `local_${Date.now()}`,
          timeAgo: 'только что',
          likes: '0',
          comments: '0',
          shares: '0',
          liked: false,
        };
        await persist([post, ...posts]);
        return post;
      },
      toggleLike(id) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== id) return p;
            return { ...p, liked: !p.liked };
          })
        );
      },
      getPost(id) {
        return posts.find((p) => p.id === id);
      },
    }),
    [posts, loading]
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error('useFeed must be used within FeedProvider');
  return ctx;
}

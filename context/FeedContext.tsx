import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { feedPosts as seedPosts, type FeedPost, type PostComment } from '@/data/mockData';
import { useSocial } from '@/context/SocialContext';

const POSTS_KEY = 'chefly.posts.v3';
const STATE_KEY = 'chefly.feedState.v3';

type FeedState = {
  liked: Record<string, boolean>;
  hiddenIds: string[];
  likeDeltas: Record<string, number>;
  shareDeltas: Record<string, number>;
  extraComments: Record<string, PostComment[]>;
};

type NewPostInput = Omit<
  FeedPost,
  | 'id'
  | 'likesCount'
  | 'commentsCount'
  | 'sharesCount'
  | 'timeAgo'
  | 'liked'
  | 'saved'
  | 'commentsList'
  | 'hidden'
>;

type FeedContextValue = {
  posts: FeedPost[];
  loading: boolean;
  addPost: (post: NewPostInput) => Promise<FeedPost>;
  toggleLike: (id: string) => void;
  addComment: (postId: string, comment: Omit<PostComment, 'id' | 'timeAgo'>) => void;
  sharePost: (id: string) => void;
  hidePost: (id: string) => void;
  getPost: (id: string) => FeedPost | undefined;
  refresh: () => Promise<void>;
};

const emptyState: FeedState = {
  liked: {},
  hiddenIds: [],
  likeDeltas: {},
  shareDeltas: {},
  extraComments: {},
};

const FeedContext = createContext<FeedContextValue | null>(null);

function buildPosts(userPosts: FeedPost[], state: FeedState): FeedPost[] {
  const base = [...userPosts, ...seedPosts.filter((p) => !userPosts.some((u) => u.id === p.id))];
  return base
    .filter((p) => !state.hiddenIds.includes(p.id))
    .map((p) => {
      const extras = state.extraComments[p.id] ?? [];
      const commentsList = [...extras, ...(p.commentsList ?? [])];
      const liked = state.liked[p.id] ?? !!p.liked;
      return {
        ...p,
        liked,
        likesCount: Math.max(0, p.likesCount + (state.likeDeltas[p.id] ?? 0)),
        sharesCount: Math.max(0, p.sharesCount + (state.shareDeltas[p.id] ?? 0)),
        commentsList,
        commentsCount: commentsList.length,
      };
    });
}

export function FeedProvider({ children }: { children: ReactNode }) {
  const { pushNotification, syncCloud } = useSocial();
  const [userPosts, setUserPosts] = useState<FeedPost[]>([]);
  const [state, setState] = useState<FeedState>(emptyState);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [postsRaw, stateRaw] = await Promise.all([
        AsyncStorage.getItem(POSTS_KEY),
        AsyncStorage.getItem(STATE_KEY),
      ]);
      if (postsRaw) setUserPosts(JSON.parse(postsRaw) as FeedPost[]);
      if (stateRaw) setState({ ...emptyState, ...(JSON.parse(stateRaw) as FeedState) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveState = useCallback((next: FeedState) => {
    setState(next);
    void AsyncStorage.setItem(STATE_KEY, JSON.stringify(next));
  }, []);

  const posts = useMemo(() => buildPosts(userPosts, state), [userPosts, state]);

  const value = useMemo<FeedContextValue>(
    () => ({
      posts,
      loading,
      async addPost(input) {
        const post: FeedPost = {
          ...input,
          id: `local_${Date.now()}`,
          timeAgo: 'только что',
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          liked: false,
          commentsList: [],
        };
        const next = [post, ...userPosts];
        setUserPosts(next);
        await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(next));
        pushNotification({
          type: 'post',
          title: 'Пост опубликован',
          body: post.recipe?.title ?? post.text.slice(0, 60),
          postId: post.id,
        });
        void syncCloud();
        return post;
      },
      toggleLike(id) {
        const current = posts.find((p) => p.id === id);
        const wasLiked = !!current?.liked;
        saveState({
          ...state,
          liked: { ...state.liked, [id]: !wasLiked },
          likeDeltas: {
            ...state.likeDeltas,
            [id]: (state.likeDeltas[id] ?? 0) + (wasLiked ? -1 : 1),
          },
        });
        if (!wasLiked && current) {
          pushNotification({
            type: 'like',
            title: 'Лайк сохранён',
            body: `Вы лайкнули пост ${current.author}`,
            postId: id,
          });
        }
        void syncCloud();
      },
      addComment(postId, comment) {
        const entry: PostComment = {
          ...comment,
          id: `c_${Date.now()}`,
          timeAgo: 'сейчас',
        };
        saveState({
          ...state,
          extraComments: {
            ...state.extraComments,
            [postId]: [entry, ...(state.extraComments[postId] ?? [])],
          },
        });
        const post = posts.find((p) => p.id === postId);
        pushNotification({
          type: 'comment',
          title: 'Новый комментарий',
          body: comment.text.slice(0, 80),
          postId,
        });
        if (post) {
          // keep reference quiet
        }
        void syncCloud();
      },
      sharePost(id) {
        saveState({
          ...state,
          shareDeltas: {
            ...state.shareDeltas,
            [id]: (state.shareDeltas[id] ?? 0) + 1,
          },
        });
        void syncCloud();
      },
      hidePost(id) {
        if (state.hiddenIds.includes(id)) return;
        saveState({
          ...state,
          hiddenIds: [...state.hiddenIds, id],
        });
      },
      getPost(id) {
        return posts.find((p) => p.id === id);
      },
      async refresh() {
        setLoading(true);
        await syncCloud();
        await new Promise((r) => setTimeout(r, 400));
        await load();
      },
    }),
    [posts, loading, userPosts, state, saveState, load, pushNotification, syncCloud]
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error('useFeed must be used within FeedProvider');
  return ctx;
}

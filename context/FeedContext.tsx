import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { feedPosts as seedPosts, type FeedPost, type PostComment } from '@/data/mockData';
import { useSocial } from '@/context/SocialContext';
import { postTags } from '@/utils/feedRank';

const POSTS_KEY = 'chefly.posts.v4';
const STATE_KEY = 'chefly.feedState.v4';

type FeedState = {
  liked: Record<string, boolean>;
  hiddenIds: string[];
  likeDeltas: Record<string, number>;
  shareDeltas: Record<string, number>;
  extraComments: Record<string, PostComment[]>;
  commentLikes: Record<string, boolean>;
  seenIds: string[];
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
  seenIds: string[];
  preferredTags: string[];
  addPost: (post: NewPostInput) => Promise<FeedPost>;
  toggleLike: (id: string) => void;
  addComment: (
    postId: string,
    comment: Omit<PostComment, 'id' | 'timeAgo' | 'likesCount' | 'liked'>
  ) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  sharePost: (id: string) => void;
  hidePost: (id: string) => void;
  repostPost: (id: string, author: { id: string; name: string; avatar: string }) => Promise<FeedPost | null>;
  markSeen: (id: string) => void;
  getPost: (id: string) => FeedPost | undefined;
  refresh: () => Promise<void>;
};

const emptyState: FeedState = {
  liked: {},
  hiddenIds: [],
  likeDeltas: {},
  shareDeltas: {},
  extraComments: {},
  commentLikes: {},
  seenIds: [],
};

const FeedContext = createContext<FeedContextValue | null>(null);

function buildPosts(userPosts: FeedPost[], state: FeedState): FeedPost[] {
  const base = [...userPosts, ...seedPosts.filter((p) => !userPosts.some((u) => u.id === p.id))];
  return base
    .filter((p) => !state.hiddenIds.includes(p.id))
    .map((p) => {
      const extras = state.extraComments[p.id] ?? [];
      const commentsList = [...extras, ...(p.commentsList ?? [])].map((c) => {
        const key = `${p.id}:${c.id}`;
        const likedOverride = state.commentLikes[key];
        if (likedOverride === undefined) return c;
        const wasLiked = !!c.liked;
        const delta = likedOverride === wasLiked ? 0 : likedOverride ? 1 : -1;
        return {
          ...c,
          liked: likedOverride,
          likesCount: Math.max(0, (c.likesCount ?? 0) + delta),
        };
      });
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
  const { pushNotification, syncCloud, savedPostIds } = useSocial();
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

  const preferredTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const id of savedPostIds) {
      const p = posts.find((x) => x.id === id);
      if (!p) continue;
      for (const t of postTags(p)) counts.set(t, (counts.get(t) ?? 0) + 2);
    }
    for (const p of posts.filter((x) => x.liked)) {
      for (const t of postTags(p)) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([t]) => t);
  }, [posts, savedPostIds]);

  const value = useMemo<FeedContextValue>(
    () => ({
      posts,
      loading,
      seenIds: state.seenIds,
      preferredTags,
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
          likesCount: 0,
          liked: false,
        };
        saveState({
          ...state,
          extraComments: {
            ...state.extraComments,
            [postId]: [entry, ...(state.extraComments[postId] ?? [])],
          },
        });
        pushNotification({
          type: 'comment',
          title: comment.replyTo ? `Ответ @${comment.replyTo}` : 'Новый комментарий',
          body: comment.text.slice(0, 80),
          postId,
        });
        void syncCloud();
      },
      toggleCommentLike(postId, commentId) {
        const key = `${postId}:${commentId}`;
        const post = posts.find((p) => p.id === postId);
        const comment = post?.commentsList.find((c) => c.id === commentId);
        const current = state.commentLikes[key] ?? !!comment?.liked;
        saveState({
          ...state,
          commentLikes: { ...state.commentLikes, [key]: !current },
        });
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
      async repostPost(id, author) {
        const source = posts.find((p) => p.id === id);
        if (!source) return null;
        const post: FeedPost = {
          id: `repost_${Date.now()}`,
          authorId: author.id,
          author: author.name,
          avatar: author.avatar,
          timeAgo: 'только что',
          text: source.recipe
            ? `Приготовил(а) тоже: ${source.recipe.title}`
            : `Повторил(а) пост ${source.author}`,
          image: source.image,
          images: source.images,
          tags: source.tags,
          isVideo: source.isVideo,
          videoUrl: source.videoUrl,
          recipe: source.recipe,
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          liked: false,
          commentsList: [],
          repostOf: { id: source.id, author: source.author, authorId: source.authorId },
        };
        const next = [post, ...userPosts];
        setUserPosts(next);
        await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(next));
        saveState({
          ...state,
          shareDeltas: {
            ...state.shareDeltas,
            [id]: (state.shareDeltas[id] ?? 0) + 1,
          },
        });
        pushNotification({
          type: 'post',
          title: 'Репост опубликован',
          body: post.text,
          postId: post.id,
        });
        void syncCloud();
        return post;
      },
      markSeen(id) {
        if (state.seenIds.includes(id)) return;
        saveState({
          ...state,
          seenIds: [...state.seenIds, id].slice(-80),
        });
      },
      getPost(id) {
        return posts.find((p) => p.id === id);
      },
      async refresh() {
        setLoading(true);
        await syncCloud();
        await new Promise((r) => setTimeout(r, 500));
        await load();
      },
    }),
    [posts, loading, userPosts, state, saveState, load, pushNotification, syncCloud, preferredTags]
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error('useFeed must be used within FeedProvider');
  return ctx;
}

import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Avatar } from './Avatar';
import { PostVideo } from './PostVideo';
import { useFeed } from '@/context/FeedContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { FeedPost as FeedPostType } from '@/data/mockData';
import { formatCount } from '@/utils/formatCount';

type Props = {
  post: FeedPostType;
};

export function FeedPostCard({ post }: Props) {
  const router = useRouter();
  const { toggleLike, sharePost, hidePost } = useFeed();
  const { isFollowing, toggleFollow, isSaved, toggleSave } = useSocial();
  const [expanded, setExpanded] = useState(false);
  const lastTap = useRef(0);
  const heart = useSharedValue(0);
  const following = isFollowing(post.authorId);
  const saved = isSaved(post.id);

  const long = post.text.length > 90;
  const preview = long && !expanded ? `${post.text.slice(0, 90).trim()}…` : post.text;

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heart.value,
    transform: [{ scale: 0.6 + heart.value * 0.6 }],
  }));

  function openPost() {
    router.push(`/post/${post.id}` as any);
  }

  function onLike() {
    toggleLike(post.id);
  }

  function onDoubleTapLike() {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      if (!post.liked) toggleLike(post.id);
      heart.value = 0;
      heart.value = withSequence(
        withSpring(1, { damping: 8 }),
        withTiming(0, { duration: 450 })
      );
      lastTap.current = 0;
    } else {
      lastTap.current = now;
      openPost();
    }
  }

  async function onShare() {
    try {
      await Share.share({
        message: `${post.author}: ${post.text}\n\nСмотри в Chefly`,
      });
      sharePost(post.id);
    } catch {
      // cancelled
    }
  }

  function onMenu() {
    Alert.alert(post.author, undefined, [
      { text: 'Открыть', onPress: openPost },
      {
        text: following ? 'Отписаться' : 'Подписаться',
        onPress: () => toggleFollow(post.authorId, post.author),
      },
      {
        text: saved ? 'Убрать из избранного' : 'В избранное',
        onPress: () => toggleSave(post.id, post.recipe?.title ?? post.text.slice(0, 40)),
      },
      {
        text: 'Скрыть пост',
        style: 'destructive',
        onPress: () => hidePost(post.id),
      },
      { text: 'Отмена', style: 'cancel' },
    ]);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable style={styles.author} onPress={openPost}>
          <Avatar uri={post.avatar} size={42} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{post.author}</Text>
            <Text style={styles.time}>
              {post.timeAgo}
              {post.recipe ? ` · ${post.recipe.cookTimeMin} мин` : ''}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={[styles.followChip, following && styles.followChipOn]}
          onPress={() => toggleFollow(post.authorId, post.author)}
        >
          <Text style={[styles.followChipText, following && styles.followChipTextOn]}>
            {following ? 'Вы подписаны' : 'Подписка'}
          </Text>
        </Pressable>
        <Pressable hitSlop={12} onPress={onMenu}>
          <Ionicons name="ellipsis-vertical" size={18} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <Pressable onPress={openPost}>
        <Text style={styles.body}>
          {preview}
          {long && (
            <Text style={styles.more} onPress={() => setExpanded((v) => !v)}>
              {expanded ? ' Скрыть' : ' Ещё'}
            </Text>
          )}
        </Text>
        {post.recipe && (
          <View style={styles.recipeChip}>
            <Ionicons name="restaurant-outline" size={14} color={Colors.primary} />
            <Text style={styles.recipeChipText}>{post.recipe.title}</Text>
          </View>
        )}
      </Pressable>

      <Pressable style={styles.mediaWrap} onPress={onDoubleTapLike}>
        {post.isVideo && post.videoUrl ? (
          <PostVideo uri={post.videoUrl} />
        ) : (
          <Image source={{ uri: post.image }} style={styles.media} />
        )}
        <Animated.View style={[styles.heartBurst, heartStyle]} pointerEvents="none">
          <Ionicons name="heart" size={72} color="#fff" />
        </Animated.View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={onLike}>
          <Ionicons
            name={post.liked ? 'heart' : 'heart-outline'}
            size={22}
            color={post.liked ? Colors.heart : Colors.text}
          />
          <Text style={styles.count}>{formatCount(post.likesCount)}</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={openPost}>
          <Ionicons name="chatbubble-outline" size={20} color={Colors.text} />
          <Text style={styles.count}>{formatCount(post.commentsCount)}</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={onShare}>
          <Ionicons name="paper-plane-outline" size={20} color={Colors.text} />
          <Text style={styles.count}>{formatCount(post.sharesCount)}</Text>
        </Pressable>
        <Pressable
          style={[styles.action, { marginLeft: 'auto' }]}
          onPress={() => toggleSave(post.id, post.recipe?.title ?? post.text.slice(0, 40))}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? Colors.primary : Colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  author: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  name: {
    fontFamily: Fonts.semibold,
    fontSize: 15,
    color: Colors.text,
  },
  time: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  followChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.primarySoft,
  },
  followChipOn: {
    backgroundColor: Colors.border,
  },
  followChipText: {
    fontFamily: Fonts.semibold,
    fontSize: 11,
    color: Colors.primary,
  },
  followChipTextOn: {
    color: Colors.textSecondary,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  more: {
    fontFamily: Fonts.semibold,
    color: Colors.primary,
  },
  recipeChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  recipeChipText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.primaryDark,
  },
  mediaWrap: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.border,
    aspectRatio: 4 / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heartBurst: {
    position: 'absolute',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.md,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.text,
  },
});

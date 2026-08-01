import { useRef, useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';
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
import { MediaCarousel } from './MediaCarousel';
import { MentionText } from './MentionText';
import { useAuth } from '@/context/AuthContext';
import { useFeed } from '@/context/FeedContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { FeedPost as FeedPostType } from '@/data/mockData';
import { formatCount } from '@/utils/formatCount';
import { mediaUrls } from '@/utils/feedRank';

type Props = {
  post: FeedPostType;
  active?: boolean;
};

export function FeedPostCard({ post, active = false }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { toggleLike, sharePost, hidePost, repostPost } = useFeed();
  const {
    isFollowing,
    toggleFollow,
    isSaved,
    toggleSave,
    collections,
    addToCollection,
    muteAuthor,
    showLessOfAuthor,
    joinChallenge,
    isInChallenge,
    getChallengeCount,
    getRating,
  } = useSocial();
  const [expanded, setExpanded] = useState(false);
  const lastTap = useRef(0);
  const heart = useSharedValue(0);
  const following = isFollowing(post.authorId);
  const saved = isSaved(post.id);
  const inChallenge = isInChallenge(post.id);
  const challengeCount = getChallengeCount(post.id);
  const rating = getRating(post.id);

  const long = post.text.length > 90;
  const preview = long && !expanded ? `${post.text.slice(0, 90).trim()}…` : post.text;

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heart.value,
    transform: [{ scale: 0.6 + heart.value * 0.6 }],
  }));

  function openPost() {
    router.push(`/post/${post.id}` as any);
  }

  function openChef() {
    router.push(`/chef/${post.authorId}` as any);
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

  function onRepost() {
    if (!user) return;
    Alert.alert('Приготовить тоже?', `Опубликовать репост рецепта «${post.recipe?.title ?? post.author}»`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Опубликовать',
        onPress: async () => {
          const created = await repostPost(post.id, {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          });
          if (created) router.push(`/post/${created.id}` as any);
        },
      },
    ]);
  }

  function onSaveMenu() {
    const title = post.recipe?.title ?? post.text.slice(0, 40);
    Alert.alert('В избранное', 'Куда сохранить?', [
      {
        text: 'Только закладка',
        onPress: () => toggleSave(post.id, title),
      },
      ...collections.map((c) => ({
        text: c.name,
        onPress: () => addToCollection(c.id, post.id),
      })),
      { text: 'Отмена', style: 'cancel' as const },
    ]);
  }

  function onMenu() {
    Alert.alert(post.author, undefined, [
      { text: 'Открыть', onPress: openPost },
      { text: 'Профиль шефа', onPress: openChef },
      {
        text: following ? 'Отписаться' : 'Подписаться',
        onPress: () => toggleFollow(post.authorId, post.author),
      },
      {
        text: saved ? 'Убрать из избранного' : 'В избранное / коллекцию',
        onPress: () => (saved ? toggleSave(post.id, post.recipe?.title ?? post.text.slice(0, 40)) : onSaveMenu()),
      },
      { text: 'Приготовить тоже', onPress: onRepost },
      {
        text: 'Показывать меньше такого',
        onPress: () => showLessOfAuthor(post.authorId),
      },
      {
        text: 'Скрыть автора',
        style: 'destructive',
        onPress: () => muteAuthor(post.authorId),
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
      {post.repostOf ? (
        <Pressable style={styles.repostBanner} onPress={() => router.push(`/post/${post.repostOf!.id}` as any)}>
          <Ionicons name="repeat" size={14} color={Colors.primary} />
          <Text style={styles.repostText}>по рецепту {post.repostOf.author}</Text>
        </Pressable>
      ) : null}

      <View style={styles.header}>
        <Pressable style={styles.author} onPress={openChef}>
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
        <MentionText text={preview} style={styles.body} />
        {long && (
          <Text style={styles.more} onPress={() => setExpanded((v) => !v)}>
            {expanded ? 'Скрыть' : 'Ещё'}
          </Text>
        )}
        {post.recipe && (
          <View style={styles.recipeChip}>
            <Ionicons name="restaurant-outline" size={14} color={Colors.primary} />
            <Text style={styles.recipeChipText}>{post.recipe.title}</Text>
            {rating ? (
              <Text style={styles.recipeChipText}> · {rating}★</Text>
            ) : null}
          </View>
        )}
        {!!post.tags?.length && (
          <View style={styles.tags}>
            {post.tags.slice(0, 3).map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}
      </Pressable>

      {post.recipe ? (
        <Pressable
          style={[styles.challenge, inChallenge && styles.challengeOn]}
          onPress={() => joinChallenge(post.id)}
        >
          <Ionicons name="flame" size={16} color={inChallenge ? '#fff' : Colors.primary} />
          <Text style={[styles.challengeText, inChallenge && styles.challengeTextOn]}>
            {inChallenge
              ? `В челлендже · ${challengeCount} готовят`
              : `Приготовь за неделю · ${challengeCount || 12}`}
          </Text>
        </Pressable>
      ) : null}

      <View style={styles.mediaWrap}>
        <MediaCarousel
          images={mediaUrls(post)}
          isVideo={post.isVideo}
          videoUrl={post.videoUrl}
          active={active}
          onPressMedia={onDoubleTapLike}
        />
        <Animated.View style={[styles.heartBurst, heartStyle]} pointerEvents="none">
          <Ionicons name="heart" size={72} color="#fff" />
        </Animated.View>
      </View>

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
        <Pressable style={styles.action} onPress={onRepost}>
          <Ionicons name="repeat-outline" size={20} color={Colors.text} />
        </Pressable>
        <Pressable style={styles.action} onPress={onShare}>
          <Ionicons name="paper-plane-outline" size={20} color={Colors.text} />
          <Text style={styles.count}>{formatCount(post.sharesCount)}</Text>
        </Pressable>
        <Pressable
          style={[styles.action, { marginLeft: 'auto' }]}
          onPress={() =>
            saved
              ? toggleSave(post.id, post.recipe?.title ?? post.text.slice(0, 40))
              : onSaveMenu()
          }
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
  repostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  repostText: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.primary },
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
    marginBottom: Spacing.sm,
  },
  challenge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.primarySoft,
    marginBottom: Spacing.md,
  },
  challengeOn: { backgroundColor: Colors.primary },
  challengeText: { fontFamily: Fonts.semibold, fontSize: 12, color: Colors.primary },
  challengeTextOn: { color: '#fff' },
  recipeChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  recipeChipText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.primaryDark,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md },
  tag: {
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: { fontFamily: Fonts.medium, fontSize: 11, color: Colors.textSecondary },
  mediaWrap: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.border,
    aspectRatio: 4 / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBurst: {
    position: 'absolute',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
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

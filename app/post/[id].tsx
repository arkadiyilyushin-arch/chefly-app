import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { PostVideo } from '@/components/PostVideo';
import { RecipeBlock } from '@/components/RecipeBlock';
import { useAuth } from '@/context/AuthContext';
import { useFeed } from '@/context/FeedContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { formatCount } from '@/utils/formatCount';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPost, toggleLike, addComment, sharePost } = useFeed();
  const { isFollowing, toggleFollow, isSaved, toggleSave } = useSocial();
  const { user } = useAuth();
  const post = getPost(id);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [draft, setDraft] = useState('');

  if (!post) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.missing}>Пост не найден</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Назад</Text>
        </Pressable>
      </View>
    );
  }

  const following = isFollowing(post.authorId);
  const saved = isSaved(post.id);

  async function onShare() {
    try {
      await Share.share({
        message: `${post!.author}: ${post!.text}\n\nСмотри в Chefly`,
      });
      sharePost(post!.id);
    } catch {
      // cancelled
    }
  }

  function sendComment() {
    if (!user) return;
    const text = draft.trim();
    if (!text) return;
    addComment(post!.id, {
      author: user.name,
      avatar: user.avatar,
      text,
    });
    setDraft('');
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Публикация</Text>
        <Pressable onPress={onShare} style={styles.iconBtn}>
          <Ionicons name="share-outline" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Avatar uri={post.avatar} size={48} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{post.author}</Text>
            <Text style={styles.time}>{post.timeAgo}</Text>
          </View>
          <Pressable
            style={[styles.followBtn, following && styles.followBtnOn]}
            onPress={() => toggleFollow(post.authorId, post.author)}
          >
            <Text style={[styles.followText, following && styles.followTextOn]}>
              {following ? 'Вы подписаны' : 'Подписаться'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.body}>{post.text}</Text>

        <View style={styles.mediaWrap}>
          {post.isVideo && post.videoUrl ? (
            <PostVideo uri={post.videoUrl} />
          ) : (
            <Image source={{ uri: post.image }} style={styles.media} />
          )}
        </View>

        {post.recipe ? <RecipeBlock recipe={post.recipe} /> : null}

        <View style={styles.actions}>
          <Pressable style={styles.action} onPress={() => toggleLike(post.id)}>
            <Ionicons
              name={post.liked ? 'heart' : 'heart-outline'}
              size={24}
              color={post.liked ? Colors.heart : Colors.text}
            />
            <Text style={styles.count}>{formatCount(post.likesCount)}</Text>
          </Pressable>
          <View style={styles.action}>
            <Ionicons name="chatbubble-outline" size={22} color={Colors.text} />
            <Text style={styles.count}>{formatCount(post.commentsCount)}</Text>
          </View>
          <Pressable style={styles.action} onPress={onShare}>
            <Ionicons name="paper-plane-outline" size={22} color={Colors.text} />
            <Text style={styles.count}>{formatCount(post.sharesCount)}</Text>
          </Pressable>
          <Pressable
            style={[styles.action, { marginLeft: 'auto' }]}
            onPress={() => toggleSave(post.id, post.recipe?.title ?? post.text.slice(0, 40))}
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={saved ? Colors.primary : Colors.text}
            />
          </Pressable>
        </View>

        <Text style={styles.commentsTitle}>Комментарии</Text>
        {post.commentsList.length === 0 ? (
          <Text style={styles.noComments}>Пока нет комментариев — напишите первый</Text>
        ) : (
          post.commentsList.map((c) => (
            <View key={c.id} style={styles.comment}>
              <Avatar uri={c.avatar} size={36} />
              <View style={styles.commentBody}>
                <View style={styles.commentTop}>
                  <Text style={styles.commentAuthor}>{c.author}</Text>
                  <Text style={styles.commentTime}>{c.timeAgo}</Text>
                </View>
                <Text style={styles.commentText}>{c.text}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          style={styles.input}
          placeholder="Написать комментарий..."
          placeholderTextColor={Colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          multiline
        />
        <Pressable style={styles.send} onPress={sendComment}>
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  missing: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.text },
  link: { fontFamily: Fonts.semibold, color: Colors.primary },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  topTitle: { fontFamily: Fonts.bold, fontSize: 17, color: Colors.text },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  name: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.text },
  time: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  followBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  followBtnOn: { backgroundColor: Colors.primarySoft },
  followText: { fontFamily: Fonts.semibold, fontSize: 12, color: '#fff' },
  followTextOn: { color: Colors.primary },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  mediaWrap: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    aspectRatio: 4 / 3,
    backgroundColor: Colors.border,
  },
  media: { width: '100%', height: '100%' },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  count: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text },
  commentsTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  noComments: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
  },
  comment: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  commentBody: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  commentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  commentAuthor: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.text, flexShrink: 1 },
  commentTime: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted },
  commentText: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 20, color: Colors.text },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
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
import { MediaCarousel } from '@/components/MediaCarousel';
import { RecipeBlock } from '@/components/RecipeBlock';
import { useAuth } from '@/context/AuthContext';
import { useFeed } from '@/context/FeedContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { formatCount } from '@/utils/formatCount';
import { mediaUrls } from '@/utils/feedRank';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPost, toggleLike, addComment, sharePost, toggleCommentLike, repostPost } = useFeed();
  const { isFollowing, toggleFollow, isSaved, toggleSave } = useSocial();
  const { user } = useAuth();
  const post = getPost(id);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

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
      text: replyTo ? `@${replyTo} ${text.replace(new RegExp(`^@${replyTo}\\s*`), '')}` : text,
      replyTo: replyTo ?? undefined,
    });
    setDraft('');
    setReplyTo(null);
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
        {post.repostOf ? (
          <Pressable
            style={styles.repostBanner}
            onPress={() => router.push(`/post/${post.repostOf!.id}` as any)}
          >
            <Ionicons name="repeat" size={14} color={Colors.primary} />
            <Text style={styles.repostText}>по рецепту {post.repostOf.author}</Text>
          </Pressable>
        ) : null}

        <View style={styles.header}>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 }}
            onPress={() => router.push(`/chef/${post.authorId}` as any)}
          >
            <Avatar uri={post.avatar} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{post.author}</Text>
              <Text style={styles.time}>{post.timeAgo}</Text>
            </View>
          </Pressable>
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
          <MediaCarousel
            images={mediaUrls(post)}
            isVideo={post.isVideo}
            videoUrl={post.videoUrl}
            active
          />
        </View>

        {post.recipe ? <RecipeBlock recipe={post.recipe} postId={post.id} /> : null}

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
          <Pressable
            style={styles.action}
            onPress={async () => {
              if (!user) return;
              const created = await repostPost(post.id, {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
              });
              if (created) router.replace(`/post/${created.id}` as any);
            }}
          >
            <Ionicons name="repeat-outline" size={22} color={Colors.text} />
          </Pressable>
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
                {c.replyTo ? <Text style={styles.replyTo}>ответ @{c.replyTo}</Text> : null}
                <Text style={styles.commentText}>{c.text}</Text>
                <View style={styles.commentActions}>
                  <Pressable
                    style={styles.commentAction}
                    onPress={() => toggleCommentLike(post.id, c.id)}
                  >
                    <Ionicons
                      name={c.liked ? 'heart' : 'heart-outline'}
                      size={14}
                      color={c.liked ? Colors.heart : Colors.textMuted}
                    />
                    <Text style={styles.commentActionText}>{c.likesCount ?? 0}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.commentAction}
                    onPress={() => {
                      setReplyTo(c.author);
                      setDraft(`@${c.author} `);
                    }}
                  >
                    <Text style={styles.commentActionText}>Ответить</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {replyTo ? (
          <Pressable style={styles.replyChip} onPress={() => setReplyTo(null)}>
            <Text style={styles.replyChipText}>ответ @{replyTo}</Text>
            <Ionicons name="close" size={14} color={Colors.primary} />
          </Pressable>
        ) : null}
        <View style={styles.composerRow}>
          <TextInput
            style={styles.input}
            placeholder={replyTo ? `Ответ @${replyTo}` : 'Написать комментарий...'}
            placeholderTextColor={Colors.textMuted}
            value={draft}
            onChangeText={setDraft}
            multiline
          />
          <Pressable style={styles.send} onPress={sendComment}>
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
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
  repostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    marginBottom: 8,
  },
  repostText: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.primary },
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
  actions: {
    flexDirection: 'row',
    gap: Spacing.lg,
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
  replyTo: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: Colors.primary,
    marginBottom: 4,
  },
  commentText: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 20, color: Colors.text },
  commentActions: { flexDirection: 'row', gap: 16, marginTop: 8 },
  commentAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.textMuted },
  composer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: 8,
  },
  replyChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  replyChipText: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.primary },
  composerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
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

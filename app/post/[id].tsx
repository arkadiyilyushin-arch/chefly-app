import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { useFeed } from '@/context/FeedContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPost, toggleLike } = useFeed();
  const post = getPost(id);
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Публикация</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Avatar uri={post.avatar} size={48} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{post.author}</Text>
            <Text style={styles.time}>{post.timeAgo}</Text>
          </View>
        </View>

        <Text style={styles.body}>{post.text}</Text>

        <View style={styles.mediaWrap}>
          <Image source={{ uri: post.image }} style={styles.media} />
          {post.isVideo && (
            <View style={styles.playBtn}>
              <Ionicons name="play" size={26} color="#fff" style={{ marginLeft: 3 }} />
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.action} onPress={() => toggleLike(post.id)}>
            <Ionicons
              name={post.liked ? 'heart' : 'heart-outline'}
              size={24}
              color={post.liked ? Colors.heart : Colors.text}
            />
            <Text style={styles.count}>{post.likes}</Text>
          </Pressable>
          <View style={styles.action}>
            <Ionicons name="chatbubble-outline" size={22} color={Colors.text} />
            <Text style={styles.count}>{post.comments}</Text>
          </View>
          <View style={styles.action}>
            <Ionicons name="paper-plane-outline" size={22} color={Colors.text} />
            <Text style={styles.count}>{post.shares}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  missing: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: Colors.text,
  },
  link: {
    fontFamily: Fonts.semibold,
    color: Colors.primary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  topTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.text,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  name: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: Colors.text,
  },
  time: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
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
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.text,
  },
});

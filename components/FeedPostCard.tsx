import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Avatar } from './Avatar';
import { useFeed } from '@/context/FeedContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { FeedPost as FeedPostType } from '@/data/mockData';

type Props = {
  post: FeedPostType;
};

export function FeedPostCard({ post }: Props) {
  const router = useRouter();
  const { toggleLike } = useFeed();
  const [expanded, setExpanded] = useState(false);
  const long = post.text.length > 90;
  const preview = long && !expanded ? `${post.text.slice(0, 90).trim()}…` : post.text;

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/post/${post.id}` as any)}>
      <View style={styles.header}>
        <View style={styles.author}>
          <Avatar uri={post.avatar} size={42} />
          <View>
            <Text style={styles.name}>{post.author}</Text>
            <Text style={styles.time}>{post.timeAgo}</Text>
          </View>
        </View>
        <Pressable hitSlop={12} onPress={(e) => e.stopPropagation?.()}>
          <Ionicons name="ellipsis-vertical" size={18} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <Text style={styles.body}>
        {preview}
        {long && (
          <Text
            style={styles.more}
            onPress={(e) => {
              e.stopPropagation?.();
              setExpanded((v) => !v);
            }}
          >
            {expanded ? ' Скрыть' : ' Ещё'}
          </Text>
        )}
      </Text>

      <View style={styles.mediaWrap}>
        <Image source={{ uri: post.image }} style={styles.media} />
        {post.isVideo && (
          <View style={styles.playBtn}>
            <Ionicons name="play" size={22} color="#fff" style={{ marginLeft: 3 }} />
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.action}
          onPress={(e) => {
            e.stopPropagation?.();
            toggleLike(post.id);
          }}
        >
          <Ionicons
            name={post.liked ? 'heart' : 'heart-outline'}
            size={22}
            color={post.liked ? Colors.heart : Colors.text}
          />
          <Text style={styles.count}>{post.likes}</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => router.push(`/post/${post.id}` as any)}>
          <Ionicons name="chatbubble-outline" size={20} color={Colors.text} />
          <Text style={styles.count}>{post.comments}</Text>
        </Pressable>
        <Pressable style={styles.action}>
          <Ionicons name="paper-plane-outline" size={20} color={Colors.text} />
          <Text style={styles.count}>{post.shares}</Text>
        </Pressable>
      </View>
    </Pressable>
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
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  author: {
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
  body: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  more: {
    fontFamily: Fonts.semibold,
    color: Colors.primary,
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
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
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

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { ForumTopic } from '@/data/mockData';

type Props = {
  topic: ForumTopic;
};

export function ForumCard({ topic }: Props) {
  return (
    <Pressable style={styles.card}>
      <View style={styles.top}>
        <View style={styles.categoryPill}>
          <Text style={styles.category}>{topic.category}</Text>
        </View>
        {topic.pinned && (
          <View style={styles.pinned}>
            <Ionicons name="pin" size={12} color={Colors.primary} />
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{topic.title}</Text>
      <Text style={styles.excerpt} numberOfLines={2}>
        {topic.excerpt}
      </Text>

      <View style={styles.footer}>
        <View style={styles.author}>
          <Avatar uri={topic.avatar} size={28} />
          <Text style={styles.authorName}>{topic.author}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="chatbubble-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{topic.replies}</Text>
          <Ionicons name="eye-outline" size={14} color={Colors.textSecondary} style={{ marginLeft: 8 }} />
          <Text style={styles.metaText}>{topic.views}</Text>
          <Text style={[styles.metaText, { marginLeft: 8 }]}>{topic.timeAgo}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  categoryPill: {
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  category: {
    fontFamily: Fonts.semibold,
    fontSize: 11,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  pinned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pinnedText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.primary,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  excerpt: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.text,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { NewsItem } from '@/data/mockData';

type Props = {
  item: NewsItem;
};

export function NewsCard({ item }: Props) {
  return (
    <Pressable style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cover} />
      ) : null}

      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.categoryPill}>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          {item.pinned && (
            <View style={styles.pinned}>
              <Ionicons name="flash" size={12} color={Colors.primary} />
              <Text style={styles.pinnedText}>Важно</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>

        <View style={styles.footer}>
          <View style={styles.author}>
            <Avatar uri={item.avatar} size={28} />
            <Text style={styles.authorName}>{item.author}</Text>
          </View>
          <View style={styles.meta}>
            <Ionicons name="eye-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{item.views}</Text>
            <Text style={[styles.metaText, { marginLeft: 8 }]}>{item.timeAgo}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cover: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.border,
  },
  body: {
    padding: Spacing.lg,
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
    letterSpacing: 0.3,
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
    flexShrink: 1,
  },
  authorName: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.text,
    flexShrink: 1,
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

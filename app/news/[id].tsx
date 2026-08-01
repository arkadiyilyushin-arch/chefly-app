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
import { newsItems } from '@/data/mockData';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = newsItems.find((n) => n.id === id);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (!item) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.missing}>Новость не найдена</Text>
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
        <Text style={styles.topTitle}>Новость</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {item.image ? <Image source={{ uri: item.image }} style={styles.cover} /> : null}

        <View style={styles.content}>
          <View style={styles.categoryPill}>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.meta}>
            <Avatar uri={item.avatar} size={36} />
            <View>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.time}>
                {item.timeAgo} · {item.views} просмотров
              </Text>
            </View>
          </View>

          <Text style={styles.body}>
            {item.excerpt}
            {'\n\n'}
            В материале — ключевые факты и контекст для поваров и любителей кухни. Следите за
            обновлениями в разделе «Новости», чтобы не пропускать открытия ресторанов, тренды и
            профессиональные события.
            {'\n\n'}
            Chefly собирает то, что важно сообществу: от сезонных продуктов до конкурсов и новых
            форматов доставки ингредиентов.
          </Text>
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
  cover: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.border,
  },
  content: {
    padding: Spacing.lg,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  category: {
    fontFamily: Fonts.semibold,
    fontSize: 11,
    color: Colors.primary,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    color: Colors.text,
    marginBottom: Spacing.lg,
    letterSpacing: -0.3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  author: {
    fontFamily: Fonts.semibold,
    fontSize: 14,
    color: Colors.text,
  },
  time: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 26,
    color: Colors.text,
  },
});

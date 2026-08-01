import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CachedImage } from '@/components/CachedImage';
import { useFeed } from '@/context/FeedContext';
import { useMenu, WEEK_DAYS, type DayId } from '@/context/MenuContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts, getPost } = useFeed();
  const { plan, setDayMeal } = useMenu();
  const { savedPostIds } = useSocial();
  const [pickDay, setPickDay] = useState<DayId | null>(null);

  const candidates = useMemo(() => {
    const saved = posts.filter((p) => savedPostIds.includes(p.id) && p.recipe);
    return saved.length ? saved : posts.filter((p) => p.recipe);
  }, [posts, savedPostIds]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Меню на неделю</Text>
        <Pressable onPress={() => router.push('/shopping' as any)} style={styles.iconBtn}>
          <Ionicons name="cart-outline" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      <FlatList
        data={WEEK_DAYS}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: Spacing.lg, gap: 10, paddingBottom: 40 }}
        renderItem={({ item: day }) => {
          const post = plan[day.id] ? getPost(plan[day.id]!) : undefined;
          return (
            <Pressable style={styles.dayCard} onPress={() => setPickDay(day.id)}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayLabel}>{day.label}</Text>
              </View>
              {post ? (
                <View style={styles.meal}>
                  <CachedImage uri={post.image} style={styles.thumb} contentFit="cover" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mealTitle}>{post.recipe?.title ?? post.text}</Text>
                    <Text style={styles.mealMeta}>
                      {post.recipe?.cookTimeMin} мин · {post.author}
                    </Text>
                  </View>
                  <Pressable onPress={() => setDayMeal(day.id, null)} hitSlop={8}>
                    <Ionicons name="close" size={18} color={Colors.textMuted} />
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.emptyDay}>Добавить блюдо из избранного</Text>
              )}
            </Pressable>
          );
        }}
      />

      <Modal visible={!!pickDay} transparent animationType="slide" onRequestClose={() => setPickDay(null)}>
        <Pressable style={styles.backdrop} onPress={() => setPickDay(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Выберите рецепт</Text>
            <FlatList
              data={candidates}
              keyExtractor={(p) => p.id}
              style={{ maxHeight: 360 }}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.pickRow}
                  onPress={() => {
                    if (pickDay) setDayMeal(pickDay, item.id);
                    setPickDay(null);
                  }}
                >
                  <CachedImage uri={item.image} style={styles.pickThumb} contentFit="cover" />
                  <Text style={styles.pickTitle} numberOfLines={2}>
                    {item.recipe?.title ?? item.text}
                  </Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  title: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dayCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: { fontFamily: Fonts.bold, color: Colors.primary, fontSize: 13 },
  meal: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  thumb: { width: 48, height: 48, borderRadius: 10 },
  mealTitle: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text },
  mealMeta: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  emptyDay: { flex: 1, fontFamily: Fonts.regular, fontSize: 14, color: Colors.textMuted },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    maxHeight: '70%',
  },
  sheetTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text, marginBottom: Spacing.md },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  pickThumb: { width: 44, height: 44, borderRadius: 8 },
  pickTitle: { flex: 1, fontFamily: Fonts.medium, fontSize: 14, color: Colors.text },
});

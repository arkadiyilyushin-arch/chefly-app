import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFeed } from '@/context/FeedContext';
import { useMenu, WEEK_DAYS } from '@/context/MenuContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function ShoppingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getPost } = useFeed();
  const { plan, checkedItems, toggleChecked, clearChecked } = useMenu();

  const items = useMemo(() => {
    const map = new Map<string, number>();
    for (const day of WEEK_DAYS) {
      const id = plan[day.id];
      if (!id) continue;
      const post = getPost(id);
      for (const ing of post?.recipe?.ingredients ?? []) {
        map.set(ing, (map.get(ing) ?? 0) + 1);
      }
    }
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, [plan, getPost]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Список покупок</Text>
        <Pressable onPress={clearChecked} style={styles.iconBtn}>
          <Ionicons name="refresh" size={20} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.name}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Пока пусто</Text>
            <Text style={styles.emptyText}>
              Добавьте блюда в меню на неделю — ингредиенты появятся здесь
            </Text>
            <Pressable style={styles.btn} onPress={() => router.push('/menu' as any)}>
              <Text style={styles.btnText}>Открыть меню</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const on = checkedItems.includes(item.name);
          return (
            <Pressable style={styles.row} onPress={() => toggleChecked(item.name)}>
              <Ionicons
                name={on ? 'checkbox' : 'square-outline'}
                size={22}
                color={on ? Colors.primary : Colors.textMuted}
              />
              <Text style={[styles.name, on && styles.nameOn]}>{item.name}</Text>
              {item.count > 1 ? <Text style={styles.count}>×{item.count}</Text> : null}
            </Pressable>
          );
        }}
      />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  name: { flex: 1, fontFamily: Fonts.medium, fontSize: 15, color: Colors.text },
  nameOn: { textDecorationLine: 'line-through', color: Colors.textMuted },
  count: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.primary },
  empty: { alignItems: 'center', paddingTop: 60, gap: 8, paddingHorizontal: 24 },
  emptyTitle: { fontFamily: Fonts.semibold, fontSize: 17, color: Colors.text },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  btnText: { fontFamily: Fonts.semibold, color: '#fff' },
});

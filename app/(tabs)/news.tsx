import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { newsItems } from '@/data/mockData';

const FILTERS = ['Все', 'Рестораны', 'Тренды', 'События', 'Рецепты', 'Рынок', 'Технологии'];

export default function NewsScreen() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('Все');

  const filtered =
    active === 'Все' ? newsItems : newsItems.filter((n) => n.category === active);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Новости</Text>
      </View>

      <Text style={styles.subtitle}>События, тренды и кухонные новости</Text>

      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersList}
        renderItem={({ item }) => {
          const selected = item === active;
          return (
            <Pressable
              onPress={() => setActive(item)}
              style={[styles.filter, selected && styles.filterActive]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                {item}
              </Text>
            </Pressable>
          );
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <NewsCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  filtersList: {
    flexGrow: 0,
    marginBottom: Spacing.md,
  },
  filters: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  filter: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 110,
  },
});

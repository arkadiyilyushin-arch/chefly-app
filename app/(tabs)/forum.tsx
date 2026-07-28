import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ForumCard } from '@/components/ForumCard';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { forumTopics } from '@/data/mockData';
import { useState } from 'react';

const FILTERS = ['All', 'News', 'Recipes', 'Tips', 'Gear', 'Baking'];

export default function ForumScreen() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? forumTopics
      : forumTopics.filter((t) => t.category === active);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Forum</Text>
        <Pressable style={styles.newBtn}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.newBtnText}>Topic</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>News, recipes & kitchen talk</Text>

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
        renderItem={({ item }) => <ForumCard topic={item} />}
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
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  newBtnText: {
    fontFamily: Fonts.semibold,
    fontSize: 13,
    color: '#fff',
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

import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedPostCard } from '@/components/FeedPostCard';
import { Logo } from '@/components/Logo';
import { StoriesRow } from '@/components/StoriesRow';
import { StoryViewer } from '@/components/StoryViewer';
import { useFeed } from '@/context/FeedContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { stories } from '@/data/mockData';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { posts, refresh, loading } = useFeed();
  const [refreshing, setRefreshing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.author.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q)
    );
  }, [posts, query]);

  async function onRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Logo size={44} />
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} hitSlop={8} onPress={() => setSearchOpen(true)}>
            <Ionicons name="search" size={22} color={Colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn} hitSlop={8} onPress={() => setNotifOpen(true)}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            <View style={styles.dot} />
          </Pressable>
        </View>
      </View>

      {loading && posts.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <StoriesRow
              stories={stories}
              onOpen={(index) => setStoryIndex(index)}
            />
          }
          renderItem={({ item }) => <FeedPostCard post={item} />}
          contentContainerStyle={{ paddingBottom: 110 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Ничего не найдено</Text>
              <Text style={styles.emptyText}>Попробуйте другой запрос</Text>
            </View>
          }
        />
      )}

      <StoryViewer
        stories={stories}
        initialIndex={storyIndex ?? 0}
        visible={storyIndex !== null}
        onClose={() => setStoryIndex(null)}
      />

      <Modal visible={searchOpen} animationType="slide" onRequestClose={() => setSearchOpen(false)}>
        <View style={[styles.modal, { paddingTop: insets.top + 8 }]}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.textMuted} />
            <TextInput
              autoFocus
              placeholder="Поиск по ленте"
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
            <Pressable onPress={() => { setSearchOpen(false); }}>
              <Text style={styles.done}>Готово</Text>
            </Pressable>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FeedPostCard post={item} />}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: Spacing.md }}
            ListEmptyComponent={
              <Text style={styles.emptyTextCenter}>Нет совпадений</Text>
            }
          />
        </View>
      </Modal>

      <Modal visible={notifOpen} animationType="slide" transparent onRequestClose={() => setNotifOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setNotifOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Уведомления</Text>
            {[
              'Елена Росси оценила ваш интерес к закваске',
              'Шеф Марко ответил в комментариях',
              'Новая подборка новостей кухни',
            ].map((t) => (
              <View key={t} style={styles.notifRow}>
                <View style={styles.notifDot} />
                <Text style={styles.notifText}>{t}</Text>
              </View>
            ))}
            <Pressable style={styles.sheetBtn} onPress={() => setNotifOpen(false)}>
              <Text style={styles.sheetBtnText}>Закрыть</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
    paddingVertical: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.heart,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: Colors.text,
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyTextCenter: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  modal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
  },
  done: {
    fontFamily: Fonts.semibold,
    color: Colors.primary,
    fontSize: 14,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: 36,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  notifRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  notifText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  sheetBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignItems: 'center',
    paddingVertical: 14,
  },
  sheetBtnText: {
    fontFamily: Fonts.semibold,
    color: '#fff',
    fontSize: 15,
  },
});

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { FeedPostCard } from '@/components/FeedPostCard';
import { FeedSkeleton } from '@/components/FeedSkeleton';
import { Logo } from '@/components/Logo';
import { StoriesRow } from '@/components/StoriesRow';
import { StoryViewer } from '@/components/StoryViewer';
import { useFeed } from '@/context/FeedContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { chefs, stories } from '@/data/mockData';
import {
  FEED_FILTERS,
  matchesFilter,
  rankForYou,
  type FeedFilterId,
} from '@/utils/feedRank';

type Tab = 'foryou' | 'following';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts, refresh, loading, preferredTags, markSeen } = useFeed();
  const {
    followingIds,
    notifications,
    unreadCount,
    markAllRead,
    syncCloud,
    cloudSyncedAt,
    toggleFollow,
    isFollowing,
    savedPostIds,
  } = useSocial();
  const [tab, setTab] = useState<Tab>('foryou');
  const [filter, setFilter] = useState<FeedFilterId>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const scoped = useMemo(() => {
    let list =
      tab === 'following' ? posts.filter((p) => followingIds.includes(p.authorId)) : posts;
    list = list.filter((p) => matchesFilter(p, filter));
    if (tab === 'foryou') {
      // seenIds намеренно не участвуют в live-сортировке — иначе лента прыгает при скролле
      list = rankForYou(list, {
        preferredTags,
        seenIds: [],
        savedIds: savedPostIds,
      });
    }
    return list;
  }, [posts, tab, followingIds, filter, preferredTags, savedPostIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return scoped;
    return scoped.filter(
      (p) =>
        p.author.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q) ||
        (p.recipe?.title.toLowerCase().includes(q) ?? false) ||
        (p.tags ?? []).some((t) => t.includes(q))
    );
  }, [scoped, query]);

  const suggestedChefs = useMemo(
    () => chefs.filter((c) => !followingIds.includes(c.id)).slice(0, 4),
    [followingIds]
  );

  async function onRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems.find((v) => v.isViewable && v.item?.id);
    if (first?.item?.id) {
      setActiveId(first.item.id as string);
      markSeen(first.item.id as string);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const renderFilters = useCallback(
    () => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FEED_FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <Pressable
              key={f.id}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => setFilter(f.id)}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    ),
    [filter]
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Logo size={44} />
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/favorites' as any)}>
            <Ionicons name="bookmark-outline" size={22} color={Colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => setSearchOpen(true)}>
            <Ionicons name="search" size={22} color={Colors.text} />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={() => {
              setNotifOpen(true);
              markAllRead();
            }}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            {unreadCount > 0 && <View style={styles.dot} />}
          </Pressable>
        </View>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, tab === 'foryou' && styles.tabActive]}
          onPress={() => setTab('foryou')}
        >
          <Text style={[styles.tabText, tab === 'foryou' && styles.tabTextActive]}>Для вас</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'following' && styles.tabActive]}
          onPress={() => setTab('following')}
        >
          <Text style={[styles.tabText, tab === 'following' && styles.tabTextActive]}>
            Подписки
          </Text>
        </Pressable>
      </View>

      {loading && posts.length === 0 ? (
        <FeedSkeleton />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ListHeaderComponent={
            <View>
              {tab === 'foryou' ? (
                <StoriesRow stories={stories} onOpen={(index) => setStoryIndex(index)} />
              ) : (
                <Text style={styles.followingHint}>
                  Посты шефов, на которых вы подписаны
                </Text>
              )}
              {renderFilters()}
            </View>
          }
          renderItem={({ item }) => <FeedPostCard post={item} active={activeId === item.id} />}
          contentContainerStyle={{ paddingBottom: 110 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            tab === 'following' ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Лента подписок пуста</Text>
                <Text style={styles.emptyText}>Подпишитесь на шефов — вот кого стоит открыть</Text>
                <View style={styles.suggestList}>
                  {suggestedChefs.map((c) => (
                    <Pressable
                      key={c.id}
                      style={styles.suggestCard}
                      onPress={() => router.push(`/chef/${c.id}` as any)}
                    >
                      <Avatar uri={c.avatar} size={52} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.suggestName}>{c.name}</Text>
                        <Text style={styles.suggestBio} numberOfLines={2}>
                          {c.bio}
                        </Text>
                      </View>
                      <Pressable
                        style={[styles.miniFollow, isFollowing(c.id) && styles.miniFollowOn]}
                        onPress={() => toggleFollow(c.id, c.name)}
                      >
                        <Text
                          style={[styles.miniFollowText, isFollowing(c.id) && styles.miniFollowTextOn]}
                        >
                          {isFollowing(c.id) ? '✓' : '+'}
                        </Text>
                      </Pressable>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Ничего не найдено</Text>
                <Text style={styles.emptyText}>Смените фильтр или поисковый запрос</Text>
              </View>
            )
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
              placeholder="Поиск по ленте и рецептам"
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
            <Pressable onPress={() => setSearchOpen(false)}>
              <Text style={styles.done}>Готово</Text>
            </Pressable>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FeedPostCard post={item} />}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: Spacing.md }}
          />
        </View>
      </Modal>

      <Modal visible={notifOpen} animationType="slide" transparent onRequestClose={() => setNotifOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setNotifOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>Уведомления</Text>
              <Pressable onPress={() => syncCloud()}>
                <Text style={styles.sync}>
                  {cloudSyncedAt ? 'Синхронизировано' : 'Синхронизировать'}
                </Text>
              </Pressable>
            </View>
            {notifications.length === 0 ? (
              <Text style={styles.emptyText}>Пока нет уведомлений</Text>
            ) : (
              notifications.slice(0, 12).map((n) => (
                <Pressable
                  key={n.id}
                  style={styles.notifRow}
                  onPress={() => {
                    setNotifOpen(false);
                    if (n.postId) router.push(`/post/${n.postId}` as any);
                  }}
                >
                  <View style={[styles.notifDot, n.read && styles.notifDotRead]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifTitle}>{n.title}</Text>
                    <Text style={styles.notifText}>{n.body}</Text>
                  </View>
                </Pressable>
              ))
            )}
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
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
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
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  tabActive: { backgroundColor: Colors.primarySoft },
  tabText: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontFamily: Fonts.semibold },
  filters: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipOn: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  chipText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary },
  chipTextOn: { color: Colors.primary, fontFamily: Fonts.semibold },
  followingHint: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  empty: { alignItems: 'center', paddingTop: 28, paddingHorizontal: Spacing.lg, gap: 6 },
  emptyTitle: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.text },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  suggestList: { width: '100%', gap: 10, marginTop: Spacing.lg },
  suggestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestName: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text },
  suggestBio: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  miniFollow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniFollowOn: { backgroundColor: Colors.primarySoft },
  miniFollowText: { fontFamily: Fonts.bold, color: '#fff', fontSize: 18 },
  miniFollowTextOn: { color: Colors.primary },
  modal: { flex: 1, backgroundColor: Colors.background },
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
  searchInput: { flex: 1, fontFamily: Fonts.regular, fontSize: 15, color: Colors.text },
  done: { fontFamily: Fonts.semibold, color: Colors.primary, fontSize: 14 },
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
    maxHeight: '75%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sheetHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sheetTitle: { fontFamily: Fonts.bold, fontSize: 20, color: Colors.text },
  sync: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.primary },
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
  notifDotRead: { backgroundColor: Colors.border },
  notifTitle: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text },
  notifText: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  sheetBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignItems: 'center',
    paddingVertical: 14,
  },
  sheetBtnText: { fontFamily: Fonts.semibold, color: '#fff', fontSize: 15 },
});

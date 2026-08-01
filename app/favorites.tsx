import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedPostCard } from '@/components/FeedPostCard';
import { useFeed } from '@/context/FeedContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts } = useFeed();
  const { savedPostIds, collections, createCollection } = useSocial();
  const [collectionId, setCollectionId] = useState<string | 'all'>('all');
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const saved = useMemo(() => {
    if (collectionId === 'all') return posts.filter((p) => savedPostIds.includes(p.id));
    const col = collections.find((c) => c.id === collectionId);
    if (!col) return [];
    return posts.filter((p) => col.postIds.includes(p.id));
  }, [posts, savedPostIds, collections, collectionId]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Избранное</Text>
        <Pressable onPress={() => setNewOpen(true)} style={styles.iconBtn}>
          <Ionicons name="folder-open-outline" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedPostCard post={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={styles.cols}>
            <Pressable
              style={[styles.colChip, collectionId === 'all' && styles.colChipOn]}
              onPress={() => setCollectionId('all')}
            >
              <Text style={[styles.colText, collectionId === 'all' && styles.colTextOn]}>
                Все ({savedPostIds.length})
              </Text>
            </Pressable>
            {collections.map((c) => (
              <Pressable
                key={c.id}
                style={[styles.colChip, collectionId === c.id && styles.colChipOn]}
                onPress={() => setCollectionId(c.id)}
              >
                <Text style={[styles.colText, collectionId === c.id && styles.colTextOn]}>
                  {c.name} ({c.postIds.length})
                </Text>
              </Pressable>
            ))}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Пока пусто</Text>
            <Text style={styles.emptyText}>
              Сохраняйте посты и раскладывайте по коллекциям: Завтраки, Гости, Быстрое
            </Text>
          </View>
        }
      />

      <Modal visible={newOpen} transparent animationType="fade" onRequestClose={() => setNewOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setNewOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Новая коллекция</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: На неделю"
              placeholderTextColor={Colors.textMuted}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <Pressable
              style={styles.createBtn}
              onPress={() => {
                if (newName.trim()) {
                  createCollection(newName.trim());
                  setNewName('');
                  setNewOpen(false);
                }
              }}
            >
              <Text style={styles.createText}>Создать</Text>
            </Pressable>
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
    marginBottom: Spacing.sm,
  },
  title: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  cols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  colChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  colChipOn: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  colText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary },
  colTextOn: { color: Colors.primary, fontFamily: Fonts.semibold },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40, gap: 8 },
  emptyTitle: { fontFamily: Fonts.semibold, fontSize: 17, color: Colors.text, marginTop: 8 },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    gap: 12,
  },
  sheetTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
  },
  createBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignItems: 'center',
    paddingVertical: 14,
  },
  createText: { fontFamily: Fonts.semibold, color: '#fff' },
});

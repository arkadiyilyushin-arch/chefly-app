import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageRow } from '@/components/MessageRow';
import { NetworkBanner } from '@/components/NetworkBanner';
import { useChat } from '@/context/ChatContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { listMessages } = useChat();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listMessages;
    return listMessages.filter(
      (m) => m.name.toLowerCase().includes(q) || m.lastMessage.toLowerCase().includes(q)
    );
  }, [listMessages, query]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <NetworkBanner />
      <View style={styles.header}>
        <Text style={styles.title}>Сообщения</Text>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          placeholder="Поиск чатов"
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => <MessageRow message={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Чатов пока нет — напишите шефу из профиля</Text>
        }
      />
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
    paddingTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 84,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    paddingHorizontal: 24,
  },
});

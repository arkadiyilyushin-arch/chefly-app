import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { useChat } from '@/context/ChatContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getThread, sendMessage } = useChat();
  const thread = getThread(id);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [draft, setDraft] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick((t) => t + 1);
  }, [thread?.bubbles.length]);

  if (!thread) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.missing}>Чат не найден</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Назад</Text>
        </Pressable>
      </View>
    );
  }

  function send() {
    sendMessage(thread!.id, draft);
    setDraft('');
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </Pressable>
        <Pressable
          style={styles.peer}
          onPress={() => {
            if (!thread.peerId.startsWith('seed_')) {
              router.push(`/chef/${thread.peerId}` as any);
            }
          }}
        >
          <Avatar uri={thread.avatar} size={36} />
          <Text style={styles.name}>{thread.name}</Text>
        </Pressable>
        <View style={styles.iconBtn} />
      </View>

      <FlatList
        data={thread.bubbles}
        keyExtractor={(m) => m.id}
        extraData={tick}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 20, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.fromMe ? styles.me : styles.them]}>
            <Text style={[styles.bubbleText, item.fromMe && styles.meText]}>{item.text}</Text>
            <Text style={[styles.time, item.fromMe && styles.meTime]}>{item.time}</Text>
          </View>
        )}
      />

      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          style={styles.input}
          placeholder="Сообщение..."
          placeholderTextColor={Colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          multiline
        />
        <Pressable style={styles.send} onPress={send}>
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  missing: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.text },
  link: { fontFamily: Fonts.semibold, color: Colors.primary },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  peer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.text },
  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  me: { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  them: { alignSelf: 'flex-start', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  bubbleText: { fontFamily: Fonts.regular, fontSize: 15, color: Colors.text, lineHeight: 21 },
  meText: { color: '#fff' },
  time: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  meTime: { color: 'rgba(255,255,255,0.7)' },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

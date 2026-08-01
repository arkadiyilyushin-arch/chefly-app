import { useMemo, useState } from 'react';
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
import { messages } from '@/data/mockData';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

type ChatMessage = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const peer = messages.find((m) => m.id === id);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [draft, setDraft] = useState('');

  const initial = useMemo<ChatMessage[]>(
    () =>
      peer
        ? [
            {
              id: '1',
              text: peer.lastMessage,
              fromMe: false,
              time: peer.timeAgo,
            },
            {
              id: '2',
              text: 'Привет! Да, давай обсудим детали 👋',
              fromMe: true,
              time: 'сейчас',
            },
          ]
        : [],
    [peer]
  );

  const [chat, setChat] = useState(initial);

  if (!peer) {
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
    const text = draft.trim();
    if (!text) return;
    setChat((prev) => [
      ...prev,
      { id: `m_${Date.now()}`, text, fromMe: true, time: 'сейчас' },
    ]);
    setDraft('');
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={8}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </Pressable>
        <Avatar uri={peer.avatar} size={36} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name} numberOfLines={1}>
            {peer.name}
          </Text>
          <Text style={styles.status}>{peer.online ? 'в сети' : 'не в сети'}</Text>
        </View>
      </View>

      <FlatList
        data={chat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.fromMe ? styles.mine : styles.theirs]}>
            <Text style={[styles.bubbleText, item.fromMe && styles.mineText]}>{item.text}</Text>
            <Text style={[styles.bubbleTime, item.fromMe && styles.mineTime]}>{item.time}</Text>
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
    paddingRight: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: Colors.text,
  },
  status: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  list: {
    padding: Spacing.lg,
    gap: 10,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: Colors.text,
  },
  mineText: {
    color: '#fff',
  },
  bubbleTime: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  mineTime: {
    color: 'rgba(255,255,255,0.75)',
  },
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

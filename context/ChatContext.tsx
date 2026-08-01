import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { messages as seedMessages, type Message } from '@/data/mockData';

const CHAT_KEY = 'chefly.chats.v1';

export type ChatBubble = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
};

export type ChatThread = {
  id: string;
  peerId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timeAgo: string;
  unread?: number;
  online?: boolean;
  bubbles: ChatBubble[];
};

type ChatContextValue = {
  threads: ChatThread[];
  listMessages: Message[];
  ensureChefChat: (chef: { id: string; name: string; avatar: string }) => string;
  getThread: (id: string) => ChatThread | undefined;
  sendMessage: (threadId: string, text: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function seedThreads(): ChatThread[] {
  return seedMessages.map((m) => ({
    id: m.id,
    peerId: `seed_${m.id}`,
    name: m.name,
    avatar: m.avatar,
    lastMessage: m.lastMessage,
    timeAgo: m.timeAgo,
    unread: m.unread,
    online: m.online,
    bubbles: [
      { id: `${m.id}_1`, text: m.lastMessage, fromMe: false, time: m.timeAgo },
      { id: `${m.id}_2`, text: 'Привет! Да, давай обсудим детали 👋', fromMe: true, time: 'сейчас' },
    ],
  }));
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<ChatThread[]>(seedThreads);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(CHAT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatThread[];
        if (parsed.length) setThreads(parsed);
      }
      setReady(true);
    })();
  }, []);

  const persist = useCallback((next: ChatThread[]) => {
    setThreads(next);
    void AsyncStorage.setItem(CHAT_KEY, JSON.stringify(next));
  }, []);

  const value = useMemo<ChatContextValue>(() => {
    return {
      threads,
      listMessages: threads.map((t) => ({
        id: t.id,
        name: t.name,
        avatar: t.avatar,
        lastMessage: t.lastMessage,
        timeAgo: t.timeAgo,
        unread: t.unread,
        online: t.online,
      })),
      ensureChefChat(chef) {
        const existing = threads.find((t) => t.peerId === chef.id || t.id === chef.id);
        if (existing) return existing.id;
        const id = `chef_${chef.id}`;
        const thread: ChatThread = {
          id,
          peerId: chef.id,
          name: chef.name,
          avatar: chef.avatar,
          lastMessage: 'Начните диалог о рецепте',
          timeAgo: 'сейчас',
          online: true,
          bubbles: [
            {
              id: `b_${Date.now()}`,
              text: `Здравствуйте! Пишу вам из профиля Chefly — хочу спросить про ваши рецепты.`,
              fromMe: true,
              time: 'сейчас',
            },
          ],
        };
        persist([thread, ...threads]);
        return id;
      },
      getThread(id) {
        return threads.find((t) => t.id === id);
      },
      sendMessage(threadId, text) {
        const trimmed = text.trim();
        if (!trimmed) return;
        const next = threads.map((t) => {
          if (t.id !== threadId) return t;
          const bubble: ChatBubble = {
            id: `b_${Date.now()}`,
            text: trimmed,
            fromMe: true,
            time: 'сейчас',
          };
          return {
            ...t,
            lastMessage: trimmed,
            timeAgo: 'сейчас',
            unread: 0,
            bubbles: [...t.bubbles, bubble],
          };
        });
        persist(next);
      },
    };
  }, [threads, persist]);

  if (!ready) return <>{children}</>;

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}

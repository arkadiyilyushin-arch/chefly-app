import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/Avatar';
import { MediaGrid } from '@/components/MediaGrid';
import { useAuth } from '@/context/AuthContext';
import { useFeed } from '@/context/FeedContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { profileMedia } from '@/data/mockData';

const TABS = [
  { key: 'grid', icon: 'grid-outline' as const, active: 'grid' as const },
  { key: 'reels', icon: 'play-circle-outline' as const, active: 'play-circle' as const },
  { key: 'tagged', icon: 'pricetag-outline' as const, active: 'pricetag' as const },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { posts } = useFeed();
  const router = useRouter();
  const [tab, setTab] = useState('reels');

  const myPostsCount = useMemo(
    () => posts.filter((p) => p.author === user?.name).length,
    [posts, user?.name]
  );

  const stats = [
    { label: 'Посты', value: String(myPostsCount || 0) },
    { label: 'Подписчики', value: '0' },
    { label: 'Подписки', value: '0' },
    { label: 'Лайки', value: '0' },
  ];

  function onLogout() {
    Alert.alert('Выйти?', 'Вы сможете войти снова в любой момент.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome' as any);
        },
      },
    ]);
  }

  if (!user) return null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.header}>
          <Avatar uri={user.avatar} size={72} />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <Pressable style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>Выйти</Text>
          </Pressable>
        </View>

        <Text style={styles.bio}>{user.bio}</Text>

        <View style={styles.stats}>
          {stats.map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tabs}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Pressable key={t.key} style={styles.tab} onPress={() => setTab(t.key)}>
                <Ionicons
                  name={active ? t.active : t.icon}
                  size={24}
                  color={active ? Colors.primary : Colors.textMuted}
                />
                {active && <View style={styles.tabDot} />}
              </Pressable>
            );
          })}
        </View>

        <MediaGrid items={profileMedia} />
      </ScrollView>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.text,
  },
  email: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  logoutText: {
    fontFamily: Fonts.semibold,
    fontSize: 13,
    color: Colors.primary,
  },
  bio: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 4,
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});

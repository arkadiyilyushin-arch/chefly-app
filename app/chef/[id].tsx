import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { FeedPostCard } from '@/components/FeedPostCard';
import { useFeed } from '@/context/FeedContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { chefs } from '@/data/mockData';

export default function ChefProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts } = useFeed();
  const { isFollowing, toggleFollow } = useSocial();

  const chef = chefs.find((c) => c.id === id);
  const chefPosts = posts.filter((p) => p.authorId === id);
  const name = chef?.name ?? chefPosts[0]?.author ?? 'Шеф';
  const avatar = chef?.avatar ?? chefPosts[0]?.avatar ?? '';
  const bio = chef?.bio ?? 'Повар в Chefly';
  const following = isFollowing(id);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Профиль шефа</Text>
        <View style={styles.iconBtn} />
      </View>

      <FlatList
        data={chefPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Avatar uri={avatar} size={86} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.bio}>{bio}</Text>
            <View style={styles.stats}>
              <Text style={styles.stat}>
                <Text style={styles.statNum}>{chefPosts.length}</Text> постов
              </Text>
            </View>
            <Pressable
              style={[styles.followBtn, following && styles.followBtnOn]}
              onPress={() => toggleFollow(id, name)}
            >
              <Text style={[styles.followText, following && styles.followTextOn]}>
                {following ? 'Вы подписаны' : 'Подписаться'}
              </Text>
            </Pressable>
            <Text style={styles.section}>Публикации</Text>
          </View>
        }
        renderItem={({ item }) => <FeedPostCard post={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>У этого шефа пока нет постов</Text>
        }
      />
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
    paddingBottom: Spacing.sm,
  },
  topTitle: { fontFamily: Fonts.bold, fontSize: 17, color: Colors.text },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: 8,
  },
  name: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.text, marginTop: 8 },
  bio: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  stats: { marginTop: 4 },
  stat: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary },
  statNum: { fontFamily: Fonts.bold, color: Colors.text },
  followBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  followBtnOn: { backgroundColor: Colors.primarySoft },
  followText: { fontFamily: Fonts.semibold, fontSize: 14, color: '#fff' },
  followTextOn: { color: Colors.primary },
  section: {
    alignSelf: 'flex-start',
    marginTop: Spacing.lg,
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.text,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
});

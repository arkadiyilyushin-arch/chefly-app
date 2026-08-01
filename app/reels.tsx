import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PostVideo } from '@/components/PostVideo';
import { useFeed } from '@/context/FeedContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { formatCount } from '@/utils/formatCount';

const { height: SCREEN_H } = Dimensions.get('window');

export default function ReelsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts, toggleLike } = useFeed();
  const { mutedAuthorIds, toggleSave, isSaved } = useSocial();
  const videos = posts.filter((p) => p.isVideo && p.videoUrl && !mutedAuthorIds.includes(p.authorId));
  const [activeId, setActiveId] = useState(videos[0]?.id ?? null);
  const itemH = SCREEN_H;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems.find((v) => v.isViewable && v.item?.id);
    if (first?.item?.id) setActiveId(first.item.id as string);
  }).current;

  return (
    <View style={styles.root}>
      <View style={[styles.top, { paddingTop: insets.top + 4 }]}>
        <Pressable onPress={() => router.back()} style={styles.close}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Reels</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={itemH}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        getItemLayout={(_, index) => ({ length: itemH, offset: itemH * index, index })}
        renderItem={({ item }) => (
          <View style={[styles.page, { height: itemH }]}>
            <PostVideo uri={item.videoUrl!} active={activeId === item.id} forcePlay />
            <View style={[styles.meta, { paddingBottom: insets.bottom + 24 }]}>
              <Pressable onPress={() => router.push(`/chef/${item.authorId}` as any)}>
                <Text style={styles.author}>@{item.author}</Text>
              </Pressable>
              <Text style={styles.caption} numberOfLines={3}>
                {item.text}
              </Text>
              {item.recipe ? <Text style={styles.recipe}>{item.recipe.title}</Text> : null}
            </View>
            <View style={[styles.side, { bottom: insets.bottom + 80 }]}>
              <Pressable style={styles.sideBtn} onPress={() => toggleLike(item.id)}>
                <Ionicons
                  name={item.liked ? 'heart' : 'heart-outline'}
                  size={28}
                  color={item.liked ? Colors.heart : '#fff'}
                />
                <Text style={styles.sideCount}>{formatCount(item.likesCount)}</Text>
              </Pressable>
              <Pressable style={styles.sideBtn} onPress={() => router.push(`/post/${item.id}` as any)}>
                <Ionicons name="chatbubble-outline" size={26} color="#fff" />
                <Text style={styles.sideCount}>{formatCount(item.commentsCount)}</Text>
              </Pressable>
              <Pressable
                style={styles.sideBtn}
                onPress={() => toggleSave(item.id, item.recipe?.title ?? item.text.slice(0, 40))}
              >
                <Ionicons
                  name={isSaved(item.id) ? 'bookmark' : 'bookmark-outline'}
                  size={26}
                  color="#fff"
                />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Пока нет видео в ленте</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  close: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Fonts.bold, fontSize: 17, color: '#fff' },
  page: { width: '100%', backgroundColor: '#000' },
  meta: {
    position: 'absolute',
    left: Spacing.lg,
    right: 80,
    bottom: 0,
    gap: 6,
  },
  author: { fontFamily: Fonts.bold, fontSize: 15, color: '#fff' },
  caption: { fontFamily: Fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 20 },
  recipe: {
    alignSelf: 'flex-start',
    marginTop: 4,
    fontFamily: Fonts.semibold,
    fontSize: 12,
    color: '#fff',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  side: { position: 'absolute', right: 12, gap: 18, alignItems: 'center' },
  sideBtn: { alignItems: 'center', gap: 4 },
  sideCount: { fontFamily: Fonts.medium, fontSize: 12, color: '#fff' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 200 },
  emptyText: { fontFamily: Fonts.medium, color: '#fff' },
});

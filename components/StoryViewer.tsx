import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { Story } from '@/data/mockData';

type Props = {
  stories: Story[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
};

const { width, height } = Dimensions.get('window');

export function StoryViewer({ stories, initialIndex, visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [index, setIndex] = useState(initialIndex);
  const story = stories[index];

  useEffect(() => {
    if (visible) setIndex(initialIndex);
  }, [visible, initialIndex]);

  if (!story) return null;

  function next() {
    if (index < stories.length - 1) setIndex((v) => v + 1);
    else onClose();
  }

  function prev() {
    if (index > 0) setIndex((v) => v - 1);
    else onClose();
  }

  function openRecipe() {
    if (!story.postId) return;
    onClose();
    router.push(`/post/${story.postId}` as any);
  }

  const photo = story.image ?? story.avatar;

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Image source={{ uri: photo }} style={styles.bg} blurRadius={20} />
        <View style={[styles.overlay, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.progressRow}>
            {stories.map((s, i) => (
              <View key={s.id} style={styles.progressTrack}>
                <View style={[styles.progressFill, i <= index && styles.progressActive]} />
              </View>
            ))}
          </View>

          <View style={styles.header}>
            <Image source={{ uri: story.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{story.name}</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.close}>
              <Ionicons name="close" size={26} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.body} pointerEvents="box-none">
            <Image source={{ uri: photo }} style={styles.photo} />
            <Text style={styles.caption}>
              {story.caption ??
                (story.isMe ? 'Ваша история на кухне' : `${story.name} делится моментом с кухни`)}
            </Text>
            {story.postId ? (
              <Pressable style={styles.cta} onPress={openRecipe}>
                <Ionicons name="restaurant-outline" size={18} color="#fff" />
                <Text style={styles.ctaText}>Открыть рецепт дня</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.tapZones} pointerEvents="box-none">
            <Pressable style={styles.zone} onPress={prev} />
            <Pressable style={styles.zone} onPress={next} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { position: 'absolute', top: 0, left: 0, width, height },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  progressFill: { flex: 1, backgroundColor: 'transparent' },
  progressActive: { backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: 10,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: Colors.primary },
  name: { flex: 1, fontFamily: Fonts.semibold, fontSize: 15, color: '#fff' },
  close: { padding: 4 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  photo: {
    width: width * 0.82,
    height: height * 0.48,
    borderRadius: Radius.xl,
  },
  caption: {
    fontFamily: Fonts.semibold,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radius.full,
    zIndex: 2,
  },
  ctaText: { fontFamily: Fonts.semibold, fontSize: 14, color: '#fff' },
  tapZones: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 120,
    flexDirection: 'row',
  },
  zone: { flex: 1 },
});

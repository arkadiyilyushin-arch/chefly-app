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
import { Colors, Fonts, Spacing } from '@/constants/theme';
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

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Image source={{ uri: story.avatar }} style={styles.bg} blurRadius={20} />
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

          <View style={styles.body}>
            <Image source={{ uri: story.avatar }} style={styles.photo} />
            <Text style={styles.caption}>
              {story.isMe ? 'Ваша история на кухне' : `${story.name} делится моментом с кухни`}
            </Text>
          </View>

          <View style={styles.tapZones}>
            <Pressable style={styles.zone} onPress={prev} />
            <Pressable style={styles.zone} onPress={next} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    opacity: 0.35,
  },
  overlay: {
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '0%',
    backgroundColor: '#fff',
  },
  progressActive: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  name: {
    flex: 1,
    fontFamily: Fonts.semibold,
    fontSize: 15,
    color: '#fff',
  },
  close: {
    padding: 4,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  photo: {
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: width * 0.36,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  caption: {
    marginTop: Spacing.xxl,
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  tapZones: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  zone: {
    flex: 1,
  },
});

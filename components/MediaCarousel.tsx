import { useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { CachedImage } from './CachedImage';
import { PostVideo } from './PostVideo';
import { Colors, Fonts, Radius } from '@/constants/theme';

type Props = {
  images: string[];
  videoUrl?: string;
  isVideo?: boolean;
  active?: boolean;
  onPressMedia?: () => void;
};

export function MediaCarousel({ images, videoUrl, isVideo, active, onPressMedia }: Props) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const urls = images.length ? images : [];

  function onLayout(e: LayoutChangeEvent) {
    setWidth(e.nativeEvent.layout.width);
  }

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!width) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  }

  if (isVideo && videoUrl) {
    return (
      <View style={styles.wrap} onLayout={onLayout}>
        <PostVideo uri={videoUrl} active={!!active} />
      </View>
    );
  }

  if (urls.length <= 1) {
    return (
      <Pressable style={styles.wrap} onPress={onPressMedia} onLayout={onLayout}>
        {urls[0] ? <CachedImage uri={urls[0]} style={styles.media} contentFit="cover" /> : null}
      </Pressable>
    );
  }

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {width > 0 && (
        <FlatList
          data={urls}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, i) => `${uri}_${i}`}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          renderItem={({ item }) => (
            <Pressable onPress={onPressMedia} style={{ width, height: '100%' }}>
              <CachedImage uri={item} style={styles.media} contentFit="cover" />
            </Pressable>
          )}
        />
      )}
      <View style={styles.badge} pointerEvents="none">
        <Text style={styles.badgeText}>
          {index + 1}/{urls.length}
        </Text>
      </View>
      <View style={styles.dots} pointerEvents="none">
        {urls.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.overlay,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: Fonts.semibold,
    fontSize: 11,
    color: '#fff',
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 14,
  },
});

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '@/constants/theme';

function Bone({ style }: { style?: object }) {
  const opacity = useSharedValue(0.45);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacity]);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.bone, style, anim]} />;
}

export function FeedSkeleton() {
  return (
    <View style={styles.list}>
      {[0, 1].map((i) => (
        <View key={i} style={styles.card}>
          <View style={styles.row}>
            <Bone style={styles.avatar} />
            <View style={{ flex: 1, gap: 8 }}>
              <Bone style={{ height: 12, width: '55%' }} />
              <Bone style={{ height: 10, width: '35%' }} />
            </View>
          </View>
          <Bone style={{ height: 12, width: '90%', marginBottom: 8 }} />
          <Bone style={{ height: 12, width: '70%', marginBottom: 14 }} />
          <Bone style={styles.media} />
          <View style={[styles.row, { marginTop: 14 }]}>
            <Bone style={{ height: 14, width: 48 }} />
            <Bone style={{ height: 14, width: 48 }} />
            <Bone style={{ height: 14, width: 48 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingTop: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  bone: { backgroundColor: Colors.border, borderRadius: 8 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  media: { width: '100%', aspectRatio: 4 / 3, borderRadius: Radius.md },
});

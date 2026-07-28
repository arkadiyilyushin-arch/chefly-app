import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';

export function Logo({ size = 36 }: { size?: number }) {
  const circle = size * 0.72;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View
        style={[
          styles.circle,
          {
            width: circle,
            height: circle,
            borderRadius: circle / 2,
            left: 0,
            top: size * 0.14,
            backgroundColor: Colors.primary,
            opacity: 0.95,
          },
        ]}
      />
      <View
        style={[
          styles.circle,
          {
            width: circle,
            height: circle,
            borderRadius: circle / 2,
            right: 0,
            top: size * 0.14,
            backgroundColor: Colors.primaryDark,
            opacity: 0.75,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  circle: {
    position: 'absolute',
  },
});

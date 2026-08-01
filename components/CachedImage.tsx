import { Image, type ImageProps } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

type Props = ImageProps & {
  uri?: string | null;
};

/** Disk-cached image to reduce flicker when scrolling the feed. */
export function CachedImage({ uri, style, ...rest }: Props) {
  return (
    <Image
      source={uri ? { uri } : undefined}
      style={[styles.base, style]}
      cachePolicy="memory-disk"
      recyclingKey={uri ?? undefined}
      transition={120}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.border,
  },
});

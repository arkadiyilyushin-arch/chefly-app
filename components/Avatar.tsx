import { StyleSheet, View, ViewStyle } from 'react-native';
import { CachedImage } from './CachedImage';
import { Colors } from '@/constants/theme';

type Props = {
  uri: string;
  size?: number;
  style?: ViewStyle;
  ring?: boolean;
  ringColor?: string;
};

export function Avatar({ uri, size = 44, style, ring, ringColor = Colors.primary }: Props) {
  const inner = size - (ring ? 4 : 0);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ring ? 2 : 0,
          borderColor: ringColor,
          padding: ring ? 2 : 0,
        },
        style,
      ]}
    >
      <CachedImage
        uri={uri}
        style={{
          width: inner,
          height: inner,
          borderRadius: inner / 2,
        }}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

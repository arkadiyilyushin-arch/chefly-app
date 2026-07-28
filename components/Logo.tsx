import { Image, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  size?: number;
  style?: ViewStyle;
};

export function Logo({ size = 40, style }: Props) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={[styles.image, { width: size, height: size, borderRadius: size * 0.22 }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

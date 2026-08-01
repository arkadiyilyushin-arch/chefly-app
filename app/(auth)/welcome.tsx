import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#2B95FF', '#4B9EFF', '#E8F3FF']}
      locations={[0, 0.45, 1]}
      style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
    >
      <View style={styles.hero}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.tagline}>Соцсеть для тех, кто любит готовить</Text>
        <Text style={styles.sub}>
          Делитесь рецептами, читайте новости кухни и общайтесь с поварами
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/(auth)/register' as any)}>
          <Text style={styles.primaryText}>Создать аккаунт</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.push('/(auth)/login' as any)}>
          <Text style={styles.secondaryText}>Войти</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 32,
    marginBottom: Spacing.md,
  },
  tagline: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  sub: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  actions: {
    gap: Spacing.md,
  },
  primaryBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.primaryDark,
  },
  secondaryBtn: {
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  secondaryText: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: '#fff',
  },
});

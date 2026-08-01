import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { Logo } from '@/components/Logo';
import { useAppMeta } from '@/context/AppMetaContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { chefs } from '@/data/mockData';

const ROLES = [
  { id: 'home' as const, title: 'Домашний повар', desc: 'Готовлю для семьи и друзей' },
  { id: 'pro' as const, title: 'Профи', desc: 'Работаю на кухне или учу' },
  { id: 'lover' as const, title: 'Фуди', desc: 'Люблю еду и новые вкусы' },
];

const CUISINES = ['итальянская', 'азиатская', 'выпечка', 'быстрое', 'веган', 'морепродукты'];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding } = useAppMeta();
  const { toggleFollow, isFollowing } = useSocial();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<'home' | 'pro' | 'lover' | null>(null);
  const [cuisines, setCuisines] = useState<string[]>([]);

  async function finish() {
    await completeOnboarding({ role, cuisines });
    router.replace('/(tabs)');
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.top}>
        <Logo size={48} />
        <Text style={styles.brand}>Chefly</Text>
      </View>

      <View style={styles.progress}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.seg, i <= step && styles.segOn]} />
        ))}
      </View>

      {step === 0 && (
        <View style={styles.body}>
          <Text style={styles.title}>Кто вы на кухне?</Text>
          <Text style={styles.sub}>Так мы подстроим ленту «Для вас»</Text>
          <View style={styles.list}>
            {ROLES.map((r) => {
              const on = role === r.id;
              return (
                <Pressable
                  key={r.id}
                  style={[styles.card, on && styles.cardOn]}
                  onPress={() => setRole(r.id)}
                >
                  <Text style={styles.cardTitle}>{r.title}</Text>
                  <Text style={styles.cardDesc}>{r.desc}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {step === 1 && (
        <View style={styles.body}>
          <Text style={styles.title}>Что любите готовить?</Text>
          <Text style={styles.sub}>Можно выбрать несколько направлений</Text>
          <View style={styles.chips}>
            {CUISINES.map((c) => {
              const on = cuisines.includes(c);
              return (
                <Pressable
                  key={c}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() =>
                    setCuisines((prev) => (on ? prev.filter((x) => x !== c) : [...prev, c]))
                  }
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.body}>
          <Text style={styles.title}>На кого подписаться?</Text>
          <Text style={styles.sub}>Выберите шефов — лента Подписки сразу оживёт</Text>
          <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 20 }}>
            {chefs.map((c) => {
              const on = isFollowing(c.id);
              return (
                <Pressable
                  key={c.id}
                  style={styles.chefRow}
                  onPress={() => toggleFollow(c.id, c.name)}
                >
                  <Avatar uri={c.avatar} size={48} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.chefName}>{c.name}</Text>
                    <Text style={styles.chefBio} numberOfLines={1}>
                      {c.bio}
                    </Text>
                  </View>
                  <View style={[styles.follow, on && styles.followOn]}>
                    <Text style={[styles.followText, on && styles.followTextOn]}>
                      {on ? '✓' : '+'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={styles.nav}>
        {step > 0 ? (
          <Pressable style={styles.secondary} onPress={() => setStep((s) => s - 1)}>
            <Text style={styles.secondaryText}>Назад</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.secondary} onPress={finish}>
            <Text style={styles.secondaryText}>Пропустить</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.primary, step === 0 && !role && styles.disabled]}
          disabled={step === 0 && !role}
          onPress={() => {
            if (step < 2) setStep((s) => s + 1);
            else void finish();
          }}
        >
          <Text style={styles.primaryText}>{step < 2 ? 'Далее' : 'В ленту'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.lg },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.lg },
  brand: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.text },
  progress: { flexDirection: 'row', gap: 6, marginBottom: Spacing.xl },
  seg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  segOn: { backgroundColor: Colors.primary },
  body: { flex: 1 },
  title: { fontFamily: Fonts.bold, fontSize: 26, color: Colors.text, marginBottom: 8 },
  sub: { fontFamily: Fonts.regular, fontSize: 15, color: Colors.textSecondary, marginBottom: Spacing.xl },
  list: { gap: 10 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cardOn: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  cardTitle: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.text },
  cardDesc: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipOn: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  chipText: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.textSecondary },
  chipTextOn: { color: Colors.primary, fontFamily: Fonts.semibold },
  chefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chefName: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.text },
  chefBio: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  follow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followOn: { backgroundColor: Colors.primarySoft },
  followText: { fontFamily: Fonts.bold, color: '#fff', fontSize: 18 },
  followTextOn: { color: Colors.primary },
  nav: { flexDirection: 'row', gap: 12 },
  secondary: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryText: { fontFamily: Fonts.semibold, color: Colors.text },
  primary: {
    flex: 1.4,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  primaryText: { fontFamily: Fonts.semibold, color: '#fff' },
  disabled: { opacity: 0.45 },
});

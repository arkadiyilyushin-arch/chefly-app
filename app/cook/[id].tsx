import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFeed } from '@/context/FeedContext';
import { useSocial } from '@/context/SocialContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function CookModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPost } = useFeed();
  const { rateRecipe, getRating } = useSocial();
  const post = getPost(id);
  const recipe = post?.recipe;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(getRating(id) ?? 0);

  const stepSeconds = useMemo(() => {
    if (!recipe) return 180;
    return Math.max(60, Math.round((recipe.cookTimeMin * 60) / Math.max(recipe.steps.length, 1)));
  }, [recipe]);

  useEffect(() => {
    setSeconds(stepSeconds);
    setRunning(false);
  }, [step, stepSeconds]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  if (!recipe) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.missing}>Рецепт не найден</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Назад</Text>
        </Pressable>
      </View>
    );
  }

  const total = recipe.steps.length;
  const current = recipe.steps[step];
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  if (done) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.recipeTitle}>Получилось?</Text>
        <Text style={styles.rateHint}>Оцените рецепт «{recipe.title}»</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable
              key={n}
              onPress={() => {
                setStars(n);
                rateRecipe(id, n);
              }}
            >
              <Ionicons
                name={n <= stars ? 'star' : 'star-outline'}
                size={36}
                color={n <= stars ? '#F5A623' : Colors.textMuted}
              />
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.navBtnPrimary} onPress={() => router.back()}>
          <Text style={styles.navPrimaryText}>{stars ? 'Сохранить оценку' : 'Закрыть'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Режим готовки</Text>
        <Text style={styles.stepLabel}>
          {step + 1}/{total}
        </Text>
      </View>

      <Text style={styles.recipeTitle}>{recipe.title}</Text>

      <View style={styles.progressRow}>
        {recipe.steps.map((_, i) => (
          <View key={i} style={[styles.progressSeg, i <= step && styles.progressOn]} />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.stepNum}>Шаг {step + 1}</Text>
        <Text style={styles.stepText}>{current}</Text>
      </View>

      <View style={styles.timerBox}>
        <Text style={styles.timer}>{mm}:{ss}</Text>
        <Text style={styles.timerHint}>Таймер на шаг</Text>
        <View style={styles.timerActions}>
          <Pressable style={styles.timerBtn} onPress={() => setRunning((v) => !v)}>
            <Ionicons name={running ? 'pause' : 'play'} size={22} color="#fff" />
            <Text style={styles.timerBtnText}>{running ? 'Пауза' : 'Старт'}</Text>
          </Pressable>
          <Pressable
            style={[styles.timerBtn, styles.timerBtnGhost]}
            onPress={() => {
              setSeconds(stepSeconds);
              setRunning(false);
            }}
          >
            <Ionicons name="refresh" size={20} color={Colors.primary} />
            <Text style={[styles.timerBtnText, { color: Colors.primary }]}>Сброс</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.nav}>
        <Pressable
          style={[styles.navBtn, step === 0 && styles.navDisabled]}
          disabled={step === 0}
          onPress={() => setStep((s) => Math.max(0, s - 1))}
        >
          <Text style={styles.navText}>Назад</Text>
        </Pressable>
        <Pressable
          style={styles.navBtnPrimary}
          onPress={() => {
            if (step < total - 1) setStep((s) => s + 1);
            else setDone(true);
          }}
        >
          <Text style={styles.navPrimaryText}>{step < total - 1 ? 'Далее' : 'Готово'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.lg },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  missing: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.text },
  link: { fontFamily: Fonts.semibold, color: Colors.primary },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontFamily: Fonts.bold, fontSize: 17, color: Colors.text },
  stepLabel: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.primary, minWidth: 44, textAlign: 'right' },
  recipeTitle: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: Spacing.xl },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  progressOn: { backgroundColor: Colors.primary },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    minHeight: 180,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepNum: {
    fontFamily: Fonts.semibold,
    fontSize: 13,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  stepText: {
    fontFamily: Fonts.semibold,
    fontSize: 22,
    lineHeight: 32,
    color: Colors.text,
  },
  timerBox: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: 6,
  },
  timer: {
    fontFamily: Fonts.bold,
    fontSize: 48,
    color: Colors.text,
    letterSpacing: 2,
  },
  timerHint: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary },
  timerActions: { flexDirection: 'row', gap: 12, marginTop: Spacing.md },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  timerBtnGhost: {
    backgroundColor: Colors.primarySoft,
  },
  timerBtnText: { fontFamily: Fonts.semibold, fontSize: 14, color: '#fff' },
  nav: {
    marginTop: 'auto',
    flexDirection: 'row',
    gap: 12,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navDisabled: { opacity: 0.4 },
  navText: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.text },
  navBtnPrimary: {
    flex: 1.4,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  navPrimaryText: { fontFamily: Fonts.semibold, fontSize: 15, color: '#fff' },
  rateHint: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  stars: { flexDirection: 'row', gap: 10, marginBottom: Spacing.xl },
});

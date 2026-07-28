import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const OPTIONS = [
  {
    icon: 'restaurant-outline' as const,
    title: 'Рецепт',
    desc: 'Поделиться блюдом с шагами и советами',
  },
  {
    icon: 'videocam-outline' as const,
    title: 'Видео готовки',
    desc: 'Снять короткий кулинарный ролик',
  },
  {
    icon: 'camera-outline' as const,
    title: 'Фото',
    desc: 'Опубликовать красивую подачу',
  },
];

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Создать</Text>
        <Pressable style={styles.postBtn}>
          <Text style={styles.postText}>Опубликовать</Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="Что вы готовите сегодня?"
        placeholderTextColor={Colors.textMuted}
        multiline
        style={styles.input}
      />

      <View style={styles.options}>
        {OPTIONS.map((opt) => (
          <Pressable key={opt.title} style={styles.option}>
            <View style={styles.optionIcon}>
              <Ionicons name={opt.icon} size={22} color={Colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{opt.title}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.text,
  },
  postBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  postText: {
    fontFamily: Fonts.semibold,
    fontSize: 14,
    color: '#fff',
  },
  input: {
    fontFamily: Fonts.regular,
    fontSize: 17,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.xl,
  },
  options: {
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: Fonts.semibold,
    fontSize: 15,
    color: Colors.text,
  },
  optionDesc: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

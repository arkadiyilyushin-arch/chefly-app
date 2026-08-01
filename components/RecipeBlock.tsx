import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { Recipe } from '@/data/mockData';

type Props = {
  recipe: Recipe;
  postId?: string;
};

export function RecipeBlock({ recipe, postId }: Props) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{recipe.title}</Text>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
          <Text style={styles.metaText}>{recipe.cookTimeMin} мин</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={16} color={Colors.primary} />
          <Text style={styles.metaText}>{recipe.servings} порц.</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="speedometer-outline" size={16} color={Colors.primary} />
          <Text style={styles.metaText}>{recipe.difficulty}</Text>
        </View>
      </View>

      {postId ? (
        <Pressable style={styles.cookBtn} onPress={() => router.push(`/cook/${postId}` as any)}>
          <Ionicons name="flame-outline" size={18} color="#fff" />
          <Text style={styles.cookBtnText}>Режим готовки</Text>
        </Pressable>
      ) : null}

      <Text style={styles.section}>Ингредиенты</Text>
      {recipe.ingredients.map((item) => (
        <View key={item} style={styles.row}>
          <View style={styles.bullet} />
          <Text style={styles.rowText}>{item}</Text>
        </View>
      ))}

      <Text style={[styles.section, { marginTop: Spacing.lg }]}>Шаги</Text>
      {recipe.steps.map((step, i) => (
        <View key={step} style={styles.step}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>{i + 1}</Text>
          </View>
          <Text style={styles.rowText}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  metaText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.primaryDark,
  },
  cookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 12,
    marginBottom: Spacing.lg,
  },
  cookBtnText: { fontFamily: Fonts.semibold, fontSize: 14, color: '#fff' },
  section: {
    fontFamily: Fonts.semibold,
    fontSize: 14,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 7,
  },
  rowText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  step: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 6,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#fff',
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { Recipe } from '@/data/mockData';

type Props = {
  recipe: Recipe;
};

export function RecipeBlock({ recipe }: Props) {
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

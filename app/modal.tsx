import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chefly</Text>
      <Text style={styles.body}>
        Соцсеть для профессиональных поваров, домашних кулинаров и всех, кто любит кухню.
        Делитесь рецептами, читайте новости и общайтесь с единомышленниками.
      </Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xxl,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
});

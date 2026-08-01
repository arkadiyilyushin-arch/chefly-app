import { StyleSheet, Text, View } from 'react-native';
import { useNetworkState } from 'expo-network';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export function NetworkBanner() {
  const network = useNetworkState();
  const offline = network.isConnected === false || network.type === 'NONE';

  if (!offline) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
      <Text style={styles.text}>Нет сети — показываем сохранённые данные</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2A2A2A',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
  },
  text: { fontFamily: Fonts.medium, fontSize: 12, color: '#fff', flex: 1 },
});

import { Tabs } from 'expo-router';
import { FloatingTabBar } from '@/components/FloatingTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...(props as any)} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Лента' }} />
      <Tabs.Screen name="news" options={{ title: 'Новости' }} />
      <Tabs.Screen name="messages" options={{ title: 'Сообщения' }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль' }} />
      <Tabs.Screen name="create" options={{ title: 'Создать' }} />
    </Tabs>
  );
}

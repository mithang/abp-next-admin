import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t('tabs.dashboard') }} />
      <Tabs.Screen name="users" options={{ title: t('tabs.users') }} />
      <Tabs.Screen name="roles" options={{ title: t('tabs.roles') }} />
      <Tabs.Screen name="account" options={{ title: t('tabs.account') }} />
    </Tabs>
  );
}

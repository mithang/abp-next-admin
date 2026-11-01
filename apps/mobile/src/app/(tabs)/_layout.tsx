import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t('tabs.dashboard') }} />
      <Tabs.Screen name="users" options={{ title: t('tabs.users') }} />
      <Tabs.Screen name="roles" options={{ title: t('tabs.roles') }} />
      <Tabs.Screen name="claim-types" options={{ title: t('tabs.claimTypes') }} />
      <Tabs.Screen name="organization-units" options={{ title: t('tabs.organizationUnits') }} />
      <Tabs.Screen name="security-logs" options={{ title: t('tabs.securityLogs') }} />
      <Tabs.Screen name="sessions" options={{ title: t('tabs.sessions') }} />
      <Tabs.Screen name="account" options={{ title: t('tabs.account') }} />
    </Tabs>
  );
}

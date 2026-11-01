import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

/**
 * Tab "Quản trị": hub cho các nhóm quản trị hệ thống thay vì mỗi nhóm một tab
 * (đã quyết: không thêm 4 tab OpenIddict, tránh 12 tab). Các nhóm quản trị
 * tiếp theo (quyền, tính năng, cài đặt, ...) sẽ thêm entry vào đây.
 */
const ENTRIES = [
  { route: '/openiddict/applications', titleKey: 'manage.openiddictApplications', descKey: 'manage.openiddictApplicationsDesc' },
  { route: '/openiddict/scopes', titleKey: 'manage.openiddictScopes', descKey: 'manage.openiddictScopesDesc' },
  { route: '/openiddict/authorizations', titleKey: 'manage.openiddictAuthorizations', descKey: 'manage.openiddictAuthorizationsDesc' },
  { route: '/openiddict/tokens', titleKey: 'manage.openiddictTokens', descKey: 'manage.openiddictTokensDesc' },
  { route: '/permissions/groups', titleKey: 'manage.permissionGroups', descKey: 'manage.permissionGroupsDesc' },
  { route: '/permissions/definitions', titleKey: 'manage.permissionDefinitions', descKey: 'manage.permissionDefinitionsDesc' },
  { route: '/features/groups', titleKey: 'manage.featureGroups', descKey: 'manage.featureGroupsDesc' },
  { route: '/features/definitions', titleKey: 'manage.featureDefinitions', descKey: 'manage.featureDefinitionsDesc' },
  { route: '/settings/system', titleKey: 'manage.systemSettings', descKey: 'manage.systemSettingsDesc' },
  { route: '/settings/definitions', titleKey: 'manage.settingDefinitions', descKey: 'manage.settingDefinitionsDesc' },
  { route: '/localization/languages', titleKey: 'manage.localizationLanguages', descKey: 'manage.localizationLanguagesDesc' },
  { route: '/localization/resources', titleKey: 'manage.localizationResources', descKey: 'manage.localizationResourcesDesc' },
  { route: '/localization/texts', titleKey: 'manage.localizationTexts', descKey: 'manage.localizationTextsDesc' },
  { route: '/data-protection/entity-type-infos', titleKey: 'manage.dataProtectionEntityTypeInfos', descKey: 'manage.dataProtectionEntityTypeInfosDesc' },
  { route: '/auditing/audit-logs', titleKey: 'manage.auditLogs', descKey: 'manage.auditLogsDesc' },
  { route: '/auditing/sys-logs', titleKey: 'manage.sysLogs', descKey: 'manage.sysLogsDesc' },
  { route: '/notifications/my-notifilers', titleKey: 'manage.myNotifications', descKey: 'manage.myNotificationsDesc' },
  { route: '/notifications/groups', titleKey: 'manage.notificationGroups', descKey: 'manage.notificationGroupsDesc' },
  { route: '/notifications/definitions', titleKey: 'manage.notificationDefinitions', descKey: 'manage.notificationDefinitionsDesc' },
  { route: '/notifications/send-records', titleKey: 'manage.notificationSendRecords', descKey: 'manage.notificationSendRecordsDesc' },
  { route: '/openapi', titleKey: 'manage.apiDocs', descKey: 'manage.apiDocsDesc' },
  { route: '/cache/caches', titleKey: 'manage.cache', descKey: 'manage.cacheDesc' },
  { route: '/ai/tools', titleKey: 'manage.aiTools', descKey: 'manage.aiToolsDesc' },
  { route: '/ai/workspaces', titleKey: 'manage.aiWorkspaces', descKey: 'manage.aiWorkspacesDesc' },
  { route: '/ai/conversations', titleKey: 'manage.aiConversations', descKey: 'manage.aiConversationsDesc' },
] as const;

export default function ManageScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AppScreen title={t('manage.title')} subtitle={t('manage.subtitle')}>
      <VStack space="sm">
        {ENTRIES.map((entry) => (
          <Pressable key={entry.route} onPress={() => router.push(entry.route)}>
            <Card className="p-4">
              <VStack space="xs">
                <Text>{t(entry.titleKey)}</Text>
                <Text>{t(entry.descKey)}</Text>
              </VStack>
            </Card>
          </Pressable>
        ))}
      </VStack>
    </AppScreen>
  );
}

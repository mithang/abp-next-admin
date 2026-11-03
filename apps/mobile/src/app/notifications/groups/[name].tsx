import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteNotificationGroup,
  getNotificationGroup,
} from '../../../features/notifications/notifications-api';

export default function NotificationGroupDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['notification-groups', name],
    queryFn: () => getNotificationGroup(name),
    enabled: Boolean(name),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        {item.description ? (
          <Text>
            {t('notificationGroups.description')}: {item.description}
          </Text>
        ) : null}
        <Text>
          {t('notificationGroups.allowSubscriptionToClients')}:{' '}
          {item.allowSubscriptionToClients ? t('featureGroups.yes') : t('featureGroups.no')}
        </Text>
        {item.isStatic ? <Text>· {t('notificationGroups.static')}</Text> : null}
        {!item.isStatic ? (
          <>
            <AppNavButton
              title={t('notificationGroups.editTitle')}
              href={`/notifications/groups/form?name=${encodeURIComponent(item.name)}`}
              variant="outline"
            />
            <AppDeleteButton
              confirmTitle={t('notificationGroups.deleteConfirmTitle')}
              confirmMessage={t('notificationGroups.deleteConfirmMessage')}
              onDelete={() => deleteNotificationGroup(name)}
              invalidateKey={['notification-groups']}
              testID="notification-group-delete"
            />
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}

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
  deleteNotificationDefinition,
  getNotificationDefinition,
} from '../../../features/notifications/notifications-api';
import {
  contentTypeName,
  lifetimeName,
  notificationTypeName,
} from '../../../features/notifications/types';

export default function NotificationDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['notification-definitions', name],
    queryFn: () => getNotificationDefinition(name),
    enabled: Boolean(name),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <Text>
          {t('notificationDefinitions.groupName')}: {item.groupName}
        </Text>
        {item.description ? (
          <Text>
            {t('notificationDefinitions.description')}: {item.description}
          </Text>
        ) : null}
        <Text>
          {t('notificationDefinitions.notificationType')}:{' '}
          {notificationTypeName(item.notificationType)}
        </Text>
        <Text>
          {t('notificationDefinitions.notificationLifetime')}:{' '}
          {lifetimeName(item.notificationLifetime)}
        </Text>
        <Text>
          {t('notificationDefinitions.contentType')}: {contentTypeName(item.contentType)}
        </Text>
        <Text>
          {t('notificationDefinitions.allowSubscriptionToClients')}:{' '}
          {item.allowSubscriptionToClients ? t('featureGroups.yes') : t('featureGroups.no')}
        </Text>
        {(item.providers ?? []).length > 0 ? (
          <Text>
            {t('notificationDefinitions.providers')}: {item.providers?.join(', ')}
          </Text>
        ) : null}
        {item.template ? (
          <Text>
            {t('notificationDefinitions.template')}: {item.template}
          </Text>
        ) : null}
        {item.isStatic ? <Text>· {t('notificationDefinitions.static')}</Text> : null}
        <AppNavButton
          title={t('notificationDefinitions.send')}
          href={`/notifications/definitions/send?name=${encodeURIComponent(item.name)}`}
        />
        {!item.isStatic ? (
          <>
            <AppNavButton
              title={t('notificationDefinitions.editTitle')}
              href={`/notifications/definitions/form?name=${encodeURIComponent(item.name)}`}
              variant="outline"
            />
            <AppDeleteButton
              confirmTitle={t('notificationDefinitions.deleteConfirmTitle')}
              confirmMessage={t('notificationDefinitions.deleteConfirmMessage')}
              onDelete={() => deleteNotificationDefinition(name)}
              invalidateKey={['notification-definitions']}
              testID="notification-definition-delete"
            />
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}

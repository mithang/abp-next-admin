import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
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
import { navHref } from '../../../lib/nav-href';

export default function NotificationDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useRouteParams<{ name: string }>();
  const query = useDetailQuery('notification-definitions', name, getNotificationDefinition);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('notificationDefinitions.groupName')} value={item.groupName} />
        <AppDetailField label={t('notificationDefinitions.description')} value={item.description} />
        <AppDetailField
          label={t('notificationDefinitions.notificationType')}
          value={notificationTypeName(item.notificationType)}
        />
        <AppDetailField
          label={t('notificationDefinitions.notificationLifetime')}
          value={lifetimeName(item.notificationLifetime)}
        />
        <AppDetailField
          label={t('notificationDefinitions.contentType')}
          value={contentTypeName(item.contentType)}
        />
        <AppDetailField
          label={t('notificationDefinitions.allowSubscriptionToClients')}
          value={item.allowSubscriptionToClients ? t('featureGroups.yes') : t('featureGroups.no')}
        />
        {(item.providers ?? []).length > 0 ? (
          <AppDetailField
            label={t('notificationDefinitions.providers')}
            value={item.providers?.join(', ')}
          />
        ) : null}
        <AppDetailField label={t('notificationDefinitions.template')} value={item.template} />
        {item.isStatic ? <Text>· {t('notificationDefinitions.static')}</Text> : null}
        <AppNavButton
          title={t('notificationDefinitions.send')}
          href={navHref('/notifications/definitions/send', { name: item.name })}
        />
        {!item.isStatic ? (
          <>
            <AppNavButton
              title={t('notificationDefinitions.editTitle')}
              href={navHref('/notifications/definitions/form', { name: item.name })}
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

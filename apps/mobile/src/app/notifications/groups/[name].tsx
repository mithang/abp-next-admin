import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppOptionalText } from '../../../components/ui/AppOptionalText';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import {
  deleteNotificationGroup,
  getNotificationGroup,
} from '../../../features/notifications/notifications-api';
import { navHref } from '../../../lib/nav-href';

export default function NotificationGroupDetailScreen() {
  const { t } = useTranslation();
  const { name } = useRouteParams<{ name: string }>();
  const query = useDetailQuery('notification-groups', name, getNotificationGroup);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('notificationGroups.description')} value={item.description} />
        <AppDetailField
          label={t('notificationGroups.allowSubscriptionToClients')}
          value={item.allowSubscriptionToClients ? t('featureGroups.yes') : t('featureGroups.no')}
        />
        <AppOptionalText show={item.isStatic} value={`· ${t('notificationGroups.static')}`} />
        {!item.isStatic ? (
          <>
            <AppNavButton
              title={t('notificationGroups.editTitle')}
              href={navHref('/notifications/groups/form', { name: item.name })}
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

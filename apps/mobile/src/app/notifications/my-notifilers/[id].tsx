import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppButton } from '../../../components/ui/AppButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { mutationErrorElement } from '../../../lib/mutation-error';
import { VStack } from '@/components/ui/vstack';
import {
  deleteMyNotification,
  getMyNotification,
  markMyNotificationsRead,
} from '../../../features/notifications/notifications-api';
import {
  contentTypeName,
  deserializeNotification,
  lifetimeName,
  NotificationReadState,
  notificationTypeName,
  readStateName,
  severityName,
} from '../../../features/notifications/types';
import { formatDateTime } from '../../../lib/dates';
import { useInvalidateQueries } from '../../../lib/mutation-success';

export default function MyNotificationDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const invalidate = useInvalidateQueries(['my-notifications']);
  const query = useDetailQuery('my-notifications', id, getMyNotification);

  const markMutation = useMutation({
    mutationFn: (state: NotificationReadState) => markMyNotificationsRead({ idList: [id], state }),
    onSuccess: invalidate,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));
  const { title, message, description } = deserializeNotification(item);
  const isUnread = item.state === NotificationReadState.UnRead;

  return (
    <AppScreen scrollable title={title || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('myNotifications.message')} value={message} />
        <AppDetailField label={t('myNotifications.description')} value={description} />
        <AppDetailField label={t('myNotifications.severity')} value={severityName(item.severity)} />
        <AppDetailField label={t('myNotifications.type')} value={notificationTypeName(item.type)} />
        <AppDetailField label={t('myNotifications.lifetime')} value={lifetimeName(item.lifetime)} />
        <AppDetailField
          label={t('myNotifications.contentType')}
          value={contentTypeName(item.contentType)}
        />
        <AppDetailField label={t('myNotifications.state')} value={readStateName(item.state)} />
        {item.creationTime ? (
          <AppDetailField
            label={t('myNotifications.creationTime')}
            value={formatDateTime(item.creationTime)}
          />
        ) : null}
        {item.data?.extraProperties ? (
          <AppDetailField
            label={t('myNotifications.data')}
            value={JSON.stringify(item.data.extraProperties)}
          />
        ) : null}
        <AppButton
          title={isUnread ? t('myNotifications.markRead') : t('myNotifications.markUnread')}
          onPress={() =>
            markMutation.mutate(
              isUnread ? NotificationReadState.Read : NotificationReadState.UnRead,
            )
          }
          loading={markMutation.isPending}
          variant="outline"
          testID="my-notification-mark"
        />
        {mutationErrorElement(markMutation)}
        <AppDeleteButton
          confirmTitle={t('myNotifications.deleteConfirmTitle')}
          confirmMessage={t('myNotifications.deleteConfirmMessage')}
          onDelete={() => deleteMyNotification(id)}
          invalidateKey={['my-notifications']}
          testID="my-notification-delete"
        />
      </VStack>
    </AppScreen>
  );
}

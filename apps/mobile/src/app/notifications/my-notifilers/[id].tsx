import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
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
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';
import { useInvalidateQueries, useInvalidateAndBack } from '../../../lib/mutation-success';

export default function MyNotificationDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const invalidate = useInvalidateQueries(['my-notifications']);
  const invalidateAndBack = useInvalidateAndBack(['my-notifications']);
  const query = useQuery({
    queryKey: ['my-notifications', id],
    queryFn: () => getMyNotification(id),
    enabled: Boolean(id),
  });

  const markMutation = useMutation({
    mutationFn: (state: NotificationReadState) => markMyNotificationsRead({ idList: [id], state }),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteMyNotification(id),
    onSuccess: invalidateAndBack,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;
  const { title, message, description } = deserializeNotification(item);
  const isUnread = item.state === NotificationReadState.UnRead;

  return (
    <AppScreen scrollable title={title || item.name} subtitle={item.name}>
      <VStack space="sm">
        {message ? (
          <Text>
            {t('myNotifications.message')}: {message}
          </Text>
        ) : null}
        {description ? (
          <Text>
            {t('myNotifications.description')}: {description}
          </Text>
        ) : null}
        <Text>
          {t('myNotifications.severity')}: {severityName(item.severity)}
        </Text>
        <Text>
          {t('myNotifications.type')}: {notificationTypeName(item.type)}
        </Text>
        <Text>
          {t('myNotifications.lifetime')}: {lifetimeName(item.lifetime)}
        </Text>
        <Text>
          {t('myNotifications.contentType')}: {contentTypeName(item.contentType)}
        </Text>
        <Text>
          {t('myNotifications.state')}: {readStateName(item.state)}
        </Text>
        {item.creationTime ? (
          <Text>
            {t('myNotifications.creationTime')}: {formatDateTime(item.creationTime)}
          </Text>
        ) : null}
        {item.data?.extraProperties ? (
          <Text>
            {t('myNotifications.data')}: {JSON.stringify(item.data.extraProperties)}
          </Text>
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
        {markMutation.isError ? <Text>{toApiError(markMutation.error).message}</Text> : null}
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('myNotifications.deleteConfirmTitle'),
              message: t('myNotifications.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="my-notification-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

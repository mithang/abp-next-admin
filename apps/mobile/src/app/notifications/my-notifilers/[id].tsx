import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
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
import { formatDateTime } from '../../../lib/dates';
import { useInvalidateQueries } from '../../../lib/mutation-success';

export default function MyNotificationDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const invalidate = useInvalidateQueries(['my-notifications']);
  const query = useQuery({
    queryKey: ['my-notifications', id],
    queryFn: () => getMyNotification(id),
    enabled: Boolean(id),
  });

  const markMutation = useMutation({
    mutationFn: (state: NotificationReadState) => markMyNotificationsRead({ idList: [id], state }),
    onSuccess: invalidate,
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

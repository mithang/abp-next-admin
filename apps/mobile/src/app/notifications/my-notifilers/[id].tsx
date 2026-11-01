import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteMyNotification, getMyNotification, markMyNotificationsRead } from '../../../features/notifications/notifications-api';
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

export default function MyNotificationDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['my-notifications', id], queryFn: () => getMyNotification(id), enabled: Boolean(id) });

  const markMutation = useMutation({
    mutationFn: (state: NotificationReadState) => markMyNotificationsRead({ idList: [id], state }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteMyNotification(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      router.back();
    },
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;
  const { title, message, description } = deserializeNotification(item);
  const isUnread = item.state === NotificationReadState.UnRead;

  return (
    <AppScreen title={title || item.name} subtitle={item.name}>
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
            {t('myNotifications.creationTime')}: {new Date(item.creationTime).toLocaleString()}
          </Text>
        ) : null}
        {item.data?.extraProperties ? (
          <Text>
            {t('myNotifications.data')}: {JSON.stringify(item.data.extraProperties)}
          </Text>
        ) : null}
        <AppButton
          title={isUnread ? t('myNotifications.markRead') : t('myNotifications.markUnread')}
          onPress={() => markMutation.mutate(isUnread ? NotificationReadState.Read : NotificationReadState.UnRead)}
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
            Alert.alert(t('myNotifications.deleteConfirmTitle'), t('myNotifications.deleteConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
            ])
          }
          testID="my-notification-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

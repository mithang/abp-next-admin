import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteNotificationGroup, getNotificationGroup } from '../../../features/notifications/notifications-api';
import { toApiError } from '../../../lib/errors';

export default function NotificationGroupDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['notification-groups', name], queryFn: () => getNotificationGroup(name), enabled: Boolean(name) });
  const deleteMutation = useMutation({
    mutationFn: () => deleteNotificationGroup(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-groups'] });
      router.back();
    },
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        {item.description ? (
          <Text>
            {t('notificationGroups.description')}: {item.description}
          </Text>
        ) : null}
        <Text>
          {t('notificationGroups.allowSubscriptionToClients')}: {item.allowSubscriptionToClients ? t('featureGroups.yes') : t('featureGroups.no')}
        </Text>
        {item.isStatic ? <Text>· {t('notificationGroups.static')}</Text> : null}
        {!item.isStatic ? (
          <>
            <AppButton
              title={t('notificationGroups.editTitle')}
              onPress={() => router.push(`/notifications/groups/form?name=${encodeURIComponent(item.name)}`)}
              variant="outline"
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                Alert.alert(t('notificationGroups.deleteConfirmTitle'), t('notificationGroups.deleteConfirmMessage'), [
                  { text: t('common.cancel'), style: 'cancel' },
                  { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
                ])
              }
              testID="notification-group-delete"
            />
          </>
        ) : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

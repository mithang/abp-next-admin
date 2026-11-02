import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteNotificationGroup,
  getNotificationGroup,
} from '../../../features/notifications/notifications-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

export default function NotificationGroupDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['notification-groups', name],
    queryFn: () => getNotificationGroup(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteNotificationGroup(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-groups'] });
      router.back();
    },
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
            <AppButton
              title={t('notificationGroups.editTitle')}
              onPress={() =>
                router.push(`/notifications/groups/form?name=${encodeURIComponent(item.name)}`)
              }
              variant="outline"
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                showConfirmDialog({
                  title: t('notificationGroups.deleteConfirmTitle'),
                  message: t('notificationGroups.deleteConfirmMessage'),
                  confirmText: t('common.delete'),
                  cancelText: t('common.cancel'),
                  onConfirm: () => deleteMutation.mutate(),
                })
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

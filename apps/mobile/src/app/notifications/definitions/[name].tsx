import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
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
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

export default function NotificationDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['notification-definitions', name],
    queryFn: () => getNotificationDefinition(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteNotificationDefinition(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-definitions'] });
      router.back();
    },
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return (
      <AppErrorState
        message={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
      />
    );
  }
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
        <AppButton
          title={t('notificationDefinitions.send')}
          onPress={() =>
            router.push(`/notifications/definitions/send?name=${encodeURIComponent(item.name)}`)
          }
        />
        {!item.isStatic ? (
          <>
            <AppButton
              title={t('notificationDefinitions.editTitle')}
              onPress={() =>
                router.push(`/notifications/definitions/form?name=${encodeURIComponent(item.name)}`)
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
                  title: t('notificationDefinitions.deleteConfirmTitle'),
                  message: t('notificationDefinitions.deleteConfirmMessage'),
                  confirmText: t('common.delete'),
                  cancelText: t('common.cancel'),
                  onConfirm: () => deleteMutation.mutate(),
                })
              }
              testID="notification-definition-delete"
            />
          </>
        ) : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

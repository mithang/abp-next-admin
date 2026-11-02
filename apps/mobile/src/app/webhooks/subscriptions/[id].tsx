import { useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteWebhookSubscription,
  getWebhookSubscription,
} from '../../../features/webhooks/webhooks-api';
import { toApiError } from '../../../lib/errors';

/**
 * Chi tiết đăng ký Webhook: webhookUri/isActive/description/webhooks/
 * headers/timeoutDuration. Secret KHÔNG hiển thị ở màn detail (đây là
 * credential của đăng ký); form sửa dùng ô nhập ẩn, nạp sẵn giá trị
 * từ DTO nên lưu không đổi vẫn giữ secret cũ — đúng modal web nhưng
 * không phơi secret ra màn xem.
 */
export default function WebhookSubscriptionDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['webhook-subscriptions', id],
    queryFn: () => getWebhookSubscription(id),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookSubscription(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['webhook-subscriptions'] });
      router.back();
    },
    onError: (error) => setActionError(toApiError(error).message),
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
    <AppScreen title={item.webhookUri}>
      <VStack space="sm">
        <Text>
          {t('webhookSubscriptions.webhookUri')}: {item.webhookUri}
        </Text>
        <Text>
          {t('webhookSubscriptions.isActive')}: {item.isActive ? t('common.yes') : t('common.no')}
        </Text>
        {item.description ? (
          <Text>
            {t('webhookSubscriptions.description')}: {item.description}
          </Text>
        ) : null}
        <Text>
          {t('webhookSubscriptions.webhooks')}: {item.webhooks.join(', ')}
        </Text>
        {item.headers && Object.keys(item.headers).length > 0 ? (
          <Text>
            {t('webhookSubscriptions.headers')}: {JSON.stringify(item.headers)}
          </Text>
        ) : null}
        {item.timeoutDuration !== undefined && item.timeoutDuration !== null ? (
          <Text>
            {t('webhookSubscriptions.timeoutDuration')}: {item.timeoutDuration}
          </Text>
        ) : null}
        {item.creationTime ? (
          <Text>
            {t('webhookSubscriptions.creationTime')}: {new Date(item.creationTime).toLocaleString()}
          </Text>
        ) : null}
        <AppButton
          title={t('webhookSubscriptions.editTitle')}
          onPress={() =>
            router.push(`/webhooks/subscriptions/form?id=${encodeURIComponent(item.id)}`)
          }
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(
              t('webhookSubscriptions.deleteConfirmTitle'),
              t('webhookSubscriptions.deleteConfirmMessage'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('common.delete'),
                  style: 'destructive',
                  onPress: () => deleteMutation.mutate(),
                },
              ],
            )
          }
        />
        {actionError ? <Text>{actionError}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

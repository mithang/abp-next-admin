import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteWebhookSubscription,
  getWebhookSubscription,
} from '../../../features/webhooks/webhooks-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

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
  const invalidateAndBack = useInvalidateAndBack(['webhook-subscriptions']);
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['webhook-subscriptions', id],
    queryFn: () => getWebhookSubscription(id),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookSubscription(id),
    onSuccess: invalidateAndBack,
    onError: (error) => setActionError(toApiError(error).message),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.webhookUri}>
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
            {t('webhookSubscriptions.creationTime')}: {formatDateTime(item.creationTime)}
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
            showConfirmDialog({
              title: t('webhookSubscriptions.deleteConfirmTitle'),
              message: t('webhookSubscriptions.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
        />
        {actionError ? <Text>{actionError}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

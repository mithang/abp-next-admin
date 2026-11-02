import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteWebhookSendAttempt,
  getWebhookSendAttempt,
  resendWebhookSendAttempt,
} from '../../../features/webhooks/webhooks-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';

/**
 * Chi tiết bản ghi gửi Webhook: đúng drawer detail của web (sự kiện:
 * webhookName/data/thời gian; subscriptionId; response + mã trạng thái;
 * request/response headers; sendExactSameData) + nút Gửi lại và Xóa
 * có xác nhận. Không có tạo/sửa (backend không có).
 */
export default function WebhookSendAttemptDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['webhook-send-attempts', id],
    queryFn: () => getWebhookSendAttempt(id),
    enabled: Boolean(id),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['webhook-send-attempts'] });
  };

  const resendMutation = useMutation({
    mutationFn: () => resendWebhookSendAttempt(id),
    onSuccess: () => void invalidate(),
    onError: (error) => setActionError(toApiError(error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookSendAttempt(id),
    onSuccess: async () => {
      await invalidate();
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
    <AppScreen scrollable title={item.webhookEvent.webhookName}>
      <VStack space="sm">
        <Text>
          {t('webhookSendAttempts.webhookName')}: {item.webhookEvent.webhookName}
        </Text>
        {item.webhookEvent.data ? (
          <Text>
            {t('webhookSendAttempts.data')}: {item.webhookEvent.data}
          </Text>
        ) : null}
        <Text>
          {t('webhookSendAttempts.subscriptionId')}: {item.webhookSubscriptionId}
        </Text>
        <Text>
          {t('webhookSendAttempts.creationTime')}: {formatDateTime(item.creationTime)}
        </Text>
        {item.responseStatusCode !== undefined ? (
          <Text>
            {t('webhookSendAttempts.responseStatusCode')}: {item.responseStatusCode}
          </Text>
        ) : null}
        {item.response ? (
          <Text>
            {t('webhookSendAttempts.response')}: {item.response}
          </Text>
        ) : null}
        <Text>
          {t('webhookSendAttempts.sendExactSameData')}:{' '}
          {item.sendExactSameData ? t('common.yes') : t('common.no')}
        </Text>
        {item.requestHeaders && Object.keys(item.requestHeaders).length > 0 ? (
          <Text>
            {t('webhookSendAttempts.requestHeaders')}: {JSON.stringify(item.requestHeaders)}
          </Text>
        ) : null}
        {item.responseHeaders && Object.keys(item.responseHeaders).length > 0 ? (
          <Text>
            {t('webhookSendAttempts.responseHeaders')}: {JSON.stringify(item.responseHeaders)}
          </Text>
        ) : null}
        <AppButton
          title={t('webhookSendAttempts.resend')}
          loading={resendMutation.isPending}
          onPress={() => resendMutation.mutate()}
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('webhookSendAttempts.deleteConfirmTitle'),
              message: t('webhookSendAttempts.deleteConfirmMessage'),
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

import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppButton } from '../../../components/ui/AppButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { stateErrorElement } from '../../../lib/state-error';
import { VStack } from '@/components/ui/vstack';
import {
  deleteWebhookSendAttempt,
  getWebhookSendAttempt,
  resendWebhookSendAttempt,
} from '../../../features/webhooks/webhooks-api';
import { useSubmitError } from '../../../lib/use-submit-error';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';
import { useInvalidateQueries, useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Chi tiết bản ghi gửi Webhook: đúng drawer detail của web (sự kiện:
 * webhookName/data/thời gian; subscriptionId; response + mã trạng thái;
 * request/response headers; sendExactSameData) + nút Gửi lại và Xóa
 * có xác nhận. Không có tạo/sửa (backend không có).
 */
export default function WebhookSendAttemptDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const invalidate = useInvalidateQueries(['webhook-send-attempts']);
  const invalidateAndBack = useInvalidateAndBack(['webhook-send-attempts']);
  const { error: actionError, onError: handleActionError } = useSubmitError();

  const query = useDetailQuery('webhook-send-attempts', id, getWebhookSendAttempt);

  const resendMutation = useMutation({
    mutationFn: () => resendWebhookSendAttempt(id),
    onSuccess: invalidate,
    onError: handleActionError,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookSendAttempt(id),
    onSuccess: invalidateAndBack,
    onError: handleActionError,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.webhookEvent.webhookName}>
      <VStack space="sm">
        <AppDetailField
          label={t('webhookSendAttempts.webhookName')}
          value={item.webhookEvent.webhookName}
        />
        <AppDetailField label={t('webhookSendAttempts.data')} value={item.webhookEvent.data} />
        <AppDetailField
          label={t('webhookSendAttempts.subscriptionId')}
          value={item.webhookSubscriptionId}
        />
        <AppDetailField
          label={t('webhookSendAttempts.creationTime')}
          value={formatDateTime(item.creationTime)}
        />
        {item.responseStatusCode !== undefined ? (
          <AppDetailField
            label={t('webhookSendAttempts.responseStatusCode')}
            value={item.responseStatusCode}
          />
        ) : null}
        <AppDetailField label={t('webhookSendAttempts.response')} value={item.response} />
        <AppDetailField
          label={t('webhookSendAttempts.sendExactSameData')}
          value={item.sendExactSameData ? t('common.yes') : t('common.no')}
        />
        {item.requestHeaders && Object.keys(item.requestHeaders).length > 0 ? (
          <AppDetailField
            label={t('webhookSendAttempts.requestHeaders')}
            value={JSON.stringify(item.requestHeaders)}
          />
        ) : null}
        {item.responseHeaders && Object.keys(item.responseHeaders).length > 0 ? (
          <AppDetailField
            label={t('webhookSendAttempts.responseHeaders')}
            value={JSON.stringify(item.responseHeaders)}
          />
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
        {stateErrorElement(actionError)}
      </VStack>
    </AppScreen>
  );
}

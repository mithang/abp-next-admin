import { useRouteParams } from '../../../lib/route-params';
import { useMutation } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppButton } from '../../../components/ui/AppButton';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { stateErrorElement } from '../../../lib/state-error';
import { VStack } from '@/components/ui/vstack';
import {
  deleteWebhookSubscription,
  getWebhookSubscription,
} from '../../../features/webhooks/webhooks-api';
import { useSubmitError } from '../../../lib/use-submit-error';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';
import { useInvalidateAndBack } from '../../../lib/mutation-success';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết đăng ký Webhook: webhookUri/isActive/description/webhooks/
 * headers/timeoutDuration. Secret KHÔNG hiển thị ở màn detail (đây là
 * credential của đăng ký); form sửa dùng ô nhập ẩn, nạp sẵn giá trị
 * từ DTO nên lưu không đổi vẫn giữ secret cũ — đúng modal web nhưng
 * không phơi secret ra màn xem.
 */
export default function WebhookSubscriptionDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();
  const invalidateAndBack = useInvalidateAndBack(['webhook-subscriptions']);
  const { error: actionError, onError: handleActionError } = useSubmitError();

  const query = useDetailQuery('webhook-subscriptions', id, getWebhookSubscription);

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookSubscription(id),
    onSuccess: invalidateAndBack,
    onError: handleActionError,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.webhookUri}>
      <VStack space="sm">
        <AppDetailField label={t('webhookSubscriptions.webhookUri')} value={item.webhookUri} />
        <AppDetailField
          label={t('webhookSubscriptions.isActive')}
          value={item.isActive ? t('common.yes') : t('common.no')}
        />
        <AppDetailField label={t('webhookSubscriptions.description')} value={item.description} />
        <AppDetailField
          label={t('webhookSubscriptions.webhooks')}
          value={item.webhooks.join(', ')}
        />
        {item.headers && Object.keys(item.headers).length > 0 ? (
          <AppDetailField
            label={t('webhookSubscriptions.headers')}
            value={JSON.stringify(item.headers)}
          />
        ) : null}
        {item.timeoutDuration !== undefined && item.timeoutDuration !== null ? (
          <AppDetailField
            label={t('webhookSubscriptions.timeoutDuration')}
            value={item.timeoutDuration}
          />
        ) : null}
        {item.creationTime ? (
          <AppDetailField
            label={t('webhookSubscriptions.creationTime')}
            value={formatDateTime(item.creationTime)}
          />
        ) : null}
        <AppNavButton
          title={t('webhookSubscriptions.editTitle')}
          href={navHref('/webhooks/subscriptions/form', { id: item.id })}
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
        {stateErrorElement(actionError)}
      </VStack>
    </AppScreen>
  );
}

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
  deleteWebhookDefinition,
  getWebhookDefinition,
} from '../../../features/webhooks/webhooks-api';
import { useSubmitError } from '../../../lib/use-submit-error';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateAndBack } from '../../../lib/mutation-success';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết định nghĩa Webhook: groupName/name/displayName/description/
 * isEnabled/isStatic/requiredFeatures. Định nghĩa tĩnh chỉ đọc như
 * bảng web — ẩn cả nút Sửa lẫn Xóa.
 */
export default function WebhookDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useRouteParams<{ name: string }>();
  const invalidateAndBack = useInvalidateAndBack(['webhook-definitions']);
  const { error: actionError, onError: handleActionError } = useSubmitError();

  const query = useDetailQuery('webhook-definitions', name, getWebhookDefinition);

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookDefinition(name),
    onSuccess: invalidateAndBack,
    onError: handleActionError,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        <AppDetailField label={t('webhookDefinitions.groupName')} value={item.groupName} />
        <AppDetailField label={t('webhookDefinitions.name')} value={item.name} />
        <AppDetailField label={t('webhookDefinitions.displayName')} value={item.displayName} />
        <AppDetailField label={t('webhookDefinitions.description')} value={item.description} />
        <AppDetailField
          label={t('webhookDefinitions.isEnabled')}
          value={item.isEnabled ? t('common.yes') : t('common.no')}
        />
        <AppDetailField
          label={t('webhookDefinitions.isStatic')}
          value={item.isStatic ? t('common.yes') : t('common.no')}
        />
        {item.requiredFeatures && item.requiredFeatures.length > 0 ? (
          <AppDetailField
            label={t('webhookDefinitions.requiredFeatures')}
            value={item.requiredFeatures.join(', ')}
          />
        ) : null}
        {item.isStatic ? null : (
          <>
            <AppNavButton
              title={t('webhookDefinitions.editTitle')}
              href={navHref('/webhooks/definitions/form', { name: item.name })}
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                showConfirmDialog({
                  title: t('webhookDefinitions.deleteConfirmTitle'),
                  message: t('webhookDefinitions.deleteConfirmMessage'),
                  confirmText: t('common.delete'),
                  cancelText: t('common.cancel'),
                  onConfirm: () => deleteMutation.mutate(),
                })
              }
            />
          </>
        )}
        {stateErrorElement(actionError)}
      </VStack>
    </AppScreen>
  );
}

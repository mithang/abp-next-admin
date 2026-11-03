import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { stateErrorElement } from '../../../lib/state-error';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteWebhookGroupDefinition,
  getWebhookGroupDefinition,
} from '../../../features/webhooks/webhooks-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Chi tiết nhóm Webhook: name/displayName/isStatic. Nhóm tĩnh chỉ đọc
 * như bảng web — ẩn cả nút Sửa lẫn Xóa (không chỉ vô hiệu).
 */
export default function WebhookGroupDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const invalidateAndBack = useInvalidateAndBack(['webhook-groups']);
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['webhook-groups', name],
    queryFn: () => getWebhookGroupDefinition(name),
    enabled: Boolean(name),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookGroupDefinition(name),
    onSuccess: invalidateAndBack,
    onError: (error) => setActionError(toApiError(error).message),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        <Text>
          {t('webhookGroups.name')}: {item.name}
        </Text>
        <Text>
          {t('webhookGroups.displayName')}: {item.displayName}
        </Text>
        <Text>
          {t('webhookGroups.isStatic')}: {item.isStatic ? t('common.yes') : t('common.no')}
        </Text>
        {item.isStatic ? null : (
          <>
            <AppNavButton
              title={t('webhookGroups.editTitle')}
              href={`/webhooks/groups/form?name=${encodeURIComponent(item.name)}`}
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                showConfirmDialog({
                  title: t('webhookGroups.deleteConfirmTitle'),
                  message: t('webhookGroups.deleteConfirmMessage'),
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

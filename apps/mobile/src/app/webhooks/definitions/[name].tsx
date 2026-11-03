import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { stateErrorElement } from '../../../lib/state-error';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteWebhookDefinition,
  getWebhookDefinition,
} from '../../../features/webhooks/webhooks-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Chi tiết định nghĩa Webhook: groupName/name/displayName/description/
 * isEnabled/isStatic/requiredFeatures. Định nghĩa tĩnh chỉ đọc như
 * bảng web — ẩn cả nút Sửa lẫn Xóa.
 */
export default function WebhookDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const invalidateAndBack = useInvalidateAndBack(['webhook-definitions']);
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['webhook-definitions', name],
    queryFn: () => getWebhookDefinition(name),
    enabled: Boolean(name),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookDefinition(name),
    onSuccess: invalidateAndBack,
    onError: (error) => setActionError(toApiError(error).message),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        <Text>
          {t('webhookDefinitions.groupName')}: {item.groupName}
        </Text>
        <Text>
          {t('webhookDefinitions.name')}: {item.name}
        </Text>
        <Text>
          {t('webhookDefinitions.displayName')}: {item.displayName}
        </Text>
        {item.description ? (
          <Text>
            {t('webhookDefinitions.description')}: {item.description}
          </Text>
        ) : null}
        <Text>
          {t('webhookDefinitions.isEnabled')}: {item.isEnabled ? t('common.yes') : t('common.no')}
        </Text>
        <Text>
          {t('webhookDefinitions.isStatic')}: {item.isStatic ? t('common.yes') : t('common.no')}
        </Text>
        {item.requiredFeatures && item.requiredFeatures.length > 0 ? (
          <Text>
            {t('webhookDefinitions.requiredFeatures')}: {item.requiredFeatures.join(', ')}
          </Text>
        ) : null}
        {item.isStatic ? null : (
          <>
            <AppNavButton
              title={t('webhookDefinitions.editTitle')}
              href={`/webhooks/definitions/form?name=${encodeURIComponent(item.name)}`}
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

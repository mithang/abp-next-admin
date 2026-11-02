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
  deleteWebhookDefinition,
  getWebhookDefinition,
} from '../../../features/webhooks/webhooks-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

/**
 * Chi tiết định nghĩa Webhook: groupName/name/displayName/description/
 * isEnabled/isStatic/requiredFeatures. Định nghĩa tĩnh chỉ đọc như
 * bảng web — ẩn cả nút Sửa lẫn Xóa.
 */
export default function WebhookDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['webhook-definitions', name],
    queryFn: () => getWebhookDefinition(name),
    enabled: Boolean(name),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookDefinition(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['webhook-definitions'] });
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
    <AppScreen title={item.displayName}>
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
            <AppButton
              title={t('webhookDefinitions.editTitle')}
              onPress={() =>
                router.push(`/webhooks/definitions/form?name=${encodeURIComponent(item.name)}`)
              }
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
        {actionError ? <Text>{actionError}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

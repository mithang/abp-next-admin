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
import { deleteWebhookGroupDefinition, getWebhookGroupDefinition } from '../../../features/webhooks/webhooks-api';
import { toApiError } from '../../../lib/errors';

/**
 * Chi tiết nhóm Webhook: name/displayName/isStatic. Nhóm tĩnh chỉ đọc
 * như bảng web — ẩn cả nút Sửa lẫn Xóa (không chỉ vô hiệu).
 */
export default function WebhookGroupDetailScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['webhook-groups', name],
    queryFn: () => getWebhookGroupDefinition(name),
    enabled: Boolean(name),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWebhookGroupDefinition(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['webhook-groups'] });
      router.back();
    },
    onError: (error) => setActionError(toApiError(error).message),
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />;
  }
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen title={item.displayName}>
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
            <AppButton
              title={t('webhookGroups.editTitle')}
              onPress={() => router.push(`/webhooks/groups/form?name=${encodeURIComponent(item.name)}`)}
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                Alert.alert(t('webhookGroups.deleteConfirmTitle'), t('webhookGroups.deleteConfirmMessage'), [
                  { text: t('common.cancel'), style: 'cancel' },
                  { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
                ])
              }
            />
          </>
        )}
        {actionError ? <Text>{actionError}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

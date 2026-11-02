import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteFeatureGroup, getFeatureGroup } from '../../../features/features/feature-groups-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

/**
 * Chi tiết nhóm tính năng. Modal web vô hiệu mọi field và ẩn nút xác nhận
 * với nhóm tĩnh nên mobile coi tĩnh là chỉ đọc: không Sửa, không Xóa.
 */
export default function FeatureGroupDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['feature-groups', name],
    queryFn: () => getFeatureGroup(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteFeatureGroup(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feature-groups'] });
      router.back();
    },
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
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('featureGroups.name')} value={item.name} />
        <AppDetailField label={t('featureGroups.displayName')} value={item.displayName} />
        {item.isStatic ? <Text>{t('featureGroups.static')}</Text> : null}
        {!item.isStatic ? (
          <>
            <AppButton
              title={t('featureGroups.editTitle')}
              onPress={() =>
                router.push(`/features/groups/form?name=${encodeURIComponent(item.name)}`)
              }
              variant="outline"
              testID="feature-group-edit"
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                showConfirmDialog({
                  title: t('featureGroups.deleteConfirmTitle'),
                  message: t('featureGroups.deleteConfirmMessage'),
                  confirmText: t('common.delete'),
                  cancelText: t('common.cancel'),
                  onConfirm: () => deleteMutation.mutate(),
                })
              }
              testID="feature-group-delete"
            />
          </>
        ) : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

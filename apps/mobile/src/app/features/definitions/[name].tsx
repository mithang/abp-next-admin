import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteFeatureDefinition,
  getFeatureDefinition,
} from '../../../features/features/feature-definitions-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Chi tiết định nghĩa tính năng. Modal web vô hiệu mọi field và ẩn nút xác
 * nhận với định nghĩa tĩnh nên mobile coi tĩnh là chỉ đọc: không Sửa, không Xóa.
 */
export default function FeatureDefinitionDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['feature-definitions']);
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['feature-definitions', name],
    queryFn: () => getFeatureDefinition(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteFeatureDefinition(name),
    onSuccess: invalidateAndBack,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('featureDefinitions.name')} value={item.name} />
        <AppDetailField label={t('featureDefinitions.groupName')} value={item.groupName} />
        <AppDetailField label={t('featureDefinitions.displayName')} value={item.displayName} />
        <AppDetailField label={t('featureDefinitions.description')} value={item.description} />
        <AppDetailField label={t('featureDefinitions.defaultValue')} value={item.defaultValue} />
        <AppDetailField label={t('featureDefinitions.valueType')} value={item.valueType} />
        <AppDetailField label={t('featureDefinitions.parentName')} value={item.parentName} />
        <AppDetailField
          label={t('featureDefinitions.isAvailableToHost')}
          value={item.isAvailableToHost ? t('featureDefinitions.yes') : t('featureDefinitions.no')}
        />
        <AppDetailField
          label={t('featureDefinitions.isVisibleToClients')}
          value={item.isVisibleToClients ? t('featureDefinitions.yes') : t('featureDefinitions.no')}
        />
        <AppDetailField
          label={t('featureDefinitions.allowedProviders')}
          value={item.allowedProviders?.join(', ')}
        />
        {item.isStatic ? <Text>{t('featureDefinitions.static')}</Text> : null}
        {!item.isStatic ? (
          <>
            <AppButton
              title={t('featureDefinitions.editTitle')}
              onPress={() =>
                router.push(`/features/definitions/form?name=${encodeURIComponent(item.name)}`)
              }
              variant="outline"
              testID="feature-definition-edit"
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                showConfirmDialog({
                  title: t('featureDefinitions.deleteConfirmTitle'),
                  message: t('featureDefinitions.deleteConfirmMessage'),
                  confirmText: t('common.delete'),
                  cancelText: t('common.cancel'),
                  onConfirm: () => deleteMutation.mutate(),
                })
              }
              testID="feature-definition-delete"
            />
          </>
        ) : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

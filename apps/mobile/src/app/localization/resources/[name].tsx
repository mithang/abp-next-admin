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
import { deleteResource, getResource } from '../../../features/localization/localization-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/** Chi tiết tài nguyên: khóa là name; web không có khái niệm tĩnh ở đây nên luôn có Sửa/Xóa. */
export default function ResourceDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['resources']);
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['resources', name],
    queryFn: () => getResource(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteResource(name),
    onSuccess: invalidateAndBack,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('resources.name')} value={item.name} />
        <AppDetailField label={t('resources.displayName')} value={item.displayName} />
        <AppDetailField label={t('resources.description')} value={item.description} />
        <AppDetailField label={t('resources.defaultCultureName')} value={item.defaultCultureName} />
        <Text>
          {t('resources.enable')}: {item.enable ? t('resources.enabled') : t('resources.disabled')}
        </Text>
        <AppDetailField label={t('resources.creationTime')} value={item.creationTime} />
        <AppButton
          title={t('resources.editTitle')}
          onPress={() =>
            router.push(`/localization/resources/form?name=${encodeURIComponent(item.name)}`)
          }
          variant="outline"
          testID="resource-edit"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('resources.deleteConfirmTitle'),
              message: t('resources.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="resource-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

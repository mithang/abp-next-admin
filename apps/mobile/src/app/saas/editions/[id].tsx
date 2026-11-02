import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteEdition, getEdition } from '../../../features/saas/saas-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

/** Chi tiết phiên bản: DTO chỉ có displayName (+ audit/extraProperties). */
export default function EditionDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['saas-editions', id],
    queryFn: () => getEdition(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteEdition(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['saas-editions'] });
      router.back();
    },
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        {item.creationTime ? (
          <Text>
            {t('saasEditions.creationTime')}: {item.creationTime}
          </Text>
        ) : null}
        {item.extraProperties && Object.keys(item.extraProperties).length > 0 ? (
          <Text>
            {t('saasEditions.extraProperties')}: {JSON.stringify(item.extraProperties)}
          </Text>
        ) : null}
        <AppButton
          title={t('saasEditions.editTitle')}
          onPress={() => router.push(`/saas/editions/form?id=${encodeURIComponent(item.id)}`)}
          variant="outline"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('saasEditions.deleteConfirmTitle'),
              message: t('saasEditions.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="saas-edition-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

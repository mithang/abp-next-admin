import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteAITool, getAITool } from '../../../features/ai/ai-api';
import { isReadOnlyTool } from '../../../features/ai/types';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

/**
 * Chi tiết công cụ AI. Công cụ hệ thống/tĩnh không sửa/xóa được (đúng
 * luật web: modal khóa nút xác nhận khi isSystem || isStatic) nên màn
 * này ẩn cả 2 nút thay vì để nút bấm rồi backend từ chối.
 */
export default function AIToolDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['ai-tools', id],
    queryFn: () => getAITool(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteAITool(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ai-tools'] });
      router.back();
    },
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;
  const readOnly = isReadOnlyTool(item);

  return (
    <AppScreen scrollable title={item.name} subtitle={item.provider}>
      <VStack space="sm">
        <Text>
          {t('aiTools.provider')}: {item.provider}
        </Text>
        {item.description ? (
          <Text>
            {t('aiTools.description')}: {item.description}
          </Text>
        ) : null}
        <Text>
          {t('aiTools.enabled')}: {item.isEnabled ? t('aiTools.yes') : t('aiTools.no')}
        </Text>
        <Text>
          {t('aiTools.global')}: {item.isGlobal ? t('aiTools.yes') : t('aiTools.no')}
        </Text>
        {item.isSystem ? <Text>· {t('aiTools.system')}</Text> : null}
        {item.isStatic ? <Text>· {t('aiTools.static')}</Text> : null}
        {item.stateCheckers ? (
          <Text>
            {t('aiTools.stateCheckers')}: {item.stateCheckers}
          </Text>
        ) : null}
        {item.extraProperties && Object.keys(item.extraProperties).length > 0 ? (
          <Text>
            {t('aiTools.extraProperties')}: {JSON.stringify(item.extraProperties)}
          </Text>
        ) : null}
        {readOnly ? <Text>{t('aiTools.readOnlyHint')}</Text> : null}
        {!readOnly ? (
          <>
            <AppButton
              title={t('aiTools.editTitle')}
              onPress={() => router.push(`/ai/tools/form?id=${encodeURIComponent(item.id)}`)}
              variant="outline"
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                showConfirmDialog({
                  title: t('aiTools.deleteConfirmTitle'),
                  message: t('aiTools.deleteConfirmMessage'),
                  confirmText: t('common.delete'),
                  cancelText: t('common.cancel'),
                  onConfirm: () => deleteMutation.mutate(),
                })
              }
              testID="ai-tool-delete"
            />
          </>
        ) : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

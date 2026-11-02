import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppEmptyState, AppErrorState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { deleteData, deleteDataItem, getData } from '../../../features/platform/platform-api';
import { DATA_VALUE_TYPE_LABELS } from '../../../features/platform/types';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateQueries, useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Chi tiết từ điển: code do backend sinh (chỉ đọc), tên/tên hiển thị/
 * mô tả, và danh sách mục (items) lấy kèm trong DataDto. Từ đây mở:
 * sửa từ điển, tạo từ điển con (form với parentId preset, đúng nút
 * 'children' của bảng web), di chuyển sang cha khác (PUT .../move),
 * thêm/sửa/xóa mục, xóa từ điển — tất cả có xác nhận khi xóa.
 */
export default function DataDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const invalidate = useInvalidateQueries(['platform-datas', id]);
  const invalidateAndBack = useInvalidateAndBack(['platform-datas']);
  const query = useQuery({
    queryKey: ['platform-datas', id],
    queryFn: () => getData(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteData(id),
    onSuccess: invalidateAndBack,
  });
  const deleteItemMutation = useMutation({
    mutationFn: (name: string) => deleteDataItem(id, name),
    onSuccess: invalidate,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName}>
      <VStack space="sm">
        <Text>
          {t('platformDataDictionaries.name')}: {item.name}
        </Text>
        <Text>
          {t('platformDataDictionaries.code')}: {item.code}
        </Text>
        {item.description ? (
          <Text>
            {t('platformDataDictionaries.description')}: {item.description}
          </Text>
        ) : null}
        <AppButton
          title={t('platformDataDictionaries.editTitle')}
          onPress={() =>
            router.push(`/platform/data-dictionaries/form?id=${encodeURIComponent(item.id)}`)
          }
          variant="outline"
        />
        <AppButton
          title={t('platformDataDictionaries.createChildTitle')}
          onPress={() =>
            router.push(`/platform/data-dictionaries/form?parentId=${encodeURIComponent(item.id)}`)
          }
          variant="outline"
        />
        <AppButton
          title={t('platformDataDictionaries.moveTitle')}
          onPress={() =>
            router.push(`/platform/data-dictionaries/move?dataId=${encodeURIComponent(item.id)}`)
          }
          variant="outline"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('platformDataDictionaries.deleteConfirmTitle'),
              message: t('platformDataDictionaries.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="platform-data-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
        <Text>{t('platformDataItems.title')}</Text>
        <AppButton
          title={t('platformDataItems.createTitle')}
          onPress={() =>
            router.push(
              `/platform/data-dictionaries/items/form?dataId=${encodeURIComponent(item.id)}`,
            )
          }
          variant="outline"
        />
        {item.items.length === 0 ? (
          <AppEmptyState message={t('platformDataItems.empty')} />
        ) : (
          item.items.map((dataItem) => (
            <Card key={dataItem.id} className="p-4">
              <VStack space="xs">
                <Text>
                  {dataItem.displayName} ({dataItem.name})
                </Text>
                <Text>
                  {DATA_VALUE_TYPE_LABELS[dataItem.valueType] ?? dataItem.valueType}
                  {dataItem.defaultValue ? ` · ${dataItem.defaultValue}` : ''}
                  {dataItem.allowBeNull ? '' : ` · ${t('platformDataItems.notNull')}`}
                </Text>
                {dataItem.description ? <Text>{dataItem.description}</Text> : null}
                <AppButton
                  title={t('platformDataItems.editTitle')}
                  variant="outline"
                  onPress={() =>
                    router.push(
                      `/platform/data-dictionaries/items/form?dataId=${encodeURIComponent(item.id)}&name=${encodeURIComponent(dataItem.name)}`,
                    )
                  }
                />
                <AppButton
                  title={t('common.delete')}
                  action="negative"
                  variant="outline"
                  loading={deleteItemMutation.isPending}
                  onPress={() =>
                    showConfirmDialog({
                      title: t('platformDataItems.deleteConfirmTitle'),
                      message: t('platformDataItems.deleteConfirmMessage'),
                      confirmText: t('common.delete'),
                      cancelText: t('common.cancel'),
                      onConfirm: () => deleteItemMutation.mutate(dataItem.name),
                    })
                  }
                />
              </VStack>
            </Card>
          ))
        )}
        {deleteItemMutation.isError ? (
          <Text>{toApiError(deleteItemMutation.error).message}</Text>
        ) : null}
      </VStack>
    </AppScreen>
  );
}

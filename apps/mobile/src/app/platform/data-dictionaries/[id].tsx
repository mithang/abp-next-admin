import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppEmptyState } from '../../../components/ui/AppStates';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { mutationErrorElement } from '../../../lib/mutation-error';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { deleteData, deleteDataItem, getData } from '../../../features/platform/platform-api';
import { DATA_VALUE_TYPE_LABELS } from '../../../features/platform/types';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateQueries } from '../../../lib/mutation-success';

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
  const invalidate = useInvalidateQueries(['platform-datas', id]);
  const query = useQuery({
    queryKey: ['platform-datas', id],
    queryFn: () => getData(id),
    enabled: Boolean(id),
  });
  const deleteItemMutation = useMutation({
    mutationFn: (name: string) => deleteDataItem(id, name),
    onSuccess: invalidate,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

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
        <AppNavButton
          title={t('platformDataDictionaries.editTitle')}
          href={`/platform/data-dictionaries/form?id=${encodeURIComponent(item.id)}`}
          variant="outline"
        />
        <AppNavButton
          title={t('platformDataDictionaries.createChildTitle')}
          href={`/platform/data-dictionaries/form?parentId=${encodeURIComponent(item.id)}`}
          variant="outline"
        />
        <AppNavButton
          title={t('platformDataDictionaries.moveTitle')}
          href={`/platform/data-dictionaries/move?dataId=${encodeURIComponent(item.id)}`}
          variant="outline"
        />
        <AppDeleteButton
          confirmTitle={t('platformDataDictionaries.deleteConfirmTitle')}
          confirmMessage={t('platformDataDictionaries.deleteConfirmMessage')}
          onDelete={() => deleteData(id)}
          invalidateKey={['platform-datas']}
          testID="platform-data-delete"
        />
        <Text>{t('platformDataItems.title')}</Text>
        <AppNavButton
          title={t('platformDataItems.createTitle')}
          href={`/platform/data-dictionaries/items/form?dataId=${encodeURIComponent(item.id)}`}
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
                <AppNavButton
                  title={t('platformDataItems.editTitle')}
                  href={`/platform/data-dictionaries/items/form?dataId=${encodeURIComponent(item.id)}&name=${encodeURIComponent(dataItem.name)}`}
                  variant="outline"
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
        {mutationErrorElement(deleteItemMutation)}
      </VStack>
    </AppScreen>
  );
}

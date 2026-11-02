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
  deleteSettingDefinition,
  getSettingDefinition,
} from '../../../features/settings/settings-definitions-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

/**
 * Chi tiết định nghĩa cài đặt. Modal web ẩn nút xác nhận với định nghĩa
 * tĩnh và bảng web vô hiệu nút xóa với bản ghi tĩnh, nên mobile coi tĩnh là
 * chỉ đọc: không Sửa, không Xóa (giống tính năng, khác quyền).
 */
export default function SettingDefinitionDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['setting-definitions']);
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['setting-definitions', name],
    queryFn: () => getSettingDefinition(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteSettingDefinition(name),
    onSuccess: invalidateAndBack,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('settingDefinitions.name')} value={item.name} />
        <AppDetailField label={t('settingDefinitions.displayName')} value={item.displayName} />
        <AppDetailField label={t('settingDefinitions.description')} value={item.description} />
        <AppDetailField label={t('settingDefinitions.defaultValue')} value={item.defaultValue} />
        <AppDetailField
          label={t('settingDefinitions.providers')}
          value={item.providers?.join(', ')}
        />
        <Text>
          {t('settingDefinitions.isEncrypted')}:{' '}
          {item.isEncrypted ? t('settingDefinitions.yes') : t('settingDefinitions.no')}
        </Text>
        <Text>
          {t('settingDefinitions.isInherited')}:{' '}
          {item.isInherited ? t('settingDefinitions.yes') : t('settingDefinitions.no')}
        </Text>
        <Text>
          {t('settingDefinitions.isVisibleToClients')}:{' '}
          {item.isVisibleToClients ? t('settingDefinitions.yes') : t('settingDefinitions.no')}
        </Text>
        {item.isStatic ? <Text>{t('settingDefinitions.static')}</Text> : null}
        {!item.isStatic ? (
          <>
            <AppButton
              title={t('settingDefinitions.editTitle')}
              onPress={() =>
                router.push(`/settings/definitions/form?name=${encodeURIComponent(item.name)}`)
              }
              variant="outline"
              testID="setting-definition-edit"
            />
            <AppButton
              title={t('common.delete')}
              action="negative"
              variant="outline"
              loading={deleteMutation.isPending}
              onPress={() =>
                showConfirmDialog({
                  title: t('settingDefinitions.deleteConfirmTitle'),
                  message: t('settingDefinitions.deleteConfirmMessage'),
                  confirmText: t('common.delete'),
                  cancelText: t('common.cancel'),
                  onConfirm: () => deleteMutation.mutate(),
                })
              }
              testID="setting-definition-delete"
            />
          </>
        ) : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

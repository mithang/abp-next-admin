import { useRouteParams } from '../../../lib/route-params';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteSettingDefinition,
  getSettingDefinition,
} from '../../../features/settings/settings-definitions-api';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết định nghĩa cài đặt. Modal web ẩn nút xác nhận với định nghĩa
 * tĩnh và bảng web vô hiệu nút xóa với bản ghi tĩnh, nên mobile coi tĩnh là
 * chỉ đọc: không Sửa, không Xóa (giống tính năng, khác quyền).
 */
export default function SettingDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useRouteParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['setting-definitions', name],
    queryFn: () => getSettingDefinition(name),
    enabled: Boolean(name),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

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
            <AppNavButton
              title={t('settingDefinitions.editTitle')}
              href={navHref('/settings/definitions/form', { name: item.name })}
              variant="outline"
              testID="setting-definition-edit"
            />
            <AppDeleteButton
              confirmTitle={t('settingDefinitions.deleteConfirmTitle')}
              confirmMessage={t('settingDefinitions.deleteConfirmMessage')}
              onDelete={() => deleteSettingDefinition(name)}
              invalidateKey={['setting-definitions']}
              testID="setting-definition-delete"
            />
          </>
        ) : null}
      </VStack>
    </AppScreen>
  );
}

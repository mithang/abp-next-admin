import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
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
  deletePermissionGroup,
  getPermissionGroup,
} from '../../../features/permissions/permission-groups-api';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết nhóm quyền. Web cho sửa nhóm tĩnh nhưng cấm xóa
 * (Delete :disabled="isStatic") — mobile ẩn nút Xóa với nhóm tĩnh.
 */
export default function PermissionGroupDetailScreen() {
  const { t } = useTranslation();
  const { name } = useRouteParams<{ name: string }>();
  const query = useDetailQuery('permission-groups', name, getPermissionGroup);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('permissionGroups.name')} value={item.name} />
        <AppDetailField label={t('permissionGroups.displayName')} value={item.displayName} />
        {item.isStatic ? <Text>{t('permissionGroups.static')}</Text> : null}
        <AppNavButton
          title={t('permissionGroups.editTitle')}
          href={navHref('/permissions/groups/form', { name: item.name })}
          variant="outline"
          testID="permission-group-edit"
        />
        {!item.isStatic ? (
          <AppDeleteButton
            confirmTitle={t('permissionGroups.deleteConfirmTitle')}
            confirmMessage={t('permissionGroups.deleteConfirmMessage')}
            onDelete={() => deletePermissionGroup(name)}
            invalidateKey={['permission-groups']}
            testID="permission-group-delete"
          />
        ) : null}
      </VStack>
    </AppScreen>
  );
}

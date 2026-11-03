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
  deletePermissionDefinition,
  getPermissionDefinition,
} from '../../../features/permissions/permission-definitions-api';
import { MultiTenancySides } from '../../../features/permissions/types';
import { navHref } from '../../../lib/nav-href';

function multiTenancySideLabel(side: MultiTenancySides): string {
  if (side === MultiTenancySides.Host) return 'Host';
  if (side === MultiTenancySides.Tenant) return 'Tenant';
  return 'Host + Tenant';
}

/**
 * Chi tiết định nghĩa quyền. Như nhóm quyền: web cho sửa định nghĩa tĩnh
 * nhưng cấm xóa — mobile ẩn nút Xóa với định nghĩa tĩnh.
 */
export default function PermissionDefinitionDetailScreen() {
  const { t } = useTranslation();
  const { name } = useRouteParams<{ name: string }>();
  const query = useDetailQuery('permission-definitions', name, getPermissionDefinition);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('permissionDefinitions.name')} value={item.name} />
        <AppDetailField label={t('permissionDefinitions.groupName')} value={item.groupName} />
        <AppDetailField label={t('permissionDefinitions.displayName')} value={item.displayName} />
        <AppDetailField label={t('permissionDefinitions.parentName')} value={item.parentName} />
        <AppDetailField
          label={t('permissionDefinitions.isEnabled')}
          value={
            item.isEnabled
              ? t('permissionDefinitions.enabled')
              : t('permissionDefinitions.disabled')
          }
        />
        <AppDetailField
          label={t('permissionDefinitions.multiTenancySide')}
          value={multiTenancySideLabel(item.multiTenancySide)}
        />
        <AppDetailField
          label={t('permissionDefinitions.providers')}
          value={item.providers?.join(', ')}
        />
        <AppDetailField
          label={t('permissionDefinitions.stateCheckers')}
          value={item.stateCheckers}
        />
        {item.isStatic ? <Text>{t('permissionDefinitions.static')}</Text> : null}
        <AppNavButton
          title={t('permissionDefinitions.editTitle')}
          href={navHref('/permissions/definitions/form', { name: item.name })}
          variant="outline"
          testID="permission-definition-edit"
        />
        {!item.isStatic ? (
          <AppDeleteButton
            confirmTitle={t('permissionDefinitions.deleteConfirmTitle')}
            confirmMessage={t('permissionDefinitions.deleteConfirmMessage')}
            onDelete={() => deletePermissionDefinition(name)}
            invalidateKey={['permission-definitions']}
            testID="permission-definition-delete"
          />
        ) : null}
      </VStack>
    </AppScreen>
  );
}

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
  deletePermissionDefinition,
  getPermissionDefinition,
} from '../../../features/permissions/permission-definitions-api';
import { MultiTenancySides } from '../../../features/permissions/types';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { useInvalidateAndBack } from '../../../lib/mutation-success';

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
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['permission-definitions']);
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['permission-definitions', name],
    queryFn: () => getPermissionDefinition(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deletePermissionDefinition(name),
    onSuccess: invalidateAndBack,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

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
        <AppButton
          title={t('permissionDefinitions.editTitle')}
          onPress={() =>
            router.push(`/permissions/definitions/form?name=${encodeURIComponent(item.name)}`)
          }
          variant="outline"
          testID="permission-definition-edit"
        />
        {!item.isStatic ? (
          <AppButton
            title={t('common.delete')}
            action="negative"
            variant="outline"
            loading={deleteMutation.isPending}
            onPress={() =>
              showConfirmDialog({
                title: t('permissionDefinitions.deleteConfirmTitle'),
                message: t('permissionDefinitions.deleteConfirmMessage'),
                confirmText: t('common.delete'),
                cancelText: t('common.cancel'),
                onConfirm: () => deleteMutation.mutate(),
              })
            }
            testID="permission-definition-delete"
          />
        ) : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

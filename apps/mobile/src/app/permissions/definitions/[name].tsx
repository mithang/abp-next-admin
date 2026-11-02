import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deletePermissionDefinition,
  getPermissionDefinition,
} from '../../../features/permissions/permission-definitions-api';
import { MultiTenancySides } from '../../../features/permissions/types';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Text>
      {label}: {value}
    </Text>
  );
}

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
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['permission-definitions', name],
    queryFn: () => getPermissionDefinition(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deletePermissionDefinition(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['permission-definitions'] });
      router.back();
    },
  });

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return (
      <AppErrorState
        message={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <Field label={t('permissionDefinitions.name')} value={item.name} />
        <Field label={t('permissionDefinitions.groupName')} value={item.groupName} />
        <Field label={t('permissionDefinitions.displayName')} value={item.displayName} />
        <Field label={t('permissionDefinitions.parentName')} value={item.parentName} />
        <Field
          label={t('permissionDefinitions.isEnabled')}
          value={
            item.isEnabled
              ? t('permissionDefinitions.enabled')
              : t('permissionDefinitions.disabled')
          }
        />
        <Field
          label={t('permissionDefinitions.multiTenancySide')}
          value={multiTenancySideLabel(item.multiTenancySide)}
        />
        <Field label={t('permissionDefinitions.providers')} value={item.providers?.join(', ')} />
        <Field label={t('permissionDefinitions.stateCheckers')} value={item.stateCheckers} />
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

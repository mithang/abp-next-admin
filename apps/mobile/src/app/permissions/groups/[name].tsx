import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deletePermissionGroup,
  getPermissionGroup,
} from '../../../features/permissions/permission-groups-api';
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

/**
 * Chi tiết nhóm quyền. Web cho sửa nhóm tĩnh nhưng cấm xóa
 * (Delete :disabled="isStatic") — mobile ẩn nút Xóa với nhóm tĩnh.
 */
export default function PermissionGroupDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { name } = useLocalSearchParams<{ name: string }>();
  const query = useQuery({
    queryKey: ['permission-groups', name],
    queryFn: () => getPermissionGroup(name),
    enabled: Boolean(name),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deletePermissionGroup(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['permission-groups'] });
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
    <AppScreen title={item.displayName || item.name} subtitle={item.name}>
      <VStack space="sm">
        <Field label={t('permissionGroups.name')} value={item.name} />
        <Field label={t('permissionGroups.displayName')} value={item.displayName} />
        {item.isStatic ? <Text>{t('permissionGroups.static')}</Text> : null}
        <AppButton
          title={t('permissionGroups.editTitle')}
          onPress={() =>
            router.push(`/permissions/groups/form?name=${encodeURIComponent(item.name)}`)
          }
          variant="outline"
          testID="permission-group-edit"
        />
        {!item.isStatic ? (
          <AppButton
            title={t('common.delete')}
            action="negative"
            variant="outline"
            loading={deleteMutation.isPending}
            onPress={() =>
              showConfirmDialog({
                title: t('permissionGroups.deleteConfirmTitle'),
                message: t('permissionGroups.deleteConfirmMessage'),
                confirmText: t('common.delete'),
                cancelText: t('common.cancel'),
                onConfirm: () => deleteMutation.mutate(),
              })
            }
            testID="permission-group-delete"
          />
        ) : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

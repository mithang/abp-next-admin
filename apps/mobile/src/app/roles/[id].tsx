import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState } from '../../components/ui/AppStates';
import { queryStateElement } from '../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { deleteRole, getRole } from '../../features/identity/roles-api';
import { roleFlags } from '../../features/identity/roles-types';
import { toApiError } from '../../lib/errors';
import { showConfirmDialog } from '../../lib/confirm';

export default function RoleDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['roles', id],
    queryFn: () => getRole(id),
    enabled: Boolean(id),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteRole(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      router.back();
    },
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;

  const role = query.data;
  if (!role) return <AppErrorState message={t('common.empty')} />;

  const flagLabels: Record<string, string> = {
    default: t('roles.isDefault'),
    public: t('roles.isPublic'),
    static: t('roles.isStatic'),
  };

  return (
    <AppScreen scrollable title={role.name} subtitle={role.id}>
      <VStack space="sm">
        {roleFlags(role).map((flag) => (
          <Badge key={flag} variant="default" className="self-start">
            <BadgeText>{flagLabels[flag]}</BadgeText>
          </Badge>
        ))}
        {roleFlags(role).length === 0 ? <Text>{t('roles.noFlags')}</Text> : null}
        <AppButton
          title={t('roles.editTitle')}
          onPress={() => router.push(`/roles/form?id=${encodeURIComponent(role.id)}`)}
          variant="outline"
          testID="role-edit"
        />
        <AppButton
          title={t('menuAllot.title')}
          variant="outline"
          onPress={() =>
            router.push(
              `/platform/menu-allot?subject=role&id=${encodeURIComponent(role.name)}&label=${encodeURIComponent(role.name)}`,
            )
          }
          testID="role-menu-allot"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('roles.deleteConfirmTitle'),
              message: t('roles.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="role-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { deleteRole, getRole } from '../../features/identity/roles-api';
import { roleFlags } from '../../features/identity/roles-types';
import { toApiError } from '../../lib/errors';

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

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return (
      <AppErrorState
        message={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const role = query.data;
  if (!role) return <AppErrorState message={t('common.empty')} />;

  const flagLabels: Record<string, string> = {
    default: t('roles.isDefault'),
    public: t('roles.isPublic'),
    static: t('roles.isStatic'),
  };

  return (
    <AppScreen title={role.name} subtitle={role.id}>
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
            Alert.alert(t('roles.deleteConfirmTitle'), t('roles.deleteConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('common.delete'),
                style: 'destructive',
                onPress: () => deleteMutation.mutate(),
              },
            ])
          }
          testID="role-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

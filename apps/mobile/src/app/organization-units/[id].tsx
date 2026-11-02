import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnitsAll,
} from '../../features/identity/organization-units-api';
import { findOrganizationUnitName } from '../../features/identity/organization-units';
import { toApiError } from '../../lib/errors';

export default function OrganizationUnitDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['organization-units', id],
    queryFn: () => getOrganizationUnit(id),
    enabled: Boolean(id),
  });
  const all = useQuery({
    queryKey: ['organization-units', 'all'],
    queryFn: getOrganizationUnitsAll,
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteOrganizationUnit(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['organization-units'] });
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
  const parentName = all.data ? findOrganizationUnitName(all.data.items, item.parentId) : undefined;

  return (
    <AppScreen title={item.displayName} subtitle={item.id}>
      <VStack space="sm">
        <Text>
          {t('organizationUnits.code')}: {item.code}
        </Text>
        <Text>
          {t('organizationUnits.parent')}:{' '}
          {parentName ?? (item.parentId ? item.parentId : t('organizationUnits.root'))}
        </Text>
        <AppButton
          title={t('organizationUnits.editTitle')}
          onPress={() => router.push(`/organization-units/form?id=${encodeURIComponent(item.id)}`)}
          variant="outline"
          testID="organization-unit-edit"
        />
        <AppButton
          title={t('organizationUnits.createChildTitle')}
          onPress={() =>
            router.push(`/organization-units/form?parentId=${encodeURIComponent(item.id)}`)
          }
          variant="outline"
          testID="organization-unit-create-child"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(
              t('organizationUnits.deleteConfirmTitle'),
              t('organizationUnits.deleteConfirmMessage'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('common.delete'),
                  style: 'destructive',
                  onPress: () => deleteMutation.mutate(),
                },
              ],
            )
          }
          testID="organization-unit-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

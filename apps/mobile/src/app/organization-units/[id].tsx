import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppButton } from '../../components/ui/AppButton';
import { AppErrorState } from '../../components/ui/AppStates';
import { queryStateElement } from '../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnitsAll,
} from '../../features/identity/organization-units-api';
import { findOrganizationUnitName } from '../../features/identity/organization-units';
import { toApiError } from '../../lib/errors';
import { showConfirmDialog } from '../../lib/confirm';
import { useInvalidateAndBack } from '../../lib/mutation-success';

export default function OrganizationUnitDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const invalidateAndBack = useInvalidateAndBack(['organization-units']);
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
    onSuccess: invalidateAndBack,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;
  const parentName = all.data ? findOrganizationUnitName(all.data.items, item.parentId) : undefined;

  return (
    <AppScreen scrollable title={item.displayName} subtitle={item.id}>
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
            showConfirmDialog({
              title: t('organizationUnits.deleteConfirmTitle'),
              message: t('organizationUnits.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
          testID="organization-unit-delete"
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

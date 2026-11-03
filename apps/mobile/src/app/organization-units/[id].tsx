import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../components/ui/AppDeleteButton';
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

export default function OrganizationUnitDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['organization-units', id],
    queryFn: () => getOrganizationUnit(id),
    enabled: Boolean(id),
  });
  const all = useQuery({
    queryKey: ['organization-units', 'all'],
    queryFn: getOrganizationUnitsAll,
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
        <AppNavButton
          title={t('organizationUnits.editTitle')}
          href={`/organization-units/form?id=${encodeURIComponent(item.id)}`}
          variant="outline"
          testID="organization-unit-edit"
        />
        <AppNavButton
          title={t('organizationUnits.createChildTitle')}
          href={`/organization-units/form?parentId=${encodeURIComponent(item.id)}`}
          variant="outline"
          testID="organization-unit-create-child"
        />
        <AppDeleteButton
          confirmTitle={t('organizationUnits.deleteConfirmTitle')}
          confirmMessage={t('organizationUnits.deleteConfirmMessage')}
          onDelete={() => deleteOrganizationUnit(id)}
          invalidateKey={['organization-units']}
          testID="organization-unit-delete"
        />
      </VStack>
    </AppScreen>
  );
}

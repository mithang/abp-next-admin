import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppTreeRowCard } from '../../components/ui/AppTreeRowCard';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getOrganizationUnitsAll } from '../../features/identity/organization-units-api';
import {
  flattenOrganizationUnits,
  type FlattenedOrganizationUnit,
} from '../../features/identity/organization-units';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { navPath } from '../../lib/nav-href';

function OrganizationUnitRow({ item }: { item: FlattenedOrganizationUnit }) {
  const { unit, depth } = item;
  return (
    <Link href={navPath('/organization-units', unit.id)} asChild>
      <AppTreeRowCard depth={depth} indent={20} indentStyle="padding">
        <VStack space="xs">
          <Text>
            {'— '.repeat(depth)}
            {unit.displayName}
          </Text>
          <Text>{unit.code}</Text>
        </VStack>
      </AppTreeRowCard>
    </Link>
  );
}

export default function OrganizationUnitsScreen() {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: ['organization-units', 'all'],
    queryFn: getOrganizationUnitsAll,
  });
  const flat = query.data ? flattenOrganizationUnits(query.data.items) : [];

  return (
    <AppScreen
      title={t('organizationUnits.title')}
      subtitle={`${t('organizationUnits.total')}: ${flat.length}`}
    >
      <AppList items={flat} {...listQueryProps(query)} emptyMessage={t('organizationUnits.empty')}>
        <FlatList
          data={flat}
          keyExtractor={(item) => item.unit.id}
          renderItem={({ item }) => <OrganizationUnitRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
      <AppNavButton
        title={t('organizationUnits.createTitle')}
        href={'/organization-units/form'}
        testID="organization-units-create"
      />
    </AppScreen>
  );
}

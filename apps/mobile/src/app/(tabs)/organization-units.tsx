import { FlatList, Pressable, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getOrganizationUnitsAll } from '../../features/identity/organization-units-api';
import {
  flattenOrganizationUnits,
  type FlattenedOrganizationUnit,
} from '../../features/identity/organization-units';
import { toApiError } from '../../lib/errors';

function OrganizationUnitRow({ item }: { item: FlattenedOrganizationUnit }) {
  const { unit, depth } = item;
  return (
    <Link href={`/organization-units/${unit.id}`} asChild>
      <Pressable>
        <View style={{ paddingLeft: depth * 20 }}>
          <Card className="p-4">
            <VStack space="xs">
              <Text>
                {'— '.repeat(depth)}
                {unit.displayName}
              </Text>
              <Text>{unit.code}</Text>
            </VStack>
          </Card>
        </View>
      </Pressable>
    </Link>
  );
}

export default function OrganizationUnitsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
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
      <AppList
        items={flat}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('organizationUnits.empty')}
      >
        <FlatList
          data={flat}
          keyExtractor={(item) => item.unit.id}
          renderItem={({ item }) => <OrganizationUnitRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
      <AppButton
        title={t('organizationUnits.createTitle')}
        onPress={() => router.push('/organization-units/form')}
        testID="organization-units-create"
      />
    </AppScreen>
  );
}

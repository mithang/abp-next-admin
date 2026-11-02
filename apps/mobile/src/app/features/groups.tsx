import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getFeatureGroups } from '../../features/features/feature-groups-api';
import type { FeatureGroupDefinitionDto } from '../../features/features/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';

function GroupRow({ item }: { item: FeatureGroupDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/features/groups/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.name}</Text>
            <Text>{item.name}</Text>
            {item.isStatic ? <Text>· {t('featureGroups.static')}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách nhóm tính năng: ListResult, web phân trang phía client. */
export default function FeatureGroupsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebouncedValue(filter);

  const query = useQuery({
    queryKey: ['feature-groups', debouncedFilter],
    queryFn: () => getFeatureGroups({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('featureGroups.title')}
      subtitle={`${t('featureGroups.total')}: ${items.length}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('featureGroups.searchPlaceholder')}
        testID="feature-groups-search"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('featureGroups.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <GroupRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
      <AppButton
        title={t('featureGroups.createTitle')}
        onPress={() => router.push('/features/groups/form')}
        testID="feature-groups-create"
      />
    </AppScreen>
  );
}

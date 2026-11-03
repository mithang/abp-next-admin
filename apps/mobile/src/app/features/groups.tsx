import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { Text } from '@/components/ui/text';
import { getFeatureGroups } from '../../features/features/feature-groups-api';
import type { FeatureGroupDefinitionDto } from '../../features/features/types';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';

function GroupRow({ item }: { item: FeatureGroupDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/features/groups/${encodeURIComponent(item.name)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>{item.name}</Text>
        {item.isStatic ? <Text>· {t('featureGroups.static')}</Text> : null}
      </AppRowCard>
    </Link>
  );
}

/** Danh sách nhóm tính năng: ListResult, web phân trang phía client. */
export default function FeatureGroupsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter, debouncedFilter] = useDebouncedFilter();

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
          {...listRefreshProps(query)}
        />
      </AppList>
      <AppNavButton
        title={t('featureGroups.createTitle')}
        href={'/features/groups/form'}
        testID="feature-groups-create"
      />
    </AppScreen>
  );
}

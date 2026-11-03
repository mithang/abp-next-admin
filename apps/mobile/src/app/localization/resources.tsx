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
import { getResourcesPaged } from '../../features/localization/localization-api';
import type { ResourceDto } from '../../features/localization/types';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { useListFilter } from '../../lib/use-list-filter';

function ResourceRow({ item }: { item: ResourceDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/localization/resources/${encodeURIComponent(item.name)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>{item.name}</Text>
        <Text>{item.enable ? t('resources.enabled') : t('resources.disabled')}</Text>
      </AppRowCard>
    </Link>
  );
}

/** Danh sách tài nguyên: phân trang phía server như bảng web (filter/skipCount/maxResultCount). */
export default function ResourcesScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['resources', debouncedFilter, page],
    queryFn: () =>
      getResourcesPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('resources.title')} subtitle={`${t('resources.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('resources.searchPlaceholder')}
        testID="resources-search"
      />
      <AppNavButton
        title={t('resources.createTitle')}
        href={'/localization/resources/form'}
        testID="resources-create"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('resources.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <ResourceRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

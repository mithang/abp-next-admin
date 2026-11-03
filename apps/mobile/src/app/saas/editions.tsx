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
import { getEditionsPaged } from '../../features/saas/saas-api';
import type { EditionDto } from '../../features/saas/types';
import { toApiError } from '../../lib/errors';
import { useListFilter } from '../../lib/use-list-filter';

function EditionRow({ item }: { item: EditionDto }) {
  return (
    <Link href={`/saas/editions/${encodeURIComponent(item.id)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName}</Text>
      </AppRowCard>
    </Link>
  );
}

/** Danh sách phiên bản: GET /api/saas/editions, phân trang ABP (skipCount). */
export default function EditionsScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['saas-editions', debouncedFilter, page],
    queryFn: () =>
      getEditionsPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('saasEditions.title')} subtitle={`${t('saasEditions.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('saasEditions.searchPlaceholder')}
        testID="saas-editions-search"
      />
      <AppNavButton
        title={t('saasEditions.createTitle')}
        href={'/saas/editions/form'}
        testID="saas-editions-create"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('saasEditions.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EditionRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

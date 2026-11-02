import { useState } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { Text } from '@/components/ui/text';
import { getEntityTypeInfosPaged } from '../../features/auditing/data-protection-api';
import type { EntityTypeInfoDto } from '../../features/auditing/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function EntityTypeInfoRow({ item }: { item: EntityTypeInfoDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/data-protection/entity-type-infos/${item.id}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>{item.typeFullName}</Text>
        <Text>
          {t('entityTypeInfos.auditEnabled')}:{' '}
          {item.isAuditEnabled ? t('entityTypeInfos.enabled') : t('entityTypeInfos.disabled')}
        </Text>
      </AppRowCard>
    </Link>
  );
}

export default function EntityTypeInfosScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['entity-type-infos', debouncedFilter, page],
    queryFn: () =>
      getEntityTypeInfosPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('entityTypeInfos.title')}
      subtitle={`${t('entityTypeInfos.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('entityTypeInfos.searchPlaceholder')}
        testID="entity-type-infos-search"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('entityTypeInfos.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EntityTypeInfoRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

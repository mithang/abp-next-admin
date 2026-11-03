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
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { useListFilter } from '../../lib/use-list-filter';
import { navPath } from '../../lib/nav-href';

function EntityTypeInfoRow({ item }: { item: EntityTypeInfoDto }) {
  const { t } = useTranslation();
  return (
    <Link href={navPath('/data-protection/entity-type-infos', item.id)} asChild>
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
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

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
        {...listQueryProps(query)}
        emptyMessage={t('entityTypeInfos.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <EntityTypeInfoRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

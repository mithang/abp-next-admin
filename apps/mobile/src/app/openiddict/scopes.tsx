import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { Text } from '@/components/ui/text';
import { getScopesPaged } from '../../features/openiddict/scopes-api';
import type { OpenIddictScopeDto } from '../../features/openiddict/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { useListFilter } from '../../lib/use-list-filter';
import { navPath } from '../../lib/nav-href';

function ScopeRow({ item }: { item: OpenIddictScopeDto }) {
  return (
    <Link href={navPath('/openiddict/scopes', item.id)} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>{item.name}</Text>
        <AppOptionalText value={item.description} />
      </AppRowCard>
    </Link>
  );
}

export default function ScopesScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['openiddict-scopes', debouncedFilter, page],
    queryFn: () =>
      getScopesPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('openiddictScopes.title')}
      subtitle={`${t('openiddictScopes.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('openiddictScopes.searchPlaceholder')}
        testID="scopes-search"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('openiddictScopes.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <ScopeRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
      <AppNavButton
        title={t('openiddictScopes.createTitle')}
        href={'/openiddict/scopes/form'}
        testID="scopes-create"
      />
    </AppScreen>
  );
}

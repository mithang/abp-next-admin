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
import { AppBadge } from '../../components/ui/AppBadge';
import { getApplicationsPaged } from '../../features/openiddict/applications-api';
import type { OpenIddictApplicationDto } from '../../features/openiddict/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { useListFilter } from '../../lib/use-list-filter';
import { navPath } from '../../lib/nav-href';

function ApplicationRow({ item }: { item: OpenIddictApplicationDto }) {
  return (
    <Link href={navPath('/openiddict/applications', item.id)} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.clientId}</Text>
        <Text>{item.clientId}</Text>
        {item.clientType ? <AppBadge label={item.clientType} /> : null}
        {item.applicationType ? <AppBadge label={item.applicationType} /> : null}
      </AppRowCard>
    </Link>
  );
}

export default function ApplicationsScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['openiddict-applications', debouncedFilter, page],
    queryFn: () =>
      getApplicationsPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('openiddictApplications.title')}
      subtitle={`${t('openiddictApplications.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('openiddictApplications.searchPlaceholder')}
        testID="applications-search"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('openiddictApplications.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <ApplicationRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
      <AppNavButton
        title={t('openiddictApplications.createTitle')}
        href={'/openiddict/applications/form'}
        testID="applications-create"
      />
    </AppScreen>
  );
}

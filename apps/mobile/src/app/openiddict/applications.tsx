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
import { Badge, BadgeText } from '@/components/ui/badge';
import { getApplicationsPaged } from '../../features/openiddict/applications-api';
import type { OpenIddictApplicationDto } from '../../features/openiddict/types';
import { toApiError } from '../../lib/errors';
import { useListFilter } from '../../lib/use-list-filter';

function ApplicationRow({ item }: { item: OpenIddictApplicationDto }) {
  return (
    <Link href={`/openiddict/applications/${item.id}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.clientId}</Text>
        <Text>{item.clientId}</Text>
        {item.clientType ? (
          <Badge variant="default" className="self-start">
            <BadgeText>{item.clientType}</BadgeText>
          </Badge>
        ) : null}
        {item.applicationType ? (
          <Badge variant="default" className="self-start">
            <BadgeText>{item.applicationType}</BadgeText>
          </Badge>
        ) : null}
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
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('openiddictApplications.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ApplicationRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
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

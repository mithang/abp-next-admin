import { useState } from 'react';
import { FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { getApplicationsPaged } from '../../features/openiddict/applications-api';
import type { OpenIddictApplicationDto } from '../../features/openiddict/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

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
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

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
      <AppButton
        title={t('openiddictApplications.createTitle')}
        onPress={() => router.push('/openiddict/applications/form')}
        testID="applications-create"
      />
    </AppScreen>
  );
}

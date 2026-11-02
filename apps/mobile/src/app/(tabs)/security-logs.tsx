import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getSecurityLogsPaged } from '../../features/identity/security-logs-api';
import type { SecurityLogDto } from '../../features/identity/security-logs';
import { toApiError } from '../../lib/errors';
import { formatDateTime } from '../../lib/dates';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function SecurityLogRow({ item }: { item: SecurityLogDto }) {
  return (
    <Link href={`/security-logs/${item.id}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.userName ?? item.identity ?? item.id}</Text>
            {item.action ? <Text>{item.action}</Text> : null}
            {item.creationTime ? <Text>{formatDateTime(item.creationTime)}</Text> : null}
            {item.clientIpAddress ? <Text>{item.clientIpAddress}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function SecurityLogsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['security-logs', debouncedFilter, page],
    queryFn: () =>
      getSecurityLogsPaged({
        userName: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('securityLogs.title')} subtitle={`${t('securityLogs.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('securityLogs.searchPlaceholder')}
        testID="security-logs-search"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('securityLogs.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SecurityLogRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

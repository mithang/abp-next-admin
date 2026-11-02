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
import { getAuditLogsPaged } from '../../features/auditing/auditing-api';
import type { AuditLogDto } from '../../features/auditing/types';
import { toApiError } from '../../lib/errors';
import { formatDateTime } from '../../lib/dates';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function AuditLogRow({ item }: { item: AuditLogDto }) {
  return (
    <Link href={`/auditing/audit-logs/${item.id}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>
              {item.httpMethod ?? ''} {item.httpStatusCode ?? ''} {item.url ?? item.id}
            </Text>
            {item.userName ? <Text>{item.userName}</Text> : null}
            {item.executionTime ? <Text>{formatDateTime(item.executionTime)}</Text> : null}
            {item.executionDuration !== undefined ? (
              <Text>{`${item.executionDuration} ms`}</Text>
            ) : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function AuditLogsScreen() {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [url, setUrl] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debounced = useDebouncedValue({ userName, url }, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['audit-logs', debounced, page],
    queryFn: () =>
      getAuditLogsPaged({
        userName: debounced.userName || undefined,
        url: debounced.url || undefined,
        skipCount,
        maxResultCount,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('auditLogs.title')} subtitle={`${t('auditLogs.total')}: ${total}`}>
      <AppSearchInput
        value={userName}
        onChangeText={setUserName}
        placeholder={t('auditLogs.searchUserPlaceholder')}
        testID="audit-logs-search-user"
      />
      <AppSearchInput
        value={url}
        onChangeText={setUrl}
        placeholder={t('auditLogs.searchUrlPlaceholder')}
        testID="audit-logs-search-url"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('auditLogs.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AuditLogRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

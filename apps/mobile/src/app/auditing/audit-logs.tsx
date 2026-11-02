import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getAuditLogsPaged } from '../../features/auditing/auditing-api';
import type { AuditLogDto } from '../../features/auditing/types';
import { toApiError } from '../../lib/errors';
import { formatDateTime } from '../../lib/dates';
import { useDebouncedValue } from '../../lib/use-debounced-value';

const PAGE_SIZE = 20;

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
  const [page, setPage] = useState(0);
  const debounced = useDebouncedValue({ userName, url }, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['audit-logs', debounced, page],
    queryFn: () =>
      getAuditLogsPaged({
        userName: debounced.userName || undefined,
        url: debounced.url || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('auditLogs.title')} subtitle={`${t('auditLogs.total')}: ${total}`}>
      <AppInput
        value={userName}
        onChangeText={setUserName}
        placeholder={t('auditLogs.searchUserPlaceholder')}
        autoCapitalize="none"
        testID="audit-logs-search-user"
      />
      <AppInput
        value={url}
        onChangeText={setUrl}
        placeholder={t('auditLogs.searchUrlPlaceholder')}
        autoCapitalize="none"
        testID="audit-logs-search-url"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('auditLogs.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AuditLogRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      {hasMore ? (
        <AppButton
          title={t('common.loadMore')}
          onPress={() => setPage((p) => p + 1)}
          variant="outline"
        />
      ) : null}
    </AppScreen>
  );
}

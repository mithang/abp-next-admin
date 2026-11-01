import { useEffect, useState } from 'react';
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
import { getSecurityLogsPaged } from '../../features/identity/security-logs-api';
import type { SecurityLogDto } from '../../features/identity/security-logs';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function SecurityLogRow({ item }: { item: SecurityLogDto }) {
  return (
    <Link href={`/security-logs/${item.id}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.userName ?? item.identity ?? item.id}</Text>
            {item.action ? <Text>{item.action}</Text> : null}
            {item.creationTime ? <Text>{new Date(item.creationTime).toLocaleString()}</Text> : null}
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
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['security-logs', debouncedFilter, page],
    queryFn: () =>
      getSecurityLogsPaged({ userName: debouncedFilter || undefined, skipCount: page * PAGE_SIZE, maxResultCount: PAGE_SIZE }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('securityLogs.title')} subtitle={`${t('securityLogs.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('securityLogs.searchPlaceholder')}
        autoCapitalize="none"
        testID="security-logs-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('securityLogs.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SecurityLogRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      {hasMore ? (
        <AppButton title={t('common.loadMore')} onPress={() => setPage((p) => p + 1)} variant="outline" />
      ) : null}
    </AppScreen>
  );
}

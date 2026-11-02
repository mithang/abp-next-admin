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
import { getSysLogsPaged } from '../../features/auditing/auditing-api';
import { logLevelName, type LogDto } from '../../features/auditing/types';
import { toApiError } from '../../lib/errors';
import { formatDateTime } from '../../lib/dates';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function SysLogRow({ item }: { item: LogDto }) {
  const id = item.fields?.id ?? `${item.timeStamp}-${item.message ?? ''}`;
  return (
    <Link href={`/auditing/sys-logs/${encodeURIComponent(id)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>
              {logLevelName(item.level)}: {item.message ?? ''}
            </Text>
            {item.timeStamp ? <Text>{formatDateTime(item.timeStamp)}</Text> : null}
            {item.fields?.requestPath ? <Text>{item.fields.requestPath}</Text> : null}
            {item.fields?.application ? <Text>{item.fields.application}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function SysLogsScreen() {
  const { t } = useTranslation();
  const [requestPath, setRequestPath] = useState('');
  const [application, setApplication] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debounced = useDebouncedValue({ requestPath, application }, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['sys-logs', debounced, page],
    queryFn: () =>
      getSysLogsPaged({
        requestPath: debounced.requestPath || undefined,
        application: debounced.application || undefined,
        skipCount,
        maxResultCount,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('sysLogs.title')} subtitle={`${t('sysLogs.total')}: ${total}`}>
      <AppSearchInput
        value={requestPath}
        onChangeText={setRequestPath}
        placeholder={t('sysLogs.searchPathPlaceholder')}
        testID="sys-logs-search-path"
      />
      <AppSearchInput
        value={application}
        onChangeText={setApplication}
        placeholder={t('sysLogs.searchAppPlaceholder')}
        testID="sys-logs-search-app"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('sysLogs.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item, index) => item.fields?.id ?? `${item.timeStamp}-${index}`}
          renderItem={({ item }) => <SysLogRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

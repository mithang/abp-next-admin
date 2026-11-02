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
import { getSysLogsPaged } from '../../features/auditing/auditing-api';
import { logLevelName, type LogDto } from '../../features/auditing/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

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
            {item.timeStamp ? <Text>{new Date(item.timeStamp).toLocaleString()}</Text> : null}
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
  const [debounced, setDebounced] = useState({ requestPath: '', application: '' });
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced({ requestPath, application });
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [requestPath, application]);

  const query = useQuery({
    queryKey: ['sys-logs', debounced, page],
    queryFn: () =>
      getSysLogsPaged({
        requestPath: debounced.requestPath || undefined,
        application: debounced.application || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('sysLogs.title')} subtitle={`${t('sysLogs.total')}: ${total}`}>
      <AppInput
        value={requestPath}
        onChangeText={setRequestPath}
        placeholder={t('sysLogs.searchPathPlaceholder')}
        autoCapitalize="none"
        testID="sys-logs-search-path"
      />
      <AppInput
        value={application}
        onChangeText={setApplication}
        placeholder={t('sysLogs.searchAppPlaceholder')}
        autoCapitalize="none"
        testID="sys-logs-search-app"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('sysLogs.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => item.fields?.id ?? `${item.timeStamp}-${index}`}
          renderItem={({ item }) => <SysLogRow item={item} />}
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

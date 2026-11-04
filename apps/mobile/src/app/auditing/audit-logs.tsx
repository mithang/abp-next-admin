import { useState } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { Text } from '@/components/ui/text';
import { getAuditLogsPaged } from '../../features/auditing/auditing-api';
import type { AuditLogDto } from '../../features/auditing/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { formatDateTime } from '../../lib/dates';
import { useDebouncedPagedFilter } from '../../lib/use-debounced-paged-filter';
import { navPath } from '../../lib/nav-href';

function AuditLogRow({ item }: { item: AuditLogDto }) {
  return (
    <Link href={navPath('/auditing/audit-logs', item.id)} asChild>
      <AppRowCard>
        <Text>
          {item.httpMethod ?? ''} {item.httpStatusCode ?? ''} {item.url ?? item.id}
        </Text>
        <AppOptionalText value={item.userName} />
        <AppOptionalText value={formatDateTime(item.executionTime)} />
        {item.executionDuration !== undefined ? (
          <Text>{`${item.executionDuration} ms`}</Text>
        ) : null}
      </AppRowCard>
    </Link>
  );
}

export default function AuditLogsScreen() {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [url, setUrl] = useState('');
  const { page, skipCount, maxResultCount, hasMore, loadMore, debounced } = useDebouncedPagedFilter(
    { userName, url },
  );

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
        {...listQueryProps(query)}
        emptyMessage={t('auditLogs.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <AuditLogRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { Text } from '@/components/ui/text';
import { getSecurityLogsPaged } from '../../features/identity/security-logs-api';
import type { SecurityLogDto } from '../../features/identity/security-logs';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { formatDateTime } from '../../lib/dates';
import { useListFilter } from '../../lib/use-list-filter';

function SecurityLogRow({ item }: { item: SecurityLogDto }) {
  return (
    <Link href={`/security-logs/${item.id}`} asChild>
      <AppRowCard>
        <Text>{item.userName ?? item.identity ?? item.id}</Text>
        {item.action ? <Text>{item.action}</Text> : null}
        {item.creationTime ? <Text>{formatDateTime(item.creationTime)}</Text> : null}
        {item.clientIpAddress ? <Text>{item.clientIpAddress}</Text> : null}
      </AppRowCard>
    </Link>
  );
}

export default function SecurityLogsScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

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
        {...listQueryProps(query)}
        emptyMessage={t('securityLogs.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SecurityLogRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

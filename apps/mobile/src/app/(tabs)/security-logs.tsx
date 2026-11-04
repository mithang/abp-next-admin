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
import { getSecurityLogsPaged } from '../../features/identity/security-logs-api';
import type { SecurityLogDto } from '../../features/identity/security-logs';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { formatDateTime } from '../../lib/dates';
import { useListFilter } from '../../lib/use-list-filter';
import { navPath } from '../../lib/nav-href';

function SecurityLogRow({ item }: { item: SecurityLogDto }) {
  return (
    <Link href={navPath('/security-logs', item.id)} asChild>
      <AppRowCard>
        <Text>{item.userName ?? item.identity ?? item.id}</Text>
        <AppOptionalText value={item.action} />
        <AppOptionalText value={formatDateTime(item.creationTime)} />
        <AppOptionalText value={item.clientIpAddress} />
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
          keyExtractor={keyById}
          renderItem={({ item }) => <SecurityLogRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { Text } from '@/components/ui/text';
import { getTenantsPaged } from '../../features/saas/saas-api';
import type { TenantDto } from '../../features/saas/types';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { useListFilter } from '../../lib/use-list-filter';

function TenantRow({ item }: { item: TenantDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/saas/tenants/${encodeURIComponent(item.id)}`} asChild>
      <AppRowCard>
        <Text>{item.name}</Text>
        <Text>
          {item.isActive ? t('saasTenants.active') : t('saasTenants.inactive')}
          {item.editionName ? ` · ${item.editionName}` : ''}
        </Text>
      </AppRowCard>
    </Link>
  );
}

/** Danh sách tenant: GET /api/saas/tenants, phân trang ABP (skipCount). */
export default function TenantsScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['saas-tenants', debouncedFilter, page],
    queryFn: () =>
      getTenantsPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('saasTenants.title')} subtitle={`${t('saasTenants.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('saasTenants.searchPlaceholder')}
        testID="saas-tenants-search"
      />
      <AppNavButton
        title={t('saasTenants.createTitle')}
        href={'/saas/tenants/form'}
        testID="saas-tenants-create"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('saasTenants.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TenantRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

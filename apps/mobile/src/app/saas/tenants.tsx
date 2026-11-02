import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getTenantsPaged } from '../../features/saas/saas-api';
import type { TenantDto } from '../../features/saas/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function TenantRow({ item }: { item: TenantDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/saas/tenants/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.name}</Text>
            <Text>
              {item.isActive ? t('saasTenants.active') : t('saasTenants.inactive')}
              {item.editionName ? ` · ${item.editionName}` : ''}
            </Text>
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách tenant: GET /api/saas/tenants, phân trang ABP (skipCount). */
export default function TenantsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

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
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('saasTenants.searchPlaceholder')}
        autoCapitalize="none"
        testID="saas-tenants-search"
      />
      <AppButton
        title={t('saasTenants.createTitle')}
        onPress={() => router.push('/saas/tenants/form')}
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
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

import { useEffect, useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getTenantsPaged } from '../../features/saas/saas-api';
import type { TenantDto } from '../../features/saas/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

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
    queryKey: ['saas-tenants', debouncedFilter, page],
    queryFn: () =>
      getTenantsPaged({
        filter: debouncedFilter || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('saasTenants.title')} subtitle={`${t('saasTenants.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('saasTenants.searchPlaceholder')}
        autoCapitalize="none"
        testID="saas-tenants-search"
      />
      <AppButton title={t('saasTenants.createTitle')} onPress={() => router.push('/saas/tenants/form')} testID="saas-tenants-create" />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('saasTenants.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TenantRow item={item} />}
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

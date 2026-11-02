import { useState } from 'react';
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
import { getLayoutsPaged } from '../../features/platform/platform-api';
import type { LayoutDto } from '../../features/platform/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';

const PAGE_SIZE = 20;

function LayoutRow({ item }: { item: LayoutDto }) {
  return (
    <Link href={`/platform/layouts/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName}</Text>
            <Text>
              {item.name} · {item.path} · {item.framework}
            </Text>
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách bố cục: GET /api/platform/layouts, phân trang ABP, lọc filter + framework. */
export default function LayoutsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [framework, setFramework] = useState('');
  const [page, setPage] = useState(0);
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });
  const debouncedFramework = useDebouncedValue(framework, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['platform-layouts', debouncedFilter, debouncedFramework, page],
    queryFn: () =>
      getLayoutsPaged({
        filter: debouncedFilter || undefined,
        framework: debouncedFramework || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen
      title={t('platformLayouts.title')}
      subtitle={`${t('platformLayouts.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('platformLayouts.searchPlaceholder')}
        autoCapitalize="none"
        testID="platform-layouts-search"
      />
      <AppInput
        value={framework}
        onChangeText={setFramework}
        placeholder={t('platformLayouts.frameworkPlaceholder')}
        autoCapitalize="none"
      />
      <AppButton
        title={t('platformLayouts.createTitle')}
        onPress={() => router.push('/platform/layouts/form')}
        testID="platform-layouts-create"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('platformLayouts.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LayoutRow item={item} />}
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

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
import { getLayoutsPaged } from '../../features/platform/platform-api';
import type { LayoutDto } from '../../features/platform/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

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
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
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
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

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
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('platformLayouts.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LayoutRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

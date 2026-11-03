import { useState } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppInput } from '../../components/ui/AppInput';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { Text } from '@/components/ui/text';
import { getLayoutsPaged } from '../../features/platform/platform-api';
import type { LayoutDto } from '../../features/platform/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { useListFilter } from '../../lib/use-list-filter';

function LayoutRow({ item }: { item: LayoutDto }) {
  return (
    <Link href={`/platform/layouts/${encodeURIComponent(item.id)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName}</Text>
        <Text>
          {item.name} · {item.path} · {item.framework}
        </Text>
      </AppRowCard>
    </Link>
  );
}

/** Danh sách bố cục: GET /api/platform/layouts, phân trang ABP, lọc filter + framework. */
export default function LayoutsScreen() {
  const { t } = useTranslation();
  const [framework, setFramework] = useState('');
  const {
    filter,
    setFilter,
    debouncedFilter,
    page,
    setPage,
    skipCount,
    maxResultCount,
    hasMore,
    loadMore,
  } = useListFilter();
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
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('platformLayouts.searchPlaceholder')}
        testID="platform-layouts-search"
      />
      <AppInput
        value={framework}
        onChangeText={setFramework}
        placeholder={t('platformLayouts.frameworkPlaceholder')}
        autoCapitalize="none"
      />
      <AppNavButton
        title={t('platformLayouts.createTitle')}
        href={'/platform/layouts/form'}
        testID="platform-layouts-create"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('platformLayouts.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LayoutRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

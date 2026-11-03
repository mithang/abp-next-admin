import { useState } from 'react';
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
import { getLanguagesPaged } from '../../features/localization/localization-api';
import type { LanguageDto } from '../../features/localization/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function LanguageRow({ item }: { item: LanguageDto }) {
  return (
    <Link href={`/localization/languages/${encodeURIComponent(item.cultureName)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.cultureName}</Text>
        <Text>{item.cultureName}</Text>
        {item.uiCultureName && item.uiCultureName !== item.cultureName ? (
          <Text>{item.uiCultureName}</Text>
        ) : null}
      </AppRowCard>
    </Link>
  );
}

/** Danh sách ngôn ngữ: phân trang phía server như bảng web (filter/skipCount/maxResultCount). */
export default function LanguagesScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['languages', debouncedFilter, page],
    queryFn: () =>
      getLanguagesPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('languages.title')} subtitle={`${t('languages.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('languages.searchPlaceholder')}
        testID="languages-search"
      />
      <AppNavButton
        title={t('languages.createTitle')}
        href={'/localization/languages/form'}
        testID="languages-create"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('languages.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.cultureName}
          renderItem={({ item }) => <LanguageRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

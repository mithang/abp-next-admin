import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getLanguagesPaged } from '../../features/localization/localization-api';
import type { LanguageDto } from '../../features/localization/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function LanguageRow({ item }: { item: LanguageDto }) {
  return (
    <Link href={`/localization/languages/${encodeURIComponent(item.cultureName)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.cultureName}</Text>
            <Text>{item.cultureName}</Text>
            {item.uiCultureName && item.uiCultureName !== item.cultureName ? (
              <Text>{item.uiCultureName}</Text>
            ) : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách ngôn ngữ: phân trang phía server như bảng web (filter/skipCount/maxResultCount). */
export default function LanguagesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
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
      <AppButton
        title={t('languages.createTitle')}
        onPress={() => router.push('/localization/languages/form')}
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

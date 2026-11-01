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
import { getLanguagesPaged } from '../../features/localization/localization-api';
import type { LanguageDto } from '../../features/localization/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function LanguageRow({ item }: { item: LanguageDto }) {
  return (
    <Link href={`/localization/languages/${encodeURIComponent(item.cultureName)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.cultureName}</Text>
            <Text>{item.cultureName}</Text>
            {item.uiCultureName && item.uiCultureName !== item.cultureName ? <Text>{item.uiCultureName}</Text> : null}
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
    queryKey: ['languages', debouncedFilter, page],
    queryFn: () =>
      getLanguagesPaged({ filter: debouncedFilter || undefined, skipCount: page * PAGE_SIZE, maxResultCount: PAGE_SIZE }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('languages.title')} subtitle={`${t('languages.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('languages.searchPlaceholder')}
        autoCapitalize="none"
        testID="languages-search"
      />
      <AppButton title={t('languages.createTitle')} onPress={() => router.push('/localization/languages/form')} testID="languages-create" />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('languages.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.cultureName}
          renderItem={({ item }) => <LanguageRow item={item} />}
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

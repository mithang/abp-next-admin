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
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { useListFilter } from '../../lib/use-list-filter';

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
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

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
        {...listQueryProps(query)}
        emptyMessage={t('languages.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.cultureName}
          renderItem={({ item }) => <LanguageRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

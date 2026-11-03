import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { Text } from '@/components/ui/text';
import { AppBadge } from '../../components/ui/AppBadge';
import { getAuthorizationsPaged } from '../../features/openiddict/authorizations-api';
import type { OpenIddictAuthorizationDto } from '../../features/openiddict/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { useListFilter } from '../../lib/use-list-filter';

/**
 * Web chỉ có bảng ủy quyền + xem/xóa (AuthorizationModal chỉ đọc) nên mobile
 * theo đúng vậy: list + detail + xóa, không có form tạo/sửa.
 */
function AuthorizationRow({ item }: { item: OpenIddictAuthorizationDto }) {
  return (
    <Link href={`/openiddict/authorizations/${item.id}`} asChild>
      <AppRowCard>
        {item.subject ? <Text>{item.subject}</Text> : null}
        {item.type ? <AppBadge label={item.type} /> : null}
        {item.status ? <AppBadge label={item.status} /> : null}
      </AppRowCard>
    </Link>
  );
}

export default function AuthorizationsScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['openiddict-authorizations', debouncedFilter, page],
    queryFn: () =>
      getAuthorizationsPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('openiddictAuthorizations.title')}
      subtitle={`${t('openiddictAuthorizations.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('openiddictAuthorizations.searchPlaceholder')}
        testID="authorizations-search"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('openiddictAuthorizations.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <AuthorizationRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { getTokensPaged } from '../../features/openiddict/tokens-api';
import type { OpenIddictTokenDto } from '../../features/openiddict/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { useListFilter } from '../../lib/use-list-filter';

/**
 * Web chỉ có bảng token + xem/xóa (TokenModal chỉ đọc) nên mobile theo đúng
 * vậy: list + detail + xóa, không có form tạo/sửa. Không hiển thị payload.
 */
function TokenRow({ item }: { item: OpenIddictTokenDto }) {
  return (
    <Link href={`/openiddict/tokens/${item.id}`} asChild>
      <AppRowCard>
        {item.subject ? <Text>{item.subject}</Text> : null}
        {item.referenceId ? <Text>{item.referenceId}</Text> : null}
        {item.type ? (
          <Badge variant="default" className="self-start">
            <BadgeText>{item.type}</BadgeText>
          </Badge>
        ) : null}
        {item.status ? (
          <Badge variant="default" className="self-start">
            <BadgeText>{item.status}</BadgeText>
          </Badge>
        ) : null}
      </AppRowCard>
    </Link>
  );
}

export default function TokensScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['openiddict-tokens', debouncedFilter, page],
    queryFn: () =>
      getTokensPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('openiddictTokens.title')}
      subtitle={`${t('openiddictTokens.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('openiddictTokens.searchPlaceholder')}
        testID="tokens-search"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('openiddictTokens.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <TokenRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

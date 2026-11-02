import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Badge, BadgeText } from '@/components/ui/badge';
import { getAuthorizationsPaged } from '../../features/openiddict/authorizations-api';
import type { OpenIddictAuthorizationDto } from '../../features/openiddict/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

/**
 * Web chỉ có bảng ủy quyền + xem/xóa (AuthorizationModal chỉ đọc) nên mobile
 * theo đúng vậy: list + detail + xóa, không có form tạo/sửa.
 */
function AuthorizationRow({ item }: { item: OpenIddictAuthorizationDto }) {
  return (
    <Link href={`/openiddict/authorizations/${item.id}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            {item.subject ? <Text>{item.subject}</Text> : null}
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
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function AuthorizationsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

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
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('openiddictAuthorizations.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AuthorizationRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

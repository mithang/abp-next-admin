import { useEffect, useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Badge, BadgeText } from '@/components/ui/badge';
import { getAuthorizationsPaged } from '../../features/openiddict/authorizations-api';
import type { OpenIddictAuthorizationDto } from '../../features/openiddict/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

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
    queryKey: ['openiddict-authorizations', debouncedFilter, page],
    queryFn: () =>
      getAuthorizationsPaged({
        filter: debouncedFilter || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen
      title={t('openiddictAuthorizations.title')}
      subtitle={`${t('openiddictAuthorizations.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('openiddictAuthorizations.searchPlaceholder')}
        autoCapitalize="none"
        testID="authorizations-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('openiddictAuthorizations.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AuthorizationRow item={item} />}
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

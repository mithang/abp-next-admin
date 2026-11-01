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
import { getTokensPaged } from '../../features/openiddict/tokens-api';
import type { OpenIddictTokenDto } from '../../features/openiddict/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

/**
 * Web chỉ có bảng token + xem/xóa (TokenModal chỉ đọc) nên mobile theo đúng
 * vậy: list + detail + xóa, không có form tạo/sửa. Không hiển thị payload.
 */
function TokenRow({ item }: { item: OpenIddictTokenDto }) {
  return (
    <Link href={`/openiddict/tokens/${item.id}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
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
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function TokensScreen() {
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
    queryKey: ['openiddict-tokens', debouncedFilter, page],
    queryFn: () =>
      getTokensPaged({ filter: debouncedFilter || undefined, skipCount: page * PAGE_SIZE, maxResultCount: PAGE_SIZE }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('openiddictTokens.title')} subtitle={`${t('openiddictTokens.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('openiddictTokens.searchPlaceholder')}
        autoCapitalize="none"
        testID="tokens-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('openiddictTokens.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TokenRow item={item} />}
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

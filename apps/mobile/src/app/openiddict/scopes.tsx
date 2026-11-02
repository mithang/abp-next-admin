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
import { getScopesPaged } from '../../features/openiddict/scopes-api';
import type { OpenIddictScopeDto } from '../../features/openiddict/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function ScopeRow({ item }: { item: OpenIddictScopeDto }) {
  return (
    <Link href={`/openiddict/scopes/${item.id}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.name}</Text>
            <Text>{item.name}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function ScopesScreen() {
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
    queryKey: ['openiddict-scopes', debouncedFilter, page],
    queryFn: () =>
      getScopesPaged({
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
      title={t('openiddictScopes.title')}
      subtitle={`${t('openiddictScopes.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('openiddictScopes.searchPlaceholder')}
        autoCapitalize="none"
        testID="scopes-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('openiddictScopes.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ScopeRow item={item} />}
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
      <AppButton
        title={t('openiddictScopes.createTitle')}
        onPress={() => router.push('/openiddict/scopes/form')}
        testID="scopes-create"
      />
    </AppScreen>
  );
}

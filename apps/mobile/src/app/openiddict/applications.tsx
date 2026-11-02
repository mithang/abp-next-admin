import { useState } from 'react';
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
import { Badge, BadgeText } from '@/components/ui/badge';
import { getApplicationsPaged } from '../../features/openiddict/applications-api';
import type { OpenIddictApplicationDto } from '../../features/openiddict/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';

const PAGE_SIZE = 20;

function ApplicationRow({ item }: { item: OpenIddictApplicationDto }) {
  return (
    <Link href={`/openiddict/applications/${item.id}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.clientId}</Text>
            <Text>{item.clientId}</Text>
            {item.clientType ? (
              <Badge variant="default" className="self-start">
                <BadgeText>{item.clientType}</BadgeText>
              </Badge>
            ) : null}
            {item.applicationType ? (
              <Badge variant="default" className="self-start">
                <BadgeText>{item.applicationType}</BadgeText>
              </Badge>
            ) : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function ApplicationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['openiddict-applications', debouncedFilter, page],
    queryFn: () =>
      getApplicationsPaged({
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
      title={t('openiddictApplications.title')}
      subtitle={`${t('openiddictApplications.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('openiddictApplications.searchPlaceholder')}
        autoCapitalize="none"
        testID="applications-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('openiddictApplications.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ApplicationRow item={item} />}
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
        title={t('openiddictApplications.createTitle')}
        onPress={() => router.push('/openiddict/applications/form')}
        testID="applications-create"
      />
    </AppScreen>
  );
}

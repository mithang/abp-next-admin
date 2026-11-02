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
import { getClaimTypesPaged } from '../../features/identity/claim-types-api';
import { valueTypeKey, type IdentityClaimTypeDto } from '../../features/identity/claim-types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function ClaimTypeRow({ item }: { item: IdentityClaimTypeDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/claim-types/${item.id}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.name}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
            <Badge variant="default" className="self-start">
              <BadgeText>{t(`claimTypes.valueType.${valueTypeKey(item.valueType)}`)}</BadgeText>
            </Badge>
            {item.required ? (
              <Badge variant="default" className="self-start">
                <BadgeText>{t('claimTypes.required')}</BadgeText>
              </Badge>
            ) : null}
            {item.isStatic ? (
              <Badge variant="default" className="self-start">
                <BadgeText>{t('claimTypes.static')}</BadgeText>
              </Badge>
            ) : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function ClaimTypesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['claim-types', debouncedFilter, page],
    queryFn: () =>
      getClaimTypesPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('claimTypes.title')} subtitle={`${t('claimTypes.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('claimTypes.searchPlaceholder')}
        autoCapitalize="none"
        testID="claim-types-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('claimTypes.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ClaimTypeRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      {hasMore(total) ? (
        <AppButton title={t('common.loadMore')} onPress={loadMore} variant="outline" />
      ) : null}
      <AppButton
        title={t('claimTypes.createTitle')}
        onPress={() => router.push('/claim-types/form')}
        testID="claim-types-create"
      />
    </AppScreen>
  );
}

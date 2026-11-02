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
import { getFeatureDefinitions } from '../../features/features/feature-definitions-api';
import type { FeatureDefinitionDto } from '../../features/features/types';
import { toApiError } from '../../lib/errors';

function DefinitionRow({ item }: { item: FeatureDefinitionDto }) {
  return (
    <Link href={`/features/definitions/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.name}</Text>
            <Text>{item.name}</Text>
            <Text>{item.groupName}</Text>
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách định nghĩa tính năng: ListResult, lọc filter/groupName phía server. */
export default function FeatureDefinitionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(filter), 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['feature-definitions', debouncedFilter],
    queryFn: () => getFeatureDefinitions({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('featureDefinitions.title')}
      subtitle={`${t('featureDefinitions.total')}: ${items.length}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('featureDefinitions.searchPlaceholder')}
        autoCapitalize="none"
        testID="feature-definitions-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('featureDefinitions.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      <AppButton
        title={t('featureDefinitions.createTitle')}
        onPress={() => router.push('/features/definitions/form')}
        testID="feature-definitions-create"
      />
    </AppScreen>
  );
}

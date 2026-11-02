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
import { getFeatureGroups } from '../../features/features/feature-groups-api';
import type { FeatureGroupDefinitionDto } from '../../features/features/types';
import { toApiError } from '../../lib/errors';

function GroupRow({ item }: { item: FeatureGroupDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/features/groups/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.name}</Text>
            <Text>{item.name}</Text>
            {item.isStatic ? <Text>· {t('featureGroups.static')}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách nhóm tính năng: ListResult, web phân trang phía client. */
export default function FeatureGroupsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(filter), 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['feature-groups', debouncedFilter],
    queryFn: () => getFeatureGroups({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('featureGroups.title')}
      subtitle={`${t('featureGroups.total')}: ${items.length}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('featureGroups.searchPlaceholder')}
        autoCapitalize="none"
        testID="feature-groups-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('featureGroups.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <GroupRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      <AppButton
        title={t('featureGroups.createTitle')}
        onPress={() => router.push('/features/groups/form')}
        testID="feature-groups-create"
      />
    </AppScreen>
  );
}

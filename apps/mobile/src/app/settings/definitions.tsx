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
import { getSettingDefinitions } from '../../features/settings/settings-definitions-api';
import type { SettingDefinitionDto } from '../../features/settings/types';
import { toApiError } from '../../lib/errors';

function DefinitionRow({ item }: { item: SettingDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/settings/definitions/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.name}</Text>
            <Text>{item.name}</Text>
            {item.isStatic ? <Text>· {t('settingDefinitions.static')}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách định nghĩa cài đặt: ListResult, lọc filter phía server, phân trang phía client như web. */
export default function SettingDefinitionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(filter), 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['setting-definitions', debouncedFilter],
    queryFn: () => getSettingDefinitions({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen title={t('settingDefinitions.title')} subtitle={`${t('settingDefinitions.total')}: ${items.length}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('settingDefinitions.searchPlaceholder')}
        autoCapitalize="none"
        testID="setting-definitions-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('settingDefinitions.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      <AppButton title={t('settingDefinitions.createTitle')} onPress={() => router.push('/settings/definitions/form')} testID="setting-definitions-create" />
    </AppScreen>
  );
}

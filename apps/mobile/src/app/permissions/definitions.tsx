import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getPermissionDefinitions } from '../../features/permissions/permission-definitions-api';
import type { PermissionDefinitionDto } from '../../features/permissions/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';

function DefinitionRow({ item }: { item: PermissionDefinitionDto }) {
  return (
    <Link href={`/permissions/definitions/${encodeURIComponent(item.name)}`} asChild>
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

/**
 * Danh sách định nghĩa quyền: ListResult, lọc filter/groupName phía server,
 * web phân trang phía client — mobile lấy toàn bộ danh sách theo filter.
 */
export default function PermissionDefinitionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebouncedValue(filter);

  const query = useQuery({
    queryKey: ['permission-definitions', debouncedFilter],
    queryFn: () => getPermissionDefinitions({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('permissionDefinitions.title')}
      subtitle={`${t('permissionDefinitions.total')}: ${items.length}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('permissionDefinitions.searchPlaceholder')}
        testID="permission-definitions-search"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('permissionDefinitions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
      <AppButton
        title={t('permissionDefinitions.createTitle')}
        onPress={() => router.push('/permissions/definitions/form')}
        testID="permission-definitions-create"
      />
    </AppScreen>
  );
}

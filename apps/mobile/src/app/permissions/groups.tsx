import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getPermissionGroups } from '../../features/permissions/permission-groups-api';
import type { PermissionGroupDefinitionDto } from '../../features/permissions/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';

function GroupRow({ item }: { item: PermissionGroupDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/permissions/groups/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.name}</Text>
            <Text>{item.name}</Text>
            {item.isStatic ? <Text>· {t('permissionGroups.static')}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/**
 * Danh sách nhóm quyền: API web trả ListResult (không phân trang server),
 * web phân trang phía client — mobile lấy toàn bộ danh sách theo filter.
 */
export default function PermissionGroupsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebouncedValue(filter);

  const query = useQuery({
    queryKey: ['permission-groups', debouncedFilter],
    queryFn: () => getPermissionGroups({ filter: debouncedFilter || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('permissionGroups.title')}
      subtitle={`${t('permissionGroups.total')}: ${items.length}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('permissionGroups.searchPlaceholder')}
        autoCapitalize="none"
        testID="permission-groups-search"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('permissionGroups.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <GroupRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
      <AppButton
        title={t('permissionGroups.createTitle')}
        onPress={() => router.push('/permissions/groups/form')}
        testID="permission-groups-create"
      />
    </AppScreen>
  );
}

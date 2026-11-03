import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { Text } from '@/components/ui/text';
import { getPermissionGroups } from '../../features/permissions/permission-groups-api';
import type { PermissionGroupDefinitionDto } from '../../features/permissions/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyByName } from '../../lib/list-keys';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';

function GroupRow({ item }: { item: PermissionGroupDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/permissions/groups/${encodeURIComponent(item.name)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>{item.name}</Text>
        {item.isStatic ? <Text>· {t('permissionGroups.static')}</Text> : null}
      </AppRowCard>
    </Link>
  );
}

/**
 * Danh sách nhóm quyền: API web trả ListResult (không phân trang server),
 * web phân trang phía client — mobile lấy toàn bộ danh sách theo filter.
 */
export default function PermissionGroupsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter, debouncedFilter] = useDebouncedFilter();

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
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('permissionGroups.searchPlaceholder')}
        testID="permission-groups-search"
      />
      <AppList items={items} {...listQueryProps(query)} emptyMessage={t('permissionGroups.empty')}>
        <FlatList
          data={items}
          keyExtractor={keyByName}
          renderItem={({ item }) => <GroupRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
      <AppNavButton
        title={t('permissionGroups.createTitle')}
        href={'/permissions/groups/form'}
        testID="permission-groups-create"
      />
    </AppScreen>
  );
}

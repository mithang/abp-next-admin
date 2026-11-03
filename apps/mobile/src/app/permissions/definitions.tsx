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
import { getPermissionDefinitions } from '../../features/permissions/permission-definitions-api';
import type { PermissionDefinitionDto } from '../../features/permissions/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyByName } from '../../lib/list-keys';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';

function DefinitionRow({ item }: { item: PermissionDefinitionDto }) {
  return (
    <Link href={`/permissions/definitions/${encodeURIComponent(item.name)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>{item.name}</Text>
        <Text>{item.groupName}</Text>
      </AppRowCard>
    </Link>
  );
}

/**
 * Danh sách định nghĩa quyền: ListResult, lọc filter/groupName phía server,
 * web phân trang phía client — mobile lấy toàn bộ danh sách theo filter.
 */
export default function PermissionDefinitionsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter, debouncedFilter] = useDebouncedFilter();

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
        {...listQueryProps(query)}
        emptyMessage={t('permissionDefinitions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={keyByName}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
      <AppNavButton
        title={t('permissionDefinitions.createTitle')}
        href={'/permissions/definitions/form'}
        testID="permission-definitions-create"
      />
    </AppScreen>
  );
}

import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { Text } from '@/components/ui/text';
import { getNotificationGroups } from '../../features/notifications/notifications-api';
import type { NotificationGroupDefinitionDto } from '../../features/notifications/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyByName } from '../../lib/list-keys';
import { useDebouncedFilter } from '../../lib/use-debounced-filter';
import { navPath } from '../../lib/nav-href';

function GroupRow({ item }: { item: NotificationGroupDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={navPath('/notifications/groups', item.name)} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>{item.name}</Text>
        <AppOptionalText show={item.isStatic} value={`· ${t('notificationGroups.static')}`} />
      </AppRowCard>
    </Link>
  );
}

/** Danh sách nhóm thông báo: ListResult, web không phân trang server (lọc client). */
export default function NotificationGroupsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter, debouncedFilter] = useDebouncedFilter();

  const query = useQuery({
    queryKey: ['notification-groups', debouncedFilter],
    queryFn: () => getNotificationGroups({ filter: debouncedFilter || undefined }),
  });
  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('notificationGroups.title')}
      subtitle={`${t('notificationGroups.total')}: ${items.length}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('notificationGroups.searchPlaceholder')}
        testID="notification-groups-search"
      />
      <AppNavButton title={t('common.create')} href={'/notifications/groups/form'} />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('notificationGroups.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={keyByName}
          renderItem={({ item }) => <GroupRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

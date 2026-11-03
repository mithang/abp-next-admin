import { useState } from 'react';
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
import { getNotificationDefinitions } from '../../features/notifications/notifications-api';
import type { NotificationDefinitionDto } from '../../features/notifications/types';
import { notificationTypeName } from '../../features/notifications/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { useDebouncedValue } from '../../lib/use-debounced-value';

function DefinitionRow({ item }: { item: NotificationDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/notifications/definitions/${encodeURIComponent(item.name)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>
          {item.name} · {notificationTypeName(item.notificationType)}
        </Text>
        {item.isStatic ? <Text>· {t('notificationDefinitions.static')}</Text> : null}
      </AppRowCard>
    </Link>
  );
}

/** Danh sách định nghĩa thông báo: ListResult, web không phân trang server. */
export default function NotificationDefinitionsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [groupName, setGroupName] = useState('');
  const debounced = useDebouncedValue({ filter, groupName });

  const query = useQuery({
    queryKey: ['notification-definitions', debounced],
    queryFn: () =>
      getNotificationDefinitions({
        filter: debounced.filter || undefined,
        groupName: debounced.groupName || undefined,
      }),
  });
  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('notificationDefinitions.title')}
      subtitle={`${t('notificationDefinitions.total')}: ${items.length}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('notificationDefinitions.searchPlaceholder')}
        testID="notification-definitions-search"
      />
      <AppSearchInput
        value={groupName}
        onChangeText={setGroupName}
        placeholder={t('notificationDefinitions.searchGroupPlaceholder')}
        testID="notification-definitions-search-group"
      />
      <AppNavButton title={t('common.create')} href={'/notifications/definitions/form'} />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('notificationDefinitions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

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
import { getNotificationGroups } from '../../features/notifications/notifications-api';
import type { NotificationGroupDefinitionDto } from '../../features/notifications/types';
import { toApiError } from '../../lib/errors';

function GroupRow({ item }: { item: NotificationGroupDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/notifications/groups/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.name}</Text>
            <Text>{item.name}</Text>
            {item.isStatic ? <Text>· {t('notificationGroups.static')}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách nhóm thông báo: ListResult, web không phân trang server (lọc client). */
export default function NotificationGroupsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(filter), 400);
    return () => clearTimeout(timer);
  }, [filter]);

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
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('notificationGroups.searchPlaceholder')}
        autoCapitalize="none"
        testID="notification-groups-search"
      />
      <AppButton
        title={t('common.create')}
        onPress={() => router.push('/notifications/groups/form')}
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('notificationGroups.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <GroupRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
    </AppScreen>
  );
}

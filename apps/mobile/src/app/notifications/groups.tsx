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
import { getNotificationGroups } from '../../features/notifications/notifications-api';
import type { NotificationGroupDefinitionDto } from '../../features/notifications/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';

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
  const debouncedFilter = useDebouncedValue(filter);

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
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('notificationGroups.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <GroupRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

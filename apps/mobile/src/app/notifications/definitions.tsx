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
import { getNotificationDefinitions } from '../../features/notifications/notifications-api';
import type { NotificationDefinitionDto } from '../../features/notifications/types';
import { notificationTypeName } from '../../features/notifications/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';

function DefinitionRow({ item }: { item: NotificationDefinitionDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/notifications/definitions/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName || item.name}</Text>
            <Text>
              {item.name} · {notificationTypeName(item.notificationType)}
            </Text>
            {item.isStatic ? <Text>· {t('notificationDefinitions.static')}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách định nghĩa thông báo: ListResult, web không phân trang server. */
export default function NotificationDefinitionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
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
      <AppButton
        title={t('common.create')}
        onPress={() => router.push('/notifications/definitions/form')}
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('notificationDefinitions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

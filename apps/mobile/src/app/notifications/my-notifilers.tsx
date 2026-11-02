import { useEffect, useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getMyNotificationsPaged } from '../../features/notifications/notifications-api';
import type { UserNotificationDto } from '../../features/notifications/types';
import {
  deserializeNotification,
  NotificationReadState,
  readStateName,
  severityName,
} from '../../features/notifications/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function MyNotificationRow({ item }: { item: UserNotificationDto }) {
  const { t } = useTranslation();
  const { title } = deserializeNotification(item);
  return (
    <Link href={`/notifications/my-notifilers/${encodeURIComponent(String(item.id))}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{title || item.name}</Text>
            <Text>
              {severityName(item.severity)} · {readStateName(item.state)}
            </Text>
            {item.creationTime ? <Text>{new Date(item.creationTime).toLocaleString()}</Text> : null}
            {item.state === NotificationReadState.UnRead ? (
              <Text>{t('myNotifications.markRead')}</Text>
            ) : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

export default function MyNotificationsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [readState, setReadState] = useState<NotificationReadState | undefined>(undefined);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['my-notifications', debouncedFilter, readState, page],
    queryFn: () =>
      getMyNotificationsPaged({
        filter: debouncedFilter || undefined,
        readState,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen
      title={t('myNotifications.title')}
      subtitle={`${t('myNotifications.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('myNotifications.searchPlaceholder')}
        autoCapitalize="none"
        testID="my-notifications-search"
      />
      <VStack space="xs">
        <AppButton
          title={t('myNotifications.all')}
          onPress={() => {
            setReadState(undefined);
            setPage(0);
          }}
          variant={readState === undefined ? 'solid' : 'outline'}
        />
        <AppButton
          title={readStateName(NotificationReadState.UnRead)}
          onPress={() => {
            setReadState(NotificationReadState.UnRead);
            setPage(0);
          }}
          variant={readState === NotificationReadState.UnRead ? 'solid' : 'outline'}
        />
        <AppButton
          title={readStateName(NotificationReadState.Read)}
          onPress={() => {
            setReadState(NotificationReadState.Read);
            setPage(0);
          }}
          variant={readState === NotificationReadState.Read ? 'solid' : 'outline'}
        />
      </VStack>
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('myNotifications.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <MyNotificationRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      {hasMore ? (
        <AppButton
          title={t('common.loadMore')}
          onPress={() => setPage((p) => p + 1)}
          variant="outline"
        />
      ) : null}
    </AppScreen>
  );
}

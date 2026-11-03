import { useState } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getMyNotificationsPaged } from '../../features/notifications/notifications-api';
import type { UserNotificationDto } from '../../features/notifications/types';
import {
  deserializeNotification,
  NotificationReadState,
  readStateName,
  severityName,
} from '../../features/notifications/types';
import { toApiError } from '../../lib/errors';
import { formatDateTime } from '../../lib/dates';
import { useListFilter } from '../../lib/use-list-filter';

function MyNotificationRow({ item }: { item: UserNotificationDto }) {
  const { t } = useTranslation();
  const { title } = deserializeNotification(item);
  return (
    <Link href={`/notifications/my-notifilers/${encodeURIComponent(String(item.id))}`} asChild>
      <AppRowCard>
        <Text>{title || item.name}</Text>
        <Text>
          {severityName(item.severity)} · {readStateName(item.state)}
        </Text>
        {item.creationTime ? <Text>{formatDateTime(item.creationTime)}</Text> : null}
        {item.state === NotificationReadState.UnRead ? (
          <Text>{t('myNotifications.markRead')}</Text>
        ) : null}
      </AppRowCard>
    </Link>
  );
}

export default function MyNotificationsScreen() {
  const { t } = useTranslation();
  const {
    filter,
    setFilter,
    debouncedFilter,
    page,
    setPage,
    skipCount,
    maxResultCount,
    hasMore,
    loadMore,
  } = useListFilter();
  const [readState, setReadState] = useState<NotificationReadState | undefined>(undefined);

  const query = useQuery({
    queryKey: ['my-notifications', debouncedFilter, readState, page],
    queryFn: () =>
      getMyNotificationsPaged({
        filter: debouncedFilter || undefined,
        readState,
        skipCount,
        maxResultCount,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('myNotifications.title')}
      subtitle={`${t('myNotifications.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('myNotifications.searchPlaceholder')}
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
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('myNotifications.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <MyNotificationRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

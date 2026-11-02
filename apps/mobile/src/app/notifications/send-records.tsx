import { useState } from 'react';
import { FlatList } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  deleteNotificationSendRecord,
  getNotificationSendRecordsPaged,
  reSendNotificationRecord,
} from '../../features/notifications/notifications-api';
import type { NotificationSendRecordDto } from '../../features/notifications/types';
import { sendStateName } from '../../features/notifications/types';
import { toApiError } from '../../lib/errors';
import { showConfirmDialog } from '../../lib/confirm';
import { formatDateTime } from '../../lib/dates';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function SendRecordRow({ item }: { item: NotificationSendRecordDto }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deleteNotificationSendRecord(String(item.id)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-send-records'] });
    },
  });
  const reSendMutation = useMutation({
    mutationFn: () => reSendNotificationRecord(String(item.id)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-send-records'] });
    },
  });
  return (
    <Card className="p-4">
      <VStack space="xs">
        <Text>{item.notification?.name ?? String(item.id)}</Text>
        <Text>
          {t('notificationSendRecords.provider')}: {item.provider} ·{' '}
          {t('notificationSendRecords.state')}: {sendStateName(item.state)}
        </Text>
        <Text>
          {t('notificationSendRecords.user')}: {item.userName}
        </Text>
        {item.sendTime ? (
          <Text>
            {t('notificationSendRecords.sendTime')}: {formatDateTime(item.sendTime)}
          </Text>
        ) : null}
        {item.reason ? (
          <Text>
            {t('notificationSendRecords.reason')}: {item.reason}
          </Text>
        ) : null}
        <AppButton
          title={t('notificationSendRecords.reSend')}
          onPress={() => reSendMutation.mutate()}
          loading={reSendMutation.isPending}
          variant="outline"
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('notificationSendRecords.deleteConfirmTitle'),
              message: t('notificationSendRecords.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
        />
        {reSendMutation.isError ? <Text>{toApiError(reSendMutation.error).message}</Text> : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </Card>
  );
}

/**
 * Lịch sử gửi thông báo: phân trang server. Backend KHÔNG có GET {id} nên
 * không có màn detail (bảng web cũng chỉ có list + xóa + gửi lại).
 */
export default function NotificationSendRecordsScreen() {
  const { t } = useTranslation();
  const [notificationName, setNotificationName] = useState('');
  const [provider, setProvider] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debounced = useDebouncedValue({ notificationName, provider }, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['notification-send-records', debounced, page],
    queryFn: () =>
      getNotificationSendRecordsPaged({
        notificationName: debounced.notificationName || undefined,
        provider: debounced.provider || undefined,
        skipCount,
        maxResultCount,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('notificationSendRecords.title')}
      subtitle={`${t('notificationSendRecords.total')}: ${total}`}
    >
      <AppInput
        value={notificationName}
        onChangeText={setNotificationName}
        placeholder={t('notificationSendRecords.searchNamePlaceholder')}
        autoCapitalize="none"
        testID="notification-send-records-search-name"
      />
      <AppInput
        value={provider}
        onChangeText={setProvider}
        placeholder={t('notificationSendRecords.searchProviderPlaceholder')}
        autoCapitalize="none"
        testID="notification-send-records-search-provider"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('notificationSendRecords.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <SendRecordRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

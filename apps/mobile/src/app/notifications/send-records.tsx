import { useState } from 'react';
import { FlatList } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppSectionCard } from '../../components/ui/AppSectionCard';
import { Text } from '@/components/ui/text';
import {
  deleteNotificationSendRecord,
  getNotificationSendRecordsPaged,
  reSendNotificationRecord,
} from '../../features/notifications/notifications-api';
import type { NotificationSendRecordDto } from '../../features/notifications/types';
import { sendStateName } from '../../features/notifications/types';
import { mutationErrorElement } from '../../lib/mutation-error';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { showConfirmDialog } from '../../lib/confirm';
import { formatDateTime } from '../../lib/dates';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';
import { useInvalidateQueries } from '../../lib/mutation-success';

function SendRecordRow({ item }: { item: NotificationSendRecordDto }) {
  const { t } = useTranslation();
  const invalidate = useInvalidateQueries(['notification-send-records']);
  const deleteMutation = useMutation({
    mutationFn: () => deleteNotificationSendRecord(String(item.id)),
    onSuccess: invalidate,
  });
  const reSendMutation = useMutation({
    mutationFn: () => reSendNotificationRecord(String(item.id)),
    onSuccess: invalidate,
  });
  return (
    <AppSectionCard>
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
      {mutationErrorElement(reSendMutation)}
      {mutationErrorElement(deleteMutation)}
    </AppSectionCard>
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
      <AppSearchInput
        value={notificationName}
        onChangeText={setNotificationName}
        placeholder={t('notificationSendRecords.searchNamePlaceholder')}
        testID="notification-send-records-search-name"
      />
      <AppSearchInput
        value={provider}
        onChangeText={setProvider}
        placeholder={t('notificationSendRecords.searchProviderPlaceholder')}
        testID="notification-send-records-search-provider"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('notificationSendRecords.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <SendRecordRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

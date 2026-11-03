import { useState } from 'react';
import { FlatList } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppList } from '../../../components/ui/AppList';
import { AppInput } from '../../../components/ui/AppInput';
import { AppSearchInput } from '../../../components/ui/AppSearchInput';
import { AppButton } from '../../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  deleteSmsMessage,
  getSmsMessagesPaged,
  sendSmsMessage,
} from '../../../features/platform/platform-api';
import type { SmsMessageDto } from '../../../features/platform/types';
import { toApiError } from '../../../lib/errors';
import { listRefreshProps } from '../../../lib/list-refresh';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';
import { useDebouncedValue } from '../../../lib/use-debounced-value';
import { usePagination } from '../../../lib/use-pagination';
import { useInvalidateQueries } from '../../../lib/mutation-success';
import { messageStatusText } from './email';

function SmsRow({ item }: { item: SmsMessageDto }) {
  const { t } = useTranslation();
  const invalidate = useInvalidateQueries(['platform-sms-messages']);
  const deleteMutation = useMutation({
    mutationFn: () => deleteSmsMessage(item.id),
    onSuccess: invalidate,
  });
  const sendMutation = useMutation({
    mutationFn: () => sendSmsMessage(item.id),
    onSuccess: invalidate,
  });
  return (
    <Card className="p-4">
      <VStack space="xs">
        <Text>{item.receiver}</Text>
        <Text>
          {t('platformSmsMessages.provider')}: {item.provider ?? '—'} ·{' '}
          {t('platformSmsMessages.status')}:{' '}
          {messageStatusText(t, 'platformSmsMessages', item.status)}
        </Text>
        <Text>
          {t('platformSmsMessages.content')}: {item.content}
        </Text>
        {item.sendTime ? (
          <Text>
            {t('platformSmsMessages.sendTime')}: {formatDateTime(item.sendTime)}
          </Text>
        ) : null}
        <Text>
          {t('platformSmsMessages.sendCount')}: {item.sendCount}
        </Text>
        {item.reason ? (
          <Text>
            {t('platformSmsMessages.reason')}: {item.reason}
          </Text>
        ) : null}
        <AppButton
          title={t('platformSmsMessages.send')}
          variant="outline"
          loading={sendMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('platformSmsMessages.sendConfirmTitle'),
              message: t('platformSmsMessages.sendConfirmMessage'),
              confirmText: t('platformSmsMessages.send'),
              cancelText: t('common.cancel'),
              onConfirm: () => sendMutation.mutate(),
              destructive: false,
            })
          }
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('platformSmsMessages.deleteConfirmTitle'),
              message: t('platformSmsMessages.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
        />
        {sendMutation.isError ? <Text>{toApiError(sendMutation.error).message}</Text> : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </Card>
  );
}

/**
 * Tin nhắn SMS: phân trang ABP, lọc filter/phoneNumber/status + khoảng
 * thời gian gửi (đúng form lọc bảng web). Bảng web KHÔNG có modal chi
 * tiết cho SMS (chỉ list + xóa + gửi lại) nên mobile cũng không làm
 * màn detail SMS, dù backend có GET {id}. KHÔNG có tạo/sửa.
 */
export default function SmsMessagesScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('');
  const [beginSendTime, setBeginSendTime] = useState('');
  const [endSendTime, setEndSendTime] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debounced = useDebouncedValue(
    { filter, phoneNumber, status, beginSendTime, endSendTime },
    400,
    () => {
      setPage(0);
    },
  );

  const parsedStatus = /^(-1|0|10)$/.test(debounced.status.trim())
    ? Number(debounced.status.trim())
    : undefined;
  const query = useQuery({
    queryKey: ['platform-sms-messages', debounced, parsedStatus, page],
    queryFn: () =>
      getSmsMessagesPaged({
        filter: debounced.filter || undefined,
        phoneNumber: debounced.phoneNumber || undefined,
        status: parsedStatus,
        beginSendTime: debounced.beginSendTime || undefined,
        endSendTime: debounced.endSendTime || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('platformSmsMessages.title')}
      subtitle={`${t('platformSmsMessages.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('platformSmsMessages.searchPlaceholder')}
        testID="platform-sms-search"
      />
      <AppInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder={t('platformSmsMessages.phonePlaceholder')}
        autoCapitalize="none"
        keyboardType="phone-pad"
      />
      <AppInput
        value={status}
        onChangeText={setStatus}
        placeholder={t('platformSmsMessages.statusPlaceholder')}
        autoCapitalize="none"
      />
      <AppInput
        value={beginSendTime}
        onChangeText={setBeginSendTime}
        placeholder={t('platformSmsMessages.beginSendTimePlaceholder')}
        autoCapitalize="none"
      />
      <AppInput
        value={endSendTime}
        onChangeText={setEndSendTime}
        placeholder={t('platformSmsMessages.endSendTimePlaceholder')}
        autoCapitalize="none"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('platformSmsMessages.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SmsRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

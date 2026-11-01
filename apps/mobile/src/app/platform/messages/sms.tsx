import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppInput } from '../../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../../components/ui/AppStates';
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
import { messageStatusText } from './email';

const PAGE_SIZE = 20;

function SmsRow({ item }: { item: SmsMessageDto }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deleteSmsMessage(item.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-sms-messages'] });
    },
  });
  const sendMutation = useMutation({
    mutationFn: () => sendSmsMessage(item.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platform-sms-messages'] });
    },
  });
  return (
    <Card className="p-4">
      <VStack space="xs">
        <Text>{item.receiver}</Text>
        <Text>
          {t('platformSmsMessages.provider')}: {item.provider ?? '—'} · {t('platformSmsMessages.status')}:{' '}
          {messageStatusText(t, 'platformSmsMessages', item.status)}
        </Text>
        <Text>
          {t('platformSmsMessages.content')}: {item.content}
        </Text>
        {item.sendTime ? (
          <Text>
            {t('platformSmsMessages.sendTime')}: {new Date(item.sendTime).toLocaleString()}
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
            Alert.alert(t('platformSmsMessages.sendConfirmTitle'), t('platformSmsMessages.sendConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('platformSmsMessages.send'), onPress: () => sendMutation.mutate() },
            ])
          }
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(t('platformSmsMessages.deleteConfirmTitle'), t('platformSmsMessages.deleteConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate() },
            ])
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
  const [debounced, setDebounced] = useState({ filter: '', phoneNumber: '', status: '', beginSendTime: '', endSendTime: '' });
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced({ filter, phoneNumber, status, beginSendTime, endSendTime });
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter, phoneNumber, status, beginSendTime, endSendTime]);

  const parsedStatus = /^(-1|0|10)$/.test(debounced.status.trim()) ? Number(debounced.status.trim()) : undefined;
  const query = useQuery({
    queryKey: ['platform-sms-messages', debounced, parsedStatus, page],
    queryFn: () =>
      getSmsMessagesPaged({
        filter: debounced.filter || undefined,
        phoneNumber: debounced.phoneNumber || undefined,
        status: parsedStatus,
        beginSendTime: debounced.beginSendTime || undefined,
        endSendTime: debounced.endSendTime || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('platformSmsMessages.title')} subtitle={`${t('platformSmsMessages.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('platformSmsMessages.searchPlaceholder')}
        autoCapitalize="none"
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
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('platformSmsMessages.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SmsRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      {hasMore ? (
        <AppButton title={t('common.loadMore')} onPress={() => setPage((p) => p + 1)} variant="outline" />
      ) : null}
    </AppScreen>
  );
}

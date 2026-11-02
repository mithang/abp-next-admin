import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppSelect } from '../../../components/ui/AppSelect';
import { AppInput } from '../../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { AppButton } from '../../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getEmailMessagesPaged } from '../../../features/platform/platform-api';
import type { EmailMessageDto } from '../../../features/platform/types';
import { toApiError } from '../../../lib/errors';
import { buildEmailStatusOptions, parseEmailStatusFilter } from '../../../lib/app-select-options';
import { formatDateTime } from '../../../lib/dates';
import { useDebouncedValue } from '../../../lib/use-debounced-value';

const PAGE_SIZE = 20;

export function messageStatusText(t: (key: string) => string, ns: string, status: number): string {
  if (status === -1) return t(`${ns}.statusPending`);
  if (status === 10) return t(`${ns}.statusFailed`);
  return t(`${ns}.statusSent`);
}

function EmailRow({ item }: { item: EmailMessageDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/platform/messages/email/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.subject ?? item.receiver}</Text>
            <Text>
              {t('platformEmailMessages.provider')}: {item.provider ?? '—'} ·{' '}
              {t('platformEmailMessages.status')}:{' '}
              {messageStatusText(t, 'platformEmailMessages', item.status)}
            </Text>
            <Text>
              {t('platformEmailMessages.receiver')}: {item.receiver}
            </Text>
            {item.sendTime ? (
              <Text>
                {t('platformEmailMessages.sendTime')}: {formatDateTime(item.sendTime)}
              </Text>
            ) : null}
            <Text>
              {t('platformEmailMessages.sendCount')}: {item.sendCount}
            </Text>
            {item.reason ? (
              <Text>
                {t('platformEmailMessages.reason')}: {item.reason}
              </Text>
            ) : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/**
 * Tin nhắn Email: phân trang ABP, lọc filter/emailAddress/status +
 * khoảng thời gian gửi (đúng form lọc bảng web; status chọn qua
 * AppSelect -1/0/10 từ vòng 29, đóng nốt mục này của P2 AppSelect;
 * để trống = tất cả). Chỉ đọc
 * + xóa + gửi lại ở màn detail;
 * KHÔNG có tạo/sửa (backend cũng không có Create/Update cho trang này).
 */
export default function EmailMessagesScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [status, setStatus] = useState('');
  const [beginSendTime, setBeginSendTime] = useState('');
  const [endSendTime, setEndSendTime] = useState('');
  const [page, setPage] = useState(0);
  const debounced = useDebouncedValue(
    { filter, emailAddress, status, beginSendTime, endSendTime },
    400,
    () => {
      setPage(0);
    },
  );

  const parsedStatus = parseEmailStatusFilter(debounced.status);
  const query = useQuery({
    queryKey: ['platform-email-messages', debounced, parsedStatus, page],
    queryFn: () =>
      getEmailMessagesPaged({
        filter: debounced.filter || undefined,
        emailAddress: debounced.emailAddress || undefined,
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
    <AppScreen
      title={t('platformEmailMessages.title')}
      subtitle={`${t('platformEmailMessages.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('platformEmailMessages.searchPlaceholder')}
        autoCapitalize="none"
        testID="platform-email-search"
      />
      <AppInput
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder={t('platformEmailMessages.emailPlaceholder')}
        autoCapitalize="none"
      />
      <AppSelect
        label={t('platformEmailMessages.status')}
        value={status}
        options={buildEmailStatusOptions(t)}
        onChange={setStatus}
        placeholder={t('platformEmailMessages.statusPlaceholder')}
        clearable
        testID="platform-email-status"
      />
      <AppInput
        value={beginSendTime}
        onChangeText={setBeginSendTime}
        placeholder={t('platformEmailMessages.beginSendTimePlaceholder')}
        autoCapitalize="none"
      />
      <AppInput
        value={endSendTime}
        onChangeText={setEndSendTime}
        placeholder={t('platformEmailMessages.endSendTimePlaceholder')}
        autoCapitalize="none"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('platformEmailMessages.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EmailRow item={item} />}
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

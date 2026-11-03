import { useState } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppList } from '../../../components/ui/AppList';
import { AppRowCard } from '../../../components/ui/AppRowCard';
import { AppSelect } from '../../../components/ui/AppSelect';
import { AppInput } from '../../../components/ui/AppInput';
import { AppSearchInput } from '../../../components/ui/AppSearchInput';
import { Text } from '@/components/ui/text';
import { getEmailMessagesPaged } from '../../../features/platform/platform-api';
import type { EmailMessageDto } from '../../../features/platform/types';
import { listRefreshProps } from '../../../lib/list-refresh';
import { listQueryProps } from '../../../lib/list-query-props';
import { keyById } from '../../../lib/list-keys';
import { buildEmailStatusOptions, parseEmailStatusFilter } from '../../../lib/app-select-options';
import { formatDateTime } from '../../../lib/dates';
import { useDebouncedValue } from '../../../lib/use-debounced-value';
import { usePagination } from '../../../lib/use-pagination';

export function messageStatusText(t: (key: string) => string, ns: string, status: number): string {
  if (status === -1) return t(`${ns}.statusPending`);
  if (status === 10) return t(`${ns}.statusFailed`);
  return t(`${ns}.statusSent`);
}

function EmailRow({ item }: { item: EmailMessageDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/platform/messages/email/${encodeURIComponent(item.id)}`} asChild>
      <AppRowCard>
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
      </AppRowCard>
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
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
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
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('platformEmailMessages.title')}
      subtitle={`${t('platformEmailMessages.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('platformEmailMessages.searchPlaceholder')}
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
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('platformEmailMessages.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <EmailRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

import { FlatList } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getSessionsPaged, revokeSession } from '../../features/identity/sessions-api';
import type { IdentitySessionDto } from '../../features/identity/sessions';
import { mutationErrorElement } from '../../lib/mutation-error';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { showConfirmDialog } from '../../lib/confirm';
import { formatDateTime } from '../../lib/dates';
import { useListFilter } from '../../lib/use-list-filter';
import { useInvalidateQueries } from '../../lib/mutation-success';

/**
 * Web chỉ có bảng phiên + nút thu hồi (SessionTable), không có trang chi tiết —
 * mobile theo đúng vậy: mỗi dòng có nút Thu hồi có xác nhận, không tạo detail giả.
 */
function SessionRow({ item }: { item: IdentitySessionDto }) {
  const { t } = useTranslation();
  const invalidate = useInvalidateQueries(['sessions']);
  const revokeMutation = useMutation({
    mutationFn: () => revokeSession(item.sessionId),
    onSuccess: invalidate,
  });
  return (
    <Card className="p-4">
      <VStack space="xs">
        <Text>{item.device}</Text>
        {item.deviceInfo ? <Text>{item.deviceInfo}</Text> : null}
        {item.clientId ? (
          <Text>
            {t('sessions.client')}: {item.clientId}
          </Text>
        ) : null}
        {item.ipAddresses ? (
          <Text>
            {t('sessions.ipAddresses')}: {item.ipAddresses}
          </Text>
        ) : null}
        <Text>
          {t('sessions.signedIn')}: {formatDateTime(item.signedIn)}
        </Text>
        {item.lastAccessed ? (
          <Text>
            {t('sessions.lastAccessed')}: {formatDateTime(item.lastAccessed)}
          </Text>
        ) : null}
        <AppButton
          title={t('sessions.revoke')}
          action="negative"
          variant="outline"
          loading={revokeMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('sessions.revokeConfirmTitle'),
              message: t('sessions.revokeConfirmMessage'),
              confirmText: t('sessions.revoke'),
              cancelText: t('common.cancel'),
              onConfirm: () => revokeMutation.mutate(),
            })
          }
          testID={`session-revoke-${item.sessionId}`}
        />
        {mutationErrorElement(revokeMutation)}
      </VStack>
    </Card>
  );
}

export default function SessionsScreen() {
  const { t } = useTranslation();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['sessions', debouncedFilter, page],
    queryFn: () =>
      getSessionsPaged({
        device: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('sessions.title')} subtitle={`${t('sessions.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('sessions.searchPlaceholder')}
        testID="sessions-search"
      />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('sessions.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.sessionId}
          renderItem={({ item }) => <SessionRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

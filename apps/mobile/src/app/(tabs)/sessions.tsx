import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getSessionsPaged, revokeSession } from '../../features/identity/sessions-api';
import type { IdentitySessionDto } from '../../features/identity/sessions';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

/**
 * Web chỉ có bảng phiên + nút thu hồi (SessionTable), không có trang chi tiết —
 * mobile theo đúng vậy: mỗi dòng có nút Thu hồi có xác nhận, không tạo detail giả.
 */
function SessionRow({ item }: { item: IdentitySessionDto }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const revokeMutation = useMutation({
    mutationFn: () => revokeSession(item.sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
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
          {t('sessions.signedIn')}: {new Date(item.signedIn).toLocaleString()}
        </Text>
        {item.lastAccessed ? (
          <Text>
            {t('sessions.lastAccessed')}: {new Date(item.lastAccessed).toLocaleString()}
          </Text>
        ) : null}
        <AppButton
          title={t('sessions.revoke')}
          action="negative"
          variant="outline"
          loading={revokeMutation.isPending}
          onPress={() =>
            Alert.alert(t('sessions.revokeConfirmTitle'), t('sessions.revokeConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('sessions.revoke'), style: 'destructive', onPress: () => revokeMutation.mutate() },
            ])
          }
          testID={`session-revoke-${item.sessionId}`}
        />
        {revokeMutation.isError ? <Text>{toApiError(revokeMutation.error).message}</Text> : null}
      </VStack>
    </Card>
  );
}

export default function SessionsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['sessions', debouncedFilter, page],
    queryFn: () =>
      getSessionsPaged({ device: debouncedFilter || undefined, skipCount: page * PAGE_SIZE, maxResultCount: PAGE_SIZE }),
  });
  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('sessions.title')} subtitle={`${t('sessions.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('sessions.searchPlaceholder')}
        autoCapitalize="none"
        testID="sessions-search"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('sessions.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.sessionId}
          renderItem={({ item }) => <SessionRow item={item} />}
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

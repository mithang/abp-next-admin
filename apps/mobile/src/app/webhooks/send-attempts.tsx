import { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  deleteWebhookSendAttempt,
  getWebhookSendAttemptsPaged,
  resendWebhookSendAttempt,
} from '../../features/webhooks/webhooks-api';
import type { WebhookSendRecordDto } from '../../features/webhooks/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function AttemptRow({ item }: { item: WebhookSendRecordDto }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resend = useMutation({
    mutationFn: () => resendWebhookSendAttempt(item.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['webhook-send-attempts'] }),
  });
  const remove = useMutation({
    mutationFn: () => deleteWebhookSendAttempt(item.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['webhook-send-attempts'] }),
  });
  return (
    <Card className="p-4">
      <VStack space="xs">
        <Link href={`/webhooks/send-attempts/${encodeURIComponent(item.id)}`} asChild>
          <Pressable>
            <VStack space="xs">
              <Text>{item.webhookEvent.webhookName}</Text>
              <Text>
                {item.responseStatusCode !== undefined ? `HTTP ${item.responseStatusCode}` : 'no response'} ·{' '}
                {new Date(item.creationTime).toLocaleString()}
              </Text>
            </VStack>
          </Pressable>
        </Link>
        <AppButton
          title={t('webhookSendAttempts.resend')}
          variant="outline"
          loading={resend.isPending}
          onPress={() => resend.mutate()}
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={remove.isPending}
          onPress={() => remove.mutate()}
        />
      </VStack>
    </Card>
  );
}

/**
 * Danh sách bản ghi gửi Webhook: đúng backend — GET
 * /api/webhooks/send-attempts (phân trang ABP, lọc filter). Gửi lại +
 * xóa ngay trên dòng như bảng web (web còn có bulk resend/delete qua
 * chọn nhiều — API bulk sẵn ở webhooks-api, UI chọn nhiều để vòng
 * sau, cùng mẫu các nhóm trước). Không có tạo/sửa (backend không có).
 */
export default function WebhookSendAttemptsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(filter);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['webhook-send-attempts', debounced, page],
    queryFn: () =>
      getWebhookSendAttemptsPaged({
        filter: debounced || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('webhookSendAttempts.title')} subtitle={`${t('webhookSendAttempts.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('webhookSendAttempts.searchPlaceholder')}
        autoCapitalize="none"
        testID="webhook-send-attempts-search"
      />
      <View style={{ height: 8 }} />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('webhookSendAttempts.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AttemptRow item={item} />}
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

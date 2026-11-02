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
  bulkDeleteWebhookSendAttempts,
  bulkResendWebhookSendAttempts,
  deleteWebhookSendAttempt,
  getWebhookSendAttemptsPaged,
  resendWebhookSendAttempt,
} from '../../features/webhooks/webhooks-api';
import type { WebhookSendRecordDto } from '../../features/webhooks/types';
import { toApiError } from '../../lib/errors';
import { toggleSelection } from '../../lib/selection';
import { showConfirmDialog } from '../../lib/confirm';

const PAGE_SIZE = 20;

function AttemptRow({
  item,
  selectMode,
  isSelected,
  onToggle,
}: {
  item: WebhookSendRecordDto;
  selectMode: boolean;
  isSelected: boolean;
  onToggle: () => void;
}) {
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
  const body = (
    <VStack space="xs">
      <Text>
        {selectMode && isSelected ? '✓ ' : ''}
        {item.webhookEvent.webhookName}
      </Text>
      <Text>
        {item.responseStatusCode !== undefined ? `HTTP ${item.responseStatusCode}` : 'no response'}{' '}
        · {new Date(item.creationTime).toLocaleString()}
      </Text>
    </VStack>
  );
  if (selectMode) {
    return (
      <Pressable onPress={onToggle}>
        <Card className="p-4">{body}</Card>
      </Pressable>
    );
  }
  return (
    <Card className="p-4">
      <VStack space="xs">
        <Link href={`/webhooks/send-attempts/${encodeURIComponent(item.id)}`} asChild>
          <Pressable>{body}</Pressable>
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
 * xóa ngay trên dòng như bảng web. Chế độ chọn nhiều gọi đúng API bulk
 * đã có ở webhooks-api (POST resend-many, DELETE delete-many, body
 * { recordIds }), theo mẫu màn Tác vụ nền (vòng 19). Không có tạo/sửa
 * (backend không có). Lọc đổi thì xóa lựa chọn.
 */
export default function WebhookSendAttemptsScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(0);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(filter);
      setPage(0);
      setSelected(new Set());
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

  const bulkMutation = useMutation({
    mutationFn: (action: 'resend' | 'delete') =>
      action === 'resend'
        ? bulkResendWebhookSendAttempts({ recordIds: [...selected] })
        : bulkDeleteWebhookSendAttempts({ recordIds: [...selected] }),
    onSuccess: async () => {
      setSelected(new Set());
      setSelectMode(false);
      await queryClient.invalidateQueries({ queryKey: ['webhook-send-attempts'] });
    },
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen
      title={t('webhookSendAttempts.title')}
      subtitle={`${t('webhookSendAttempts.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('webhookSendAttempts.searchPlaceholder')}
        autoCapitalize="none"
        testID="webhook-send-attempts-search"
      />
      <AppButton
        title={
          selectMode ? t('webhookSendAttempts.exitSelectMode') : t('webhookSendAttempts.selectMode')
        }
        onPress={() => {
          setSelectMode((v) => !v);
          setSelected(new Set());
        }}
        variant="outline"
      />
      {selected.size > 0 ? (
        <>
          <AppButton
            title={`${t('webhookSendAttempts.bulkResend')} (${selected.size})`}
            variant="outline"
            loading={bulkMutation.isPending}
            onPress={() => bulkMutation.mutate('resend')}
          />
          <AppButton
            title={`${t('webhookSendAttempts.bulkDelete')} (${selected.size})`}
            action="negative"
            variant="outline"
            loading={bulkMutation.isPending}
            onPress={() =>
              showConfirmDialog({
                title: t('webhookSendAttempts.bulkDeleteConfirmTitle'),
                message: t('webhookSendAttempts.bulkDeleteConfirmMessage'),
                confirmText: t('common.delete'),
                cancelText: t('common.cancel'),
                onConfirm: () => bulkMutation.mutate('delete'),
              })
            }
          />
        </>
      ) : null}
      <View style={{ height: 8 }} />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('webhookSendAttempts.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AttemptRow
              item={item}
              selectMode={selectMode}
              isSelected={selected.has(item.id)}
              onToggle={() => setSelected((prev) => toggleSelection(prev, item.id))}
            />
          )}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      {bulkMutation.isError ? <Text>{toApiError(bulkMutation.error).message}</Text> : null}
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

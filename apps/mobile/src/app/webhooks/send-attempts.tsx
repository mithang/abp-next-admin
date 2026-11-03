import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppSectionCard } from '../../components/ui/AppSectionCard';
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
import { mutationErrorElement } from '../../lib/mutation-error';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { toggleSelection } from '../../lib/selection';
import { showConfirmDialog } from '../../lib/confirm';
import { formatDateTime } from '../../lib/dates';
import { useListFilter } from '../../lib/use-list-filter';
import { useInvalidateQueries } from '../../lib/mutation-success';

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
  const invalidate = useInvalidateQueries(['webhook-send-attempts']);
  const resend = useMutation({
    mutationFn: () => resendWebhookSendAttempt(item.id),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: () => deleteWebhookSendAttempt(item.id),
    onSuccess: invalidate,
  });
  const body = (
    <VStack space="xs">
      <Text>
        {selectMode && isSelected ? '✓ ' : ''}
        {item.webhookEvent.webhookName}
      </Text>
      <Text>
        {item.responseStatusCode !== undefined ? `HTTP ${item.responseStatusCode}` : 'no response'}{' '}
        · {formatDateTime(item.creationTime)}
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
    <AppSectionCard>
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
    </AppSectionCard>
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter(() => {
      setSelected(new Set());
    });
  const [selectMode, setSelectMode] = useState(false);

  const query = useQuery({
    queryKey: ['webhook-send-attempts', debouncedFilter, page],
    queryFn: () =>
      getWebhookSendAttemptsPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
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

  return (
    <AppScreen
      title={t('webhookSendAttempts.title')}
      subtitle={`${t('webhookSendAttempts.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('webhookSendAttempts.searchPlaceholder')}
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
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('webhookSendAttempts.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => (
            <AttemptRow
              item={item}
              selectMode={selectMode}
              isSelected={selected.has(item.id)}
              onToggle={() => setSelected((prev) => toggleSelection(prev, item.id))}
            />
          )}
          {...listRefreshProps(query)}
        />
      </AppList>
      {mutationErrorElement(bulkMutation)}
      {hasMore(total) ? (
        <AppButton title={t('common.loadMore')} onPress={loadMore} variant="outline" />
      ) : null}
    </AppScreen>
  );
}

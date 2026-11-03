import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  bulkDeleteWebhookSubscriptions,
  getWebhookSubscriptionsPaged,
} from '../../features/webhooks/webhooks-api';
import type { WebhookSubscriptionDto } from '../../features/webhooks/types';
import { mutationErrorElement } from '../../lib/mutation-error';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { toggleSelection } from '../../lib/selection';
import { showConfirmDialog } from '../../lib/confirm';
import { useListFilter } from '../../lib/use-list-filter';

function SubscriptionRow({
  item,
  selectMode,
  isSelected,
  onToggle,
}: {
  item: WebhookSubscriptionDto;
  selectMode: boolean;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const body = (
    <Card className="p-4">
      <VStack space="xs">
        <Text>
          {selectMode && isSelected ? '✓ ' : ''}
          {item.webhookUri}
        </Text>
        <Text>{item.isActive ? 'active' : 'inactive'}</Text>
        {item.description ? <Text>{item.description}</Text> : null}
        <Text>{item.webhooks.join(', ')}</Text>
      </VStack>
    </Card>
  );
  if (selectMode) {
    return <Pressable onPress={onToggle}>{body}</Pressable>;
  }
  return (
    <Link href={`/webhooks/subscriptions/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>{body}</Pressable>
    </Link>
  );
}

/**
 * Danh sách đăng ký Webhook: đúng backend — GET
 * /api/webhooks/subscriptions (phân trang ABP, lọc filter/webhookUri).
 * Chế độ chọn nhiều gọi đúng API bulk đã có ở webhooks-api (DELETE
 * delete-many, body { recordIds }), theo mẫu màn Tác vụ nền (vòng 19).
 * Lọc đổi thì xóa lựa chọn (tránh bulk nhầm id ngoài danh sách hiển thị).
 */
export default function WebhookSubscriptionsScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter(() => {
      setSelected(new Set());
    });
  const [selectMode, setSelectMode] = useState(false);

  const query = useQuery({
    queryKey: ['webhook-subscriptions', debouncedFilter, page],
    queryFn: () =>
      getWebhookSubscriptionsPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const bulkDelete = useMutation({
    mutationFn: () => bulkDeleteWebhookSubscriptions({ recordIds: [...selected] }),
    onSuccess: async () => {
      setSelected(new Set());
      setSelectMode(false);
      await queryClient.invalidateQueries({ queryKey: ['webhook-subscriptions'] });
    },
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('webhookSubscriptions.title')}
      subtitle={`${t('webhookSubscriptions.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('webhookSubscriptions.searchPlaceholder')}
        testID="webhook-subscriptions-search"
      />
      <AppNavButton
        title={t('webhookSubscriptions.createTitle')}
        href={'/webhooks/subscriptions/form'}
        testID="webhook-subscriptions-create"
      />
      <AppButton
        title={
          selectMode
            ? t('webhookSubscriptions.exitSelectMode')
            : t('webhookSubscriptions.selectMode')
        }
        onPress={() => {
          setSelectMode((v) => !v);
          setSelected(new Set());
        }}
        variant="outline"
      />
      {selected.size > 0 ? (
        <AppButton
          title={`${t('webhookSubscriptions.bulkDelete')} (${selected.size})`}
          action="negative"
          variant="outline"
          loading={bulkDelete.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('webhookSubscriptions.bulkDeleteConfirmTitle'),
              message: t('webhookSubscriptions.bulkDeleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => bulkDelete.mutate(),
            })
          }
        />
      ) : null}
      <View style={{ height: 8 }} />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('webhookSubscriptions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubscriptionRow
              item={item}
              selectMode={selectMode}
              isSelected={selected.has(item.id)}
              onToggle={() => setSelected((prev) => toggleSelection(prev, item.id))}
            />
          )}
          {...listRefreshProps(query)}
        />
      </AppList>
      {mutationErrorElement(bulkDelete)}
      {hasMore(total) ? (
        <AppButton title={t('common.loadMore')} onPress={loadMore} variant="outline" />
      ) : null}
    </AppScreen>
  );
}

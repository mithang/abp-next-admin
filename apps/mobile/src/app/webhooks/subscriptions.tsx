import { FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '../../lib/mutation-success';
import { useBulkSelection } from '../../lib/use-bulk-selection';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppSectionCard } from '../../components/ui/AppSectionCard';
import { AppSpacer } from '../../components/ui/AppSpacer';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { Text } from '@/components/ui/text';
import {
  bulkDeleteWebhookSubscriptions,
  getWebhookSubscriptionsPaged,
} from '../../features/webhooks/webhooks-api';
import type { WebhookSubscriptionDto } from '../../features/webhooks/types';
import { mutationErrorElement } from '../../lib/mutation-error';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { showConfirmDialog } from '../../lib/confirm';
import { useListFilter } from '../../lib/use-list-filter';
import { navPath } from '../../lib/nav-href';

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
    <AppSectionCard>
      <Text>
        {selectMode && isSelected ? '✓ ' : ''}
        {item.webhookUri}
      </Text>
      <Text>{item.isActive ? 'active' : 'inactive'}</Text>
      <AppOptionalText value={item.description} />
      <Text>{item.webhooks.join(', ')}</Text>
    </AppSectionCard>
  );
  if (selectMode) {
    return <Pressable onPress={onToggle}>{body}</Pressable>;
  }
  return (
    <Link href={navPath('/webhooks/subscriptions', item.id)} asChild>
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
  const invalidateSubscriptions = useInvalidateQueries(['webhook-subscriptions']);
  const { selected, selectMode, toggleSelect, clearSelection, toggleSelectMode, exitSelectMode } =
    useBulkSelection();
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter(clearSelection);

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
      exitSelectMode();
      await invalidateSubscriptions();
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
        onPress={toggleSelectMode}
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
      <AppSpacer />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('webhookSubscriptions.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => (
            <SubscriptionRow
              item={item}
              selectMode={selectMode}
              isSelected={selected.has(item.id)}
              onToggle={() => toggleSelect(item.id)}
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

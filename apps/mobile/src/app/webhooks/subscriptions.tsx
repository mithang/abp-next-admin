import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
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
  bulkDeleteWebhookSubscriptions,
  getWebhookSubscriptionsPaged,
} from '../../features/webhooks/webhooks-api';
import type { WebhookSubscriptionDto } from '../../features/webhooks/types';
import { toApiError } from '../../lib/errors';
import { toggleSelection } from '../../lib/selection';

const PAGE_SIZE = 20;

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
  const router = useRouter();
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
    queryKey: ['webhook-subscriptions', debounced, page],
    queryFn: () =>
      getWebhookSubscriptionsPaged({
        filter: debounced || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
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
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen
      title={t('webhookSubscriptions.title')}
      subtitle={`${t('webhookSubscriptions.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('webhookSubscriptions.searchPlaceholder')}
        autoCapitalize="none"
        testID="webhook-subscriptions-search"
      />
      <AppButton
        title={t('webhookSubscriptions.createTitle')}
        onPress={() => router.push('/webhooks/subscriptions/form')}
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
            Alert.alert(
              t('webhookSubscriptions.bulkDeleteConfirmTitle'),
              t('webhookSubscriptions.bulkDeleteConfirmMessage'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('common.delete'),
                  style: 'destructive',
                  onPress: () => bulkDelete.mutate(),
                },
              ],
            )
          }
        />
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
        <AppEmptyState message={t('webhookSubscriptions.empty')} />
      ) : (
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
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      {bulkDelete.isError ? <Text>{toApiError(bulkDelete.error).message}</Text> : null}
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

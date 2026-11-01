import { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getWebhookSubscriptionsPaged } from '../../features/webhooks/webhooks-api';
import type { WebhookSubscriptionDto } from '../../features/webhooks/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function SubscriptionRow({ item }: { item: WebhookSubscriptionDto }) {
  return (
    <Link href={`/webhooks/subscriptions/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.webhookUri}</Text>
            <Text>{item.isActive ? 'active' : 'inactive'}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
            <Text>{item.webhooks.join(', ')}</Text>
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/**
 * Danh sách đăng ký Webhook: đúng backend — GET
 * /api/webhooks/subscriptions (phân trang ABP, lọc filter/webhookUri).
 * API xóa hàng loạt sẵn ở webhooks-api, UI chọn nhiều để vòng sau
 * (cùng mẫu các nhóm trước).
 */
export default function WebhookSubscriptionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
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
    queryKey: ['webhook-subscriptions', debounced, page],
    queryFn: () =>
      getWebhookSubscriptionsPaged({
        filter: debounced || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('webhookSubscriptions.title')} subtitle={`${t('webhookSubscriptions.total')}: ${total}`}>
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
      <View style={{ height: 8 }} />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('webhookSubscriptions.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SubscriptionRow item={item} />}
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

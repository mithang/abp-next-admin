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
import { getWebhookGroupDefinitions } from '../../features/webhooks/webhooks-api';
import type { WebhookGroupDefinitionDto } from '../../features/webhooks/types';
import { toApiError } from '../../lib/errors';

function GroupRow({ item }: { item: WebhookGroupDefinitionDto }) {
  return (
    <Link href={`/webhooks/groups/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName}</Text>
            <Text>{item.name}</Text>
            {item.isStatic ? <Text>static</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/**
 * Danh sách nhóm Webhook: đúng backend — GET
 * /api/webhooks/definitions/groups (ListResult, lọc filter, không phân
 * trang ABP). Nhóm tĩnh chỉ đọc như bảng web (detail ẩn Sửa/Xóa).
 */
export default function WebhookGroupsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(filter), 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['webhook-groups', debounced],
    queryFn: () => getWebhookGroupDefinitions({ filter: debounced || undefined }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen
      title={t('webhookGroups.title')}
      subtitle={`${t('webhookGroups.total')}: ${items.length}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('webhookGroups.searchPlaceholder')}
        autoCapitalize="none"
        testID="webhook-groups-search"
      />
      <AppButton
        title={t('webhookGroups.createTitle')}
        onPress={() => router.push('/webhooks/groups/form')}
        testID="webhook-groups-create"
      />
      <View style={{ height: 8 }} />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('webhookGroups.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <GroupRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
    </AppScreen>
  );
}

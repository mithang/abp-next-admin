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
import { getWebhookDefinitions } from '../../features/webhooks/webhooks-api';
import type { WebhookDefinitionDto } from '../../features/webhooks/types';
import { toApiError } from '../../lib/errors';

function DefinitionRow({ item }: { item: WebhookDefinitionDto }) {
  return (
    <Link href={`/webhooks/definitions/${encodeURIComponent(item.name)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.displayName}</Text>
            <Text>
              {item.groupName} · {item.name}
            </Text>
            <Text>{item.isEnabled ? 'enabled' : 'disabled'}</Text>
            {item.isStatic ? <Text>static</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/**
 * Danh sách định nghĩa Webhook: đúng backend — GET
 * /api/webhooks/definitions (ListResult, lọc filter/groupName, không
 * phân trang ABP). Định nghĩa tĩnh chỉ đọc như bảng web.
 */
export default function WebhookDefinitionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [groupName, setGroupName] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [debouncedGroup, setDebouncedGroup] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
      setDebouncedGroup(groupName);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter, groupName]);

  const query = useQuery({
    queryKey: ['webhook-definitions', debouncedFilter, debouncedGroup],
    queryFn: () =>
      getWebhookDefinitions({
        filter: debouncedFilter || undefined,
        groupName: debouncedGroup || undefined,
      }),
  });

  const items = query.data?.items ?? [];

  return (
    <AppScreen title={t('webhookDefinitions.title')} subtitle={`${t('webhookDefinitions.total')}: ${items.length}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('webhookDefinitions.searchPlaceholder')}
        autoCapitalize="none"
        testID="webhook-definitions-search"
      />
      <AppInput
        value={groupName}
        onChangeText={setGroupName}
        placeholder={t('webhookDefinitions.groupNamePlaceholder')}
        autoCapitalize="none"
        testID="webhook-definitions-group"
      />
      <AppButton
        title={t('webhookDefinitions.createTitle')}
        onPress={() => router.push('/webhooks/definitions/form')}
        testID="webhook-definitions-create"
      />
      <View style={{ height: 8 }} />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('webhookDefinitions.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <DefinitionRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
    </AppScreen>
  );
}

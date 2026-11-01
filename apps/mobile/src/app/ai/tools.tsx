import { useEffect, useState } from 'react';
import { FlatList, Pressable } from 'react-native';
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
import { getAIToolsPaged } from '../../features/ai/ai-api';
import type { AIToolDefinitionRecordDto } from '../../features/ai/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function ToolRow({ item }: { item: AIToolDefinitionRecordDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/ai/tools/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.name}</Text>
            <Text>
              {item.provider} · {item.isEnabled ? t('aiTools.enabled') : t('aiTools.disabled')}
              {item.isGlobal ? ` · ${t('aiTools.global')}` : ''}
              {item.isStatic ? ` · ${t('aiTools.static')}` : ''}
              {item.isSystem ? ` · ${t('aiTools.system')}` : ''}
            </Text>
            {item.description ? <Text>{item.description}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/** Danh sách công cụ AI: GET /api/ai-management/tools, phân trang ABP (skipCount). */
export default function AIToolsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [provider, setProvider] = useState('');
  const [debounced, setDebounced] = useState({ filter: '', provider: '' });
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced({ filter, provider });
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter, provider]);

  const query = useQuery({
    queryKey: ['ai-tools', debounced, page],
    queryFn: () =>
      getAIToolsPaged({
        filter: debounced.filter || undefined,
        provider: debounced.provider || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('aiTools.title')} subtitle={`${t('aiTools.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('aiTools.searchPlaceholder')}
        autoCapitalize="none"
        testID="ai-tools-search"
      />
      <AppInput
        value={provider}
        onChangeText={setProvider}
        placeholder={t('aiTools.searchProviderPlaceholder')}
        autoCapitalize="none"
        testID="ai-tools-search-provider"
      />
      <AppButton title={t('aiTools.createTitle')} onPress={() => router.push('/ai/tools/form')} testID="ai-tools-create" />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('aiTools.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ToolRow item={item} />}
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

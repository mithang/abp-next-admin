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
import { getConversationsPaged } from '../../features/ai/ai-api';
import type { ConversationDto } from '../../features/ai/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function ConversationRow({ item }: { item: ConversationDto }) {
  return (
    <Link href={`/ai/conversations/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.name}</Text>
            <Text>
              {item.workspace} · {item.createdAt}
            </Text>
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/**
 * Danh sách phiên hội thoại: GET /api/ai-management/chats/conversations.
 * Backend chỉ trả phiên do chính user tạo (ConversationAppService lọc
 * CreatorId == CurrentUser.Id). Chạm vào phiên để mở màn chat SSE.
 */
export default function AIConversationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['ai-conversations', debouncedFilter, page],
    queryFn: () =>
      getConversationsPaged({
        filter: debouncedFilter || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen
      title={t('aiConversations.title')}
      subtitle={`${t('aiConversations.total')}: ${total}`}
    >
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('aiConversations.searchPlaceholder')}
        autoCapitalize="none"
        testID="ai-conversations-search"
      />
      <AppButton
        title={t('aiConversations.createTitle')}
        onPress={() => router.push('/ai/conversations/form')}
        testID="ai-conversations-create"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('aiConversations.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ConversationRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
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

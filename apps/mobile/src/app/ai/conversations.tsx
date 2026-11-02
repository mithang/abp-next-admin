import { useState } from 'react';
import { FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { Text } from '@/components/ui/text';
import { getConversationsPaged } from '../../features/ai/ai-api';
import type { ConversationDto } from '../../features/ai/types';
import { toApiError } from '../../lib/errors';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function ConversationRow({ item }: { item: ConversationDto }) {
  return (
    <Link href={`/ai/conversations/${encodeURIComponent(item.id)}`} asChild>
      <AppRowCard>
        <Text>{item.name}</Text>
        <Text>
          {item.workspace} · {item.createdAt}
        </Text>
      </AppRowCard>
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
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['ai-conversations', debouncedFilter, page],
    queryFn: () =>
      getConversationsPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('aiConversations.title')}
      subtitle={`${t('aiConversations.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('aiConversations.searchPlaceholder')}
        testID="ai-conversations-search"
      />
      <AppButton
        title={t('aiConversations.createTitle')}
        onPress={() => router.push('/ai/conversations/form')}
        testID="ai-conversations-create"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('aiConversations.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ConversationRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

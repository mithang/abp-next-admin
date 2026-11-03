import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { Text } from '@/components/ui/text';
import { getConversationsPaged } from '../../features/ai/ai-api';
import type { ConversationDto } from '../../features/ai/types';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { useListFilter } from '../../lib/use-list-filter';

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
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

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
      <AppNavButton
        title={t('aiConversations.createTitle')}
        href={'/ai/conversations/form'}
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
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

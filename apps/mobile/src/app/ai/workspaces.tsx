import { useState } from 'react';
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
import { getWorkspacesPaged } from '../../features/ai/ai-api';
import type { WorkspaceDefinitionRecordDto } from '../../features/ai/types';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function WorkspaceRow({ item }: { item: WorkspaceDefinitionRecordDto }) {
  const { t } = useTranslation();
  return (
    <Link href={`/ai/workspaces/${encodeURIComponent(item.id)}`} asChild>
      <AppRowCard>
        <Text>{item.displayName || item.name}</Text>
        <Text>
          {item.name} · {item.provider}/{item.modelName} ·{' '}
          {item.isEnabled ? t('aiWorkspaces.enabled') : t('aiWorkspaces.disabled')}
          {item.isStatic ? ` · ${t('aiWorkspaces.static')}` : ''}
          {item.isSystem ? ` · ${t('aiWorkspaces.system')}` : ''}
        </Text>
        {item.description ? <Text>{item.description}</Text> : null}
      </AppRowCard>
    </Link>
  );
}

/** Danh sách không gian làm việc: GET /api/ai-management/workspaces, phân trang ABP. */
export default function AIWorkspacesScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [provider, setProvider] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debounced = useDebouncedValue({ filter, provider }, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['ai-workspaces', debounced, page],
    queryFn: () =>
      getWorkspacesPaged({
        filter: debounced.filter || undefined,
        provider: debounced.provider || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen title={t('aiWorkspaces.title')} subtitle={`${t('aiWorkspaces.total')}: ${total}`}>
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('aiWorkspaces.searchPlaceholder')}
        testID="ai-workspaces-search"
      />
      <AppSearchInput
        value={provider}
        onChangeText={setProvider}
        placeholder={t('aiWorkspaces.searchProviderPlaceholder')}
        testID="ai-workspaces-search-provider"
      />
      <AppNavButton
        title={t('aiWorkspaces.createTitle')}
        href={'/ai/workspaces/form'}
        testID="ai-workspaces-create"
      />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('aiWorkspaces.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WorkspaceRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

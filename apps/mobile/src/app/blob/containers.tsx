import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { Text } from '@/components/ui/text';
import { getBlobContainersPaged } from '../../features/blob/blob-api';
import type { BlobContainerDto } from '../../features/blob/types';
import { toApiError } from '../../lib/errors';
import { formatDateTime } from '../../lib/dates';
import { useDebouncedValue } from '../../lib/use-debounced-value';
import { usePagination } from '../../lib/use-pagination';

function ContainerRow({ item }: { item: BlobContainerDto }) {
  return (
    <Link href={`/blob/containers/${encodeURIComponent(item.id)}`} asChild>
      <AppRowCard>
        <Text>{item.name}</Text>
        {item.creationTime ? <Text>{formatDateTime(item.creationTime)}</Text> : null}
      </AppRowCard>
    </Link>
  );
}

/**
 * Danh sách container blob: đúng backend — GET
 * /api/blob-management/containers (phân trang ABP, lọc filter).
 * Backend không có Update cho container nên danh sách không có nút
 * Sửa; tạo mới qua form, xóa ở màn detail.
 */
export default function BlobContainersScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const debounced = useDebouncedValue(filter, 400, () => {
    setPage(0);
  });

  const query = useQuery({
    queryKey: ['blob-containers', debounced, page],
    queryFn: () =>
      getBlobContainersPaged({
        filter: debounced || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('blobContainers.title')}
      subtitle={`${t('blobContainers.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('blobContainers.searchPlaceholder')}
        testID="blob-containers-search"
      />
      <AppNavButton
        title={t('blobContainers.createTitle')}
        href={'/blob/containers/form'}
        testID="blob-containers-create"
      />
      <View style={{ height: 8 }} />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('blobContainers.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContainerRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

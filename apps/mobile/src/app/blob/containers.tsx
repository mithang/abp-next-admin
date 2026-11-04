import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { AppSpacer } from '../../components/ui/AppSpacer';
import { AppOptionalText } from '../../components/ui/AppOptionalText';
import { Text } from '@/components/ui/text';
import { getBlobContainersPaged } from '../../features/blob/blob-api';
import type { BlobContainerDto } from '../../features/blob/types';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { formatDateTime } from '../../lib/dates';
import { useListFilter } from '../../lib/use-list-filter';
import { navPath } from '../../lib/nav-href';

function ContainerRow({ item }: { item: BlobContainerDto }) {
  return (
    <Link href={navPath('/blob/containers', item.id)} asChild>
      <AppRowCard>
        <Text>{item.name}</Text>
        <AppOptionalText value={formatDateTime(item.creationTime)} />
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
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter();

  const query = useQuery({
    queryKey: ['blob-containers', debouncedFilter, page],
    queryFn: () =>
      getBlobContainersPaged({
        filter: debouncedFilter || undefined,
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
      <AppSpacer />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('blobContainers.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <ContainerRow item={item} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

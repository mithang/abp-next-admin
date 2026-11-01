import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getBlobContainersPaged, getBlobsPaged } from '../../features/blob/blob-api';
import { BLOB_TYPE_FOLDER, type BlobContainerDto, type BlobDto } from '../../features/blob/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function BlobRow({ item, containerId }: { item: BlobDto; containerId: string }) {
  const { t } = useTranslation();
  const isFolder = item.type === BLOB_TYPE_FOLDER;
  const href = isFolder
    ? `/blob/blobs?containerId=${encodeURIComponent(containerId)}&parentId=${encodeURIComponent(item.id)}`
    : `/blob/blobs/${encodeURIComponent(item.id)}`;
  return (
    <Link href={href} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>
              {isFolder ? '📁' : '📄'} {item.name}
            </Text>
            <Text>
              {isFolder ? t('blobBlobs.folder') : t('blobBlobs.file')}
              {item.contentType ? ` · ${item.contentType}` : ''}
              {!isFolder ? ` · ${item.size} bytes · ${t('blobBlobs.downloadCount')}: ${item.downloadCount}` : ''}
            </Text>
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/**
 * Danh sách tệp/thư mục trong một container: đúng backend — GET
 * /api/blob-management/blobs với containerId bắt buộc + parentId
 * (để trống = thư mục gốc). Thư mục bấm vào sẽ mở cùng màn với
 * parentId mới (quay lại bằng nút Back của hệ thống vì BlobDto không
 * có parentId để dựng breadcrumb); tệp bấm vào mở màn detail.
 * Khi chưa có containerId (mở từ hub), màn hiển thị danh sách
 * container để chọn — không tự đoán container mặc định.
 * Upload tệp chưa có: cần file picker native + upload chunked
 * (xem P2 báo cáo vòng 16), nên màn chỉ ghi rõ điều đó, không tạo
 * nút upload giả.
 */
export default function BlobsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { containerId, parentId } = useLocalSearchParams<{ containerId?: string; parentId?: string }>();
  const [page, setPage] = useState(0);

  const containersQuery = useQuery({
    queryKey: ['blob-containers-picker'],
    queryFn: () => getBlobContainersPaged({ maxResultCount: 50 }),
    enabled: !containerId,
  });

  const query = useQuery({
    queryKey: ['blob-blobs', containerId, parentId, page],
    queryFn: () =>
      getBlobsPaged({
        containerId: containerId as string,
        parentId: parentId || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
    enabled: Boolean(containerId),
  });

  if (!containerId) {
    const containers: BlobContainerDto[] = containersQuery.data?.items ?? [];
    return (
      <AppScreen title={t('blobBlobs.title')} subtitle={t('blobBlobs.chooseContainer')}>
        {containersQuery.isPending ? (
          <AppLoading />
        ) : containersQuery.isError ? (
          <AppErrorState
            message={toApiError(containersQuery.error).message}
            onRetry={() => void containersQuery.refetch()}
          />
        ) : containers.length === 0 ? (
          <AppEmptyState message={t('blobContainers.empty')} />
        ) : (
          <FlatList
            data={containers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link href={`/blob/blobs?containerId=${encodeURIComponent(item.id)}`} asChild>
                <Pressable>
                  <Card className="p-4">
                    <Text>{item.name}</Text>
                  </Card>
                </Pressable>
              </Link>
            )}
          />
        )}
      </AppScreen>
    );
  }

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen
      title={t('blobBlobs.title')}
      subtitle={parentId ? `${t('blobBlobs.folder')}: ${parentId}` : t('blobBlobs.rootFolder')}
    >
      <AppButton
        title={t('blobBlobs.createFolderTitle')}
        onPress={() =>
          router.push(
            `/blob/blobs/form?containerId=${encodeURIComponent(containerId)}${parentId ? `&parentId=${encodeURIComponent(parentId)}` : ''}`,
          )
        }
        testID="blob-blobs-create-folder"
      />
      <Text>{t('blobBlobs.uploadNotAvailable')}</Text>
      <View style={{ height: 8 }} />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('blobBlobs.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BlobRow item={item} containerId={containerId} />}
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

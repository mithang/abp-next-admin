import { FlatList, Pressable, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppButton } from '../../components/ui/AppButton';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  getBlobContainersPaged,
  getBlobsPaged,
  uploadBlobFile,
} from '../../features/blob/blob-api';
import { BLOB_TYPE_FOLDER, type BlobContainerDto, type BlobDto } from '../../features/blob/types';
import { toApiError } from '../../lib/errors';
import { usePagination } from '../../lib/use-pagination';

function BlobRow({ item, containerId }: { item: BlobDto; containerId: string }) {
  const { t } = useTranslation();
  const isFolder = item.type === BLOB_TYPE_FOLDER;
  const href = isFolder
    ? `/blob/blobs?containerId=${encodeURIComponent(containerId)}&parentId=${encodeURIComponent(item.id)}`
    : `/blob/blobs/${encodeURIComponent(item.id)}`;
  return (
    <Link href={href} asChild>
      <AppRowCard>
        <Text>
          {isFolder ? '📁' : '📄'} {item.name}
        </Text>
        <Text>
          {isFolder ? t('blobBlobs.folder') : t('blobBlobs.file')}
          {item.contentType ? ` · ${item.contentType}` : ''}
          {!isFolder
            ? ` · ${item.size} bytes · ${t('blobBlobs.downloadCount')}: ${item.downloadCount}`
            : ''}
        </Text>
      </AppRowCard>
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
 * Upload tệp (vòng 31): DocumentPicker (Expo Go đã gồm sẵn module
 * này theo docs SDK 58) + POST single-file /blobs/file; chunked
 * /file/chunk cố tình không dùng vì backend gộp chunk sai thứ tự
 * từ 10 chunk trở lên (xem blob-upload.ts). Tiến trình upload là
 * trạng thái đang tải (fetch không báo % tiến trình), không bịa %.
 */
export default function BlobsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { containerId, parentId } = useLocalSearchParams<{
    containerId?: string;
    parentId?: string;
  }>();
  const { page, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadBlobFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['blob-blobs'] });
    },
  });

  async function onPickAndUpload() {
    if (!containerId || uploadMutation.isPending) return;
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    uploadMutation.mutate({
      containerId,
      parentId: parentId || undefined,
      file: { uri: asset.uri, name: asset.name, mimeType: asset.mimeType, size: asset.size },
    });
  }

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
        skipCount,
        maxResultCount,
      }),
    enabled: Boolean(containerId),
  });

  if (!containerId) {
    const containers: BlobContainerDto[] = containersQuery.data?.items ?? [];
    return (
      <AppScreen title={t('blobBlobs.title')} subtitle={t('blobBlobs.chooseContainer')}>
        <AppList
          items={containers}
          isPending={containersQuery.isPending}
          isError={containersQuery.isError}
          errorMessage={toApiError(containersQuery.error).message}
          onRetry={() => void containersQuery.refetch()}
          emptyMessage={t('blobContainers.empty')}
        >
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
        </AppList>
      </AppScreen>
    );
  }

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

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
      <AppButton
        title={uploadMutation.isPending ? t('blobBlobs.uploading') : t('blobBlobs.upload')}
        onPress={() => void onPickAndUpload()}
        loading={uploadMutation.isPending}
        testID="blob-blobs-upload"
      />
      {uploadMutation.isSuccess ? <Text>{t('blobBlobs.uploaded')}</Text> : null}
      {uploadMutation.isError ? <Text>{toApiError(uploadMutation.error).message}</Text> : null}
      <View style={{ height: 8 }} />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('blobBlobs.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BlobRow item={item} containerId={containerId} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      </AppList>
    </AppScreen>
  );
}

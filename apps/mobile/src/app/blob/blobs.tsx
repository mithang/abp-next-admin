import { FlatList, Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { useRouteParams } from '../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppRowCard } from '../../components/ui/AppRowCard';
import { AppButton } from '../../components/ui/AppButton';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  getBlobContainersPaged,
  getBlobsPaged,
  uploadBlobFile,
} from '../../features/blob/blob-api';
import { BLOB_TYPE_FOLDER, type BlobContainerDto, type BlobDto } from '../../features/blob/types';
import { mutationErrorElement } from '../../lib/mutation-error';
import { listRefreshProps } from '../../lib/list-refresh';
import { listQueryProps } from '../../lib/list-query-props';
import { keyById } from '../../lib/list-keys';
import { usePagination } from '../../lib/use-pagination';
import { useInvalidateQueries } from '../../lib/mutation-success';
import { navHref, navPath } from '../../lib/nav-href';

function BlobRow({ item, containerId }: { item: BlobDto; containerId: string }) {
  const { t } = useTranslation();
  const isFolder = item.type === BLOB_TYPE_FOLDER;
  const href = isFolder
    ? navHref('/blob/blobs', { containerId, parentId: item.id })
    : navPath('/blob/blobs', item.id);
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
  const { containerId, parentId } = useRouteParams<{
    containerId?: string;
    parentId?: string;
  }>();
  const { page, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
  const invalidate = useInvalidateQueries(['blob-blobs']);

  const uploadMutation = useMutation({
    mutationFn: uploadBlobFile,
    onSuccess: invalidate,
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
          {...listQueryProps(containersQuery)}
          emptyMessage={t('blobContainers.empty')}
        >
          <FlatList
            data={containers}
            keyExtractor={keyById}
            renderItem={({ item }) => (
              <Link href={navHref('/blob/blobs', { containerId: item.id })} asChild>
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
      <AppNavButton
        title={t('blobBlobs.createFolderTitle')}
        href={navHref('/blob/blobs/form', { containerId, parentId: parentId || undefined })}
        testID="blob-blobs-create-folder"
      />
      <AppButton
        title={uploadMutation.isPending ? t('blobBlobs.uploading') : t('blobBlobs.upload')}
        onPress={() => void onPickAndUpload()}
        loading={uploadMutation.isPending}
        testID="blob-blobs-upload"
      />
      {uploadMutation.isSuccess ? <Text>{t('blobBlobs.uploaded')}</Text> : null}
      {mutationErrorElement(uploadMutation)}
      <View style={{ height: 8 }} />
      <AppList
        items={items}
        {...listQueryProps(query)}
        emptyMessage={t('blobBlobs.empty')}
        hasMore={hasMore(total)}
        onLoadMore={loadMore}
      >
        <FlatList
          data={items}
          keyExtractor={keyById}
          renderItem={({ item }) => <BlobRow item={item} containerId={containerId} />}
          {...listRefreshProps(query)}
        />
      </AppList>
    </AppScreen>
  );
}

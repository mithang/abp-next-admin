import { useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteBlob,
  generateBlobDownloadUrl,
  generateBlobPreviewUrl,
  getBlob,
} from '../../../features/blob/blob-api';
import { BLOB_TYPE_FOLDER } from '../../../features/blob/types';
import { config } from '../../../lib/config';
import { toApiError } from '../../../lib/errors';

/**
 * Chi tiết blob: đúng BlobDto backend (name/fullName/type/contentType/
 * size/expirationTime/downloadCount — không có path). Tệp có nút Tải
 * xuống / Xem trước: gọi generate-url rồi mở URL bằng trình duyệt hệ
 * thống (mẫu openapi); URL tương đối được ghép với apiUrl từ cấu hình.
 * Thư mục không có 2 nút này (đúng bảng web: preview/download chỉ
 * dành cho tệp).
 */
export default function BlobDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openError, setOpenError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['blob-blobs', id],
    queryFn: () => getBlob(id),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBlob(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['blob-blobs'] });
      router.back();
    },
  });

  const openGeneratedUrl = async (kind: 'download' | 'preview') => {
    setOpenError(null);
    try {
      const raw =
        kind === 'download' ? await generateBlobDownloadUrl(id) : await generateBlobPreviewUrl(id);
      const url =
        typeof raw === 'string' && /^https?:\/\//.test(raw)
          ? raw
          : `${config.apiUrl.replace(/\/$/, '')}${raw}`;
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      setOpenError(e instanceof Error ? e.message : t('blobBlobs.openFailed'));
    }
  };

  if (query.isPending) return <AppLoading />;
  if (query.isError) {
    return (
      <AppErrorState
        message={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
      />
    );
  }
  const item = query.data;
  if (!item) return <AppErrorState message={t('common.empty')} />;

  const isFolder = item.type === BLOB_TYPE_FOLDER;

  return (
    <AppScreen title={item.name}>
      <VStack space="sm">
        <Text>
          {t('blobBlobs.fullName')}: {item.fullName}
        </Text>
        <Text>
          {isFolder ? t('blobBlobs.folder') : t('blobBlobs.file')}
          {item.contentType ? ` · ${item.contentType}` : ''}
        </Text>
        {!isFolder ? (
          <>
            <Text>
              {t('blobBlobs.size')}: {item.size} bytes
            </Text>
            <Text>
              {t('blobBlobs.downloadCount')}: {item.downloadCount}
            </Text>
          </>
        ) : null}
        {item.expirationTime ? (
          <Text>
            {t('blobBlobs.expirationTime')}: {new Date(item.expirationTime).toLocaleString()}
          </Text>
        ) : null}
        {item.creationTime ? (
          <Text>
            {t('blobContainers.creationTime')}: {new Date(item.creationTime).toLocaleString()}
          </Text>
        ) : null}
        {!isFolder ? (
          <>
            <AppButton
              title={t('blobBlobs.download')}
              onPress={() => void openGeneratedUrl('download')}
            />
            <AppButton
              title={t('blobBlobs.preview')}
              variant="outline"
              onPress={() => void openGeneratedUrl('preview')}
            />
          </>
        ) : null}
        {openError ? <Text>{openError}</Text> : null}
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(t('blobBlobs.deleteConfirmTitle'), t('blobBlobs.deleteConfirmMessage'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('common.delete'),
                style: 'destructive',
                onPress: () => deleteMutation.mutate(),
              },
            ])
          }
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

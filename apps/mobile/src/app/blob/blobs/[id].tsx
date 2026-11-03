import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { stateErrorElement } from '../../../lib/state-error';
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
import { formatDateTime } from '../../../lib/dates';

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
  const { id } = useRouteParams<{ id: string }>();
  const [openError, setOpenError] = useState<string | null>(null);

  const query = useDetailQuery('blob-blobs', id, getBlob);

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

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  const isFolder = item.type === BLOB_TYPE_FOLDER;

  return (
    <AppScreen scrollable title={item.name}>
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
            {t('blobBlobs.expirationTime')}: {formatDateTime(item.expirationTime)}
          </Text>
        ) : null}
        {item.creationTime ? (
          <Text>
            {t('blobContainers.creationTime')}: {formatDateTime(item.creationTime)}
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
        {stateErrorElement(openError)}
        <AppDeleteButton
          confirmTitle={t('blobBlobs.deleteConfirmTitle')}
          confirmMessage={t('blobBlobs.deleteConfirmMessage')}
          onDelete={() => deleteBlob(id)}
          invalidateKey={['blob-blobs']}
        />
      </VStack>
    </AppScreen>
  );
}

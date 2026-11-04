import { useRouteParams } from '../../../lib/route-params';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { deleteBlobContainer, getBlobContainer } from '../../../features/blob/blob-api';
import { formatDateTime } from '../../../lib/dates';
import { navHref } from '../../../lib/nav-href';

/**
 * Chi tiết container blob: name + concurrencyStamp + thời gian tạo.
 * Không có nút Sửa vì backend không có Update cho container; nút Xem
 * tệp mở danh sách blob của container này.
 */
export default function BlobContainerDetailScreen() {
  const { t } = useTranslation();
  const { id } = useRouteParams<{ id: string }>();

  const query = useDetailQuery('blob-containers', id, getBlobContainer);

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.name}>
      <VStack space="sm">
        <AppDetailField label={t('blobContainers.name')} value={item.name} />
        <AppDetailField
          label={t('blobContainers.concurrencyStamp')}
          value={item.concurrencyStamp}
        />
        {item.creationTime ? (
          <AppDetailField
            label={t('blobContainers.creationTime')}
            value={formatDateTime(item.creationTime)}
          />
        ) : null}
        <AppNavButton
          title={t('blobContainers.viewBlobs')}
          href={navHref('/blob/blobs', { containerId: item.id })}
        />
        <AppDeleteButton
          confirmTitle={t('blobContainers.deleteConfirmTitle')}
          confirmMessage={t('blobContainers.deleteConfirmMessage')}
          onDelete={() => deleteBlobContainer(id)}
          invalidateKey={['blob-containers']}
        />
      </VStack>
    </AppScreen>
  );
}

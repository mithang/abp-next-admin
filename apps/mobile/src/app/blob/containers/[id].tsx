import { useRouteParams } from '../../../lib/route-params';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
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

  const query = useQuery({
    queryKey: ['blob-containers', id],
    queryFn: () => getBlobContainer(id),
    enabled: Boolean(id),
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.name}>
      <VStack space="sm">
        <Text>
          {t('blobContainers.name')}: {item.name}
        </Text>
        <Text>
          {t('blobContainers.concurrencyStamp')}: {item.concurrencyStamp}
        </Text>
        {item.creationTime ? (
          <Text>
            {t('blobContainers.creationTime')}: {formatDateTime(item.creationTime)}
          </Text>
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

import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { deleteBlobContainer, getBlobContainer } from '../../../features/blob/blob-api';
import { toApiError } from '../../../lib/errors';

/**
 * Chi tiết container blob: name + concurrencyStamp + thời gian tạo.
 * Không có nút Sửa vì backend không có Update cho container; nút Xem
 * tệp mở danh sách blob của container này.
 */
export default function BlobContainerDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['blob-containers', id],
    queryFn: () => getBlobContainer(id),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBlobContainer(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['blob-containers'] });
      router.back();
    },
  });

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

  return (
    <AppScreen title={item.name}>
      <VStack space="sm">
        <Text>
          {t('blobContainers.name')}: {item.name}
        </Text>
        <Text>
          {t('blobContainers.concurrencyStamp')}: {item.concurrencyStamp}
        </Text>
        {item.creationTime ? (
          <Text>
            {t('blobContainers.creationTime')}: {new Date(item.creationTime).toLocaleString()}
          </Text>
        ) : null}
        <AppButton
          title={t('blobContainers.viewBlobs')}
          onPress={() => router.push(`/blob/blobs?containerId=${encodeURIComponent(item.id)}`)}
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            Alert.alert(
              t('blobContainers.deleteConfirmTitle'),
              t('blobContainers.deleteConfirmMessage'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('common.delete'),
                  style: 'destructive',
                  onPress: () => deleteMutation.mutate(),
                },
              ],
            )
          }
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

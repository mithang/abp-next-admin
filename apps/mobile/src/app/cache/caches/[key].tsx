import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppEmptyState, AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  getCacheValue,
  refreshCacheKey,
  removeCacheKey,
} from '../../../features/caching/caching-api';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';

/**
 * Chi tiết giá trị cache: GET /api/caching-management/cache/value?key=...
 * Hiển thị type/size/expiration + toàn bộ values dạng JSON (web cũng hiển thị
 * bảng giá trị này trong CacheKeyTable). Nút Làm mới chỉ đổi hạn (PUT
 * .../refresh với key), nút Xóa và nút Đặt giá trị mở form prefill key.
 */
export default function CacheValueDetailScreen() {
  const { t } = useTranslation();
  const { key } = useLocalSearchParams<{ key: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['cache-values', key],
    queryFn: () => getCacheValue({ key: key as string }),
    enabled: Boolean(key),
  });
  const refreshMutation = useMutation({
    mutationFn: () => refreshCacheKey({ key: key as string }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cache-values', key] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => removeCacheKey({ key: key as string }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cache-keys'] });
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
  if (!item) return <AppEmptyState message={t('common.empty')} />;

  return (
    <AppScreen scrollable title={key as string} subtitle={t('caches.detailSubtitle')}>
      <VStack space="sm">
        <Text>
          {t('caches.type')}: {item.type}
        </Text>
        <Text>
          {t('caches.size')}: {item.size}
        </Text>
        {item.expiration ? (
          <Text>
            {t('caches.expiration')}: {formatDateTime(item.expiration)}
          </Text>
        ) : null}
        <Text>{JSON.stringify(item.values, null, 2)}</Text>
        <AppButton
          title={t('common.refresh')}
          variant="outline"
          loading={refreshMutation.isPending}
          onPress={() => refreshMutation.mutate()}
        />
        <AppButton
          title={t('caches.setValue')}
          variant="outline"
          onPress={() => router.push(`/cache/caches/form?key=${encodeURIComponent(key as string)}`)}
        />
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('caches.deleteConfirmTitle'),
              message: t('caches.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
        />
        {refreshMutation.isError ? <Text>{toApiError(refreshMutation.error).message}</Text> : null}
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppEmptyState } from '../../../components/ui/AppStates';
import { queryStateElement } from '../../../lib/query-state';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  getCacheValue,
  refreshCacheKey,
  removeCacheKey,
} from '../../../features/caching/caching-api';
import { toApiError } from '../../../lib/errors';
import { formatDateTime } from '../../../lib/dates';
import { useInvalidateQueries } from '../../../lib/mutation-success';

/**
 * Chi tiết giá trị cache: GET /api/caching-management/cache/value?key=...
 * Hiển thị type/size/expiration + toàn bộ values dạng JSON (web cũng hiển thị
 * bảng giá trị này trong CacheKeyTable). Nút Làm mới chỉ đổi hạn (PUT
 * .../refresh với key), nút Xóa và nút Đặt giá trị mở form prefill key.
 */
export default function CacheValueDetailScreen() {
  const { t } = useTranslation();
  const { key } = useLocalSearchParams<{ key: string }>();
  const invalidate = useInvalidateQueries(['cache-values', key]);
  const query = useQuery({
    queryKey: ['cache-values', key],
    queryFn: () => getCacheValue({ key: key as string }),
    enabled: Boolean(key),
  });
  const refreshMutation = useMutation({
    mutationFn: () => refreshCacheKey({ key: key as string }),
    onSuccess: invalidate,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
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
        <AppNavButton
          title={t('caches.setValue')}
          href={`/cache/caches/form?key=${encodeURIComponent(key as string)}`}
          variant="outline"
        />
        <AppDeleteButton
          confirmTitle={t('caches.deleteConfirmTitle')}
          confirmMessage={t('caches.deleteConfirmMessage')}
          onDelete={() => removeCacheKey({ key: key as string })}
          invalidateKey={['cache-keys']}
        />
        {refreshMutation.isError ? <Text>{toApiError(refreshMutation.error).message}</Text> : null}
      </VStack>
    </AppScreen>
  );
}

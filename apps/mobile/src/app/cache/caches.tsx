import { useEffect, useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  getCacheKeys,
  refreshCacheKey,
  removeCacheKey,
  removeCacheKeys,
} from '../../features/caching/caching-api';
import { toApiError } from '../../lib/errors';
import { showConfirmDialog } from '../../lib/confirm';

/**
 * Quản lý cache: danh sách khóa từ GET /api/caching-management/cache/keys.
 * Backend phân trang bằng marker (nextMarker), không phải skipCount — màn này
 * tích lũy khóa qua các lần "Tải thêm" bằng marker, đúng contract backend.
 * Chạm vào khóa để xem giá trị; chế độ chọn cho phép xóa hàng loạt
 * (DELETE .../bulk/remove { keys }) như bảng web.
 */
export default function CacheKeysScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [prefix, setPrefix] = useState('');
  const [debounced, setDebounced] = useState({ filter: '', prefix: '' });
  const [extraKeys, setExtraKeys] = useState<string[]>([]);
  const [extraMarker, setExtraMarker] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced({ filter, prefix });
      setExtraKeys([]);
      setExtraMarker(null);
      setSelected(new Set());
    }, 400);
    return () => clearTimeout(timer);
  }, [filter, prefix]);

  const query = useQuery({
    queryKey: ['cache-keys', debounced],
    queryFn: () =>
      getCacheKeys({
        filter: debounced.filter || undefined,
        prefix: debounced.prefix || undefined,
      }),
  });

  // Marker trang tiếp theo suy ra trực tiếp, không qua effect: khi chưa tải
  // thêm thì lấy nextMarker của trang đầu; sau khi tải thêm thì lấy marker
  // của trang vừa tải (chỉ cập nhật trong callback onSuccess, không setState
  // đồng bộ trong effect — theo luật lint react-hooks/set-state-in-effect).
  const nextMarker = extraKeys.length > 0 ? extraMarker : (query.data?.nextMarker ?? null);

  const keys = [...(query.data?.keys ?? []), ...extraKeys];

  const loadMoreMutation = useMutation({
    mutationFn: (marker: string) =>
      getCacheKeys({
        filter: debounced.filter || undefined,
        prefix: debounced.prefix || undefined,
        marker,
      }),
    onSuccess: (data) => {
      setExtraKeys((prev) => [...prev, ...data.keys]);
      setExtraMarker(data.nextMarker ?? null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (key: string) => removeCacheKey({ key }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cache-keys'] });
      setExtraKeys([]);
      setExtraMarker(null);
    },
  });

  const refreshMutation = useMutation({
    mutationFn: (key: string) => refreshCacheKey({ key }),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: () => removeCacheKeys({ keys: [...selected] }),
    onSuccess: async () => {
      setSelected(new Set());
      setSelectMode(false);
      await queryClient.invalidateQueries({ queryKey: ['cache-keys'] });
      setExtraKeys([]);
      setExtraMarker(null);
    },
  });

  const toggleSelect = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <AppScreen title={t('caches.title')} subtitle={`${t('caches.total')}: ${keys.length}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('caches.searchFilterPlaceholder')}
        autoCapitalize="none"
        testID="cache-keys-search-filter"
      />
      <AppInput
        value={prefix}
        onChangeText={setPrefix}
        placeholder={t('caches.searchPrefixPlaceholder')}
        autoCapitalize="none"
        testID="cache-keys-search-prefix"
      />
      <AppButton
        title={selectMode ? t('caches.exitSelectMode') : t('caches.selectMode')}
        onPress={() => {
          setSelectMode((v) => !v);
          setSelected(new Set());
        }}
        variant="outline"
      />
      {selected.size > 0 ? (
        <AppButton
          title={`${t('caches.bulkDelete')} (${selected.size})`}
          action="negative"
          variant="outline"
          loading={bulkDeleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('caches.bulkDeleteConfirmTitle'),
              message: t('caches.bulkDeleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => bulkDeleteMutation.mutate(),
            })
          }
        />
      ) : null}
      <AppButton
        title={t('caches.setValue')}
        onPress={() => router.push('/cache/caches/form')}
        variant="outline"
      />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState
          message={toApiError(query.error).message}
          onRetry={() => void query.refetch()}
        />
      ) : keys.length === 0 ? (
        <AppEmptyState message={t('caches.empty')} />
      ) : (
        <FlatList
          data={keys}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                if (selectMode) toggleSelect(item);
                else router.push(`/cache/caches/${encodeURIComponent(item)}`);
              }}
            >
              <Card className="p-4">
                <VStack space="xs">
                  <Text>
                    {selectMode && selected.has(item) ? '✓ ' : ''}
                    {item}
                  </Text>
                  <AppButton
                    title={t('common.refresh')}
                    variant="outline"
                    loading={refreshMutation.isPending}
                    onPress={() => refreshMutation.mutate(item)}
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
                        onConfirm: () => deleteMutation.mutate(item),
                      })
                    }
                  />
                </VStack>
              </Card>
            </Pressable>
          )}
          refreshing={query.isFetching}
          onRefresh={() => {
            // Pull-to-refresh chỉ tải lại trang đầu nên phải xóa các khóa đã
            // tải thêm, nếu không danh sách sẽ trùng khóa trang đầu.
            setExtraKeys([]);
            setExtraMarker(null);
            void query.refetch();
          }}
        />
      )}
      {nextMarker ? (
        <AppButton
          title={t('common.loadMore')}
          onPress={() => loadMoreMutation.mutate(nextMarker)}
          loading={loadMoreMutation.isPending}
          variant="outline"
        />
      ) : null}
      {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
      {bulkDeleteMutation.isError ? (
        <Text>{toApiError(bulkDeleteMutation.error).message}</Text>
      ) : null}
    </AppScreen>
  );
}

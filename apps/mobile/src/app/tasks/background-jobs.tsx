import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppList } from '../../components/ui/AppList';
import { AppSearchInput } from '../../components/ui/AppSearchInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppNavButton } from '../../components/ui/AppNavButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import {
  bulkDeleteBackgroundJobs,
  bulkPauseBackgroundJobs,
  bulkResumeBackgroundJobs,
  bulkStartBackgroundJobs,
  bulkStopBackgroundJobs,
  bulkTriggerBackgroundJobs,
  getBackgroundJobsPaged,
} from '../../features/tasks/tasks-api';
import {
  JOB_PRIORITY_LABELS,
  JOB_STATUS_LABELS,
  JOB_TYPE_LABELS,
  type BackgroundJobInfoDto,
} from '../../features/tasks/types';
import { toApiError } from '../../lib/errors';
import { listRefreshProps } from '../../lib/list-refresh';
import { toggleSelection } from '../../lib/selection';
import { showConfirmDialog } from '../../lib/confirm';
import { formatDateTime } from '../../lib/dates';
import { useListFilter } from '../../lib/use-list-filter';

type BulkAction = 'pause' | 'resume' | 'trigger' | 'stop' | 'start' | 'delete';

function JobRow({
  item,
  selectMode,
  isSelected,
  onToggle,
}: {
  item: BackgroundJobInfoDto;
  selectMode: boolean;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const body = (
    <Card className="p-4">
      <VStack space="xs">
        <Text>
          {selectMode && isSelected ? '✓ ' : ''}
          {item.name}
        </Text>
        <Text>
          {item.group} · {item.type}
        </Text>
        <Text>
          {JOB_STATUS_LABELS[item.status] ?? item.status} ·{' '}
          {JOB_TYPE_LABELS[item.jobType] ?? item.jobType} ·{' '}
          {JOB_PRIORITY_LABELS[item.priority] ?? item.priority}
          {item.isEnabled ? '' : ' · disabled'}
        </Text>
        {item.nextRunTime ? <Text>{formatDateTime(item.nextRunTime)}</Text> : null}
      </VStack>
    </Card>
  );
  if (selectMode) {
    return <Pressable onPress={onToggle}>{body}</Pressable>;
  }
  return (
    <Link href={`/tasks/background-jobs/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>{body}</Pressable>
    </Link>
  );
}

/**
 * Danh sách tác vụ nền: đúng backend — GET
 * /api/task-management/background-jobs (phân trang ABP, lọc filter).
 * Điều khiển đơn ở màn detail; chế độ chọn nhiều ở đây gọi đúng các API
 * bulk đã có ở tasks-api (PUT bulk-pause/resume/trigger/stop/start,
 * DELETE bulk-delete, body { jobIds }), theo mẫu màn Cache. Lọc đổi thì
 * xóa lựa chọn (tránh bulk nhầm id ngoài danh sách đang hiển thị).
 */
export default function BackgroundJobsScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { filter, setFilter, debouncedFilter, page, skipCount, maxResultCount, hasMore, loadMore } =
    useListFilter(() => {
      setSelected(new Set());
    });
  const [selectMode, setSelectMode] = useState(false);

  const query = useQuery({
    queryKey: ['tasks-background-jobs', debouncedFilter, page],
    queryFn: () =>
      getBackgroundJobsPaged({
        filter: debouncedFilter || undefined,
        skipCount,
        maxResultCount,
      }),
  });

  const bulkMutation = useMutation({
    mutationFn: (action: BulkAction) => {
      const input = { jobIds: [...selected] };
      switch (action) {
        case 'pause':
          return bulkPauseBackgroundJobs(input);
        case 'resume':
          return bulkResumeBackgroundJobs(input);
        case 'trigger':
          return bulkTriggerBackgroundJobs(input);
        case 'stop':
          return bulkStopBackgroundJobs(input);
        case 'start':
          return bulkStartBackgroundJobs(input);
        case 'delete':
          return bulkDeleteBackgroundJobs(input);
      }
    },
    onSuccess: async () => {
      setSelected(new Set());
      setSelectMode(false);
      await queryClient.invalidateQueries({ queryKey: ['tasks-background-jobs'] });
    },
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;

  return (
    <AppScreen
      title={t('backgroundJobs.title')}
      subtitle={`${t('backgroundJobs.total')}: ${total}`}
    >
      <AppSearchInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('backgroundJobs.searchPlaceholder')}
        testID="background-jobs-search"
      />
      <AppNavButton
        title={t('backgroundJobs.createTitle')}
        href={'/tasks/background-jobs/form'}
        testID="background-jobs-create"
      />
      <AppButton
        title={selectMode ? t('backgroundJobs.exitSelectMode') : t('backgroundJobs.selectMode')}
        onPress={() => {
          setSelectMode((v) => !v);
          setSelected(new Set());
        }}
        variant="outline"
      />
      {selected.size > 0 ? (
        <>
          {(['pause', 'resume', 'trigger', 'stop', 'start'] as const).map((action) => (
            <AppButton
              key={action}
              title={`${t(`backgroundJobs.${action}`)} (${selected.size})`}
              variant="outline"
              loading={bulkMutation.isPending}
              onPress={() => bulkMutation.mutate(action)}
            />
          ))}
          <AppButton
            title={`${t('backgroundJobs.bulkDelete')} (${selected.size})`}
            action="negative"
            variant="outline"
            loading={bulkMutation.isPending}
            onPress={() =>
              showConfirmDialog({
                title: t('backgroundJobs.bulkDeleteConfirmTitle'),
                message: t('backgroundJobs.bulkDeleteConfirmMessage'),
                confirmText: t('common.delete'),
                cancelText: t('common.cancel'),
                onConfirm: () => bulkMutation.mutate('delete'),
              })
            }
          />
        </>
      ) : null}
      <View style={{ height: 8 }} />
      <AppList
        items={items}
        isPending={query.isPending}
        isError={query.isError}
        errorMessage={toApiError(query.error).message}
        onRetry={() => void query.refetch()}
        emptyMessage={t('backgroundJobs.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobRow
              item={item}
              selectMode={selectMode}
              isSelected={selected.has(item.id)}
              onToggle={() => setSelected((prev) => toggleSelection(prev, item.id))}
            />
          )}
          {...listRefreshProps(query)}
        />
      </AppList>
      {bulkMutation.isError ? <Text>{toApiError(bulkMutation.error).message}</Text> : null}
      {hasMore(total) ? (
        <AppButton title={t('common.loadMore')} onPress={loadMore} variant="outline" />
      ) : null}
    </AppScreen>
  );
}

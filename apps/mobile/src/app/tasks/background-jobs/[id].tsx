import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  deleteBackgroundJob,
  deleteBackgroundJobLog,
  getBackgroundJob,
  getBackgroundJobLogsPaged,
  pauseBackgroundJob,
  resumeBackgroundJob,
  startBackgroundJob,
  stopBackgroundJob,
  triggerBackgroundJob,
} from '../../../features/tasks/tasks-api';
import {
  JOB_PRIORITY_LABELS,
  JOB_SOURCE_LABELS,
  JOB_STATUS_LABELS,
  JOB_TYPE_LABELS,
} from '../../../features/tasks/types';
import { toApiError } from '../../../lib/errors';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';
import { usePagination } from '../../../lib/use-pagination';

/**
 * Chi tiết tác vụ nền: đúng drawer detail của web (status/source/
 * isEnabled/priority/group/name/description/type/creationTime/
 * lockTimeOut/beginTime/endTime/jobType/cron/interval/lastRunTime/
 * nextRunTime/triggerCount/maxCount/tryCount/maxTryCount/result) +
 * nút Sửa, Xóa có xác nhận và 5 nút điều khiển (tạm dừng/tiếp tục/
 * kích hoạt/dừng/bắt đầu) đúng các action PUT của controller.
 */
export default function BackgroundJobDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['tasks-background-jobs', id],
    queryFn: () => getBackgroundJob(id),
    enabled: Boolean(id),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['tasks-background-jobs'] });
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteBackgroundJob(id),
    onSuccess: async () => {
      await invalidate();
      router.back();
    },
  });

  const {
    page: logPage,
    skipCount: logSkipCount,
    maxResultCount: logMaxResultCount,
    hasMore: hasMoreLogs,
    loadMore: loadMoreLogs,
  } = usePagination();
  const logsQuery = useQuery({
    queryKey: ['tasks-background-job-logs', id, logPage],
    queryFn: () =>
      getBackgroundJobLogsPaged({
        jobId: id,
        skipCount: logSkipCount,
        maxResultCount: logMaxResultCount,
      }),
    enabled: Boolean(id),
  });
  const deleteLogMutation = useMutation({
    mutationFn: (logId: string) => deleteBackgroundJobLog(logId),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ['tasks-background-job-logs'] }),
    onError: (error) => setActionError(toApiError(error).message),
  });

  const actionMutation = useMutation({
    mutationFn: (action: 'pause' | 'resume' | 'trigger' | 'stop' | 'start') => {
      const fn =
        action === 'pause'
          ? pauseBackgroundJob
          : action === 'resume'
            ? resumeBackgroundJob
            : action === 'trigger'
              ? triggerBackgroundJob
              : action === 'stop'
                ? stopBackgroundJob
                : startBackgroundJob;
      return fn(id);
    },
    onSuccess: () => void invalidate(),
    onError: (error) => setActionError(toApiError(error).message),
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
    <AppScreen scrollable title={item.name}>
      <VStack space="sm">
        <Text>
          {t('backgroundJobs.status')}: {JOB_STATUS_LABELS[item.status] ?? item.status}
        </Text>
        <Text>
          {t('backgroundJobs.source')}: {JOB_SOURCE_LABELS[item.source] ?? item.source}
        </Text>
        <Text>
          {t('backgroundJobs.isEnabled')}: {item.isEnabled ? t('common.yes') : t('common.no')}
        </Text>
        <Text>
          {t('backgroundJobs.priority')}: {JOB_PRIORITY_LABELS[item.priority] ?? item.priority}
        </Text>
        <Text>
          {t('backgroundJobs.group')}: {item.group}
        </Text>
        <Text>
          {t('backgroundJobs.type')}: {item.type}
        </Text>
        {item.description ? (
          <Text>
            {t('backgroundJobs.description')}: {item.description}
          </Text>
        ) : null}
        <Text>
          {t('backgroundJobs.jobType')}: {JOB_TYPE_LABELS[item.jobType] ?? item.jobType}
        </Text>
        {item.cron ? (
          <Text>
            {t('backgroundJobs.cron')}: {item.cron}
          </Text>
        ) : null}
        <Text>
          {t('backgroundJobs.interval')}: {item.interval}
        </Text>
        <Text>
          {t('backgroundJobs.beginTime')}: {formatDateTime(item.beginTime)}
        </Text>
        {item.endTime ? (
          <Text>
            {t('backgroundJobs.endTime')}: {formatDateTime(item.endTime)}
          </Text>
        ) : null}
        {item.lastRunTime ? (
          <Text>
            {t('backgroundJobs.lastRunTime')}: {formatDateTime(item.lastRunTime)}
          </Text>
        ) : null}
        {item.nextRunTime ? (
          <Text>
            {t('backgroundJobs.nextRunTime')}: {formatDateTime(item.nextRunTime)}
          </Text>
        ) : null}
        <Text>
          {t('backgroundJobs.triggerCount')}: {item.triggerCount}
        </Text>
        <Text>
          {t('backgroundJobs.maxCount')}: {item.maxCount}
        </Text>
        <Text>
          {t('backgroundJobs.tryCount')}: {item.tryCount}
        </Text>
        <Text>
          {t('backgroundJobs.maxTryCount')}: {item.maxTryCount}
        </Text>
        <Text>
          {t('backgroundJobs.lockTimeOut')}: {item.lockTimeOut}
        </Text>
        {item.nodeName ? (
          <Text>
            {t('backgroundJobs.nodeName')}: {item.nodeName}
          </Text>
        ) : null}
        <Text>
          {t('backgroundJobs.isAbandoned')}: {item.isAbandoned ? t('common.yes') : t('common.no')}
        </Text>
        {item.result ? (
          <Text>
            {t('backgroundJobs.result')}: {item.result}
          </Text>
        ) : null}
        {item.creationTime ? (
          <Text>
            {t('backgroundJobs.creationTime')}: {formatDateTime(item.creationTime)}
          </Text>
        ) : null}
        <Text>
          {t('backgroundJobs.args')}: {JSON.stringify(item.args ?? {})}
        </Text>
        <AppButton
          title={t('backgroundJobs.editTitle')}
          onPress={() =>
            router.push(`/tasks/background-jobs/form?id=${encodeURIComponent(item.id)}`)
          }
        />
        <AppButton
          title={t('backgroundJobs.pause')}
          variant="outline"
          loading={actionMutation.isPending}
          onPress={() => actionMutation.mutate('pause')}
        />
        <AppButton
          title={t('backgroundJobs.resume')}
          variant="outline"
          loading={actionMutation.isPending}
          onPress={() => actionMutation.mutate('resume')}
        />
        <AppButton
          title={t('backgroundJobs.trigger')}
          variant="outline"
          loading={actionMutation.isPending}
          onPress={() => actionMutation.mutate('trigger')}
        />
        <AppButton
          title={t('backgroundJobs.stop')}
          variant="outline"
          loading={actionMutation.isPending}
          onPress={() => actionMutation.mutate('stop')}
        />
        <AppButton
          title={t('backgroundJobs.start')}
          variant="outline"
          loading={actionMutation.isPending}
          onPress={() => actionMutation.mutate('start')}
        />
        {actionError ? <Text>{actionError}</Text> : null}
        <AppButton
          title={t('common.delete')}
          action="negative"
          variant="outline"
          loading={deleteMutation.isPending}
          onPress={() =>
            showConfirmDialog({
              title: t('backgroundJobs.deleteConfirmTitle'),
              message: t('backgroundJobs.deleteConfirmMessage'),
              confirmText: t('common.delete'),
              cancelText: t('common.cancel'),
              onConfirm: () => deleteMutation.mutate(),
            })
          }
        />
        {deleteMutation.isError ? <Text>{toApiError(deleteMutation.error).message}</Text> : null}
        <Text>{t('backgroundJobs.jobLogs')}</Text>
        {logsQuery.isPending ? (
          <AppLoading />
        ) : logsQuery.isError ? (
          <AppErrorState
            message={toApiError(logsQuery.error).message}
            onRetry={() => void logsQuery.refetch()}
          />
        ) : (logsQuery.data?.items ?? []).length === 0 ? (
          <Text>{t('backgroundJobs.jobLogsEmpty')}</Text>
        ) : (
          <>
            {(logsQuery.data?.items ?? []).map((log) => (
              <VStack key={log.id} space="xs">
                <Text>
                  {log.jobName} · {formatDateTime(log.runTime)}
                </Text>
                <Text>{log.message}</Text>
                {log.exception ? (
                  <Text>
                    {t('backgroundJobs.exception')}: {log.exception}
                  </Text>
                ) : null}
                <AppButton
                  title={t('common.delete')}
                  action="negative"
                  variant="outline"
                  loading={deleteLogMutation.isPending}
                  onPress={() =>
                    showConfirmDialog({
                      title: t('backgroundJobs.deleteJobLogConfirmTitle'),
                      message: t('backgroundJobs.deleteJobLogConfirmMessage'),
                      confirmText: t('common.delete'),
                      cancelText: t('common.cancel'),
                      onConfirm: () => deleteLogMutation.mutate(log.id),
                    })
                  }
                />
              </VStack>
            ))}
            {hasMoreLogs(logsQuery.data?.totalCount ?? 0) ? (
              <AppButton title={t('common.loadMore')} onPress={loadMoreLogs} variant="outline" />
            ) : null}
          </>
        )}
      </VStack>
    </AppScreen>
  );
}

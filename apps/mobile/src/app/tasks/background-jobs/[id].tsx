import { useRouteParams } from '../../../lib/route-params';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDetailQuery } from '../../../lib/use-detail-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppDetailField } from '../../../components/ui/AppDetailField';

import { AppButton } from '../../../components/ui/AppButton';
import { AppNavButton } from '../../../components/ui/AppNavButton';
import { AppDeleteButton } from '../../../components/ui/AppDeleteButton';
import { AppErrorState, AppLoading } from '../../../components/ui/AppStates';
import { notFoundElement } from '../../../lib/not-found';
import { queryStateElement } from '../../../lib/query-state';
import { stateErrorElement } from '../../../lib/state-error';
import { useInvalidateQueries } from '../../../lib/mutation-success';
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
import { useSubmitError } from '../../../lib/use-submit-error';
import { showConfirmDialog } from '../../../lib/confirm';
import { formatDateTime } from '../../../lib/dates';
import { usePagination } from '../../../lib/use-pagination';
import { navHref } from '../../../lib/nav-href';

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
  const { id } = useRouteParams<{ id: string }>();
  const { error: actionError, onError: handleActionError } = useSubmitError();

  const query = useDetailQuery('tasks-background-jobs', id, getBackgroundJob);

  const invalidate = useInvalidateQueries(['tasks-background-jobs']);
  const invalidateLogs = useInvalidateQueries(['tasks-background-job-logs']);

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
    onSuccess: invalidateLogs,
    onError: handleActionError,
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
    onSuccess: invalidate,
    onError: handleActionError,
  });

  const queryState = queryStateElement(query);
  if (queryState) return queryState;
  const item = query.data;
  if (!item) return notFoundElement(t('common.empty'));

  return (
    <AppScreen scrollable title={item.name}>
      <VStack space="sm">
        <AppDetailField
          label={t('backgroundJobs.status')}
          value={JOB_STATUS_LABELS[item.status] ?? item.status}
        />
        <AppDetailField
          label={t('backgroundJobs.source')}
          value={JOB_SOURCE_LABELS[item.source] ?? item.source}
        />
        <AppDetailField
          label={t('backgroundJobs.isEnabled')}
          value={item.isEnabled ? t('common.yes') : t('common.no')}
        />
        <AppDetailField
          label={t('backgroundJobs.priority')}
          value={JOB_PRIORITY_LABELS[item.priority] ?? item.priority}
        />
        <AppDetailField label={t('backgroundJobs.group')} value={item.group} />
        <AppDetailField label={t('backgroundJobs.type')} value={item.type} />
        <AppDetailField label={t('backgroundJobs.description')} value={item.description} />
        <AppDetailField
          label={t('backgroundJobs.jobType')}
          value={JOB_TYPE_LABELS[item.jobType] ?? item.jobType}
        />
        <AppDetailField label={t('backgroundJobs.cron')} value={item.cron} />
        <AppDetailField label={t('backgroundJobs.interval')} value={item.interval} />
        <AppDetailField
          label={t('backgroundJobs.beginTime')}
          value={formatDateTime(item.beginTime)}
        />
        {item.endTime ? (
          <AppDetailField
            label={t('backgroundJobs.endTime')}
            value={formatDateTime(item.endTime)}
          />
        ) : null}
        {item.lastRunTime ? (
          <AppDetailField
            label={t('backgroundJobs.lastRunTime')}
            value={formatDateTime(item.lastRunTime)}
          />
        ) : null}
        {item.nextRunTime ? (
          <AppDetailField
            label={t('backgroundJobs.nextRunTime')}
            value={formatDateTime(item.nextRunTime)}
          />
        ) : null}
        <AppDetailField label={t('backgroundJobs.triggerCount')} value={item.triggerCount} />
        <AppDetailField label={t('backgroundJobs.maxCount')} value={item.maxCount} />
        <AppDetailField label={t('backgroundJobs.tryCount')} value={item.tryCount} />
        <AppDetailField label={t('backgroundJobs.maxTryCount')} value={item.maxTryCount} />
        <AppDetailField label={t('backgroundJobs.lockTimeOut')} value={item.lockTimeOut} />
        <AppDetailField label={t('backgroundJobs.nodeName')} value={item.nodeName} />
        <AppDetailField
          label={t('backgroundJobs.isAbandoned')}
          value={item.isAbandoned ? t('common.yes') : t('common.no')}
        />
        <AppDetailField label={t('backgroundJobs.result')} value={item.result} />
        {item.creationTime ? (
          <AppDetailField
            label={t('backgroundJobs.creationTime')}
            value={formatDateTime(item.creationTime)}
          />
        ) : null}
        <AppDetailField label={t('backgroundJobs.args')} value={JSON.stringify(item.args ?? {})} />
        <AppNavButton
          title={t('backgroundJobs.editTitle')}
          href={navHref('/tasks/background-jobs/form', { id: item.id })}
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
        {stateErrorElement(actionError)}
        <AppDeleteButton
          confirmTitle={t('backgroundJobs.deleteConfirmTitle')}
          confirmMessage={t('backgroundJobs.deleteConfirmMessage')}
          onDelete={() => deleteBackgroundJob(id)}
          invalidateKey={['tasks-background-jobs']}
        />
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
                <AppDetailField label={t('backgroundJobs.exception')} value={log.exception} />
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

import { apiPath, apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import { pagedDefaults } from '../../lib/paged-params';
import type {
  BackgroundJobDefinitionDto,
  BackgroundJobInfoBatchInput,
  BackgroundJobInfoCreateDto,
  BackgroundJobInfoDto,
  BackgroundJobInfoGetListInput,
  BackgroundJobInfoUpdateDto,
  BackgroundJobLogDto,
  BackgroundJobLogGetListInput,
} from './types';

const BASE = '/api/task-management/background-jobs';

/** GET /api/task-management/background-jobs — phân trang ABP, lọc theo web. */
export function getBackgroundJobsPaged(input: BackgroundJobInfoGetListInput = {}) {
  return apiRequest<PagedResult<BackgroundJobInfoDto>>(BASE, {
    method: 'GET',
    params: {
      filter: input.filter,
      group: input.group,
      name: input.name,
      type: input.type,
      status: input.status,
      jobType: input.jobType,
      priority: input.priority,
      source: input.source,
      isAbandoned: input.isAbandoned,
      ...pagedDefaults(input),
      sorting: input.sorting,
    },
  });
}

/** GET /api/task-management/background-jobs/{id} */
export function getBackgroundJob(id: string) {
  return apiRequest<BackgroundJobInfoDto>(apiPath(BASE, id), { method: 'GET' });
}

/** POST /api/task-management/background-jobs */
export function createBackgroundJob(input: BackgroundJobInfoCreateDto) {
  return apiRequest<BackgroundJobInfoDto>(BASE, { method: 'POST', body: input });
}

/** PUT /api/task-management/background-jobs/{id} — chỉ gửi base + concurrencyStamp. */
export function updateBackgroundJob(id: string, input: BackgroundJobInfoUpdateDto) {
  return apiRequest<BackgroundJobInfoDto>(apiPath(BASE, id), {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/task-management/background-jobs/{id} */
export function deleteBackgroundJob(id: string) {
  return apiRequest<void>(apiPath(BASE, id), { method: 'DELETE' });
}

/** GET /api/task-management/background-jobs/definitions — gợi ý type cho form tạo. */
export function getBackgroundJobDefinitions() {
  return apiRequest<ListResult<BackgroundJobDefinitionDto>>(`${BASE}/definitions`, {
    method: 'GET',
  });
}

function jobAction(id: string, action: string) {
  return apiRequest<void>(apiPath(BASE, id, action), { method: 'PUT' });
}

/** PUT .../{id}/pause */
export function pauseBackgroundJob(id: string) {
  return jobAction(id, 'pause');
}

/** PUT .../{id}/resume */
export function resumeBackgroundJob(id: string) {
  return jobAction(id, 'resume');
}

/** PUT .../{id}/trigger */
export function triggerBackgroundJob(id: string) {
  return jobAction(id, 'trigger');
}

/** PUT .../{id}/stop */
export function stopBackgroundJob(id: string) {
  return jobAction(id, 'stop');
}

/** PUT .../{id}/start */
export function startBackgroundJob(id: string) {
  return jobAction(id, 'start');
}

function bulkAction(action: string, input: BackgroundJobInfoBatchInput) {
  return apiRequest<void>(`${BASE}/bulk-${action}`, { method: 'PUT', body: input });
}

/**
 * Các API bulk của web (bulk-pause/resume/trigger/stop/start/delete):
 * API layer có sẵn + có test; UI chọn nhiều ở màn list tác vụ nền
 * (background-jobs.tsx, theo mẫu màn Cache) gọi đúng các hàm này.
 */
export function bulkPauseBackgroundJobs(input: BackgroundJobInfoBatchInput) {
  return bulkAction('pause', input);
}

export function bulkResumeBackgroundJobs(input: BackgroundJobInfoBatchInput) {
  return bulkAction('resume', input);
}

export function bulkTriggerBackgroundJobs(input: BackgroundJobInfoBatchInput) {
  return bulkAction('trigger', input);
}

export function bulkStopBackgroundJobs(input: BackgroundJobInfoBatchInput) {
  return bulkAction('stop', input);
}

export function bulkStartBackgroundJobs(input: BackgroundJobInfoBatchInput) {
  return bulkAction('start', input);
}

export function bulkDeleteBackgroundJobs(input: BackgroundJobInfoBatchInput) {
  return apiRequest<void>(`${BASE}/bulk-delete`, { method: 'DELETE', body: input });
}

/* ---------------- Nhật ký chạy: tab logs của drawer detail web ---------------- */

/** GET /api/task-management/background-jobs/logs — phân trang ABP, lọc jobId. */
export function getBackgroundJobLogsPaged(input: BackgroundJobLogGetListInput = {}) {
  return apiRequest<PagedResult<BackgroundJobLogDto>>(`${BASE}/logs`, {
    method: 'GET',
    params: {
      jobId: input.jobId,
      group: input.group,
      name: input.name,
      type: input.type,
      filter: input.filter,
      hasExceptions: input.hasExceptions,
      ...pagedDefaults(input),
      sorting: input.sorting,
    },
  });
}

/** DELETE /api/task-management/background-jobs/logs/{id} */
export function deleteBackgroundJobLog(id: string) {
  return apiRequest<void>(apiPath(BASE, 'logs', id), { method: 'DELETE' });
}

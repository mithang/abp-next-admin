/**
 * Kiểu cho nhóm Tác vụ nền (Background Jobs), đối chiếu trực tiếp
 * backend LINGYUN.Abp.TaskManagement.Application.Contracts, không chỉ
 * copy web:
 * - IBackgroundJobInfoAppService — GET/POST
 *   /api/task-management/background-jobs, GET/PUT/DELETE
 *   /background-jobs/{id}, PUT .../{id}/pause|resume|trigger|stop|start,
 *   PUT .../bulk-pause|bulk-resume|bulk-trigger|bulk-stop|bulk-start,
 *   DELETE .../bulk-delete, GET .../definitions (ListResult).
 * - CreateDto = base (isEnabled, args, description, jobType, cron,
 *   maxTryCount, maxCount, interval, priority, lockTimeOut) + name,
 *   group, type, nodeName, beginTime (bắt buộc), endTime, source
 *   (mặc định User = 0 ở C#). UpdateDto = base + concurrencyStamp:
 *   sửa KHÔNG gửi name/group/type/nodeName/beginTime/endTime/source.
 * DTO C# dùng PascalCase; JSON trả về camelCase như mọi API ABP khác.
 *
 * Enum số đúng backend:
 * - JobStatus: None -1, Completed 0, Queuing 5, Running 10,
 *   FailedRetry 15, Paused 20, Stopped 30.
 * - JobType: Once 0, Period 1, Persistent 2.
 * - JobPriority: Low 5, BelowNormal 10, Normal 15, AboveNormal 20,
 *   High 25.
 * - JobSource: None -1, User 0, System 10.
 */

export interface PagedInput {
  filter?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export const JOB_STATUS_LABELS: Record<number, string> = {
  '-1': 'None',
  0: 'Completed',
  5: 'Queuing',
  10: 'Running',
  15: 'FailedRetry',
  20: 'Paused',
  30: 'Stopped',
};

export const JOB_TYPE_LABELS: Record<number, string> = {
  0: 'Once',
  1: 'Period',
  2: 'Persistent',
};

export const JOB_PRIORITY_LABELS: Record<number, string> = {
  5: 'Low',
  10: 'BelowNormal',
  15: 'Normal',
  20: 'AboveNormal',
  25: 'High',
};

export const JOB_SOURCE_LABELS: Record<number, string> = {
  '-1': 'None',
  0: 'User',
  10: 'System',
};

export interface BackgroundJobInfoDto {
  id: string;
  name: string;
  group: string;
  type: string;
  result?: string | null;
  args: Record<string, unknown>;
  status: number;
  description?: string | null;
  beginTime: string;
  endTime?: string | null;
  cron?: string | null;
  interval: number;
  isAbandoned: boolean;
  isEnabled: boolean;
  jobType: number;
  lastRunTime?: string | null;
  lockTimeOut: number;
  maxCount: number;
  maxTryCount: number;
  nextRunTime?: string | null;
  nodeName?: string | null;
  priority: number;
  source: number;
  triggerCount: number;
  tryCount: number;
  concurrencyStamp: string;
  creationTime?: string;
  creatorId?: string | null;
  lastModificationTime?: string | null;
  lastModifierId?: string | null;
}

export interface BackgroundJobInfoBaseDto {
  isEnabled: boolean;
  args: Record<string, unknown>;
  description?: string;
  jobType: number;
  cron?: string;
  maxTryCount: number;
  maxCount: number;
  interval: number;
  priority: number;
  lockTimeOut: number;
}

export interface BackgroundJobInfoCreateDto extends BackgroundJobInfoBaseDto {
  name: string;
  group: string;
  type: string;
  nodeName?: string;
  beginTime: string;
  endTime?: string;
  source: number;
}

export interface BackgroundJobInfoUpdateDto extends BackgroundJobInfoBaseDto {
  concurrencyStamp: string;
}

export interface BackgroundJobInfoGetListInput extends PagedInput {
  group?: string;
  name?: string;
  type?: string;
  status?: number;
  jobType?: number;
  priority?: number;
  source?: number;
  isAbandoned?: boolean;
  beginTime?: string;
  endTime?: string;
  beginLastRunTime?: string;
  endLastRunTime?: string;
  beginCreationTime?: string;
  endCreationTime?: string;
}

export interface BackgroundJobInfoBatchInput {
  jobIds: string[];
}

/**
 * Nhật ký chạy tác vụ — tab "logs" trong drawer detail của web
 * (JobInfoDetailDrawer): GET/DELETE
 * /api/task-management/background-jobs/logs[/{id}], list lọc jobId.
 */
export interface BackgroundJobLogDto {
  id: string;
  exception?: string | null;
  jobGroup: string;
  jobName: string;
  jobType: string;
  message: string;
  runTime: string;
}

export interface BackgroundJobLogGetListInput extends PagedInput {
  jobId?: string;
  group?: string;
  name?: string;
  type?: string;
  hasExceptions?: boolean;
  beginRunTime?: string;
  endRunTime?: string;
}

export interface BackgroundJobParameterDto {
  name: string;
  displayName: string;
  description?: string | null;
  required: boolean;
}

export interface BackgroundJobDefinitionDto {
  name: string;
  displayName?: string | null;
  description?: string | null;
  parameters?: BackgroundJobParameterDto[];
}

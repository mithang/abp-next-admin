import { apiPath, apiRequest, type PagedResult } from '../../lib/api-client';
import type { AuditLogDto, AuditLogGetListInput, LogDto, LogGetListInput } from './types';

/** GET /api/auditing/audit-log — phân trang ABP, lọc theo userName/url/method/status... */
export function getAuditLogsPaged(input: AuditLogGetListInput = {}) {
  return apiRequest<PagedResult<AuditLogDto>>('/api/auditing/audit-log', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      userName: input.userName,
      url: input.url,
      httpMethod: input.httpMethod,
      httpStatusCode: input.httpStatusCode,
      applicationName: input.applicationName,
      clientId: input.clientId,
      clientIpAddress: input.clientIpAddress,
      correlationId: input.correlationId,
      hasException: input.hasException,
      minExecutionDuration: input.minExecutionDuration,
      maxExecutionDuration: input.maxExecutionDuration,
      startTime: input.startTime,
      endTime: input.endTime,
    },
  });
}

/** GET /api/auditing/audit-log/{id} — detail gồm actions + entityChanges như drawer web. */
export function getAuditLog(id: string) {
  return apiRequest<AuditLogDto>(apiPath('/api/auditing/audit-log', id), {
    method: 'GET',
  });
}

/** DELETE /api/auditing/audit-log/{id} */
export function deleteAuditLog(id: string) {
  return apiRequest<void>(apiPath('/api/auditing/audit-log', id), {
    method: 'DELETE',
  });
}

/** DELETE /api/auditing/audit-log/bulk — xóa hàng loạt, API sẵn cho vòng sau (UI chưa có chọn nhiều, như security-logs). */
export function deleteAuditLogsBulk(ids: string[]) {
  return apiRequest<void>('/api/auditing/audit-log/bulk', { method: 'DELETE', body: { ids } });
}

/** GET /api/auditing/logging — phân trang ABP (LogGetByPagedDto kế thừa PagedAndSorted). */
export function getSysLogsPaged(input: LogGetListInput = {}) {
  return apiRequest<PagedResult<LogDto>>('/api/auditing/logging', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      level: input.level,
      application: input.application,
      machineName: input.machineName,
      environment: input.environment,
      context: input.context,
      requestId: input.requestId,
      requestPath: input.requestPath,
      correlationId: input.correlationId,
      processId: input.processId,
      threadId: input.threadId,
      hasException: input.hasException,
      startTime: input.startTime,
      endTime: input.endTime,
    },
  });
}

/** GET /api/auditing/logging/{id} — id là fields.id của log (LogDto không có id top-level). */
export function getSysLog(id: string) {
  return apiRequest<LogDto>(apiPath('/api/auditing/logging', id), { method: 'GET' });
}

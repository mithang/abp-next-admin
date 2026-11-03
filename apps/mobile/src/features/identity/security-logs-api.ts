import { apiPath, apiRequest, type PagedResult } from '../../lib/api-client';
import { pagedDefaults } from '../../lib/paged-params';
import type { GetSecurityLogPagedInput, SecurityLogDto } from './security-logs';

/** GET /api/auditing/security-log — phân trang ABP, lọc theo userName (ô tìm kiếm mobile). */
export function getSecurityLogsPaged(input: GetSecurityLogPagedInput = {}) {
  return apiRequest<PagedResult<SecurityLogDto>>('/api/auditing/security-log', {
    method: 'GET',
    params: {
      ...pagedDefaults(input),
      sorting: input.sorting,
      userName: input.userName,
      actionName: input.actionName,
      applicationName: input.applicationName,
      clientId: input.clientId,
    },
  });
}

/** GET /api/auditing/security-log/{id} */
export function getSecurityLog(id: string) {
  return apiRequest<SecurityLogDto>(apiPath('/api/auditing/security-log', id), {
    method: 'GET',
  });
}

/** DELETE /api/auditing/security-log/{id} */
export function deleteSecurityLog(id: string) {
  return apiRequest<void>(apiPath('/api/auditing/security-log', id), {
    method: 'DELETE',
  });
}

/** DELETE /api/auditing/security-log/bulk — xóa hàng loạt, API sẵn cho vòng sau (UI chưa có chọn nhiều). */
export function deleteSecurityLogsBulk(ids: string[]) {
  return apiRequest<void>('/api/auditing/security-log/bulk', { method: 'DELETE', body: { ids } });
}

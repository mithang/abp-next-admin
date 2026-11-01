import { apiRequest, type PagedResult } from '../../lib/api-client';
import type { GetSecurityLogPagedInput, SecurityLogDto } from './security-logs';

/** GET /api/auditing/security-log — phân trang ABP, lọc theo userName (ô tìm kiếm mobile). */
export function getSecurityLogsPaged(input: GetSecurityLogPagedInput = {}) {
  return apiRequest<PagedResult<SecurityLogDto>>('/api/auditing/security-log', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
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
  return apiRequest<SecurityLogDto>(`/api/auditing/security-log/${encodeURIComponent(id)}`, { method: 'GET' });
}

/** DELETE /api/auditing/security-log/{id} */
export function deleteSecurityLog(id: string) {
  return apiRequest<void>(`/api/auditing/security-log/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/** DELETE /api/auditing/security-log/bulk — xóa hàng loạt, API sẵn cho vòng sau (UI chưa có chọn nhiều). */
export function deleteSecurityLogsBulk(ids: string[]) {
  return apiRequest<void>('/api/auditing/security-log/bulk', { method: 'DELETE', body: { ids } });
}

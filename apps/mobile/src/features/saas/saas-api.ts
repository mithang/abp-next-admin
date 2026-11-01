import { apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import type {
  EditionCreateDto,
  EditionDto,
  EditionGetListInput,
  EditionUpdateDto,
  TenantConnectionStringCheckInput,
  TenantConnectionStringDto,
  TenantConnectionStringSetInput,
  TenantCreateDto,
  TenantDto,
  TenantGetListInput,
  TenantUpdateDto,
} from './types';

/* ---------------- Tenant: /api/saas/tenants ---------------- */

/** GET /api/saas/tenants — phân trang ABP, lọc filter. */
export function getTenantsPaged(input: TenantGetListInput = {}) {
  return apiRequest<PagedResult<TenantDto>>('/api/saas/tenants', {
    method: 'GET',
    params: {
      filter: input.filter,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/saas/tenants/{id} */
export function getTenant(id: string) {
  return apiRequest<TenantDto>(`/api/saas/tenants/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** POST /api/saas/tenants — tạo kèm adminEmailAddress/adminPassword bắt buộc. */
export function createTenant(input: TenantCreateDto) {
  return apiRequest<TenantDto>('/api/saas/tenants', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/saas/tenants/{id} — body bắt buộc có concurrencyStamp (DTO C#). */
export function updateTenant(id: string, input: TenantUpdateDto) {
  return apiRequest<TenantDto>(`/api/saas/tenants/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/saas/tenants/{id} */
export function deleteTenant(id: string) {
  return apiRequest<void>(`/api/saas/tenants/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/* ---------------- Chuỗi kết nối tenant ---------------- */

/** GET /api/saas/tenants/{id}/connection-string — tất cả chuỗi kết nối (ListResult). */
export function getTenantConnectionStrings(id: string) {
  return apiRequest<ListResult<TenantConnectionStringDto>>(
    `/api/saas/tenants/${encodeURIComponent(id)}/connection-string`,
    { method: 'GET' },
  );
}

/** GET /api/saas/tenants/{id}/connection-string/{name} */
export function getTenantConnectionString(id: string, name: string) {
  return apiRequest<TenantConnectionStringDto>(
    `/api/saas/tenants/${encodeURIComponent(id)}/connection-string/${encodeURIComponent(name)}`,
    { method: 'GET' },
  );
}

/** PUT /api/saas/tenants/{id}/connection-string — đặt (tạo mới hoặc ghi đè). */
export function setTenantConnectionString(id: string, input: TenantConnectionStringSetInput) {
  return apiRequest<TenantConnectionStringDto>(
    `/api/saas/tenants/${encodeURIComponent(id)}/connection-string`,
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/saas/tenants/{id}/connection-string/{name} */
export function deleteTenantConnectionString(id: string, name: string) {
  return apiRequest<void>(
    `/api/saas/tenants/${encodeURIComponent(id)}/connection-string/${encodeURIComponent(name)}`,
    { method: 'DELETE' },
  );
}

/**
 * POST /api/saas/tenants/connection-string/check — trả void: HTTP 2xx nghĩa
 * là kết nối được, lỗi nghĩa là không kết nối được (đúng ITenantAppService).
 */
export function checkTenantConnectionString(input: TenantConnectionStringCheckInput) {
  return apiRequest<void>('/api/saas/tenants/connection-string/check', {
    method: 'POST',
    body: input,
  });
}

/* ---------------- Edition: /api/saas/editions ---------------- */

/** GET /api/saas/editions — phân trang ABP, lọc filter. */
export function getEditionsPaged(input: EditionGetListInput = {}) {
  return apiRequest<PagedResult<EditionDto>>('/api/saas/editions', {
    method: 'GET',
    params: {
      filter: input.filter,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/saas/editions/{id} */
export function getEdition(id: string) {
  return apiRequest<EditionDto>(`/api/saas/editions/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** POST /api/saas/editions — chỉ có displayName (+ extraProperties). */
export function createEdition(input: EditionCreateDto) {
  return apiRequest<EditionDto>('/api/saas/editions', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/saas/editions/{id} — body bắt buộc có concurrencyStamp. */
export function updateEdition(id: string, input: EditionUpdateDto) {
  return apiRequest<EditionDto>(`/api/saas/editions/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/saas/editions/{id} */
export function deleteEdition(id: string) {
  return apiRequest<void>(`/api/saas/editions/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

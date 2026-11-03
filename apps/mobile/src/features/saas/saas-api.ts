import { apiPath, apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import { pagedDefaults } from '../../lib/paged-params';
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
import type { GetFeatureValuesResult, UpdateFeatureValuesInput } from './tenant-features';

/* ---------------- Tenant: /api/saas/tenants ---------------- */

/** GET /api/saas/tenants — phân trang ABP, lọc filter. */
export function getTenantsPaged(input: TenantGetListInput = {}) {
  return apiRequest<PagedResult<TenantDto>>('/api/saas/tenants', {
    method: 'GET',
    params: {
      filter: input.filter,
      ...pagedDefaults(input),
      sorting: input.sorting,
    },
  });
}

/** GET /api/saas/tenants/{id} */
export function getTenant(id: string) {
  return apiRequest<TenantDto>(apiPath('/api/saas/tenants', id), {
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
  return apiRequest<TenantDto>(apiPath('/api/saas/tenants', id), {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/saas/tenants/{id} */
export function deleteTenant(id: string) {
  return apiRequest<void>(apiPath('/api/saas/tenants', id), {
    method: 'DELETE',
  });
}

/* ---------------- Chuỗi kết nối tenant ---------------- */

/** GET /api/saas/tenants/{id}/connection-string — tất cả chuỗi kết nối (ListResult). */
export function getTenantConnectionStrings(id: string) {
  return apiRequest<ListResult<TenantConnectionStringDto>>(
    apiPath('/api/saas/tenants', id, 'connection-string'),
    { method: 'GET' },
  );
}

/** GET /api/saas/tenants/{id}/connection-string/{name} */
export function getTenantConnectionString(id: string, name: string) {
  return apiRequest<TenantConnectionStringDto>(
    apiPath('/api/saas/tenants', id, 'connection-string', name),
    { method: 'GET' },
  );
}

/** PUT /api/saas/tenants/{id}/connection-string — đặt (tạo mới hoặc ghi đè). */
export function setTenantConnectionString(id: string, input: TenantConnectionStringSetInput) {
  return apiRequest<TenantConnectionStringDto>(
    apiPath('/api/saas/tenants', id, 'connection-string'),
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/saas/tenants/{id}/connection-string/{name} */
export function deleteTenantConnectionString(id: string, name: string) {
  return apiRequest<void>(apiPath('/api/saas/tenants', id, 'connection-string', name), {
    method: 'DELETE',
  });
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

/* ---------------- Giá trị tính năng theo tenant ---------------- */

/** GET /api/feature-management/features?providerName=T&providerKey={id}
 * — đúng FeatureModal web trong TenantTable (providerName 'T').
 */
export function getTenantFeatureValues(tenantId: string) {
  return apiRequest<GetFeatureValuesResult>('/api/feature-management/features', {
    method: 'GET',
    params: { providerName: 'T', providerKey: tenantId },
  });
}

/** PUT /api/feature-management/features — body { features: [{ name, value }] }, value luôn là chuỗi. */
export function updateTenantFeatureValues(tenantId: string, input: UpdateFeatureValuesInput) {
  return apiRequest<void>('/api/feature-management/features', {
    method: 'PUT',
    params: { providerName: 'T', providerKey: tenantId },
    body: input,
  });
}

/**
 * DELETE /api/feature-management/features — xóa toàn bộ giá trị tính
 * năng của tenant, quay về giá trị mặc định (đúng deleteApi của web
 * useFeaturesApi; màn hình dùng làm nút "Đặt lại mặc định").
 */
export function deleteTenantFeatureValues(tenantId: string) {
  return apiRequest<void>('/api/feature-management/features', {
    method: 'DELETE',
    params: { providerName: 'T', providerKey: tenantId },
  });
}

/* ---------------- Edition: /api/saas/editions ---------------- */

/** GET /api/saas/editions — phân trang ABP, lọc filter. */
export function getEditionsPaged(input: EditionGetListInput = {}) {
  return apiRequest<PagedResult<EditionDto>>('/api/saas/editions', {
    method: 'GET',
    params: {
      filter: input.filter,
      ...pagedDefaults(input),
      sorting: input.sorting,
    },
  });
}

/** GET /api/saas/editions/{id} */
export function getEdition(id: string) {
  return apiRequest<EditionDto>(apiPath('/api/saas/editions', id), {
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
  return apiRequest<EditionDto>(apiPath('/api/saas/editions', id), {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/saas/editions/{id} */
export function deleteEdition(id: string) {
  return apiRequest<void>(apiPath('/api/saas/editions', id), {
    method: 'DELETE',
  });
}

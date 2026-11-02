import { apiRequest, type PagedResult } from '../../lib/api-client';
import type { GetRolePagedListInput, IdentityRoleDto } from './roles-types';

/** GET /api/identity/roles — đã kiểm chứng từ useRolesApi.ts của web app-antd. */
export function getRolesPaged(input: GetRolePagedListInput = {}) {
  return apiRequest<PagedResult<IdentityRoleDto>>('/api/identity/roles', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      filter: input.filter,
    },
  });
}

/** GET /api/identity/roles/{id} */
export function getRole(id: string) {
  return apiRequest<IdentityRoleDto>(`/api/identity/roles/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** POST /api/identity/roles — API layer sẵn cho màn hình tạo vai trò vòng sau. */
export function createRole(input: { name: string; isDefault: boolean; isPublic: boolean }) {
  return apiRequest<IdentityRoleDto>('/api/identity/roles', { method: 'POST', body: input });
}

/** PUT /api/identity/roles/{id} — API layer sẵn cho màn hình sửa vai trò vòng sau. */
export function updateRole(
  id: string,
  input: { name: string; isDefault: boolean; isPublic: boolean; concurrencyStamp?: string },
) {
  return apiRequest<IdentityRoleDto>(`/api/identity/roles/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/identity/roles/{id} */
export function deleteRole(id: string) {
  return apiRequest<void>(`/api/identity/roles/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

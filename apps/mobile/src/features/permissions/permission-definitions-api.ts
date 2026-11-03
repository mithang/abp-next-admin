import { apiPath, apiRequest, type ListResult } from '../../lib/api-client';
import type {
  PermissionDefinitionCreateDto,
  PermissionDefinitionDto,
  PermissionDefinitionGetListInput,
  PermissionDefinitionUpdateDto,
} from './types';

/** GET /api/permission-management/definitions — web lọc filter/groupName, phân trang phía client. */
export function getPermissionDefinitions(input: PermissionDefinitionGetListInput = {}) {
  return apiRequest<ListResult<PermissionDefinitionDto>>('/api/permission-management/definitions', {
    method: 'GET',
    params: { filter: input.filter, groupName: input.groupName },
  });
}

/** GET /api/permission-management/definitions/{name} */
export function getPermissionDefinition(name: string) {
  return apiRequest<PermissionDefinitionDto>(
    apiPath('/api/permission-management/definitions', name),
    { method: 'GET' },
  );
}

/** POST /api/permission-management/definitions */
export function createPermissionDefinition(input: PermissionDefinitionCreateDto) {
  return apiRequest<PermissionDefinitionDto>('/api/permission-management/definitions', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/permission-management/definitions/{name} — không gửi name/groupName. */
export function updatePermissionDefinition(name: string, input: PermissionDefinitionUpdateDto) {
  return apiRequest<PermissionDefinitionDto>(
    apiPath('/api/permission-management/definitions', name),
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/permission-management/definitions/{name} */
export function deletePermissionDefinition(name: string) {
  return apiRequest<void>(apiPath('/api/permission-management/definitions', name), {
    method: 'DELETE',
  });
}

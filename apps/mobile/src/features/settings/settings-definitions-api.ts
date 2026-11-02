import { apiRequest, type ListResult } from '../../lib/api-client';
import type {
  SettingDefinitionCreateDto,
  SettingDefinitionDto,
  SettingDefinitionGetListInput,
  SettingDefinitionUpdateDto,
} from './types';

/** GET /api/setting-management/settings/definitions — web lọc filter, phân trang phía client. */
export function getSettingDefinitions(input: SettingDefinitionGetListInput = {}) {
  return apiRequest<ListResult<SettingDefinitionDto>>(
    '/api/setting-management/settings/definitions',
    {
      method: 'GET',
      params: { filter: input.filter, providerName: input.providerName },
    },
  );
}

/** GET /api/setting-management/settings/definitions/{name} */
export function getSettingDefinition(name: string) {
  return apiRequest<SettingDefinitionDto>(
    `/api/setting-management/settings/definitions/${encodeURIComponent(name)}`,
    { method: 'GET' },
  );
}

/** POST /api/setting-management/settings/definitions */
export function createSettingDefinition(input: SettingDefinitionCreateDto) {
  return apiRequest<SettingDefinitionDto>('/api/setting-management/settings/definitions', {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/setting-management/settings/definitions/{name} — không gửi name/isStatic. */
export function updateSettingDefinition(name: string, input: SettingDefinitionUpdateDto) {
  return apiRequest<SettingDefinitionDto>(
    `/api/setting-management/settings/definitions/${encodeURIComponent(name)}`,
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/setting-management/settings/definitions/{name} — web vô hiệu nút này với bản ghi tĩnh. */
export function deleteSettingDefinition(name: string) {
  return apiRequest<void>(
    `/api/setting-management/settings/definitions/${encodeURIComponent(name)}`,
    {
      method: 'DELETE',
    },
  );
}

/** GET /api/setting-management/settings/definitions/assignable-providers — dùng làm gợi ý cho ô providers ở form. */
export function getAssignableProviders() {
  return apiRequest<ListResult<{ name: string; value: string }>>(
    '/api/setting-management/settings/definitions/assignable-providers',
    { method: 'GET' },
  );
}

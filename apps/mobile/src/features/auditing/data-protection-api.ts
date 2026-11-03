import { apiPath, apiRequest, type PagedResult } from '../../lib/api-client';
import { pagedDefaults } from '../../lib/paged-params';
import type { EntityTypeInfoDto, GetEntityTypeInfoListInput } from './types';

/** GET /api/data-protection-management/entity-type-infos — phân trang ABP, lọc filter. */
export function getEntityTypeInfosPaged(input: GetEntityTypeInfoListInput = {}) {
  return apiRequest<PagedResult<EntityTypeInfoDto>>(
    '/api/data-protection-management/entity-type-infos',
    {
      method: 'GET',
      params: {
        filter: input.filter,
        isAuditEnabled: input.isAuditEnabled,
        sorting: input.sorting,
        ...pagedDefaults(input),
      },
    },
  );
}

/** GET /api/data-protection-management/entity-type-infos/{id} — backend chỉ có Get/GetList, không tạo/sửa/xóa. */
export function getEntityTypeInfo(id: string) {
  return apiRequest<EntityTypeInfoDto>(
    apiPath('/api/data-protection-management/entity-type-infos', id),
    {
      method: 'GET',
    },
  );
}

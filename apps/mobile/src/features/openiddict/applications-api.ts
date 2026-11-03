import { apiPath, apiRequest, type PagedResult } from '../../lib/api-client';
import type {
  OpenIddictApplicationCreateOrUpdateDto,
  OpenIddictApplicationDto,
  OpenIddictApplicationGetListInput,
} from './types';

/** GET /api/openiddict/applications — đã kiểm chứng từ useApplicationsApi.ts của web. */
export function getApplicationsPaged(input: OpenIddictApplicationGetListInput = {}) {
  return apiRequest<PagedResult<OpenIddictApplicationDto>>('/api/openiddict/applications', {
    method: 'GET',
    params: {
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
      filter: input.filter,
    },
  });
}

/** GET /api/openiddict/applications/{id} */
export function getApplication(id: string) {
  return apiRequest<OpenIddictApplicationDto>(apiPath('/api/openiddict/applications', id), {
    method: 'GET',
  });
}

/**
 * POST /api/openiddict/applications — requirements và settings là field bắt buộc
 * của DTO web (CreateOrUpdateDto); form mobile luôn gửi mặc định
 * requirements { features: { requirePkce: false } } và settings { tokenLifetime: {} }
 * vì UI chưa có chỗ sửa sâu hai nhóm này.
 */
export function createApplication(
  input: Omit<OpenIddictApplicationCreateOrUpdateDto, 'requirements' | 'settings'>,
) {
  const body: OpenIddictApplicationCreateOrUpdateDto = {
    ...input,
    requirements: { features: { requirePkce: false } },
    settings: { tokenLifetime: {} },
  };
  return apiRequest<OpenIddictApplicationDto>('/api/openiddict/applications', {
    method: 'POST',
    body,
  });
}

/**
 * PUT /api/openiddict/applications/{id} — mặc định requirements/settings như create,
 * NHƯNG giữ nguyên giá trị hiện có khi form sửa truyền vào: nếu không, một lần sửa
 * tên/displayName sẽ vô tình reset requirePkce và tokenLifetime của ứng dụng.
 */
export function updateApplication(
  id: string,
  input: Omit<OpenIddictApplicationCreateOrUpdateDto, 'requirements' | 'settings'> & {
    requirements?: OpenIddictApplicationCreateOrUpdateDto['requirements'];
    settings?: OpenIddictApplicationCreateOrUpdateDto['settings'];
  },
) {
  const body: OpenIddictApplicationCreateOrUpdateDto = {
    ...input,
    requirements: input.requirements ?? { features: { requirePkce: false } },
    settings: input.settings ?? { tokenLifetime: {} },
  };
  return apiRequest<OpenIddictApplicationDto>(apiPath('/api/openiddict/applications', id), {
    method: 'PUT',
    body,
  });
}

/** DELETE /api/openiddict/applications/{id} */
export function deleteApplication(id: string) {
  return apiRequest<void>(apiPath('/api/openiddict/applications', id), {
    method: 'DELETE',
  });
}

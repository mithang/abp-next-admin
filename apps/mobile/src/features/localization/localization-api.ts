import { apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import type {
  DeleteTextInput,
  GetTextByKeyInput,
  GetTextsInput,
  LanguageCreateDto,
  LanguageDto,
  LanguageGetPagedListInput,
  LanguageUpdateDto,
  ResourceCreateDto,
  ResourceDto,
  ResourceGetPagedListInput,
  ResourceUpdateDto,
  SetTextInput,
  TextDifferenceDto,
  TextDto,
} from './types';

/* ---------------- Ngôn ngữ: GET /api/localization/languages (phân trang phía server) ---------------- */

/** GET /api/localization/languages — bảng web gửi filter/skipCount/maxResultCount/sorting. */
export function getLanguagesPaged(input: LanguageGetPagedListInput = {}) {
  return apiRequest<PagedResult<LanguageDto>>('/api/localization/languages', {
    method: 'GET',
    params: {
      filter: input.filter,
      skipCount: input.skipCount,
      maxResultCount: input.maxResultCount,
      sorting: input.sorting,
    },
  });
}

/** GET /api/localization/languages/{cultureName} */
export function getLanguage(cultureName: string) {
  return apiRequest<LanguageDto>(`/api/localization/languages/${encodeURIComponent(cultureName)}`, {
    method: 'GET',
  });
}

/** POST /api/localization/languages */
export function createLanguage(input: LanguageCreateDto) {
  return apiRequest<LanguageDto>('/api/localization/languages', { method: 'POST', body: input });
}

/** PUT /api/localization/languages/{cultureName} — backend chỉ nhận displayName. */
export function updateLanguage(cultureName: string, input: LanguageUpdateDto) {
  return apiRequest<LanguageDto>(`/api/localization/languages/${encodeURIComponent(cultureName)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/localization/languages/{cultureName} */
export function deleteLanguage(cultureName: string) {
  return apiRequest<void>(`/api/localization/languages/${encodeURIComponent(cultureName)}`, {
    method: 'DELETE',
  });
}

/* ---------------- Tài nguyên: GET /api/localization/resources (phân trang phía server) ---------------- */

/** GET /api/localization/resources — bảng web gửi filter/skipCount/maxResultCount/sorting. */
export function getResourcesPaged(input: ResourceGetPagedListInput = {}) {
  return apiRequest<PagedResult<ResourceDto>>('/api/localization/resources', {
    method: 'GET',
    params: {
      filter: input.filter,
      skipCount: input.skipCount,
      maxResultCount: input.maxResultCount,
      sorting: input.sorting,
    },
  });
}

/** GET /api/localization/resources/{name} */
export function getResource(name: string) {
  return apiRequest<ResourceDto>(`/api/localization/resources/${encodeURIComponent(name)}`, {
    method: 'GET',
  });
}

/** POST /api/localization/resources */
export function createResource(input: ResourceCreateDto) {
  return apiRequest<ResourceDto>('/api/localization/resources', { method: 'POST', body: input });
}

/** PUT /api/localization/resources/{name} — giữ defaultCultureName đã tải (modal web không có ô này). */
export function updateResource(name: string, input: ResourceUpdateDto) {
  return apiRequest<ResourceDto>(`/api/localization/resources/${encodeURIComponent(name)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/localization/resources/{name} */
export function deleteResource(name: string) {
  return apiRequest<void>(`/api/localization/resources/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
}

/* ---------------- Văn bản: GET /api/localization/texts (ListResult, không phân trang server) ---------------- */

/** GET /api/localization/texts — web bắt buộc cultureName + targetCultureName ở form tìm kiếm. */
export function getTexts(input: GetTextsInput) {
  return apiRequest<ListResult<TextDifferenceDto>>('/api/localization/texts', {
    method: 'GET',
    params: {
      cultureName: input.cultureName,
      targetCultureName: input.targetCultureName,
      resourceName: input.resourceName,
      filter: input.filter,
      onlyNull: input.onlyNull,
    },
  });
}

/** GET /api/localization/texts/by-key */
export function getTextByKey(input: GetTextByKeyInput) {
  return apiRequest<TextDto>('/api/localization/texts/by-key', {
    method: 'GET',
    params: { cultureName: input.cultureName, key: input.key, resourceName: input.resourceName },
  });
}

/** PUT /api/localization/texts — set-text: tạo mới nếu chưa có, cập nhật nếu đã có (SetTextAsync). */
export function setText(input: SetTextInput) {
  return apiRequest<void>('/api/localization/texts', { method: 'PUT', body: input });
}

/** DELETE /api/localization/texts — body đúng như bảng web: cultureName là culture nguồn của dòng. */
export function deleteText(input: DeleteTextInput) {
  return apiRequest<void>('/api/localization/texts', { method: 'DELETE', body: input });
}

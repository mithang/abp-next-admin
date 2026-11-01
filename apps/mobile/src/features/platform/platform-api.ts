import { apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import type {
  DataCreateDto,
  DataDto,
  DataGetListInput,
  DataItemCreateDto,
  DataItemUpdateDto,
  DataMoveDto,
  DataUpdateDto,
  LayoutCreateDto,
  LayoutDto,
  LayoutGetListInput,
  LayoutUpdateDto,
} from './types';

/* ---------------- Từ điển dữ liệu: /api/platform/datas ---------------- */

/** GET /api/platform/datas — phân trang ABP, lọc filter. */
export function getDatasPaged(input: DataGetListInput = {}) {
  return apiRequest<PagedResult<DataDto>>('/api/platform/datas', {
    method: 'GET',
    params: {
      filter: input.filter,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/platform/datas/all — bảng web dùng route này rồi dựng cây theo parentId. */
export function getDatasAll() {
  return apiRequest<ListResult<DataDto>>('/api/platform/datas/all', { method: 'GET' });
}

/** GET /api/platform/datas/by-name/{name} — web dùng để lấy mục 'UI Framework' làm gợi ý framework cho bố cục. */
export function getDataByName(name: string) {
  return apiRequest<DataDto>(`/api/platform/datas/by-name/${encodeURIComponent(name)}`, {
    method: 'GET',
  });
}

/** GET /api/platform/datas/{id} */
export function getData(id: string) {
  return apiRequest<DataDto>(`/api/platform/datas/${encodeURIComponent(id)}`, { method: 'GET' });
}

/** POST /api/platform/datas — tạo kèm parentId tùy chọn (để trống = gốc). */
export function createData(input: DataCreateDto) {
  return apiRequest<DataDto>('/api/platform/datas', { method: 'POST', body: input });
}

/** PUT /api/platform/datas/{id} — KHÔNG gửi parentId/code (không có trong UpdateDto). */
export function updateData(id: string, input: DataUpdateDto) {
  return apiRequest<DataDto>(`/api/platform/datas/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/platform/datas/{id} */
export function deleteData(id: string) {
  return apiRequest<void>(`/api/platform/datas/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/** PUT /api/platform/datas/{id}/move — đổi từ điển cha; parentId rỗng = về gốc. */
export function moveData(id: string, input: DataMoveDto) {
  return apiRequest<DataDto>(`/api/platform/datas/${encodeURIComponent(id)}/move`, {
    method: 'PUT',
    body: input,
  });
}

/* ---------------- Mục từ điển ---------------- */

/** POST /api/platform/datas/{id}/items — tạo mục (name bắt buộc lúc tạo). */
export function createDataItem(id: string, input: DataItemCreateDto) {
  return apiRequest<void>(`/api/platform/datas/${encodeURIComponent(id)}/items`, {
    method: 'POST',
    body: input,
  });
}

/** PUT /api/platform/datas/{id}/items/{name} — sửa mục, body KHÔNG có name. */
export function updateDataItem(id: string, name: string, input: DataItemUpdateDto) {
  return apiRequest<void>(
    `/api/platform/datas/${encodeURIComponent(id)}/items/${encodeURIComponent(name)}`,
    { method: 'PUT', body: input },
  );
}

/** DELETE /api/platform/datas/{id}/items/{name} */
export function deleteDataItem(id: string, name: string) {
  return apiRequest<void>(
    `/api/platform/datas/${encodeURIComponent(id)}/items/${encodeURIComponent(name)}`,
    { method: 'DELETE' },
  );
}

/* ---------------- Bố cục: /api/platform/layouts ---------------- */

/** GET /api/platform/layouts — phân trang ABP, lọc filter/framework. */
export function getLayoutsPaged(input: LayoutGetListInput = {}) {
  return apiRequest<PagedResult<LayoutDto>>('/api/platform/layouts', {
    method: 'GET',
    params: {
      filter: input.filter,
      framework: input.framework,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/platform/layouts/{id} */
export function getLayout(id: string) {
  return apiRequest<LayoutDto>(`/api/platform/layouts/${encodeURIComponent(id)}`, { method: 'GET' });
}

/** POST /api/platform/layouts — tạo kèm dataId + framework (chỉ lúc tạo). */
export function createLayout(input: LayoutCreateDto) {
  return apiRequest<LayoutDto>('/api/platform/layouts', { method: 'POST', body: input });
}

/** PUT /api/platform/layouts/{id} — KHÔNG gửi dataId/framework (không có trong UpdateDto). */
export function updateLayout(id: string, input: LayoutUpdateDto) {
  return apiRequest<LayoutDto>(`/api/platform/layouts/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/platform/layouts/{id} */
export function deleteLayout(id: string) {
  return apiRequest<void>(`/api/platform/layouts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

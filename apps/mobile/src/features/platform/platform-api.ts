import { apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import type {
  DataCreateDto,
  DataDto,
  DataGetListInput,
  DataItemCreateDto,
  DataItemUpdateDto,
  DataMoveDto,
  DataUpdateDto,
  EmailMessageDto,
  EmailMessageGetListInput,
  LayoutCreateDto,
  LayoutDto,
  LayoutGetListInput,
  LayoutUpdateDto,
  MenuCreateDto,
  MenuDto,
  MenuGetAllInput,
  MenuUpdateDto,
  SmsMessageDto,
  SmsMessageGetListInput,
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

/* ---------------- Menu: /api/platform/menus ---------------- */

/** GET /api/platform/menus/all — bảng web dùng route này rồi dựng cây theo parentId. */
export function getMenusAll(input: MenuGetAllInput = {}) {
  return apiRequest<ListResult<MenuDto>>('/api/platform/menus/all', {
    method: 'GET',
    params: {
      framework: input.framework,
      filter: input.filter,
      layoutId: input.layoutId,
      parentId: input.parentId,
    },
  });
}

/** GET /api/platform/menus/{id} */
export function getMenu(id: string) {
  return apiRequest<MenuDto>(`/api/platform/menus/${encodeURIComponent(id)}`, { method: 'GET' });
}

/** POST /api/platform/menus — tạo kèm layoutId bắt buộc (chỉ lúc tạo). */
export function createMenu(input: MenuCreateDto) {
  return apiRequest<MenuDto>('/api/platform/menus', { method: 'POST', body: input });
}

/** PUT /api/platform/menus/{id} — KHÔNG gửi layoutId (không có trong UpdateDto). */
export function updateMenu(id: string, input: MenuUpdateDto) {
  return apiRequest<MenuDto>(`/api/platform/menus/${encodeURIComponent(id)}`, { method: 'PUT', body: input });
}

/** DELETE /api/platform/menus/{id} */
export function deleteMenu(id: string) {
  return apiRequest<void>(`/api/platform/menus/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/* ---------------- Tin nhắn Email: /api/platform/messages/email ---------------- */

/** GET /api/platform/messages/email — phân trang ABP, lọc filter/status/emailAddress/khoảng thời gian gửi. */
export function getEmailMessagesPaged(input: EmailMessageGetListInput = {}) {
  return apiRequest<PagedResult<EmailMessageDto>>('/api/platform/messages/email', {
    method: 'GET',
    params: {
      filter: input.filter,
      emailAddress: input.emailAddress,
      content: input.content,
      from: input.from,
      subject: input.subject,
      status: input.status,
      beginSendTime: input.beginSendTime,
      endSendTime: input.endSendTime,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/platform/messages/email/{id} — modal xem chi tiết chỉ đọc của web. */
export function getEmailMessage(id: string) {
  return apiRequest<EmailMessageDto>(`/api/platform/messages/email/${encodeURIComponent(id)}`, { method: 'GET' });
}

/** DELETE /api/platform/messages/email/{id} */
export function deleteEmailMessage(id: string) {
  return apiRequest<void>(`/api/platform/messages/email/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/** POST /api/platform/messages/email/{id}/send — gửi lại. */
export function sendEmailMessage(id: string) {
  return apiRequest<void>(`/api/platform/messages/email/${encodeURIComponent(id)}/send`, { method: 'POST' });
}

/* ---------------- Tin nhắn SMS: /api/platform/messages/sms ---------------- */

/** GET /api/platform/messages/sms — phân trang ABP, lọc filter/status/phoneNumber/khoảng thời gian gửi. */
export function getSmsMessagesPaged(input: SmsMessageGetListInput = {}) {
  return apiRequest<PagedResult<SmsMessageDto>>('/api/platform/messages/sms', {
    method: 'GET',
    params: {
      filter: input.filter,
      phoneNumber: input.phoneNumber,
      content: input.content,
      status: input.status,
      beginSendTime: input.beginSendTime,
      endSendTime: input.endSendTime,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** DELETE /api/platform/messages/sms/{id} */
export function deleteSmsMessage(id: string) {
  return apiRequest<void>(`/api/platform/messages/sms/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/** POST /api/platform/messages/sms/{id}/send — gửi lại. */
export function sendSmsMessage(id: string) {
  return apiRequest<void>(`/api/platform/messages/sms/${encodeURIComponent(id)}/send`, { method: 'POST' });
}

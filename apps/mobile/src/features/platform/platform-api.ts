import { apiRequest, type ListResult, type PagedResult } from '../../lib/api-client';
import type { RoleMenuInput, UserMenuInput } from './menu-allotment';
import type {
  UserFavoriteMenuCreateDto,
  UserFavoriteMenuDto,
  UserFavoriteMenuUpdateDto,
} from './menu-favorites';
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
  return apiRequest<LayoutDto>(`/api/platform/layouts/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
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
  return apiRequest<MenuDto>(`/api/platform/menus/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/platform/menus/{id} */
export function deleteMenu(id: string) {
  return apiRequest<void>(`/api/platform/menus/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/* ---------------- Phân bổ menu: by-user / by-role ---------------- */

/** GET /api/platform/menus/by-user/{userId}/{framework} — menu đã gán cho user. */
export function getUserMenus(userId: string, framework: string) {
  return apiRequest<ListResult<MenuDto>>(
    `/api/platform/menus/by-user/${encodeURIComponent(userId)}/${encodeURIComponent(framework)}`,
    { method: 'GET' },
  );
}

/** GET /api/platform/menus/by-role/{role}/{framework} — menu đã gán cho vai trò. */
export function getRoleMenus(role: string, framework: string) {
  return apiRequest<ListResult<MenuDto>>(
    `/api/platform/menus/by-role/${encodeURIComponent(role)}/${encodeURIComponent(framework)}`,
    { method: 'GET' },
  );
}

/** PUT /api/platform/menus/by-user — gán menu + startup cho user. */
export function setUserMenus(input: UserMenuInput) {
  return apiRequest<void>('/api/platform/menus/by-user', { method: 'PUT', body: input });
}

/** PUT /api/platform/menus/by-role — gán menu + startup cho vai trò. */
export function setRoleMenus(input: RoleMenuInput) {
  return apiRequest<void>('/api/platform/menus/by-role', { method: 'PUT', body: input });
}

/* ---------------- Menu yêu thích của tôi: /api/platform/menus/favorites ---------------- */

/**
 * GET /api/platform/menus/favorites/my-favorite-menus — list "của tôi"
 * (không cần userId; framework tùy chọn, trống = mọi framework).
 */
export function getMyFavoriteMenus(framework?: string) {
  return apiRequest<ListResult<UserFavoriteMenuDto>>(
    '/api/platform/menus/favorites/my-favorite-menus',
    { method: 'GET', params: { framework: framework || undefined } },
  );
}

/** POST .../my-favorite-menus — tạo (framework bắt buộc lúc tạo). */
export function createMyFavoriteMenu(input: UserFavoriteMenuCreateDto) {
  return apiRequest<UserFavoriteMenuDto>('/api/platform/menus/favorites/my-favorite-menus', {
    method: 'POST',
    body: input,
  });
}

/**
 * PUT .../my-favorite-menus — sửa alias/color/icon (menuId + stamp bắt buộc).
 * Chưa có UI gọi hàm này ở vòng 23: DTO trả về không mang concurrencyStamp
 * và web cũng không có UI sửa favorites — xem menu-favorites.ts.
 */
export function updateMyFavoriteMenu(input: UserFavoriteMenuUpdateDto) {
  return apiRequest<UserFavoriteMenuDto>('/api/platform/menus/favorites/my-favorite-menus', {
    method: 'PUT',
    body: input,
  });
}

/**
 * DELETE .../my-favorite-menus/{MenuId} — {MenuId} là id của MENU,
 * không phải id bản ghi favorite (service tìm bằng userId + menuId).
 */
export function deleteMyFavoriteMenu(menuId: string) {
  return apiRequest<void>(
    `/api/platform/menus/favorites/my-favorite-menus/${encodeURIComponent(menuId)}`,
    { method: 'DELETE' },
  );
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
  return apiRequest<EmailMessageDto>(`/api/platform/messages/email/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** DELETE /api/platform/messages/email/{id} */
export function deleteEmailMessage(id: string) {
  return apiRequest<void>(`/api/platform/messages/email/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/** POST /api/platform/messages/email/{id}/send — gửi lại. */
export function sendEmailMessage(id: string) {
  return apiRequest<void>(`/api/platform/messages/email/${encodeURIComponent(id)}/send`, {
    method: 'POST',
  });
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
  return apiRequest<void>(`/api/platform/messages/sms/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/** POST /api/platform/messages/sms/{id}/send — gửi lại. */
export function sendSmsMessage(id: string) {
  return apiRequest<void>(`/api/platform/messages/sms/${encodeURIComponent(id)}/send`, {
    method: 'POST',
  });
}

import type { ListResultDto, PagedResultDto } from "#/abp-core";

import type {
	GetTenantPagedListInput,
	TenantConnectionStringCheckInput,
	TenantConnectionStringDto,
	TenantConnectionStringSetInput,
	TenantCreateDto,
	TenantDto,
	TenantUpdateDto,
} from "#/saas/tenants";

import requestClient from "../request";

/**
 * Tạo tenant
 * @param {TenantCreateDto} input Tham số
 * @returns Tenant đã tạo
 */
export function createApi(input: TenantCreateDto): Promise<TenantDto> {
	return requestClient.post<TenantDto>("/api/saas/tenants", input);
}

/**
 * Chỉnh sửa tenant
 * @param {string} id Tham số
 * @param {TenantUpdateDto} input Tham số
 * @returns Tenant đã chỉnh sửa
 */
export function updateApi(id: string, input: TenantUpdateDto): Promise<TenantDto> {
	return requestClient.put<TenantDto>(`/api/saas/tenants/${id}`, input);
}

/**
 * Truy vấn tenant
 * @param {string} id Id
 * @returns Tenant truy vấn được
 */
export function getApi(id: string): Promise<TenantDto> {
	return requestClient.get<TenantDto>(`/api/saas/tenants/${id}`);
}

/**
 * Xóa tenant
 * @param {string} id Id
 * @returns {void}
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/saas/tenants/${id}`);
}

/**
 * Truy vấn danh sách phân trang tenant
 * @param {GetTenantPagedListInput} input Tham số
 * @returns {void}
 */
export function getPagedListApi(input?: GetTenantPagedListInput): Promise<PagedResultDto<TenantDto>> {
	return requestClient.get<PagedResultDto<TenantDto>>("/api/saas/tenants", {
		params: input,
	});
}

/**
 * Đặt chuỗi kết nối
 * @param {string} id Id tenant
 * @param {TenantConnectionStringSetInput} input Tham số
 * @returns Chuỗi kết nối
 */
export function setConnectionStringApi(
	id: string,
	input: TenantConnectionStringSetInput,
): Promise<TenantConnectionStringDto> {
	return requestClient.put<TenantConnectionStringDto>(`/api/saas/tenants/${id}/connection-string`, input);
}

/**
 * Truy vấn chuỗi kết nối
 * @param {string} id Id tenant
 * @param {string} name Tên chuỗi kết nối
 * @returns Chuỗi kết nối
 */
export function getConnectionStringApi(id: string, name: string): Promise<TenantConnectionStringDto> {
	return requestClient.get<TenantConnectionStringDto>(`/api/saas/tenants/${id}/connection-string/${name}`);
}

/**
 * Truy vấn tất cả chuỗi kết nối
 * @param {string} id Id tenant
 * @returns Danh sách chuỗi kết nối
 */
export function getConnectionStringsApi(id: string): Promise<ListResultDto<TenantConnectionStringDto>> {
	return requestClient.get<ListResultDto<TenantConnectionStringDto>>(`/api/saas/tenants/${id}/connection-string`);
}

/**
 * Xóa tenant
 * @param {string} id Id tenant
 * @param {string} name Tên chuỗi kết nối
 * @returns {void}
 */
export function deleteConnectionStringApi(id: string, name: string): Promise<void> {
	return requestClient.delete(`/api/saas/tenants/${id}/connection-string/${name}`);
}

/**
 * Kiểm tra chuỗi kết nối cơ sở dữ liệu
 * @param input Tham số
 */
export function checkConnectionString(input: TenantConnectionStringCheckInput): Promise<void> {
	return requestClient.post("/api/saas/tenants/connection-string/check", input);
}

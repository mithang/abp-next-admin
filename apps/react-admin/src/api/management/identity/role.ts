import type { PagedResultDto, ListResultDto } from "#/abp-core";

import type {
	IdentityClaimCreateDto,
	IdentityClaimDeleteDto,
	IdentityClaimDto,
	IdentityClaimUpdateDto,
} from "#/management/identity/claims";

import type {
	GetRolePagedListInput,
	IdentityRoleCreateDto,
	IdentityRoleDto,
	IdentityRoleUpdateDto,
} from "#/management/identity";

import requestClient from "../../request";

/**
 * Thêm mới vai trò
 * @param input Tham số
 * @returns Đối tượng truyền dữ liệu thực thể vai trò
 */
export function createApi(input: IdentityRoleCreateDto): Promise<IdentityRoleDto> {
	return requestClient.post<IdentityRoleDto>("/api/identity/roles", input);
}

/**
 * Xóa vai trò
 * @param id Id vai trò
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/identity/roles/${id}`);
}

/**
 * Truy vấn vai trò
 * @param id Id vai trò
 * @returns Đối tượng truyền dữ liệu thực thể vai trò
 */
export function getApi(id: string): Promise<IdentityRoleDto> {
	return requestClient.get<IdentityRoleDto>(`/api/identity/roles/${id}`);
}

/**
 * Cập nhật vai trò
 * @param id Id vai trò
 * @returns Đối tượng truyền dữ liệu thực thể vai trò
 */
export function updateApi(id: string, input: IdentityRoleUpdateDto): Promise<IdentityRoleDto> {
	return requestClient.put<IdentityRoleDto>(`/api/identity/roles/${id}`, input);
}

/**
 * Truy vấn danh sách phân trang vai trò
 * @param input Tham số lọc
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể vai trò
 */
export function getPagedListApi(input?: GetRolePagedListInput): Promise<PagedResultDto<IdentityRoleDto>> {
	return requestClient.get<PagedResultDto<IdentityRoleDto>>("/api/identity/roles", {
		params: input,
	});
}

/**
 * Xóa vai trò khỏi tổ chức
 * @param id Id vai trò
 * @param ouId Id tổ chức
 */
export function removeOrganizationUnitApi(id: string, ouId: string): Promise<void> {
	return requestClient.delete(`/api/identity/roles/${id}/organization-units/${ouId}`);
}

/**
 * Lấy danh sách claim của vai trò
 * @param id Id vai trò
 */
export function getClaimsApi(id: string): Promise<ListResultDto<IdentityClaimDto>> {
	return requestClient.get<ListResultDto<IdentityClaimDto>>(`/api/identity/roles/${id}/claims`);
}

/**
 * Xóa claim của vai trò
 * @param id Id vai trò
 * @param input DTO claim của vai trò
 */
export function deleteClaimApi(id: string, input: IdentityClaimDeleteDto): Promise<void> {
	return requestClient.delete(`/api/identity/roles/${id}/claims`, {
		params: input,
	});
}

/**
 * Tạo claim của vai trò
 * @param id Id vai trò
 * @param input DTO claim của vai trò
 */
export function createClaimApi(id: string, input: IdentityClaimCreateDto): Promise<void> {
	return requestClient.post(`/api/identity/roles/${id}/claims`, input);
}

/**
 * Cập nhật claim của vai trò
 * @param id Id vai trò
 * @param input DTO vai trò của người dùng
 */
export function updateClaimApi(id: string, input: IdentityClaimUpdateDto): Promise<void> {
	return requestClient.put(`/api/identity/roles/${id}/claims`, input);
}

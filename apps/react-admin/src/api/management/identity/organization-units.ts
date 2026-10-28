import type { ListResultDto, PagedResultDto } from "#/abp-core";

import type { IdentityRoleDto, IdentityUserDto } from "#/management/identity";
import type {
	GetIdentityRolesInput,
	GetIdentityUsersInput,
	GetOrganizationUnitPagedListInput,
	GetUnaddedRoleListInput,
	GetUnaddedUserListInput,
	OrganizationUnitAddRoleDto,
	OrganizationUnitAddUserDto,
	OrganizationUnitCreateDto,
	OrganizationUnitDto,
	OrganizationUnitGetChildrenDto,
	OrganizationUnitUpdateDto,
} from "#/management/identity/organization-units";

import requestClient from "../../request";

/**
 * Thêm mới tổ chức
 * @param input Tham số
 * @returns Đối tượng truyền dữ liệu thực thể tổ chức
 */
export function createApi(input: OrganizationUnitCreateDto): Promise<OrganizationUnitDto> {
	return requestClient.post<OrganizationUnitDto>("/api/identity/organization-units", input);
}

/**
 * Xóa tổ chức
 * @param id Id tổ chức
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/identity/organization-units/${id}`);
}

/**
 * Truy vấn tổ chức
 * @param id Id tổ chức
 * @returns Đối tượng truyền dữ liệu thực thể tổ chức
 */
export function getApi(id: string): Promise<OrganizationUnitDto> {
	return requestClient.get<OrganizationUnitDto>(`/api/identity/organization-units/${id}`);
}

/**
 * Cập nhật tổ chức
 * @param id Id tổ chức
 * @returns Đối tượng truyền dữ liệu thực thể tổ chức
 */

export function updateApi(id: string, input: OrganizationUnitUpdateDto): Promise<OrganizationUnitDto> {
	return requestClient.put<OrganizationUnitDto>(`/api/identity/organization-units/${id}`, input);
}

/**
 * Truy vấn danh sách phân trang tổ chức
 * @param input Tham số lọc
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể tổ chức
 */
export function getPagedListApi(
	input?: GetOrganizationUnitPagedListInput,
): Promise<PagedResultDto<OrganizationUnitDto>> {
	return requestClient.get<PagedResultDto<OrganizationUnitDto>>("/api/identity/organization-units", {
		params: input,
	});
}

/**
 * Truy vấn danh sách tổ chức gốc
 * @returns Danh sách đối tượng truyền dữ liệu thực thể tổ chức
 */
export function getRootListApi(): Promise<ListResultDto<OrganizationUnitDto>> {
	return requestClient.get<ListResultDto<OrganizationUnitDto>>("/api/identity/organization-units/root-node");
}

/**
 * Truy vấn danh sách tổ chức
 * @returns Danh sách đối tượng truyền dữ liệu thực thể tổ chức
 */
export function getAllListApi(): Promise<ListResultDto<OrganizationUnitDto>> {
	return requestClient.get<ListResultDto<OrganizationUnitDto>>("/api/identity/organization-units/all");
}

/**
 * Truy vấn danh sách tổ chức cấp dưới
 * @param input Tham số truy vấn
 * @returns Danh sách đối tượng truyền dữ liệu thực thể tổ chức
 */
export function getChildrenApi(input: OrganizationUnitGetChildrenDto): Promise<ListResultDto<OrganizationUnitDto>> {
	return requestClient.get<ListResultDto<OrganizationUnitDto>>("/api/identity/organization-units/find-children", {
		params: input,
	});
}

/**
 * Truy vấn danh sách người dùng của tổ chức
 * @param id Id tổ chức
 * @param input Tham số lọc truy vấn
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể người dùng
 */
export function getUserListApi(id: string, input?: GetIdentityUsersInput): Promise<PagedResultDto<IdentityUserDto>> {
	return requestClient.get<PagedResultDto<IdentityUserDto>>(`/api/identity/organization-units/${id}/users`, {
		params: input,
	});
}

/**
 * Truy vấn danh sách người dùng chưa tham gia tổ chức
 * @param input Tham số lọc truy vấn
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể người dùng
 */
export function getUnaddedUserListApi(input: GetUnaddedUserListInput): Promise<PagedResultDto<IdentityUserDto>> {
	return requestClient.get<PagedResultDto<IdentityUserDto>>(
		`/api/identity/organization-units/${input.id}/unadded-users`,
		{
			params: input,
		},
	);
}

/**
 * Thêm người dùng vào tổ chức
 * @param id Id tổ chức
 * @param input Danh sách id người dùng
 */
export function addMembers(id: string, input: OrganizationUnitAddUserDto): Promise<void> {
	return requestClient.post(`/api/identity/organization-units/${id}/users`, input);
}

/**
 * Truy vấn danh sách vai trò của tổ chức
 * @param id Id tổ chức
 * @param input Tham số lọc truy vấn
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể vai trò
 */
export function getRoleListApi(id: string, input?: GetIdentityRolesInput): Promise<PagedResultDto<IdentityRoleDto>> {
	return requestClient.get<PagedResultDto<IdentityRoleDto>>(`/api/identity/organization-units/${id}/roles`, {
		params: input,
	});
}

/**
 * Truy vấn danh sách vai trò chưa tham gia tổ chức
 * @param input Tham số lọc truy vấn
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể vai trò
 */
export function getUnaddedRoleListApi(input: GetUnaddedRoleListInput): Promise<PagedResultDto<IdentityRoleDto>> {
	return requestClient.get<PagedResultDto<IdentityRoleDto>>(
		`/api/identity/organization-units/${input.id}/unadded-roles`,
		{
			params: input,
		},
	);
}

/**
 * Thêm vai trò vào tổ chức
 * @param id Id tổ chức
 * @param input Danh sách id vai trò
 */
export function addRoles(id: string, input: OrganizationUnitAddRoleDto): Promise<void> {
	return requestClient.post(`/api/identity/organization-units/${id}/roles`, input);
}

/**
 * Di chuyển tổ chức
 * @param id Id tổ chức
 * @param parentId Id tổ chức cấp trên
 */
export function moveTo(id: string, parentId?: string): Promise<void> {
	return requestClient.put(`api/identity/organization-units/${id}/move`, { parentId });
}

import type { ListResultDto, PagedResultDto } from "#/abp-core";
import type { IdentityRoleDto, OrganizationUnitDto } from "#/management/identity";
import type {
	IdentityClaimCreateDto,
	IdentityClaimDeleteDto,
	IdentityClaimDto,
	IdentityClaimUpdateDto,
} from "#/management/identity/claims";
import type {
	ChangeUserPasswordInput,
	GetUserPagedListInput,
	IdentityUserCreateDto,
	IdentityUserDto,
	IdentityUserUpdateDto,
} from "#/management/identity";
import requestClient from "../../request";

/**
 * Thêm người dùng mới
 * @param input tham số
 * @returns đối tượng truyền dữ liệu thực thể người dùng
 */
export function createApi(input: IdentityUserCreateDto): Promise<IdentityUserDto> {
	return requestClient.post<IdentityUserDto>("/api/identity/users", input);
}

/**
 * Xóa người dùng
 * @param id id người dùng
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/identity/users/${id}`);
}

/**
 * Truy vấn người dùng
 * @param id id người dùng
 * @returns đối tượng truyền dữ liệu thực thể người dùng
 */
export function getApi(id: string): Promise<IdentityUserDto> {
	return requestClient.get<IdentityUserDto>(`/api/identity/users/${id}`);
}

/**
 * Cập nhật người dùng
 * @param id id người dùng
 * @returns đối tượng truyền dữ liệu thực thể người dùng
 */
export function updateApi(id: string, input: IdentityUserUpdateDto): Promise<IdentityUserDto> {
	return requestClient.put<IdentityUserDto>(`/api/identity/users/${id}`, input);
}

/**
 * Truy vấn danh sách phân trang người dùng
 * @param input tham số lọc
 * @returns danh sách phân trang đối tượng truyền dữ liệu thực thể người dùng
 */
export function getPagedListApi(input?: GetUserPagedListInput): Promise<PagedResultDto<IdentityUserDto>> {
	return requestClient.get<PagedResultDto<IdentityUserDto>>("/api/identity/users", {
		params: input,
	});
}

/**
 * Xóa người dùng khỏi tổ chức
 * @param id id người dùng
 * @param ouId id tổ chức
 */
export function removeOrganizationUnitApi(id: string, ouId: string): Promise<void> {
	return requestClient.delete(`/api/identity/users/${id}/organization-units/${ouId}`);
}

/**
 * Lấy danh sách tổ chức của người dùng
 * @param id id người dùng
 */
export function getOrganizationUnitsApi(id: string): Promise<ListResultDto<OrganizationUnitDto>> {
	return requestClient.get<ListResultDto<OrganizationUnitDto>>(`/api/identity/users/${id}/organization-units`);
}

/**
 * Khóa người dùng
 * @param id id người dùng
 * @param seconds thời gian khóa(giây)
 */
export function lockApi(id: string, seconds: number): Promise<void> {
	return requestClient.put(`/api/identity/users/${id}/lock/${seconds}`);
}

/**
 * Mở khóa người dùng
 * @param id id người dùng
 */
export function unLockApi(id: string): Promise<void> {
	return requestClient.put(`/api/identity/users/${id}/unlock`);
}

/**
 * Đổi mật khẩu người dùng
 * @param id id người dùng
 * @param input dto thay đổi mật khẩu
 */
export function changePasswordApi(id: string, input: ChangeUserPasswordInput): Promise<void> {
	return requestClient.put(`/api/identity/users/change-password?id=${id}`, input);
}

/**
 * Lấy danh sách vai trò khả dụng
 */
export function getAssignableRolesApi(): Promise<ListResultDto<IdentityRoleDto>> {
	return requestClient.get<ListResultDto<IdentityRoleDto>>("/api/identity/users/assignable-roles");
}

/**
 * Lấy danh sách vai trò của người dùng
 * @param id id người dùng
 */
export function getRolesApi(id: string): Promise<ListResultDto<IdentityRoleDto>> {
	return requestClient.get<ListResultDto<IdentityRoleDto>>(`/api/identity/users/${id}/roles`);
}

/**
 * Lấy danh sách claim của người dùng
 * @param id id người dùng
 */
export function getClaimsApi(id: string): Promise<ListResultDto<IdentityClaimDto>> {
	return requestClient.get<ListResultDto<IdentityClaimDto>>(`/api/identity/users/${id}/claims`);
}

/**
 * Xóa claim của người dùng
 * @param id id người dùng
 * @param input dto claim người dùng
 */
export function deleteClaimApi(id: string, input: IdentityClaimDeleteDto): Promise<void> {
	return requestClient.delete(`/api/identity/users/${id}/claims`, { params: input });
}

/**
 * Tạo claim của người dùng
 * @param id id người dùng
 * @param input dto claim người dùng
 */
export function createClaimApi(id: string, input: IdentityClaimCreateDto): Promise<void> {
	return requestClient.post(`/api/identity/users/${id}/claims`, input);
}

/**
 * Cập nhật claim của người dùng
 * @param id id người dùng
 * @param input dto claim người dùng
 */
export function updateClaimApi(id: string, input: IdentityClaimUpdateDto): Promise<void> {
	return requestClient.put(`/api/identity/users/${id}/claims`, input);
}

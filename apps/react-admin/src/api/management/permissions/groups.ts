import type { ListResultDto } from "#/abp-core";

import type {
	PermissionGroupDefinitionCreateDto,
	PermissionGroupDefinitionDto,
	PermissionGroupDefinitionGetListInput,
	PermissionGroupDefinitionUpdateDto,
} from "#/management/permissions/groups";

import requestClient from "../../request";

/**
 * Xóa định nghĩa quyền
 * @param name Tên quyền
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/permission-management/definitions/groups/${name}`);
}

/**
 * Truy vấn định nghĩa quyền
 * @param name Tên quyền
 * @returns Đối tượng truyền dữ liệu định nghĩa quyền
 */
export function getApi(name: string): Promise<PermissionGroupDefinitionDto> {
	return requestClient.get<PermissionGroupDefinitionDto>(`/api/permission-management/definitions/groups/${name}`);
}

/**
 * Truy vấn danh sách định nghĩa quyền
 * @param input Điều kiện lọc quyền
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa quyền
 */
export function getListApi(
	input?: PermissionGroupDefinitionGetListInput,
): Promise<ListResultDto<PermissionGroupDefinitionDto>> {
	return requestClient.get<ListResultDto<PermissionGroupDefinitionDto>>(
		"/api/permission-management/definitions/groups",
		{
			params: input,
		},
	);
}

/**
 * Tạo định nghĩa quyền
 * @param input Tham số định nghĩa quyền
 * @returns Đối tượng truyền dữ liệu định nghĩa quyền
 */
export function createApi(input: PermissionGroupDefinitionCreateDto): Promise<PermissionGroupDefinitionDto> {
	return requestClient.post<PermissionGroupDefinitionDto>("/api/permission-management/definitions/groups", input);
}

/**
 * Cập nhật định nghĩa quyền
 * @param name Tên quyền
 * @param input Tham số định nghĩa quyền
 * @returns Đối tượng truyền dữ liệu định nghĩa quyền
 */
export function updateApi(
	name: string,
	input: PermissionGroupDefinitionUpdateDto,
): Promise<PermissionGroupDefinitionDto> {
	return requestClient.put<PermissionGroupDefinitionDto>(
		`/api/permission-management/definitions/groups/${name}`,
		input,
	);
}

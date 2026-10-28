import type { ListResultDto } from "#/abp-core";

import type {
	PermissionDefinitionCreateDto,
	PermissionDefinitionDto,
	PermissionDefinitionGetListInput,
	PermissionDefinitionUpdateDto,
} from "#/management/permissions/definitions";

import requestClient from "../../request";

/**
 * Xóa định nghĩa quyền
 * @param name Tên quyền
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/permission-management/definitions/${name}`);
}

/**
 * Truy vấn định nghĩa quyền
 * @param name Tên quyền
 * @returns Đối tượng truyền dữ liệu định nghĩa quyền
 */
export function getApi(name: string): Promise<PermissionDefinitionDto> {
	return requestClient.get<PermissionDefinitionDto>(`/api/permission-management/definitions/${name}`);
}

/**
 * Truy vấn danh sách định nghĩa quyền
 * @param input Điều kiện lọc quyền
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa quyền
 */
export function getListApi(input?: PermissionDefinitionGetListInput): Promise<ListResultDto<PermissionDefinitionDto>> {
	return requestClient.get<ListResultDto<PermissionDefinitionDto>>("/api/permission-management/definitions", {
		params: input,
	});
}

/**
 * Tạo định nghĩa quyền
 * @param input Tham số định nghĩa quyền
 * @returns Đối tượng truyền dữ liệu định nghĩa quyền
 */
export function createApi(input: PermissionDefinitionCreateDto): Promise<PermissionDefinitionDto> {
	return requestClient.post<PermissionDefinitionDto>("/api/permission-management/definitions", input);
}

/**
 * Cập nhật định nghĩa quyền
 * @param name Tên quyền
 * @param input Tham số định nghĩa quyền
 * @returns Đối tượng truyền dữ liệu định nghĩa quyền
 */
export function updateApi(name: string, input: PermissionDefinitionUpdateDto): Promise<PermissionDefinitionDto> {
	return requestClient.put<PermissionDefinitionDto>(`/api/permission-management/definitions/${name}`, input);
}

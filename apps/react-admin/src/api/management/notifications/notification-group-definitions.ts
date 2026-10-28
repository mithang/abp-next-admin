import type { ListResultDto } from "#/abp-core";

import type {
	NotificationGroupDefinitionCreateDto,
	NotificationGroupDefinitionDto,
	NotificationGroupDefinitionGetListInput,
	NotificationGroupDefinitionUpdateDto,
} from "#/notifications/groups";

import requestClient from "../../request";

/**
 * Xóa định nghĩa nhóm thông báo
 * @param name Tên nhóm thông báo
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/notifications/definitions/groups/${name}`);
}

/**
 * Truy vấn định nghĩa nhóm thông báo
 * @param name Tên nhóm thông báo
 * @returns Đối tượng truyền dữ liệu định nghĩa nhóm thông báo
 */
export function getApi(name: string): Promise<NotificationGroupDefinitionDto> {
	return requestClient.get<NotificationGroupDefinitionDto>(`/api/notifications/definitions/groups/${name}`);
}

/**
 * Truy vấn danh sách định nghĩa nhóm thông báo
 * @param input Điều kiện lọc nhóm thông báo
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa nhóm thông báo
 */
export function getListApi(
	input?: NotificationGroupDefinitionGetListInput,
): Promise<ListResultDto<NotificationGroupDefinitionDto>> {
	return requestClient.get<ListResultDto<NotificationGroupDefinitionDto>>("/api/notifications/definitions/groups", {
		params: input,
	});
}

/**
 * Tạo định nghĩa nhóm thông báo
 * @param input Tham số định nghĩa nhóm thông báo
 * @returns Đối tượng truyền dữ liệu định nghĩa nhóm thông báo
 */
export function createApi(input: NotificationGroupDefinitionCreateDto): Promise<NotificationGroupDefinitionDto> {
	return requestClient.post<NotificationGroupDefinitionDto>("/api/notifications/definitions/groups", input);
}

/**
 * Cập nhật định nghĩa nhóm thông báo
 * @param name Tên nhóm thông báo
 * @param input Tham số định nghĩa nhóm thông báo
 * @returns Đối tượng truyền dữ liệu định nghĩa nhóm thông báo
 */
export function updateApi(
	name: string,
	input: NotificationGroupDefinitionUpdateDto,
): Promise<NotificationGroupDefinitionDto> {
	return requestClient.put<NotificationGroupDefinitionDto>(`/api/notifications/definitions/groups/${name}`, input);
}

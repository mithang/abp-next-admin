import type { ListResultDto } from "#/abp-core";

import type {
	NotificationDefinitionCreateDto,
	NotificationDefinitionDto,
	NotificationDefinitionGetListInput,
	NotificationDefinitionUpdateDto,
} from "#/notifications/definitions";

import requestClient from "../../request";

/**
 * Xóa định nghĩa thông báo
 * @param name Tên thông báo
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/notifications/definitions/notifications/${name}`);
}

/**
 * Truy vấn định nghĩa thông báo
 * @param name Tên thông báo
 * @returns Đối tượng truyền dữ liệu định nghĩa thông báo
 */
export function getApi(name: string): Promise<NotificationDefinitionDto> {
	return requestClient.get<NotificationDefinitionDto>(`/api/notifications/definitions/notifications/${name}`);
}

/**
 * Truy vấn danh sách định nghĩa thông báo
 * @param input Điều kiện lọc thông báo
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa thông báo
 */
export function getListApi(
	input?: NotificationDefinitionGetListInput,
): Promise<ListResultDto<NotificationDefinitionDto>> {
	return requestClient.get<ListResultDto<NotificationDefinitionDto>>("/api/notifications/definitions/notifications", {
		params: input,
	});
}

/**
 * Tạo định nghĩa thông báo
 * @param input Tham số định nghĩa thông báo
 * @returns Đối tượng truyền dữ liệu định nghĩa thông báo
 */
export function createApi(input: NotificationDefinitionCreateDto): Promise<NotificationDefinitionDto> {
	return requestClient.post<NotificationDefinitionDto>("/api/notifications/definitions/notifications", input);
}

/**
 * Cập nhật định nghĩa thông báo
 * @param name Tên thông báo
 * @param input Tham số định nghĩa thông báo
 * @returns Đối tượng truyền dữ liệu định nghĩa thông báo
 */
export function updateApi(name: string, input: NotificationDefinitionUpdateDto): Promise<NotificationDefinitionDto> {
	return requestClient.put<NotificationDefinitionDto>(`/api/notifications/definitions/notifications/${name}`, input);
}

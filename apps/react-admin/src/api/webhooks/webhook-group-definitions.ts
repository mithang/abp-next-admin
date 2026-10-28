import type { ListResultDto } from "#/abp-core";

import type {
	WebhookGroupDefinitionCreateDto,
	WebhookGroupDefinitionDto,
	WebhookGroupDefinitionGetListInput,
	WebhookGroupDefinitionUpdateDto,
} from "#/webhooks/groups";

import requestClient from "../request";

/**
 * Xóa định nghĩa nhóm Webhook
 * @param name Tên nhóm Webhook
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/webhooks/definitions/groups/${name}`);
}

/**
 * Truy vấn định nghĩa nhóm Webhook
 * @param name Tên nhóm Webhook
 * @returns Đối tượng truyền dữ liệu định nghĩa nhóm Webhook
 */
export function getApi(name: string): Promise<WebhookGroupDefinitionDto> {
	return requestClient.get<WebhookGroupDefinitionDto>(`/api/webhooks/definitions/groups/${name}`);
}

/**
 * Truy vấn danh sách định nghĩa nhóm Webhook
 * @param input Điều kiện lọc nhóm Webhook
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa nhóm Webhook
 */
export function getListApi(
	input?: WebhookGroupDefinitionGetListInput,
): Promise<ListResultDto<WebhookGroupDefinitionDto>> {
	return requestClient.get<ListResultDto<WebhookGroupDefinitionDto>>("/api/webhooks/definitions/groups", {
		params: input,
	});
}

/**
 * Tạo định nghĩa nhóm Webhook
 * @param input Tham số định nghĩa nhóm Webhook
 * @returns Đối tượng truyền dữ liệu định nghĩa nhóm Webhook
 */
export function createApi(input: WebhookGroupDefinitionCreateDto): Promise<WebhookGroupDefinitionDto> {
	return requestClient.post<WebhookGroupDefinitionDto>("/api/webhooks/definitions/groups", input);
}

/**
 * Cập nhật định nghĩa nhóm Webhook
 * @param name Tên nhóm Webhook
 * @param input Tham số định nghĩa nhóm Webhook
 * @returns Đối tượng truyền dữ liệu định nghĩa nhóm Webhook
 */
export function updateApi(name: string, input: WebhookGroupDefinitionUpdateDto): Promise<WebhookGroupDefinitionDto> {
	return requestClient.put<WebhookGroupDefinitionDto>(`/api/webhooks/definitions/groups/${name}`, input);
}

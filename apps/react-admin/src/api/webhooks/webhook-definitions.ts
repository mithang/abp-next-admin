import type { ListResultDto } from "#/abp-core";

import type {
	WebhookDefinitionCreateDto,
	WebhookDefinitionDto,
	WebhookDefinitionGetListInput,
	WebhookDefinitionUpdateDto,
} from "#/webhooks/definitions";

import requestClient from "../request";

/**
 * Xóa định nghĩa Webhook
 * @param name Tên Webhook
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/webhooks/definitions/${name}`);
}

/**
 * Truy vấn định nghĩa Webhook
 * @param name Tên Webhook
 * @returns Đối tượng truyền dữ liệu định nghĩa Webhook
 */
export function getApi(name: string): Promise<WebhookDefinitionDto> {
	return requestClient.get<WebhookDefinitionDto>(`/api/webhooks/definitions/${name}`);
}

/**
 * Truy vấn danh sách định nghĩa Webhook
 * @param input Điều kiện lọc Webhook
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa Webhook
 */
export function getListApi(input?: WebhookDefinitionGetListInput): Promise<ListResultDto<WebhookDefinitionDto>> {
	return requestClient.get<ListResultDto<WebhookDefinitionDto>>("/api/webhooks/definitions", {
		params: input,
	});
}

/**
 * Tạo định nghĩa Webhook
 * @param input Tham số định nghĩa Webhook
 * @returns Đối tượng truyền dữ liệu định nghĩa Webhook
 */
export function createApi(input: WebhookDefinitionCreateDto): Promise<WebhookDefinitionDto> {
	return requestClient.post<WebhookDefinitionDto>("/api/webhooks/definitions", input);
}

/**
 * Cập nhật định nghĩa Webhook
 * @param name Tên Webhook
 * @param input Tham số định nghĩa Webhook
 * @returns Đối tượng truyền dữ liệu định nghĩa Webhook
 */
export function updateApi(name: string, input: WebhookDefinitionUpdateDto): Promise<WebhookDefinitionDto> {
	return requestClient.put<WebhookDefinitionDto>(`/api/webhooks/definitions/${name}`, input);
}

import type { ListResultDto, PagedResultDto } from "#/abp-core";

import type {
	WebhookAvailableGroupDto,
	WebhookSubscriptionCreateDto,
	WebhookSubscriptionDeleteManyInput,
	WebhookSubscriptionDto,
	WebhookSubscriptionGetListInput,
	WebhookSubscriptionUpdateDto,
} from "#/webhooks/subscriptions";

import requestClient from "../request";

/**
 * Tạo đăng ký
 * @param input Tham số
 * @returns Dto đăng ký
 */
export function createApi(input: WebhookSubscriptionCreateDto): Promise<WebhookSubscriptionDto> {
	return requestClient.post<WebhookSubscriptionDto>("/api/webhooks/subscriptions", input);
}

/**
 * Xóa đăng ký
 * @param id Id đăng ký
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/webhooks/subscriptions/${id}`);
}

/**
 * Xóa hàng loạt đăng ký
 * @param input Tham số
 */
export function bulkDeleteApi(input: WebhookSubscriptionDeleteManyInput): Promise<void> {
	return requestClient.delete("/api/webhooks/subscriptions/delete-many", {
		data: input,
	});
}

/**
 * Truy vấn danh sách tất cả nhóm Webhook khả dụng
 * @returns Danh sách nhóm Webhook
 */
export function getAllAvailableWebhooksApi(): Promise<ListResultDto<WebhookAvailableGroupDto>> {
	return requestClient.get<ListResultDto<WebhookAvailableGroupDto>>("/api/webhooks/subscriptions/availables");
}

/**
 * Truy vấn đăng ký
 * @param id Id đăng ký
 * @returns Dto đăng ký
 */
export function getApi(id: string): Promise<WebhookSubscriptionDto> {
	return requestClient.get<WebhookSubscriptionDto>(`/api/webhooks/subscriptions/${id}`);
}

/**
 * Truy vấn danh sách phân trang đăng ký
 * @param input Tham số lọc
 * @returns Danh sách Dto đăng ký
 */
export function getPagedListApi(
	input: WebhookSubscriptionGetListInput,
): Promise<PagedResultDto<WebhookSubscriptionDto>> {
	return requestClient.get<PagedResultDto<WebhookSubscriptionDto>>("/api/webhooks/subscriptions", {
		params: input,
	});
}

/**
 * Cập nhật đăng ký
 * @param id Id đăng ký
 * @param input Tham số cập nhật
 * @returns Dto đăng ký
 */
export function updateApi(id: string, input: WebhookSubscriptionUpdateDto): Promise<WebhookSubscriptionDto> {
	return requestClient.put<WebhookSubscriptionDto>(`/api/webhooks/subscriptions/${id}`, input);
}

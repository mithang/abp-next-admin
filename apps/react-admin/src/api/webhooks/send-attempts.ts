import type { PagedResultDto } from "#/abp-core";

import type {
	WebhookSendRecordDeleteManyInput,
	WebhookSendRecordDto,
	WebhookSendRecordGetListInput,
	WebhookSendRecordResendManyInput,
} from "#/webhooks/send-attempts";

import requestClient from "../request";

/**
 * Truy vấn bản ghi gửi
 * @param id Id bản ghi
 * @returns Dto bản ghi gửi
 */
export function getApi(id: string): Promise<WebhookSendRecordDto> {
	return requestClient.get<WebhookSendRecordDto>(`/api/webhooks/send-attempts/${id}`);
}

/**
 * Xóa bản ghi gửi
 * @param id Id bản ghi
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/webhooks/send-attempts/${id}`);
}

/**
 * Xóa hàng loạt bản ghi gửi
 * @param input Tham số
 */
export function bulkDeleteApi(input: WebhookSendRecordDeleteManyInput): Promise<void> {
	return requestClient.delete("/api/webhooks/send-attempts/delete-many", {
		data: input,
	});
}

/**
 * Truy vấn danh sách phân trang bản ghi gửi
 * @param input Tham số lọc
 * @returns Danh sách phân trang Dto bản ghi gửi
 */
export function getPagedListApi(input: WebhookSendRecordGetListInput): Promise<PagedResultDto<WebhookSendRecordDto>> {
	return requestClient.get<PagedResultDto<WebhookSendRecordDto>>("/api/webhooks/send-attempts", {
		params: input,
	});
}

/**
 * Gửi lại
 * @param id Id bản ghi
 */
export function reSendApi(id: string): Promise<void> {
	return requestClient.post(`/api/webhooks/send-attempts/${id}/resend`);
}

/**
 * Gửi lại hàng loạt
 * @param input Tham số
 */
export function bulkReSendApi(input: WebhookSendRecordResendManyInput): Promise<void> {
	return requestClient.post("/api/webhooks/send-attempts/resend-many", input);
}

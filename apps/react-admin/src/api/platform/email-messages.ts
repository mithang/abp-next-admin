import type { PagedResultDto } from "#/abp-core";

import type { EmailMessageDto, EmailMessageGetListInput } from "#/platform/messages";

import requestClient from "../request";

/**
 * Lấy danh sách phân trang tin nhắn email
 * @param {EmailMessageGetListInput} input Tham số
 * @returns {Promise<PagedResultDto<EmailMessageDto>>} Danh sách tin nhắn email
 */
export function getPagedListApi(input?: EmailMessageGetListInput): Promise<PagedResultDto<EmailMessageDto>> {
	return requestClient.get<PagedResultDto<EmailMessageDto>>("/api/platform/messages/email", {
		params: input,
	});
}

/**
 * Lấy tin nhắn email
 * @param id Id
 * @returns {EmailMessageDto} Tin nhắn email
 */
export function getApi(id: string): Promise<EmailMessageDto> {
	return requestClient.get<EmailMessageDto>(`/api/platform/messages/email/${id}`);
}

/**
 * Xóa tin nhắn email
 * @param id Id
 * @returns {void}
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/platform/messages/email/${id}`);
}

/**
 * Gửi tin nhắn email
 * @param id Id
 * @returns {void}
 */
export function sendApi(id: string): Promise<void> {
	return requestClient.post(`/api/platform/messages/email/${id}/send`);
}

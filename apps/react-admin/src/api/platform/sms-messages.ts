import type { PagedResultDto } from "#/abp-core";

import type { SmsMessageDto, SmsMessageGetListInput } from "#/platform/messages";

import requestClient from "../request";

/**
 * Lấy danh sách phân trang tin nhắn SMS
 * @param {EmailMessageGetListInput} input Tham số
 * @returns {Promise<PagedResultDto<EmailMessageDto>>} Danh sách tin nhắn SMS
 */
export function getPagedListApi(input?: SmsMessageGetListInput): Promise<PagedResultDto<SmsMessageDto>> {
	return requestClient.get<PagedResultDto<SmsMessageDto>>("/api/platform/messages/sms", {
		params: input,
	});
}

/**
 * Lấy tin nhắn SMS
 * @param id Id
 * @returns {SmsMessageDto} Tin nhắn SMS
 */
export function getApi(id: string): Promise<SmsMessageDto> {
	return requestClient.get<SmsMessageDto>(`/api/platform/messages/sms/${id}`);
}

/**
 * Xóa tin nhắn SMS
 * @param id Id
 * @returns {void}
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/platform/messages/sms/${id}`);
}

/**
 * Gửi tin nhắn SMS
 * @param id Id
 * @returns {void}
 */
export function sendApi(id: string): Promise<void> {
	return requestClient.post(`/api/platform/messages/sms/${id}/send`);
}

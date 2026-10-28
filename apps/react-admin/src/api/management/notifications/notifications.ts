import type { ListResultDto } from "#/abp-core";

import type {
	NotificationGroupDto,
	NotificationProviderDto,
	NotificationTemplateDto,
} from "#/notifications/definitions";
import type { NotificationSendInput, NotificationTemplateSendInput } from "#/notifications/notifications";

import requestClient from "@/api/request";

/**
 * Lấy danh sách nhà cung cấp thông báo khả dụng
 * @returns {Promise<ListResultDto<NotificationProviderDto>>} Danh sách nhà cung cấp thông báo khả dụng
 */
export function getAssignableProvidersApi(): Promise<ListResultDto<NotificationProviderDto>> {
	return requestClient.get<ListResultDto<NotificationProviderDto>>("/api/notifications/assignable-providers");
}

/**
 * Lấy danh sách thông báo khả dụng
 * @returns {Promise<ListResultDto<NotificationGroupDto>>} Danh sách thông báo khả dụng
 */
export function getAssignableNotifiersApi(): Promise<ListResultDto<NotificationGroupDto>> {
	return requestClient.get<ListResultDto<NotificationGroupDto>>("/api/notifications/assignables");
}
/**
 * Lấy danh sách mẫu thông báo khả dụng
 * @returns {Promise<ListResultDto<NotificationTemplateDto>>} Danh sách mẫu thông báo khả dụng
 */
export function getAssignableTemplatesApi(): Promise<ListResultDto<NotificationTemplateDto>> {
	return requestClient.get<ListResultDto<NotificationTemplateDto>>("/api/notifications/assignable-templates", {
		method: "GET",
	});
}
/**
 * Gửi thông báo
 * @param input Tham số
 * @returns {Promise<void>}
 */
export function sendNotiferApi(input: NotificationSendInput): Promise<void> {
	return requestClient.post("/api/notifications/send", input);
}
/**
 * Gửi thông báo mẫu
 * @param input Tham số
 * @returns {Promise<void>}
 */
export function sendTemplateNotiferApi(input: NotificationTemplateSendInput): Promise<void> {
	return requestClient.post("/api/notifications/send/template", input);
}

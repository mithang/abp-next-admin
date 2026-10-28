import type { PagedResultDto } from "#/abp-core";

import type {
	GetMyNotifilerPagedListInput,
	MarkReadStateInput,
	UserNotificationDto,
} from "#/notifications/my-notifilers";

import requestClient from "@/api/request";
/**
 * Lấy danh sách thông báo của tôi
 * @param {GetMyNotifilerPagedListInput} input Tham số
 * @returns {Promise<PagedResultDto<UserNotificationDto>>} Danh sách thông báo phân trang
 */
export function getMyNotifilersApi(input?: GetMyNotifilerPagedListInput): Promise<PagedResultDto<UserNotificationDto>> {
	return requestClient.get<PagedResultDto<UserNotificationDto>>("/api/notifications/my-notifilers", {
		params: input,
	});
}
/**
 * Xóa thông báo của tôi
 * @param {string} id Id thông báo
 * @returns {void}
 */
export function deleteMyNotifilerApi(id: string): Promise<void> {
	return requestClient.delete(`/api/notifications/my-notifilers/${id}`);
}
/**
 * Đặt trạng thái đã đọc cho thông báo
 * @param {MarkReadStateInput} input Tham số
 * @returns {void}
 */
export function markReadStateApi(input: MarkReadStateInput): Promise<void> {
	return requestClient.put("/api/notifications/my-notifilers/mark-read-state", input);
}

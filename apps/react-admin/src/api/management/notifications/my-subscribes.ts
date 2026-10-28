import type { ListResultDto } from "#/abp-core";

import type { UserSubscreNotification } from "#/notifications/subscribes";

import requestClient from "../../request";

/**
 * Lấy tất cả thông báo đã đăng ký của tôi
 * @returns Danh sách thông báo đã đăng ký
 */
export function getMySubscribesApi(): Promise<ListResultDto<UserSubscreNotification>> {
	return requestClient.get<ListResultDto<UserSubscreNotification>>("/api/notifications/my-subscribes/all");
}

/**
 * Đăng ký thông báo
 * @param name Tên thông báo
 */
export function subscribeApi(name: string): Promise<void> {
	return requestClient.post("/api/notifications/my-subscribes", {
		name,
	});
}

/**
 * Hủy đăng ký thông báo
 * @param name Tên thông báo
 */
export function unSubscribeApi(name: string): Promise<void> {
	return requestClient.delete(`/api/notifications/my-subscribes?name=${name}`);
}

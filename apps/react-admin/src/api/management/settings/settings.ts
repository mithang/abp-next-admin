import type { ListResultDto } from "#/abp-core";

import type { SettingGroup, SettingsUpdateInput } from "#/management/settings";

import requestClient from "@/api/request";

/**
 * Lấy cài đặt toàn cục
 * @returns Danh sách đối tượng truyền dữ liệu cài đặt
 */
export function getGlobalSettingsApi(): Promise<ListResultDto<SettingGroup>> {
	return requestClient.get<ListResultDto<SettingGroup>>("/api/setting-management/settings/by-global");
}

/**
 * Đặt cài đặt toàn cục
 * @returns Danh sách đối tượng truyền dữ liệu cài đặt
 */
export function setGlobalSettingsApi(input: SettingsUpdateInput): Promise<void> {
	return requestClient.put("/api/setting-management/settings/change-global", input);
}

/**
 * Lấy cài đặt tenant
 * @returns Danh sách đối tượng truyền dữ liệu cài đặt
 */
export function getTenantSettingsApi(): Promise<ListResultDto<SettingGroup>> {
	return requestClient.get<ListResultDto<SettingGroup>>("api/setting-management/settings/by-current-tenant");
}

/**
 * Đặt cài đặt tenant
 * @returns Danh sách đối tượng truyền dữ liệu cài đặt
 */
export function setTenantSettingsApi(input: SettingsUpdateInput): Promise<void> {
	return requestClient.put("/api/setting-management/settings/change-current-tenant", input);
}
/**
 * Lấy cài đặt người dùng
 * @returns Danh sách đối tượng truyền dữ liệu cài đặt
 */
export function getUserSettingsApi(): Promise<ListResultDto<SettingGroup>> {
	return requestClient.get<ListResultDto<SettingGroup>>("/api/setting-management/settings/by-current-user");
}

/**
 * Đặt cài đặt người dùng
 * @returns Danh sách đối tượng truyền dữ liệu cài đặt
 */
export function setUserSettingsApi(input: SettingsUpdateInput): Promise<void> {
	return requestClient.put("/api/setting-management/settings/change-current-user", input);
}

/**
 * Gửi email kiểm tra
 * @param emailAddress Địa chỉ người nhận email
 */
export const sendTestEmailApi = (emailAddress: string) => {
	return requestClient.post("/api/setting-management/settings/send-test-email", {
		emailAddress,
	});
};

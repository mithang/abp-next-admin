import type { ListResultDto } from "#/abp-core";

import type {
	SettingDefinitionCreateDto,
	SettingDefinitionDto,
	SettingDefinitionGetListInput,
	SettingDefinitionUpdateDto,
} from "#/management/settings/definitions";
import requestClient from "@/api/request";

/**
 * Xóa định nghĩa cài đặt
 * @param name Tên cài đặt
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/setting-management/settings/definitions/${name}`);
}

/**
 * Truy vấn định nghĩa cài đặt
 * @param name Tên cài đặt
 * @returns Đối tượng truyền dữ liệu định nghĩa cài đặt
 */
export function getApi(name: string): Promise<SettingDefinitionDto> {
	return requestClient.get<SettingDefinitionDto>(`/api/setting-management/settings/definitions/${name}`);
}

/**
 * Truy vấn danh sách định nghĩa cài đặt
 * @param input Điều kiện lọc cài đặt
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa cài đặt
 */
export function getListApi(input?: SettingDefinitionGetListInput): Promise<ListResultDto<SettingDefinitionDto>> {
	return requestClient.get<ListResultDto<SettingDefinitionDto>>("/api/setting-management/settings/definitions", {
		params: input,
	});
}

/**
 * Tạo định nghĩa cài đặt
 * @param input Tham số định nghĩa cài đặt
 * @returns Đối tượng truyền dữ liệu định nghĩa cài đặt
 */
export function createApi(input: SettingDefinitionCreateDto): Promise<SettingDefinitionDto> {
	return requestClient.post<SettingDefinitionDto>("/api/setting-management/settings/definitions", input);
}

/**
 * Cập nhật định nghĩa cài đặt
 * @param name Tên cài đặt
 * @param input Tham số định nghĩa cài đặt
 * @returns Đối tượng truyền dữ liệu định nghĩa cài đặt
 */
export function updateApi(name: string, input: SettingDefinitionUpdateDto): Promise<SettingDefinitionDto> {
	return requestClient.put<SettingDefinitionDto>(`/api/setting-management/settings/definitions/${name}`, input);
}

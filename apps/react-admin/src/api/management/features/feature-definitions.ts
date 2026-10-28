import type { ListResultDto } from "#/abp-core";

import type {
	FeatureDefinitionCreateDto,
	FeatureDefinitionDto,
	FeatureDefinitionGetListInput,
	FeatureDefinitionUpdateDto,
} from "#/management/features/definitions";

import requestClient from "../../request";

/**
 * Xóa định nghĩa tính năng
 * @param name Tên tính năng
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/feature-management/definitions/${name}`);
}

/**
 * Truy vấn định nghĩa tính năng
 * @param name Tên tính năng
 * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
 */
export function getApi(name: string): Promise<FeatureDefinitionDto> {
	return requestClient.get<FeatureDefinitionDto>(`/api/feature-management/definitions/${name}`);
}

/**
 * Truy vấn danh sách định nghĩa tính năng
 * @param input Điều kiện lọc tính năng
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa tính năng
 */
export function getListApi(input?: FeatureDefinitionGetListInput): Promise<ListResultDto<FeatureDefinitionDto>> {
	return requestClient.get<ListResultDto<FeatureDefinitionDto>>("/api/feature-management/definitions", {
		params: input,
	});
}

/**
 * Tạo định nghĩa tính năng
 * @param input Tham số định nghĩa tính năng
 * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
 */
export function createApi(input: FeatureDefinitionCreateDto): Promise<FeatureDefinitionDto> {
	return requestClient.post<FeatureDefinitionDto>("/api/feature-management/definitions", input);
}

/**
 * Cập nhật định nghĩa tính năng
 * @param name Tên tính năng
 * @param input Tham số định nghĩa tính năng
 * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
 */
export function updateApi(name: string, input: FeatureDefinitionUpdateDto): Promise<FeatureDefinitionDto> {
	return requestClient.put<FeatureDefinitionDto>(`/api/feature-management/definitions/${name}`, input);
}

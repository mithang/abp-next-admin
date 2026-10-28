import type { ListResultDto } from "#/abp-core";

import type {
	FeatureGroupDefinitionCreateDto,
	FeatureGroupDefinitionDto,
	FeatureGroupDefinitionGetListInput,
	FeatureGroupDefinitionUpdateDto,
} from "#/management/features/groups";

import requestClient from "../../request";

/**
 * Xóa định nghĩa tính năng
 * @param name Tên tính năng
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/feature-management/definitions/groups/${name}`);
}

/**
 * Truy vấn định nghĩa tính năng
 * @param name Tên tính năng
 * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
 */
export function getApi(name: string): Promise<FeatureGroupDefinitionDto> {
	return requestClient.get<FeatureGroupDefinitionDto>(`/api/feature-management/definitions/groups/${name}`);
}

/**
 * Truy vấn danh sách định nghĩa tính năng
 * @param input Điều kiện lọc tính năng
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa tính năng
 */
export function getListApi(
	input?: FeatureGroupDefinitionGetListInput,
): Promise<ListResultDto<FeatureGroupDefinitionDto>> {
	return requestClient.get<ListResultDto<FeatureGroupDefinitionDto>>("/api/feature-management/definitions/groups", {
		params: input,
	});
}

/**
 * Tạo định nghĩa tính năng
 * @param input Tham số định nghĩa tính năng
 * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
 */
export function createApi(input: FeatureGroupDefinitionCreateDto): Promise<FeatureGroupDefinitionDto> {
	return requestClient.post<FeatureGroupDefinitionDto>("/api/feature-management/definitions/groups", input);
}

/**
 * Cập nhật định nghĩa tính năng
 * @param name Tên tính năng
 * @param input Tham số định nghĩa tính năng
 * @returns Đối tượng truyền dữ liệu định nghĩa tính năng
 */
export function updateApi(name: string, input: FeatureGroupDefinitionUpdateDto): Promise<FeatureGroupDefinitionDto> {
	return requestClient.put<FeatureGroupDefinitionDto>(`/api/feature-management/definitions/groups/${name}`, input);
}

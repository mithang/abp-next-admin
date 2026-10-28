import type { ListResultDto } from "#/abp-core";

import type {
	ResourceCreateDto,
	ResourceDto,
	ResourceGetListInput,
	ResourceUpdateDto,
} from "#/management/localization/resources";

import requestClient from "../../request";

/**
 * Truy vấn danh sách tài nguyên
 * @param input Tham số
 * @returns Danh sách tài nguyên
 */
export function getListApi(input?: ResourceGetListInput): Promise<ListResultDto<ResourceDto>> {
	return requestClient.get<ListResultDto<ResourceDto>>("/api/abp/localization/resources", {
		params: input,
	});
}

/**
 * Truy vấntài nguyên
 * @param name Tên tài nguyên
 * @returns Tài nguyên được truy vấn
 */
export function getApi(name: string): Promise<ResourceDto> {
	return requestClient.get<ResourceDto>(`/api/localization/resources/${name}`);
}

/**
 * Xóa tài nguyên
 * @param name Tên tài nguyên
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/localization/resources/${name}`);
}

/**
 * Tạo tài nguyên
 * @param input Tham số
 * @returns Tài nguyên đã tạo
 */
export function createApi(input: ResourceCreateDto): Promise<ResourceDto> {
	return requestClient.post<ResourceDto>("/api/localization/resources", input);
}

/**
 * Chỉnh sửa tài nguyên
 * @param name Tên tài nguyên
 * @param input Tham số
 * @returns Tài nguyên đã chỉnh sửa
 */
export function updateApi(name: string, input: ResourceUpdateDto): Promise<ResourceDto> {
	return requestClient.put<ResourceDto>(`/api/localization/resources/${name}`, input);
}

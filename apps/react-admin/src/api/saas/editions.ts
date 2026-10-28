import type { PagedResultDto } from "#/abp-core";

import type { EditionCreateDto, EditionDto, EditionUpdateDto, GetEditionPagedListInput } from "#/saas/editions";

import requestClient from "../request";

/**
 * Tạo phiên bản
 * @param {EditionCreateDto} input Tham số
 * @returns Phiên bản đã tạo
 */
export function createApi(input: EditionCreateDto): Promise<EditionDto> {
	return requestClient.post<EditionDto>("/api/saas/editions", input);
}

/**
 * Chỉnh sửa phiên bản
 * @param {string} id Tham số
 * @param {EditionUpdateDto} input Tham số
 * @returns Phiên bản đã chỉnh sửa
 */
export function updateApi(id: string, input: EditionUpdateDto): Promise<EditionDto> {
	return requestClient.put<EditionDto>(`/api/saas/editions/${id}`, input);
}

/**
 * Truy vấn phiên bản
 * @param {string} id Id
 * @returns Phiên bản đã truy vấn
 */
export function getApi(id: string): Promise<EditionDto> {
	return requestClient.get<EditionDto>(`/api/saas/editions/${id}`);
}

/**
 * Xóa phiên bản
 * @param {string} id Id
 * @returns {void}
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/saas/editions/${id}`);
}

/**
 * Truy vấn danh sách phân trang phiên bản
 * @param {GetEditionPagedListInput} input Tham số
 * @returns {void}
 */
export function getPagedListApi(input?: GetEditionPagedListInput): Promise<PagedResultDto<EditionDto>> {
	return requestClient.get<PagedResultDto<EditionDto>>("/api/saas/editions", {
		params: input,
	});
}

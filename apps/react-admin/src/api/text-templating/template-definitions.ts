import type { ListResultDto } from "#/abp-core";

import type {
	TextTemplateDefinitionCreateDto,
	TextTemplateDefinitionDto,
	TextTemplateDefinitionGetListInput,
	TextTemplateDefinitionUpdateDto,
} from "#/text-templating/definitions";

import requestClient from "../request";

/**
 * Thêm mới định nghĩa mẫu
 * @param input Tham số
 * @returns Đối tượng truyền dữ liệu định nghĩa mẫu
 */
export function createApi(input: TextTemplateDefinitionCreateDto): Promise<TextTemplateDefinitionDto> {
	return requestClient.post<TextTemplateDefinitionDto>("/api/text-templating/template/definitions", input);
}

/**
 * Xóa định nghĩa mẫu
 * @param name Tên mẫu
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/text-templating/template/definitions/${name}`);
}

/**
 * Lấy định nghĩa mẫu
 * @param name Tên mẫu
 * @returns Đối tượng truyền dữ liệu định nghĩa mẫu
 */
export function getApi(name: string): Promise<TextTemplateDefinitionDto> {
	return requestClient.get<TextTemplateDefinitionDto>(`/api/text-templating/template/definitions/${name}`);
}

/**
 * Lấy danh sách định nghĩa mẫu
 * @param input Tham số lọc
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa mẫu
 */
export function getListApi(
	input?: TextTemplateDefinitionGetListInput,
): Promise<ListResultDto<TextTemplateDefinitionDto>> {
	return requestClient.get<ListResultDto<TextTemplateDefinitionDto>>("/api/text-templating/template/definitions", {
		params: input,
	});
}

/**
 * Cập nhật định nghĩa mẫu
 * @param name Tên mẫu
 * @returns Đối tượng truyền dữ liệu định nghĩa mẫu
 */
export function updateApi(name: string, input: TextTemplateDefinitionUpdateDto): Promise<TextTemplateDefinitionDto> {
	return requestClient.put<TextTemplateDefinitionDto>(`/api/text-templating/template/definitions/${name}`, input);
}

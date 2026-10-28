import type {
	TextTemplateContentDto,
	TextTemplateContentGetInput,
	TextTemplateContentUpdateDto,
	TextTemplateRestoreInput,
} from "#/text-templating/contents";

import requestClient from "../request";

/**
 * Lấy nội dung mẫu
 * @param input Tham số
 * @returns Đối tượng truyền dữ liệu nội dung mẫu
 */
export function getApi(input: TextTemplateContentGetInput): Promise<TextTemplateContentDto> {
	let url = "/api/text-templating/templates/content";
	url += input.culture ? `/${input.culture}/${input.name}` : `/${input.name}`;
	return requestClient.get<TextTemplateContentDto>(url);
}

/**
 * Đặt lại nội dung mẫu về giá trị mặc định
 * @param name Tên mẫu
 * @param input Tham số
 * @returns Danh sách đối tượng truyền dữ liệu định nghĩa mẫu
 */
export function restoreToDefaultApi(name: string, input: TextTemplateRestoreInput): Promise<void> {
	return requestClient.put(`/api/text-templating/templates/content/${name}/restore-to-default`, input);
}

/**
 * Cập nhật nội dung mẫu
 * @param name Tên mẫu
 * @param input Tham số
 * @returns Đối tượng truyền dữ liệu nội dung mẫu
 */
export function updateApi(name: string, input: TextTemplateContentUpdateDto): Promise<TextTemplateContentDto> {
	return requestClient.put<TextTemplateContentDto>(`/api/text-templating/templates/content/${name}`, input);
}

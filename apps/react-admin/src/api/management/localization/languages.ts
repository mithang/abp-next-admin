import type { ListResultDto } from "#/abp-core";

import type {
	LanguageCreateDto,
	LanguageDto,
	LanguageGetListInput,
	LanguageUpdateDto,
} from "#/management/localization/languages";

import requestClient from "../../request";

/**
 * Truy vấn danh sách ngôn ngữ
 * @param input Tham số
 * @returns Danh sách ngôn ngữ
 */
export function getListApi(input?: LanguageGetListInput): Promise<ListResultDto<LanguageDto>> {
	return requestClient.get<ListResultDto<LanguageDto>>("/api/abp/localization/languages", {
		params: input,
	});
}

/**
 * Truy vấnngôn ngữ
 * @param name Tên ngôn ngữ
 * @returns Ngôn ngữ được truy vấn
 */
export function getApi(name: string): Promise<LanguageDto> {
	return requestClient.get<LanguageDto>(`/api/localization/languages/${name}`);
}

/**
 * Xóa ngôn ngữ
 * @param name Tên ngôn ngữ
 */
export function deleteApi(name: string): Promise<void> {
	return requestClient.delete(`/api/localization/languages/${name}`);
}

/**
 * Tạo ngôn ngữ
 * @param input Tham số
 * @returns Ngôn ngữ đã tạo
 */
export function createApi(input: LanguageCreateDto): Promise<LanguageDto> {
	return requestClient.post<LanguageDto>("/api/localization/languagesr", input);
}

/**
 * Chỉnh sửa ngôn ngữ
 * @param name Tên ngôn ngữ
 * @param input Tham số
 * @returns Ngôn ngữ đã chỉnh sửa
 */
export function updateApi(name: string, input: LanguageUpdateDto): Promise<LanguageDto> {
	return requestClient.put<LanguageDto>(`/api/localization/languages/${name}`, input);
}

import type { ListResultDto } from "#/abp-core";

import type {
	GetTextByKeyInput,
	GetTextsInput,
	SetTextInput,
	TextDifferenceDto,
	TextDto,
} from "#/management/localization/texts";

import requestClient from "../../request";

/**
 * Truy vấn danh sách văn bản
 * @param input Tham số
 * @returns Danh sách văn bản
 */
export function getListApi(input: GetTextsInput): Promise<ListResultDto<TextDifferenceDto>> {
	return requestClient.get<ListResultDto<TextDifferenceDto>>("/api/abp/localization/texts", {
		params: input,
	});
}

/**
 * Truy vấn văn bản
 * @param input Tham số
 * @returns Văn bản đã truy vấn
 */
export function getApi(input: GetTextByKeyInput): Promise<TextDto> {
	return requestClient.get<TextDto>("/api/abp/localization/texts/by-culture-key", {
		params: input,
	});
}

/**
 * Thiết lập văn bản
 * @param input Tham số
 */
export function setApi(input: SetTextInput): Promise<void> {
	return requestClient.put("/api/localization/texts", input);
}

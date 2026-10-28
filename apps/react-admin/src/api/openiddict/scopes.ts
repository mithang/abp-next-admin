import type { PagedResultDto } from "#/abp-core";
import type {
	OpenIddictScopeCreateDto,
	OpenIddictScopeDto,
	OpenIddictScopeGetListInput,
	OpenIddictScopeUpdateDto,
} from "#/openiddict/scopes";

import requestClient from "../request";

/**
 * Tạo phạm vi
 * @param input Tham số
 * @returns Đối tượng truyền dữ liệu thực thể phạm vi
 */
export function createApi(input: OpenIddictScopeCreateDto): Promise<OpenIddictScopeDto> {
	return requestClient.post<OpenIddictScopeDto>("/api/openiddict/scopes", input);
}

/**
 * Xóa phạm vi
 * @param id Id phạm vi
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/openiddict/scopes/${id}`);
}

/**
 * Lấy phạm vi
 * @param id Id phạm vi
 * @returns Đối tượng truyền dữ liệu thực thể phạm vi
 */
export function getApi(id: string): Promise<OpenIddictScopeDto> {
	return requestClient.get<OpenIddictScopeDto>(`/api/openiddict/scopes/${id}`);
}

/**
 * Cập nhật phạm vi
 * @param id Id phạm vi
 * @param input Tham số cập nhật
 * @returns Đối tượng truyền dữ liệu thực thể phạm vi
 */
export function updateApi(id: string, input: OpenIddictScopeUpdateDto): Promise<OpenIddictScopeDto> {
	return requestClient.put<OpenIddictScopeDto>(`/api/openiddict/scopes/${id}`, input);
}

/**
 * Lấy danh sách phân trang phạm vi
 * @param input Tham số lọc
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể phạm vi
 */
export function getPagedListApi(input?: OpenIddictScopeGetListInput): Promise<PagedResultDto<OpenIddictScopeDto>> {
	return requestClient.get<PagedResultDto<OpenIddictScopeDto>>("/api/openiddict/scopes", {
		params: input,
	});
}

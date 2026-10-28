import type { PagedResultDto } from "#/abp-core";
import type { OpenIddictTokenDto, OpenIddictTokenGetListInput } from "#/openiddict/tokens";
import requestClient from "../request";

/**
 * Xoá token
 * @param id Id token
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/openiddict/tokens/${id}`);
}

/**
 * Lấy token
 * @param id Id token
 * @returns Đối tượng truyền dữ liệu thực thể token
 */
export function getApi(id: string): Promise<OpenIddictTokenDto> {
	return requestClient.get<OpenIddictTokenDto>(`/api/openiddict/tokens/${id}`);
}

/**
 * Lấy danh sách phân trang token
 * @param input Tham số lọc
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể token
 */
export function getPagedListApi(input?: OpenIddictTokenGetListInput): Promise<PagedResultDto<OpenIddictTokenDto>> {
	return requestClient.get<PagedResultDto<OpenIddictTokenDto>>("/api/openiddict/tokens", {
		params: input,
	});
}

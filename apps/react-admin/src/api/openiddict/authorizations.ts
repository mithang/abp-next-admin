import type { PagedResultDto } from "#/abp-core";
import type { OpenIddictAuthorizationDto, OpenIddictAuthorizationGetListInput } from "#/openiddict/authorizations";

import requestClient from "../request";

/**
 * Xoá uỷ quyền
 * @param id Id uỷ quyền
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/openiddict/authorizations/${id}`);
}

/**
 * Truy vấn uỷ quyền
 * @param id Id uỷ quyền
 * @returns Đối tượng truyền dữ liệu thực thể uỷ quyền
 */
export function getApi(id: string): Promise<OpenIddictAuthorizationDto> {
	return requestClient.get<OpenIddictAuthorizationDto>(`/api/openiddict/authorizations/${id}`);
}

/**
 * Truy vấn danh sách phân trang uỷ quyền
 * @param input Tham số lọc
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể uỷ quyền
 */
export function getPagedListApi(
	input?: OpenIddictAuthorizationGetListInput,
): Promise<PagedResultDto<OpenIddictAuthorizationDto>> {
	return requestClient.get<PagedResultDto<OpenIddictAuthorizationDto>>("/api/openiddict/authorizations", {
		params: input,
	});
}

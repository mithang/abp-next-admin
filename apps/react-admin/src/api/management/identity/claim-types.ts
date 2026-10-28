import type { ListResultDto, PagedResultDto } from "#/abp-core";

import type {
	GetIdentityClaimTypePagedListInput,
	IdentityClaimTypeCreateDto,
	IdentityClaimTypeDto,
	IdentityClaimTypeUpdateDto,
} from "#/management/identity";
import requestClient from "../../request";

/**
 * Thêm khai báo người dùng
 * @param input Tham số
 * @returns Đối tượng truyền dữ liệu thực thể khai báo người dùng
 */
export function createApi(input: IdentityClaimTypeCreateDto): Promise<IdentityClaimTypeDto> {
	return requestClient.post<IdentityClaimTypeDto>("/api/identity/claim-types", input);
}

/**
 * Xóa khai báo người dùng
 * @param id Id khai báo người dùng
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/identity/claim-types/${id}`);
}

/**
 * Truy vấn khai báo người dùng
 * @param id Id khai báo người dùng
 * @returns Đối tượng truyền dữ liệu thực thể khai báo người dùng
 */
export function getApi(id: string): Promise<IdentityClaimTypeDto> {
	return requestClient.get<IdentityClaimTypeDto>(`/api/identity/claim-types/${id}`);
}

/**
 * Cập nhật khai báo người dùng
 * @param id Id khai báo người dùng
 * @returns Đối tượng truyền dữ liệu thực thể khai báo người dùng
 */
export function updateApi(id: string, input: IdentityClaimTypeUpdateDto): Promise<IdentityClaimTypeDto> {
	return requestClient.put<IdentityClaimTypeDto>(`/api/identity/claim-types/${id}`, input);
}

/**
 * Truy vấn danh sách phân trang khai báo người dùng
 * @param input Tham số lọc
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể khai báo người dùng
 */
export function getPagedListApi(
	input?: GetIdentityClaimTypePagedListInput,
): Promise<PagedResultDto<IdentityClaimTypeDto>> {
	return requestClient.get<PagedResultDto<IdentityClaimTypeDto>>("/api/identity/claim-types", {
		params: input,
	});
}

/**
 * Lấy danh sách loại khai báo khả dụng
 */
export function getAssignableClaimsApi(): Promise<ListResultDto<IdentityClaimTypeDto>> {
	return requestClient.get<ListResultDto<IdentityClaimTypeDto>>("/api/identity/claim-types/actived-list");
}

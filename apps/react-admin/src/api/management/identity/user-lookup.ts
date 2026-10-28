import type { ListResultDto } from "#/abp-core";

import type { IdentityUserDto, UserLookupCountInput, UserLookupSearchInput } from "#/management/identity/user";

import requestClient from "../../request";

/**
 * Truy vấn người dùng theo id
 * @param id Id người dùng
 * @returns Đối tượng truyền dữ liệu thực thể người dùng
 */
export function findByIdApi(id: string): Promise<IdentityUserDto> {
	return requestClient.get<IdentityUserDto>(`/api/identity/users/lookup/${id}`);
}

/**
 * Truy vấn người dùng theo tên người dùng
 * @param userName Tên người dùng
 * @returns Đối tượng truyền dữ liệu thực thể người dùng
 */
export function findByUserNameApi(userName: string): Promise<IdentityUserDto> {
	return requestClient.get<IdentityUserDto>(`/api/identity/users/lookup/by-username/${userName}`);
}

/**
 * Tìm kiếm danh sách người dùng
 * @param input Điều kiện lọc tìm kiếm
 * @returns Danh sách đối tượng truyền dữ liệu thực thể người dùng
 */
export function searchApi(input?: UserLookupSearchInput): Promise<ListResultDto<IdentityUserDto>> {
	return requestClient.get<ListResultDto<IdentityUserDto>>("/api/identity/users/lookup/search", {
		params: input,
	});
}

/**
 * Tìm kiếm số lượng người dùng
 * @param input Điều kiện lọc tìm kiếm
 */
export function countApi(input?: UserLookupCountInput): Promise<number> {
	return requestClient.get<number>("/api/identity/users/lookup/count", {
		params: input,
	});
}

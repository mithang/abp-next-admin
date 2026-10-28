import type { ListResultDto } from "#/abp-core";

import type { UserFavoriteMenuCreateDto, UserFavoriteMenuDto } from "#/platform/favorites";

import requestClient from "../request";

/**
 * Thêm menu thường dùng
 * @param input Tham số
 * @returns Menu thường dùng
 */
export function createApi(input: UserFavoriteMenuCreateDto): Promise<UserFavoriteMenuDto> {
	return requestClient.post<UserFavoriteMenuDto>("/api/platform/menus/favorites/my-favorite-menus", input);
}

/**
 * Xoá menu thường dùng
 * @param id Id menu
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/platform/menus/favorites/my-favorite-menus/${id}`);
}

/**
 * Lấy danh sách menu thường dùng
 * @param framework Khung giao diện người dùng ui
 * @returns Danh sách menu
 */
export function getListApi(framework?: string): Promise<ListResultDto<UserFavoriteMenuDto>> {
	return requestClient.get<ListResultDto<UserFavoriteMenuDto>>("/api/platform/menus/favorites/my-favorite-menus", {
		params: { framework },
	});
}

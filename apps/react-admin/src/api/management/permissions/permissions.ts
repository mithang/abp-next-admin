import type { PermissionProvider, PermissionResultDto, PermissionsUpdateDto } from "#/management/permissions";

import requestClient from "../../request";

/**
 * Truy vấn quyền
 * @param provider
 * @returns Đối tượng truyền dữ liệu thực thể quyền
 */
export function getApi(provider: PermissionProvider): Promise<PermissionResultDto> {
	return requestClient.get<PermissionResultDto>("/api/permission-management/permissions", {
		params: provider,
	});
}

/**
 * Cập nhật quyền
 * @param provider
 * @param input
 */
export function updateApi(provider: PermissionProvider, input: PermissionsUpdateDto): Promise<void> {
	return requestClient.put("/api/permission-management/permissions", input, {
		params: provider,
	});
}

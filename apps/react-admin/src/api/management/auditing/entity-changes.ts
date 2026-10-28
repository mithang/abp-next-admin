import type { ListResultDto } from "#/abp-core";

import type { EntityChangeGetWithUsernameInput, EntityChangeWithUsernameDto } from "#/management/auditing";
import requestClient from "../../request";

/**
 * Lấy danh sách thay đổi thực thể bao gồm tên người dùng
 * @param input Tham số
 */
export function getListWithUsernameApi(
	input: EntityChangeGetWithUsernameInput,
): Promise<ListResultDto<EntityChangeWithUsernameDto>> {
	return requestClient.get<ListResultDto<EntityChangeWithUsernameDto>>("/api/auditing/entity-changes/with-username", {
		params: input,
	});
}

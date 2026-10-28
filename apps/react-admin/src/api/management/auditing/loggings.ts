import type { PagedResultDto } from "#/abp-core";

import type { LogDto, LogGetListInput } from "#/management/auditing";

import requestClient from "../../request";

/**
 * Lấy nhật ký hệ thống
 * @param id id nhật ký
 */
export function getApi(id: string): Promise<LogDto> {
	return requestClient.get<LogDto>(`/api/auditing/logging/${id}`, {
		method: "GET",
	});
}

/**
 * Lấy danh sách phân trang nhật ký hệ thống
 * @param input tham số
 */
export function getPagedListApi(input: LogGetListInput): Promise<PagedResultDto<LogDto>> {
	return requestClient.get<PagedResultDto<LogDto>>("/api/auditing/logging", {
		params: input,
	});
}

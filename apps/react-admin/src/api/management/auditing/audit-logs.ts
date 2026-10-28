import type { PagedResultDto } from "#/abp-core";

import type { AuditLogDto, AuditLogGetListInput } from "#/management/auditing";
import requestClient from "../../request";

/**
 * Lấy nhật ký kiểm tra (audit log)
 * @param id id nhật ký
 */
export function getApi(id: string): Promise<AuditLogDto> {
	return requestClient.get<AuditLogDto>(`/api/auditing/audit-log/${id}`);
}

/**
 * Lấy danh sách phân trang nhật ký kiểm tra
 * @param input tham số
 */
export function getPagedListApi(input: AuditLogGetListInput): Promise<PagedResultDto<AuditLogDto>> {
	return requestClient.get<PagedResultDto<AuditLogDto>>("/api/auditing/audit-log", {
		params: input,
	});
}

/**
 * Xóa nhật ký kiểm tra
 * @param id id nhật ký
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/auditing/audit-log/${id}`);
}

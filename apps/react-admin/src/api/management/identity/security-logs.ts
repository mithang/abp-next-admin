import type { GetSecurityLogPagedRequest, SecurityLogDto } from "#/management/identity";
import type { PagedResultDto } from "#/abp-core";
import requestClient from "../../request";

/**
 * Xoá nhật ký bảo mật
 * @param id Id nhật ký bảo mật
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/auditing/security-log/${id}`);
}

/**
 * Truy vấn nhật ký bảo mật
 * @param id Id nhật ký bảo mật
 * @returns Đối tượng truyền dữ liệu thực thể nhật ký bảo mật
 */
export function getApi(id: string): Promise<SecurityLogDto> {
	return requestClient.get<SecurityLogDto>(`/api/auditing/security-log/${id}`);
}

/**
 * Truy vấn danh sách phân trang nhật ký bảo mật
 * @param input Tham số lọc
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể nhật ký bảo mật
 */
export function getPagedListApi(input?: GetSecurityLogPagedRequest): Promise<PagedResultDto<SecurityLogDto>> {
	return requestClient.get<PagedResultDto<SecurityLogDto>>("/api/auditing/security-log", {
		params: input,
	});
}

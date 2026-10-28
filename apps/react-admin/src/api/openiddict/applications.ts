import type { PagedResultDto } from "#/abp-core";
import type {
	OpenIddictApplicationCreateDto,
	OpenIddictApplicationDto,
	OpenIddictApplicationGetListInput,
	OpenIddictApplicationUpdateDto,
} from "#/openiddict/applications";

import requestClient from "../request";

/**
 * Tạo ứng dụng
 * @param input Tham số
 * @returns Đối tượng truyền dữ liệu thực thể ứng dụng
 */
export function createApi(input: OpenIddictApplicationCreateDto): Promise<OpenIddictApplicationDto> {
	return requestClient.post<OpenIddictApplicationDto>("/api/openiddict/applications", input);
}

/**
 * Xóa ứng dụng
 * @param id Id ứng dụng
 */
export function deleteApi(id: string): Promise<void> {
	return requestClient.delete(`/api/openiddict/applications/${id}`);
}

/**
 * Truy vấn ứng dụng
 * @param id Id ứng dụng
 * @returns Đối tượng truyền dữ liệu thực thể ứng dụng
 */
export function getApi(id: string): Promise<OpenIddictApplicationDto> {
	return requestClient.get<OpenIddictApplicationDto>(`/api/openiddict/applications/${id}`);
}

/**
 * Cập nhật ứng dụng
 * @param id Id ứng dụng
 * @param input Tham số cập nhật
 * @returns Đối tượng truyền dữ liệu thực thể ứng dụng
 */
export function updateApi(id: string, input: OpenIddictApplicationUpdateDto): Promise<OpenIddictApplicationDto> {
	return requestClient.put<OpenIddictApplicationDto>(`/api/openiddict/applications/${id}`, input);
}

/**
 * Truy vấn danh sách phân trang ứng dụng
 * @param input Tham số lọc
 * @returns Danh sách phân trang đối tượng truyền dữ liệu thực thể ứng dụng
 */
export function getPagedListApi(
	input?: OpenIddictApplicationGetListInput,
): Promise<PagedResultDto<OpenIddictApplicationDto>> {
	return requestClient.get<PagedResultDto<OpenIddictApplicationDto>>("/api/openiddict/applications", {
		params: input,
	});
}

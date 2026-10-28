import type { PagedResultDto } from "#/abp-core";
import type { GetUserSessionsInput, IdentitySessionDto } from "#/management/identity/sessions";
import requestClient from "@/api/request";

/**
 * Truy vấn danh sách phiên
 * @param { GetUserSessionsInput } input Tham số truy vấn
 * @returns { Promise<PagedResultDto<IdentitySessionDto>> } Danh sách phiên người dùng
 */
export function getSessionsApi(input?: GetUserSessionsInput): Promise<PagedResultDto<IdentitySessionDto>> {
	return requestClient.get<PagedResultDto<IdentitySessionDto>>("/api/identity/sessions", {
		params: input,
	});
}
/**
 * Thu hồi phiên
 * @param { string } sessionId Id phiên
 * @returns { Promise<void> }
 */
export function revokeSessionApi(sessionId: string): Promise<void> {
	return requestClient.delete(`/api/identity/sessions/${sessionId}/revoke`);
}

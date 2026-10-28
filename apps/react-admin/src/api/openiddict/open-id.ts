import type { OpenIdConfiguration } from "#/abp-core/openid";

import requestClient from "../request";

/**
 * Điểm cuối phát hiện openid
 * @returns Dữ liệu cấu hình OpenId
 */
export function discoveryApi(): Promise<OpenIdConfiguration> {
	return requestClient.get<OpenIdConfiguration>("/.well-known/openid-configuration");
}

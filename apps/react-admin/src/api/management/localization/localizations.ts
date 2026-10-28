import type { ApplicationLocalizationDto } from "#/abp-core";

import requestClient from "../../request";

/**
 * Lấy ngôn ngữ của ứng dụng
 * @returns Cấu hình bản địa hóa
 */
export function getLocalizationApi(options: {
	cultureName: string;
	onlyDynamics?: boolean;
}): Promise<ApplicationLocalizationDto> {
	return requestClient.get<ApplicationLocalizationDto>("/api/abp/application-localization", {
		params: options,
	});
}

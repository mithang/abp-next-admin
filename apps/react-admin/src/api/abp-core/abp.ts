import type { ApplicationConfigurationDto, ApplicationLocalizationDto } from "#/abp-core";
import requestClient from "../request";

/**
 * Lấy thông tin cấu hình ứng dụng
 */
export function getConfigApi(options?: {
	includeLocalizationResources?: boolean;
}): Promise<ApplicationConfigurationDto> {
	return requestClient.get<ApplicationConfigurationDto>("/api/abp/application-configuration", {
		params: options,
	});
}

/**
 * Lấy ngôn ngữ ứng dụng
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

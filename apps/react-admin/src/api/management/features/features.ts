import type { FeatureProvider, GetFeatureListResultDto, UpdateFeaturesDto } from "#/management/features/features";

import requestClient from "../../request";

/**
 * Xóa tính năng
 * @param {FeatureProvider} provider Tham số
 * @returns {Promise<void>}
 */
export function deleteApi(provider: FeatureProvider): Promise<void> {
	return requestClient.delete("/api/feature-management/features", {
		params: provider,
	});
}

/**
 * Truy vấn tính năng
 * @param {FeatureProvider} provider Tham số
 * @returns {Promise<GetFeatureListResultDto>} Đối tượng truyền dữ liệu thực thể tính năng
 */
export function getApi(provider: FeatureProvider): Promise<GetFeatureListResultDto> {
	return requestClient.get<GetFeatureListResultDto>("/api/feature-management/features", {
		params: provider,
	});
}

/**
 * Cập nhật tính năng
 * @param {FeatureProvider} provider
 * @param {UpdateFeaturesDto} input Tham số
 * @returns {Promise<void>}
 */
export function updateApi(provider: FeatureProvider, input: UpdateFeaturesDto): Promise<void> {
	return requestClient.put("/api/feature-management/features", input, {
		params: provider,
	});
}

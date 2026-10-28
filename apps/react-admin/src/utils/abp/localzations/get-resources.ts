import { mergeRight } from "ramda";
import type { Dictionary } from "#/abp-core/global";
import useLocaleStore from "@/store/localeI18nStore";

/**
 * Lấy tài nguyên bản địa hóa sau khi hợp nhất
 * @param resourceNames Tên tài nguyên cần hợp nhất
 * @returns Tài nguyên bản địa hóa sau khi hợp nhất
 */
export function getResources(resourceNames?: string | string[]) {
	const localizations = useLocaleStore.getState().localizations || {};
	let merged: Dictionary<string, string> = {};

	if (resourceNames) {
		if (Array.isArray(resourceNames)) {
			resourceNames.forEach((name) => {
				merged = mergeRight(merged, localizations[name] || {});
			});
		} else {
			merged = mergeRight(merged, localizations[resourceNames] || {});
		}
	} else {
		// Merge everything if no resource names provided
		Object.keys(localizations).forEach((r) => {
			merged = mergeRight(merged, localizations[r] || {});
		});
	}

	return merged;
}

import { useEffect, useMemo } from "react";
import { format } from "@/utils/string";
import useLocaleStore, { useLocale } from "@/store/localeI18nStore";
import { getResources } from "@/utils/abp/localzations/get-resources";

// const { L } = useLocalizer(['AbpAuditLogging', 'AbpUi']);

/*
	const { t: $t } = useTranslation();
	const { L } = useLocalizer();
  console.log(L('DisplayName:ClaimValue')) //Khác với kết quả lấy từ getI18nLocales(), cái này không có key tiền tố
  console.log($t('AbpIdentity.DisplayName:ClaimValue'))
*/
export function useLocalizer(resourceNames?: string | string[], callback?: () => void) {
	const localizations = useLocaleStore.getState().localizations || {};
	const locale = useLocale();

	const mergedResources = useMemo(() => getResources(resourceNames), [resourceNames]);

	useEffect(() => {
		if (callback) {
			callback();
		}
	}, [locale, callback]);

	/**
	 * Lưu ý, dùng react hook để lưu trữ key
	 * @param key
	 * @param args
	 * @returns
	 */
	function L(key: string, args?: any[] | Record<string, string>) {
		if (!key) return "";
		return mergedResources[key] ? format(mergedResources[key], args ?? []) : key;
	}
	/**
	 * Thực tế chưa gọi react hook, có thể gọi ở nhiều nơi
	 * @param resource
	 * @param key
	 * @param args
	 * @returns
	 */
	function Lr(resource: string, key: string, args?: any[] | Record<string, string>) {
		if (!resource || !key) return "";
		// const { localizations } = useLocaleStore.getState();
		const subResource = localizations[resource] ?? {};
		return subResource[key] ? format(subResource[key], args ?? []) : key;
	}

	return { L, Lr };
}

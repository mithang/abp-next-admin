import type { Dictionary } from "#/abp-core";
import { format } from "@/utils/string";

/**
 * Cho phép bên ngoài truyền vào mergedResources để dịch
 * @param mergedResources Đối tượng tài nguyên đã tính trước
 * @param key Key cần dịch
 * @param args Tham số tùy chọn
 * @returns Chuỗi đã dịch
 */
export function LrWithResources(
	mergedResources: Dictionary<string, string>,
	key: string,
	args?: any[] | Record<string, string>,
) {
	if (!key) return "";
	return mergedResources[key] ? format(mergedResources[key], args ?? []) : key;
}

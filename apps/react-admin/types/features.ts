import type { NameValue } from "./abp-core";

type FeatureValue = NameValue<string>;

/**
 * Interface kiểm tra tính năng
 */
interface IFeatureChecker {
	/**
	 * Lấy giá trị tính năng
	 * @param name Tên tính năng
	 * @returns Trả về giá trị tính năng đã đặt, không tồn tại thì là chuỗi rỗng
	 */
	getOrEmpty(name: string): string;
	/**
	 * Tính năng có được bật hay không
	 * @param featureNames Tên tính năng
	 * @param requiresAll Có thỏa mãn tất cả hay không
	 */
	isEnabled(featureNames: string | string[], requiresAll?: boolean): boolean;
}

interface IGlobalFeatureChecker {
	isEnabled(featureNames: string | string[], requiresAll?: boolean): boolean;
}

export type { FeatureValue, IFeatureChecker, IGlobalFeatureChecker };

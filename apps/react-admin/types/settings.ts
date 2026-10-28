import type { NameValue } from "./abp-core";

type SettingValue = NameValue<string>;
/**
 * Giao diện cài đặt
 */
interface ISettingProvider {
	/**
	 * Lấy tập hợp giá trị cài đặt
	 * @param names tên cài đặt cần lọc
	 */
	getAll(...names: string[]): SettingValue[];
	/**
	 * Truy vấn giá trị cài đặt kiểu number
	 * @param name Tên cài đặt
	 * @returns Trả về giá trị cài đặt kiểu number, mặc định là 0
	 */
	getNumber(name: string): number;
	/**
	 * Lấy giá trị cài đặt, nếu rỗng thì trả về chuỗi rỗng
	 * @param name Tên cài đặt
	 */
	getOrEmpty(name: string): string;
	/**
	 * Truy vấn giá trị cài đặt kiểu boolean
	 * @param name Tên cài đặt
	 */
	isTrue(name: string): boolean;
}

export type { ISettingProvider, SettingValue };

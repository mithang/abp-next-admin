/**
 * Kiểm tra giá trị truyền vào có phải là undefined hay không.
 *
 * @param {unknown} value Giá trị cần kiểm tra.
 * @returns {boolean} Trả về true nếu giá trị là undefined, ngược lại trả về false.
 */
function isUndefined(value?: unknown): value is undefined {
	return value === undefined;
}

/**
 * Kiểm tra giá trị truyền vào có phải là boolean hay không
 * @param value
 * @returns Trả về true nếu giá trị là giá trị boolean, ngược lại trả về false.
 */
function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}

/**
 * Kiểm tra chuỗi truyền vào có phải là URL HTTP hoặc HTTPS hợp lệ hay không.
 *
 * @param {string} url Chuỗi cần kiểm tra.
 * @return {boolean} Trả về true nếu chuỗi là URL HTTP hoặc HTTPS hợp lệ, ngược lại trả về false.
 */
function isHttpUrl(url?: string): boolean {
	if (!url) {
		return false;
	}
	// Dùng biểu thức chính quy để kiểm tra URL có bắt đầu bằng http:// hoặc https:// hay không
	const httpRegex = /^https?:\/\/.*$/;
	return httpRegex.test(url);
}

/**
 * Kiểm tra giá trị truyền vào có phải là đối tượng window hay không.
 *
 * @param {any} value Giá trị cần kiểm tra.
 * @returns {boolean} Trả về true nếu giá trị là đối tượng window, ngược lại trả về false.
 */
function isWindow(value: any): value is Window {
	return typeof window !== "undefined" && value !== null && value === value.window;
}

/**
 * Kiểm tra môi trường chạy hiện tại có phải là Mac OS hay không.
 *
 * Hàm này xác định môi trường chạy hiện tại bằng cách kiểm tra chuỗi navigator.userAgent.
 * Nếu chuỗi userAgent chứa "macintosh" hoặc "mac os x" (không phân biệt chữ hoa/thường) thì môi trường hiện tại được coi là Mac OS.
 *
 * @returns {boolean} Trả về true nếu môi trường hiện tại là Mac OS, ngược lại trả về false.
 */
function isMacOs(): boolean {
	const macRegex = /macintosh|mac os x/i;
	return macRegex.test(navigator.userAgent);
}

/**
 * Kiểm tra môi trường chạy hiện tại có phải là Windows OS hay không.
 *
 * Hàm này xác định môi trường chạy hiện tại bằng cách kiểm tra chuỗi navigator.userAgent.
 * Nếu chuỗi userAgent chứa "windows" hoặc "win32" (không phân biệt chữ hoa/thường) thì môi trường hiện tại được coi là Windows OS.
 *
 * @returns {boolean} Trả về true nếu môi trường hiện tại là Windows OS, ngược lại trả về false.
 */
function isWindowsOs(): boolean {
	const windowsRegex = /windows|win32/i;
	return windowsRegex.test(navigator.userAgent);
}

/**
 * Kiểm tra giá trị truyền vào có phải là số hay không
 * @param value
 */
function isNumber(value: any): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

/**
 * Returns the first value in the provided list that is neither `null` nor `undefined`.
 *
 * This function iterates over the input values and returns the first one that is
 * not strictly equal to `null` or `undefined`. If all values are either `null` or
 * `undefined`, it returns `undefined`.
 *
 * @template T - The type of the input values.
 * @param {...(T | null | undefined)[]} values - A list of values to evaluate.
 * @returns {T | undefined} - The first value that is not `null` or `undefined`, or `undefined` if none are found.
 *
 * @example
 * // Returns 42 because it is the first non-null, non-undefined value.
 * getFirstNonNullOrUndefined(undefined, null, 42, 'hello'); // 42
 *
 * @example
 * // Returns 'hello' because it is the first non-null, non-undefined value.
 * getFirstNonNullOrUndefined(null, undefined, 'hello', 123); // 'hello'
 *
 * @example
 * // Returns undefined because all values are either null or undefined.
 * getFirstNonNullOrUndefined(undefined, null); // undefined
 */
function getFirstNonNullOrUndefined<T>(...values: (null | T | undefined)[]): T | undefined {
	for (const value of values) {
		if (value !== undefined && value !== null) {
			return value;
		}
	}
	return undefined;
}

export { getFirstNonNullOrUndefined, isBoolean, isHttpUrl, isMacOs, isNumber, isUndefined, isWindow, isWindowsOs };

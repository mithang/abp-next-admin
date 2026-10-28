import { isFunction, isObject, isString } from '@vue/shared';

/**
 * Kiểm tra giá trị truyền vào có phải là undefined hay không.
 *
 * @param {unknown} value Giá trị cần kiểm tra.
 * @returns {boolean} Nếu giá trị là undefined, trả về true, ngược lại trả về false.
 */
function isUndefined(value?: unknown): value is undefined {
  return value === undefined;
}

/**
 * Kiểm tra giá trị truyền vào có phải là boolean hay không
 * @param value
 * @returns Nếu giá trị là boolean, trả về true, ngược lại trả về false.
 */
function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Kiểm tra giá trị truyền vào có rỗng hay không.
 *
 * Các trường hợp sau sẽ được coi là rỗng:
 * - Giá trị là null.
 * - Giá trị là undefined.
 * - Giá trị là một chuỗi rỗng.
 * - Giá trị là một mảng có độ dài 0.
 * - Giá trị là một Map hoặc Set không có phần tử nào.
 * - Giá trị là một đối tượng không có thuộc tính nào.
 *
 * @param {T} value Giá trị cần kiểm tra.
 * @returns {boolean} Nếu giá trị rỗng, trả về true, ngược lại trả về false.
 */
function isEmpty<T = unknown>(value?: T): value is T {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value) || isString(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * Kiểm tra chuỗi truyền vào có phải là URL HTTP hoặc HTTPS hợp lệ hay không.
 *
 * @param {string} url Chuỗi cần kiểm tra.
 * @return {boolean} Nếu chuỗi là URL HTTP hoặc HTTPS hợp lệ, trả về true, ngược lại trả về false.
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
 * @returns {boolean} Nếu giá trị là đối tượng window, trả về true, ngược lại trả về false.
 */
function isWindow(value: any): value is Window {
  return (
    typeof window !== 'undefined' && value !== null && value === value.window
  );
}

/**
 * Kiểm tra môi trường chạy hiện tại có phải là Mac OS hay không.
 *
 * Hàm này xác định môi trường chạy hiện tại bằng cách kiểm tra chuỗi navigator.userAgent.
 * Nếu chuỗi userAgent chứa "macintosh" hoặc "mac os x" (không phân biệt hoa thường), môi trường hiện tại được coi là Mac OS.
 *
 * @returns {boolean} Nếu môi trường hiện tại là Mac OS, trả về true, ngược lại trả về false.
 */
function isMacOs(): boolean {
  const macRegex = /macintosh|mac os x/i;
  return macRegex.test(navigator.userAgent);
}

/**
 * Kiểm tra môi trường chạy hiện tại có phải là Windows OS hay không.
 *
 * Hàm này xác định môi trường chạy hiện tại bằng cách kiểm tra chuỗi navigator.userAgent.
 * Nếu chuỗi userAgent chứa "windows" hoặc "win32" (không phân biệt hoa thường), môi trường hiện tại được coi là Windows OS.
 *
 * @returns {boolean} Nếu môi trường hiện tại là Windows OS, trả về true, ngược lại trả về false.
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
  return typeof value === 'number' && Number.isFinite(value);
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
function getFirstNonNullOrUndefined<T>(
  ...values: (null | T | undefined)[]
): T | undefined {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

export {
  getFirstNonNullOrUndefined,
  isBoolean,
  isEmpty,
  isFunction,
  isHttpUrl,
  isMacOs,
  isNumber,
  isObject,
  isString,
  isUndefined,
  isWindow,
  isWindowsOs,
};

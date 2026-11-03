/**
 * Helper đọc route params (Expo Router) dùng chung.
 *
 * Trước vòng 68, 79 màn hình trong `src/app/` gọi thẳng
 * `useLocalSearchParams<{ id: string }>()` (hoặc `name`, `key`,
 * `dataId`, ...) rồi đưa giá trị thẳng vào query key và API call.
 * Kiểu `string` đó là nói dối ở runtime: expo-router trả
 * `string | string[] | undefined` — deep link hoặc query key lặp
 * (`?id=a&id=b`) cho ra mảng, và mảng đó sẽ đi thẳng vào
 * `apiPath`/`queryKey` gây URL sai hoặc cache key sai mà
 * TypeScript không bắt được (kiểu generic do màn hình tự khai).
 *
 * `useRouteParams` giữ nguyên contract kiểu của màn hình (generic
 * `T` trả về đúng `T`, nên không phải sửa call site nào khác),
 * chỉ chuẩn hóa runtime: mảng -> phần tử đầu, còn lại giữ nguyên.
 * Màn hình nào cần phân biệt "không có param" với "param rỗng"
 * vẫn làm được vì `undefined` và `''` đều được giữ nguyên.
 *
 * Cố tình KHÔNG ép kiểu về `string | undefined` cho mọi param:
 * 27 màn hình `id: string` bắt buộc đang truyền `id` thẳng vào
 * API function nhận `string` (được bảo vệ bằng
 * `enabled: Boolean(id)` ở query); ép `undefined` sẽ bắt 27+
 * màn hình thêm guard giả mà runtime vốn đã an toàn.
 */

import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';

export type RouteParamValue = string | string[] | undefined;

/** Một giá trị param: mảng -> phần tử đầu, `undefined`/chuỗi giữ nguyên. */
export function normalizeRouteParam(value: RouteParamValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/** Chuẩn hóa toàn bộ record params; key nào không phải mảng giữ nguyên giá trị. */
export function normalizeRouteParams<T extends Record<string, string | string[] | undefined>>(
  params: T,
): T {
  const normalized: Record<string, string | undefined> = {};
  for (const key of Object.keys(params)) {
    normalized[key] = normalizeRouteParam(params[key]);
  }
  return normalized as T;
}

/**
 * Thay cho `useLocalSearchParams`: cùng generic, cùng kiểu trả về,
 * nhưng mọi giá trị đã qua `normalizeRouteParam`.
 */
export function useRouteParams<
  T extends Record<string, string | string[] | undefined> = Record<
    string,
    string | string[] | undefined
  >,
>(): T {
  const raw = useLocalSearchParams<T>();
  return useMemo(() => normalizeRouteParams(raw), [raw]);
}

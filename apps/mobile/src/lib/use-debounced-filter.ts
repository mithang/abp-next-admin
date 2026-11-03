import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useDebouncedValue } from './use-debounced-value';

/**
 * Bộ ba lọc đơn đã debounce cho các màn hình KHÔNG phân trang
 * (một ô tìm kiếm `filter`, không có reset page để gộp):
 *
 * ```
 * const [filter, setFilter, debouncedFilter] = useDebouncedFilter();
 * ```
 *
 * Trả về tuple thay vì object để mỗi màn hình giữ đúng tên biến
 * cũ của mình khi destructure — ví dụ menu-allot dùng
 * `[identityFilter, setIdentityFilter, debouncedFilter]` và
 * `[framework, setFramework, debouncedFramework]` trong cùng file,
 * còn webhooks/groups từng đặt tên giá trị debounce là `debounced`.
 *
 * Cố tình KHÔNG dùng ở đây: các màn hình phân trang dùng
 * `useListFilter` (tự reset về trang 0 khi settled); các màn hình
 * lọc đa field debounce cả object `{ filter, ... }` và các màn
 * hình cần `onSettled` riêng (ví dụ layouts reset framework gợi ý)
 * vẫn dùng trực tiếp `useDebouncedValue` để không làm mờ queryKey
 * của từng màn hình.
 */
export function useDebouncedFilter(
  initial = '',
  delay = 400,
): [string, Dispatch<SetStateAction<string>>, string] {
  const [filter, setFilter] = useState(initial);
  const debouncedFilter = useDebouncedValue(filter, delay);
  return [filter, setFilter, debouncedFilter];
}

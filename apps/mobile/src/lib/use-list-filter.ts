import { useState } from 'react';
import { useDebouncedValue } from './use-debounced-value';
import { usePagination } from './use-pagination';

/**
 * Bộ ba lọc + phân trang dùng chung cho các màn hình danh sách
 * lọc đơn (một ô tìm kiếm `filter`): state `filter`, phân trang
 * `usePagination` và giá trị đã debounce `debouncedFilter` tự
 * reset về trang 0 khi settled — đúng mẫu 21 màn hình từng tự
 * lặp trước vòng 54:
 *
 * ```
 * const [filter, setFilter] = useState('');
 * const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
 * const debouncedFilter = useDebouncedValue(filter, 400, () => {
 *   setPage(0);
 * });
 * ```
 *
 * `onSettledExtra` (tuỳ chọn) chạy cùng timer với `setPage(0)`
 * cho các màn hình cần reset thêm state khi lọc settled — ví dụ
 * 3 màn hình bulk (background-jobs, webhook subscriptions,
 * send-attempts) từng xoá selection trong cùng `onSettled` cũ,
 * nên hai setState vẫn batch thành một lần render như trước.
 *
 * Cố tình KHÔNG dùng ở đây: các màn hình lọc đa field (email/sms
 * messages, ai/tools, audit-logs, send-records, cache, menus)
 * debounce cả object `{ filter, ... }` — gộp chúng vào hook
 * single-filter này sẽ làm mờ queryKey/queryFn của từng màn
 * hình; và các màn hình không phân trang (permissions/features/
 * settings definitions, menu-allot identity) không có reset
 * page để gộp.
 */
export function useListFilter(onSettledExtra?: () => void) {
  const [filter, setFilter] = useState('');
  const pagination = usePagination();
  const debouncedFilter = useDebouncedValue(filter, 400, () => {
    pagination.setPage(0);
    onSettledExtra?.();
  });
  return { filter, setFilter, debouncedFilter, ...pagination };
}

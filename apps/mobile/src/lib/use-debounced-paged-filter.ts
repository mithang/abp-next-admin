import { useDebouncedValue } from './use-debounced-value';
import { usePagination } from './use-pagination';

/**
 * Bộ đôi phân trang + debounce object dùng chung cho các màn hình
 * danh sách lọc đa field: phân trang `usePagination` và giá trị
 * lọc đã debounce `debounced` tự reset về trang 0 khi settled —
 * đúng mẫu 7 màn hình từng tự lặp trước vòng 65:
 *
 * ```
 * const { page, setPage, skipCount, maxResultCount, hasMore, loadMore } = usePagination();
 * const debounced = useDebouncedValue({ filter, provider }, 400, () => {
 *   setPage(0);
 * });
 * ```
 *
 * Đây là phần mở rộng đa field của `useListFilter` (vòng 54):
 * hook đó chỉ nhận một chuỗi `filter`, còn các màn hình này
 * debounce cả object `{ filter, ... }` nên không gộp vào đó được
 * mà không làm mờ queryKey/queryFn của từng màn hình. Hook này
 * giữ nguyên ngữ nghĩa cũ: `useDebouncedValue` so sánh object
 * bằng `JSON.stringify` nên timer chỉ reset khi một field thật
 * sự đổi, và `setPage(0)` chạy cùng callback timer với
 * `setDebounced` nên query chỉ chạy một lần với (giá trị mới,
 * page 0), không có render trung gian.
 *
 * `onSettledExtra` (tuỳ chọn) chạy cùng timer với `setPage(0)`,
 * cùng vai trò như ở `useListFilter`, cho màn hình cần reset
 * thêm state khi lọc settled.
 *
 * Cố tình KHÔNG dùng ở đây: các màn hình lọc đa field nhưng
 * không phân trang (notifications/definitions, platform/menus
 * debounce object mà không có `setPage(0)`, cache/caches còn
 * giữ extraKeys/extraMarker riêng) và platform/layouts (đã dùng
 * `useListFilter` cho filter đơn + một `useDebouncedValue` riêng
 * cho framework — gộp thêm sẽ làm mờ hai debounce độc lập đó).
 */
export function useDebouncedPagedFilter<T extends object>(
  filters: T,
  delay = 400,
  onSettledExtra?: () => void,
) {
  const pagination = usePagination();
  const debounced = useDebouncedValue(filters, delay, () => {
    pagination.setPage(0);
    onSettledExtra?.();
  });
  return { debounced, ...pagination };
}

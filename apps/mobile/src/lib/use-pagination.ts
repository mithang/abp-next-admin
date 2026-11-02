import { useCallback, useState } from 'react';

/**
 * Kích thước trang chung của mọi danh sách phân trang phía server
 * trong app (trước vòng 37, 29 màn hình tự khai báo riêng
 * `const PAGE_SIZE = 20;` với cùng giá trị này).
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Trạng thái phân trang "tải thêm" dùng chung cho các màn hình danh
 * sách: page 0-based, `skipCount = page * pageSize`,
 * `maxResultCount = pageSize`, `hasMore(totalCount)` đúng công thức
 * cũ `(page + 1) * pageSize < totalCount`.
 *
 * Trước vòng 37, 29 màn hình danh sách + phân trang phụ (chọn
 * identity ở menu-allot, log của background job) tự lặp cùng mẫu
 * này: state `page`, hằng `PAGE_SIZE`, công thức `skipCount`/
 * `hasMore` và nút "tải thêm" `setPage((p) => p + 1)`. Hook này gom
 * toàn bộ mẫu vào một chỗ; các màn hình chỉ còn giữ `setPage(0)`
 * cho reset (ví dụ `onSettled` của debounce ở vòng 36) và
 * `loadMore` cho nút tải thêm.
 *
 * Cố tình KHÔNG dùng ở đây: phân trang bằng marker của màn hình
 * cache (không có skipCount/page, dùng nextMarker) — giao thức
 * khác, không ép chung được.
 */
export function usePagination(pageSize: number = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(0);
  const resetPage = useCallback(() => setPage(0), []);
  const loadMore = useCallback(() => setPage((p) => p + 1), []);
  const hasMore = useCallback(
    (totalCount: number) => (page + 1) * pageSize < totalCount,
    [page, pageSize],
  );
  return {
    page,
    setPage,
    resetPage,
    loadMore,
    skipCount: page * pageSize,
    maxResultCount: pageSize,
    hasMore,
    pageSize,
  };
}

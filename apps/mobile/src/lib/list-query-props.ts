/**
 * Props trạng thái query dùng chung cho AppList.
 *
 * Trước vòng 60, cả 48 màn hình danh sách dùng AppList đều tự lặp đúng
 * cùng bộ 4 props liên tiếp, chỉ khác tên biến query:
 * `isPending={query.isPending}`, `isError={query.isError}`,
 * `errorMessage={toApiError(query.error).message}` và
 * `onRetry={() => void query.refetch()}` (tên biến query thay bằng
 * listQuery/menusQuery/identityQuery/containersQuery ở 4 màn hình).
 * Helper thuần này gom bộ đó thành một lần spread
 * `{...listQueryProps(query)}` nên một thay đổi quy tắc trạng thái
 * danh sách (ví dụ đổi message lỗi) chỉ cần sửa một chỗ. Cố tình là
 * hàm thuần, không phải hook: nó không dùng state/effect nào, và gọi
 * inline tại props giúp tránh phải chèn thêm câu lệnh hook vào 48 file
 * ở vị trí khai báo query.
 *
 * Cố tình KHÔNG dùng ở đây: các màn hình detail dùng queryStateElement
 * (early-return cả màn hình, không phải props của AppList), và các
 * AppErrorState lẻ ngoài AppList (ví dụ text-templating content) vốn
 * không truyền đủ bộ 4 props này.
 */
import { toApiError } from './errors';

export type ListStateQuery = {
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
};

export function listQueryProps(query: ListStateQuery) {
  return {
    isPending: query.isPending,
    isError: query.isError,
    errorMessage: toApiError(query.error).message,
    onRetry: () => {
      void query.refetch();
    },
  };
}

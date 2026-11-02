import type { ReactNode } from 'react';
import { AppErrorState, AppLoading } from '../components/ui/AppStates';
import { toApiError } from './errors';

/**
 * Trạng thái tối thiểu của một TanStack Query mà helper này cần.
 * Dùng kiểu cấu trúc (không import TanStack Query) để helper không phụ
 * thuộc vào kiểu UseQueryResult cụ thể và test được bằng object giả.
 */
export interface QueryStateLike {
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
}

/**
 * Trả về element trạng thái query dùng chung cho các màn hình detail/form:
 * đang tải -> <AppLoading />, lỗi -> <AppErrorState /> với thông điệp đã
 * làm sạch và nút thử lại, còn lại -> null để màn hình render tiếp.
 * Nhận một query hoặc một mảng query: đang tải nếu BẤT KỲ query nào
 * đang tải, lỗi lấy query lỗi ĐẦU TIÊN (đúng thứ tự các block gốc xếp
 * nối tiếp nhau). Hàm thuần, không phải hook, nên gọi ở vị trí của
 * early return cũ là an toàn kể cả khi có early return khác trước đó.
 * Lưu ý: với form edit, query detail bị disable khi tạo mới vẫn có
 * isPending = true, nên call site form PHẢI giữ guard `isEdit &&`
 * như block gốc (xem các form đã migrate).
 */
export function queryStateElement(query: QueryStateLike | QueryStateLike[]): ReactNode | null {
  const queries = Array.isArray(query) ? query : [query];
  if (queries.some((q) => q.isPending)) return <AppLoading />;
  const failed = queries.find((q) => q.isError);
  if (failed) {
    return (
      <AppErrorState
        message={toApiError(failed.error).message}
        onRetry={() => void failed.refetch()}
      />
    );
  }
  return null;
}

import type { ReactNode } from 'react';
import { Text } from '@/components/ui/text';
import { toApiError } from './errors';

/**
 * Trạng thái tối thiểu của một TanStack Mutation mà helper này cần.
 * Dùng kiểu cấu trúc (không import TanStack Query) để helper không phụ
 * thuộc vào kiểu UseMutationResult cụ thể và test được bằng object giả.
 */
export interface MutationErrorLike {
  isError: boolean;
  error: unknown;
}

/**
 * Dòng lỗi mutation dùng chung cho các màn hình list/detail ngoài form:
 * mutation lỗi -> <Text> với thông điệp đã làm sạch, còn lại -> null.
 * Đây là hình dạng dòng lỗi lặp lại ở 16 điểm gọi trong 13 màn hình
 * (thu hồi phiên, xóa, gửi lại, làm mới cache, gửi email/SMS, thao tác
 * hàng loạt...): trước đây mỗi màn hình tự lặp
 * `{xMutation.isError ? <Text>{toApiError(xMutation.error).message}</Text> : null}`.
 * Hàm thuần, không phải hook, nên đặt đúng vị trí dòng cũ là an toàn.
 * Màn hình có nhiều mutation (gửi lại + xóa, thao tác hàng loạt + xóa)
 * gọi helper một lần cho mỗi mutation, giữ đúng thứ tự các dòng cũ.
 * Lỗi submit của form KHÔNG dùng helper này mà dùng AppFormSubmit;
 * lỗi query KHÔNG dùng helper này mà dùng queryStateElement/AppList.
 */
export function mutationErrorElement(mutation: MutationErrorLike): ReactNode | null {
  if (!mutation.isError) return null;
  return <Text>{toApiError(mutation.error).message}</Text>;
}

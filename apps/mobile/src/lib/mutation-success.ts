import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

/**
 * Callback onSuccess dùng chung cho mutation: invalidate các query key
 * rồi trả về (không tự quay lại). Dùng cho các mutation ở lại màn hình
 * (đánh dấu đã đọc, gửi lại, làm mới, thao tác hàng loạt...): trước đây
 * mỗi màn hình tự lặp `await queryClient.invalidateQueries(...)`.
 * Trả về hàm async nên gán trực tiếp được cho `onSuccess` của useMutation
 * (tham số data/variables/context của TanStack Query được bỏ qua).
 */
export function useInvalidateQueries(...queryKeys: QueryKey[]) {
  const queryClient = useQueryClient();
  return async () => {
    for (const queryKey of queryKeys) {
      await queryClient.invalidateQueries({ queryKey });
    }
  };
}

/**
 * Callback onSuccess dùng chung cho mutation tạo/sửa/xóa: invalidate các
 * query key rồi quay lại màn hình trước. Đây là hình dạng onSuccess phổ
 * biến nhất của app (detail + form của gần như mọi nhóm chức năng).
 * Gọi hook này ở đầu component (thay cho `useQueryClient`) rồi gán trực
 * tiếp cho `onSuccess`; các onSuccess có thêm logic khác (setState,
 * router.replace, reset form...) KHÔNG dùng helper này mà giữ nguyên.
 */
export function useInvalidateAndBack(...queryKeys: QueryKey[]) {
  const router = useRouter();
  const invalidate = useInvalidateQueries(...queryKeys);
  return async () => {
    await invalidate();
    router.back();
  };
}

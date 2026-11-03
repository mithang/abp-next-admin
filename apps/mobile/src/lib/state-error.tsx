import type { ReactNode } from 'react';
import { Text } from '@/components/ui/text';

/**
 * Dòng lỗi chuỗi-state dùng chung cho các màn hình ngoài form:
 * state lỗi (string | null) có giá trị -> <Text> với đúng chuỗi đó,
 * còn lại (null/undefined/chuỗi rỗng) -> null — đúng ngữ nghĩa
 * ternary cũ `{xError ? <Text>{xError}</Text> : null}`.
 * Đây là hình dạng dòng lỗi lặp lại ở 18 điểm gọi trong 16 màn hình
 * (lưu cài đặt, lưu tenant/features, gán menu, form yêu thích,
 * mở blob, thao tác nền/webhook/text-templating, gửi/lưu WeChat...).
 * Hàm thuần, không phải hook, nên đặt đúng vị trí dòng cũ là an toàn.
 * Màn hình có 2 dòng lỗi (connection-strings: set + check,
 * menu-favorites: 2 form) gọi helper một lần cho mỗi dòng, giữ đúng
 * thứ tự các dòng cũ. Khác mutationErrorElement: message đã là
 * chuỗi cuối cùng, KHÔNG qua toApiError; khác AppFormSubmit: đây là
 * dòng lỗi đơn lẻ ngoài cặp submit (form cache giữ nguyên thứ tự
 * nút-trước-lỗi nên không dùng AppFormSubmit); dòng thành công
 * ({saved ? ...}, {saveMessage ? ...}...) KHÔNG dùng helper này.
 */
export function stateErrorElement(message: string | null | undefined): ReactNode | null {
  if (!message) return null;
  return <Text>{message}</Text>;
}

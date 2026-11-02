import type { AppSelectOption } from '../components/ui/AppSelect';
import { DATA_VALUE_TYPE_LABELS } from '../features/platform/types';
import type { EditionDto } from '../features/saas/types';

/**
 * Option cho AppSelect ở các màn đã chuyển khỏi nhập text (vòng 28–29).
 * Tách ra helper thuần để test được mà không cần render form (form dùng
 * RHF + TanStack Query nên test component của chúng nặng hơn nhiều):
 * - edition: value = id, label "tên — id" giữ đúng thông tin gợi ý cũ.
 * - valueType mục từ điển: chỉ 0–5 như modal web (Object=6 vẫn loại,
 *   đúng schema dataItemFormSchema); label lấy từ DATA_VALUE_TYPE_LABELS
 *   nên khớp màn detail vốn đã dùng bảng này.
 * - status email: -1 chưa gửi / 0 đã gửi / 10 thất bại, đúng
 *   messageStatusText ở màn email (label qua i18n, không hardcode).
 */
export function buildEditionOptions(
  editions: readonly Pick<EditionDto, 'id' | 'displayName'>[],
): AppSelectOption[] {
  return editions.map((e) => ({ value: e.id, label: `${e.displayName} — ${e.id}` }));
}

export function buildDataValueTypeOptions(): AppSelectOption[] {
  return [0, 1, 2, 3, 4, 5].map((value) => ({
    value: String(value),
    label: DATA_VALUE_TYPE_LABELS[value] ?? String(value),
  }));
}

export function buildEmailStatusOptions(t: (key: string) => string): AppSelectOption[] {
  return [
    { value: '-1', label: t('platformEmailMessages.statusPending') },
    { value: '0', label: t('platformEmailMessages.statusSent') },
    { value: '10', label: t('platformEmailMessages.statusFailed') },
  ];
}

/**
 * Lọc status email từ state chuỗi của AppSelect: '' = tất cả (không gửi
 * status lên API); chỉ -1/0/10 là hợp lệ, còn lại (kể cả chuỗi lạ từ
 * phiên bản cũ nhập tay) trả undefined thay vì gửi số vô nghĩa.
 */
export function parseEmailStatusFilter(status: string): number | undefined {
  const trimmed = status.trim();
  if (trimmed === '-1' || trimmed === '0' || trimmed === '10') return Number(trimmed);
  return undefined;
}

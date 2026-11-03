import type { ReactNode } from 'react';
import { AppErrorState } from '../components/ui/AppStates';

/**
 * Guard không-tìm-thấy dùng chung cho các màn hình detail: dữ liệu
 * detail đã load xong (queryStateElement đã cho qua) nhưng bản ghi
 * không tồn tại -> <AppErrorState> với thông điệp đã dịch sẵn, kèm
 * nút thử lại khi caller truyền onRetry — đúng ngữ nghĩa dòng cũ
 * `if (!item) return <AppErrorState message={t('common.empty')} />;`.
 * Đây là hình dạng guard lặp lại ở 40 điểm gọi trong 40 màn hình
 * detail (users, roles, claim-types, organization-units, security-logs,
 * openiddict x4, permissions x2, features x2, settings definitions,
 * localization x2, data-protection, auditing x2, notifications x3,
 * ai x3, saas x2, platform x5, blob x2, tasks, webhooks x4,
 * text-templating) — trước đây mỗi màn hình tự lặp đúng một dòng đó,
 * chỉ khác tên biến kiểm tra (item/user/role/app/scope/token/authz)
 * và 1 site có onRetry (data-dictionaries items form).
 * Hàm thuần, không phải hook, nên giữ nguyên vị trí early-return cũ
 * là an toàn (không đổi thứ tự hook hay luồng render sau guard).
 * Cố tình KHÔNG dùng helper này: màn hình cache [key] dùng
 * <AppEmptyState> (giá trị cache trống không phải lỗi); các guard
 * khác (login discovery -> AppLoading, throw Error trong form,
 * Text trống của entity-type properties) không phải AppErrorState.
 */
export function notFoundElement(message: string, onRetry?: () => void): ReactNode {
  return <AppErrorState message={message} onRetry={onRetry} />;
}

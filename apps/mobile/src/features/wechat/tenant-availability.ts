import { apiRequest } from '../../lib/api-client';

/**
 * Tín hiệu tenant hiện tại cho màn Cài đặt WeChat (kết quả review auth
 * vòng 32, thay cho ghi chú "không có tín hiệu tenant" từ vòng 17):
 * - Web chọn route by-global hay by-current-tenant theo
 *   currentTenant.isAvailable từ application-configuration; mobile trước
 *   đây để người dùng tự chọn phạm vi nên tài khoản host (không tenant)
 *   bấm "Tenant hiện tại" sẽ gọi thẳng vào
 *   WeChatSettingAppService.GetAllForCurrentTenantAsync, nơi
 *   CurrentTenant.GetId().ToString() nổ 500 khi không có tenant.
 * - GET /api/abp/application-configuration là endpoint chuẩn của ABP
 *   (đã kiểm chứng live: unauth trả 200 với currentTenant.isAvailable
 *   = false); bản thân endpoint này không thay đổi auth của WeChat.
 * - Chỉ đọc isAvailable: không dùng id/name tenant, không cache tenant
 *   vào store, không gửi tenant_id do client tự chọn lên backend.
 */

export type CurrentTenantInfo = {
  id?: string | null;
  name?: string | null;
  isAvailable?: boolean;
};

export type ApplicationConfigurationPayload = {
  currentTenant?: CurrentTenantInfo | null;
  result?: { currentTenant?: CurrentTenantInfo | null } | null;
};

/**
 * Trích isAvailable từ payload application-configuration. Chấp nhận cả
 * DTO thô (khi header _AbpDontWrapResult có tác dụng) và envelope đã
 * unwrap (apiRequest trả result) — phòng khi một lớp proxy trả lại
 * dạng { result: { currentTenant } }. Thiếu currentTenant hoặc thiếu
 * cờ → false (an toàn: về phạm vi Toàn cục, không gọi route tenant).
 */
export function isTenantAvailable(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false;
  const record = payload as ApplicationConfigurationPayload;
  const tenant = record.currentTenant ?? record.result?.currentTenant;
  return tenant?.isAvailable === true;
}

/** GET /api/abp/application-configuration → tenant hiện tại có sẵn không. */
export async function getTenantAvailability(): Promise<boolean> {
  const payload = await apiRequest<ApplicationConfigurationPayload>(
    '/api/abp/application-configuration',
    { method: 'GET' },
  );
  return isTenantAvailable(payload);
}

import { apiRequest, type ListResult } from '../../lib/api-client';
import type { SettingGroup, SettingsUpdateInput } from '../settings/types';

/**
 * Cài đặt WeChat: đúng web (packages/@abp/wechat):
 * - Trang settings của web chỉ là SettingForm trên 2 route của
 *   WeChatSettingController: GET /api/wechat/setting-management/by-global
 *   và /by-current-tenant; lưu qua API cài đặt chung
 *   PUT /api/setting-management/settings/change-global và
 *   /change-current-tenant (cùng shape { settings: [{ name, value }] }
 *   như màn Cài đặt hệ thống, chỉ gửi các giá trị đã đổi).
 * - Web chọn tenant hay global theo currentTenant.isAvailable — mobile
 *   không có tín hiệu tenant (không fetch application-configuration),
 *   nên màn hình để người dùng chọn phạm vi rõ ràng (mặc định Toàn cục)
 *   thay vì đoán ngầm; 2 đường lấy/lưu đi theo cùng phạm vi đã chọn.
 */

/** GET /api/wechat/setting-management/by-global */
export function getWechatGlobalSettings() {
  return apiRequest<ListResult<SettingGroup>>('/api/wechat/setting-management/by-global', {
    method: 'GET',
  });
}

/** GET /api/wechat/setting-management/by-current-tenant */
export function getWechatTenantSettings() {
  return apiRequest<ListResult<SettingGroup>>('/api/wechat/setting-management/by-current-tenant', {
    method: 'GET',
  });
}

/** PUT /api/setting-management/settings/change-global */
export function setWechatGlobalSettings(input: SettingsUpdateInput) {
  return apiRequest<void>('/api/setting-management/settings/change-global', {
    method: 'PUT',
    body: input,
  });
}

/** PUT /api/setting-management/settings/change-current-tenant */
export function setWechatTenantSettings(input: SettingsUpdateInput) {
  return apiRequest<void>('/api/setting-management/settings/change-current-tenant', {
    method: 'PUT',
    body: input,
  });
}

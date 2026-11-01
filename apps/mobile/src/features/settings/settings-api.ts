import { apiRequest, type ListResult } from '../../lib/api-client';
import { SettingValueType, type SettingGroup, type SettingsUpdateInput } from './types';

/** GET /api/v2/setting-management/settings — web SystemSetting dùng đúng route v2 này. */
export function getSystemSettings() {
  return apiRequest<ListResult<SettingGroup>>('/api/v2/setting-management/settings', { method: 'GET' });
}

/** PUT /api/v2/setting-management/settings — chỉ gửi các cài đặt đã đổi (xem collectChangedSettings). */
export function setSystemSettings(input: SettingsUpdateInput) {
  return apiRequest<void>('/api/v2/setting-management/settings', { method: 'PUT', body: input });
}

/** POST /api/setting-management/settings/send-test-email — slot send-test-email của SystemSetting web. */
export function sendTestEmail(emailAddress: string) {
  return apiRequest<void>('/api/setting-management/settings/send-test-email', {
    method: 'POST',
    body: { emailAddress },
  });
}

/**
 * Thu thập các cài đặt đã đổi để gửi PUT, đúng logic web SettingForm:
 * - chỉ những detail có giá trị sửa khác giá trị gốc (so sánh chuỗi);
 * - bỏ qua NoSet (web onValueChange return sớm);
 * - bỏ qua Array/Object (web không render control sửa cho 2 kiểu này);
 * - giá trị gửi luôn là chuỗi (web String(setting.value)).
 */
export function collectChangedSettings(
  groups: SettingGroup[],
  edits: Record<string, string>,
): SettingsUpdateInput {
  const settings: SettingsUpdateInput['settings'] = [];
  for (const group of groups) {
    for (const setting of group.settings) {
      for (const detail of setting.details) {
        if (detail.valueType === SettingValueType.NoSet) continue;
        if (detail.valueType === SettingValueType.Array || detail.valueType === SettingValueType.Object) continue;
        const edited = edits[detail.name];
        if (edited === undefined) continue;
        if (edited === (detail.value ?? '')) continue;
        settings.push({ name: detail.name, value: edited });
      }
    }
  }
  return { settings };
}

/** Kiểm tra giá trị Option có nằm trong danh sách options của detail không (web dùng Select nên không gửi giá trị ngoài danh sách). */
export function isValidOptionValue(value: string, options: { value: string }[]): boolean {
  return options.some((option) => option.value === value);
}

/** Kiểm tra email đơn giản cho ô gửi email test (web dùng isEmail rồi mới gọi API). */
export function isValidEmail(value: string): boolean {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

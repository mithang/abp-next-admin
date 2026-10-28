import type { Preferences } from '@vben-core/preferences';
import type { DeepPartial } from '@vben-core/typings';

/**
 * Nếu bạn muốn mọi app đều dùng cùng cài đặt mặc định của preferences, bạn có thể định nghĩa tại đây
 * Thay vì sửa cài đặt mặc định của preferences trong @vben-core/preferences
 * @param preferences
 * @returns
 */

function defineOverridesPreferences(preferences: DeepPartial<Preferences>) {
  return preferences;
}

export { defineOverridesPreferences };

export * from '@vben-core/preferences';

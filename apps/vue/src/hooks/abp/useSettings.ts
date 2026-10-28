import { computed } from 'vue';
import { useAbpStoreWithOut } from '/@/store/modules/abp';

type SettingValue = NameValue<string>;
/**
 * Giao diện cài đặt
 */
export interface ISettingProvider {
  /**
   * Truy vấn giá trị cài đặt kiểu number
   * @param name Tên cài đặt
   * @returns Trả về giá trị cài đặt kiểu number, mặc định là 0
   */
  getNumber(name: string): number;
  /**
   * Truy vấn giá trị cài đặt kiểu boolean
   * @param name Tên cài đặt
   */
  isTrue(name: string): boolean;
  /**
   * Lấy giá trị cài đặt, nếu rỗng thì trả về chuỗi rỗng
   * @param name Tên cài đặt
   */
  getOrEmpty(name: string): string;
  /**
   * Lấy tập hợp giá trị cài đặt
   * @param names tên cài đặt cần lọc
   */
  getAll(...names: string[]): SettingValue[];
}

export function useSettings() {
  const getSettings = computed(() => {
    const abpStore = useAbpStoreWithOut();
    const { values: settings } = abpStore.getApplication.setting;
    const settingValues = Object.keys(settings).map((key): SettingValue => {
      return {
        name: key,
        value: settings[key],
      };
    });
    return settingValues;
  });

  function get(name: string): SettingValue | undefined {
    return getSettings.value.find((setting) => name === setting.name);
  }

  function getAll(...names: string[]): SettingValue[] {
    if (names) {
      return getSettings.value.filter((setting) => names.includes(setting.name));
    }
    return getSettings.value;
  }

  function getOrDefault<T>(name: string, defaultValue: T): T | string {
    var setting = get(name);
    if (!setting) {
      return defaultValue;
    }
    return setting.value;
  }

  const settingProvider: ISettingProvider = {
    getOrEmpty(name: string) {
      return getOrDefault(name, '');
    },
    getAll(...names: string[]) {
      return getAll(...names);
    },
    getNumber(name: string, defaultValue: number = 0) {
      var value = getOrDefault(name, defaultValue);
      const num = Number(value);
      return isNaN(num) ? defaultValue : num;
    },
    isTrue(name: string) {
      var value = getOrDefault(name, 'false');
      return value.toLowerCase() === 'true';
    },
  };

  return { settingProvider };
}

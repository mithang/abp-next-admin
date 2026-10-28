interface SettingBase {
  /** Tên */
  name: string;
  /** Giá trị cài đặt hiện tại */
  value: string;
}

/** Đối tượng thay đổi cấu hình */
type SettingUpdateInput = SettingBase;

/** Tập hợp đối tượng thay đổi cấu hình */
interface SettingsUpdateInput {
  /** Tập hợp cấu hình */
  settings: SettingUpdateInput[];
}

export enum ValueType {
  Array = 4,
  Boolean = 2,
  Date = 3,
  NoSet = -1,
  Number = 1,
  Object = 10,
  Option = 5,
  String = 0,
}

interface Option {
  name: string;
  value: string;
}

interface SettingDetail {
  defaultValue: string;
  description?: string;
  displayName: string;
  isEncrypted: boolean;
  name: string;
  options: Option[];
  slot?: string;
  value?: string;
  valueType: ValueType;
}

interface Setting {
  description?: string;
  details: SettingDetail[];
  displayName: string;
}

interface SettingGroup {
  description: string;
  displayName: string;
  settings: Setting[];
}

export type { Setting, SettingDetail, SettingGroup, SettingsUpdateInput };

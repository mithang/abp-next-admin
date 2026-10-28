export class SettingBase {
  /** Tên */
  name!: string;
  /** Giá trị cài đặt hiện tại */
  value!: any;
}

/** Đối tượng thay đổi cấu hình */
export class SettingUpdate extends SettingBase {}

/** Tập hợp đối tượng thay đổi cấu hình */
export class SettingsUpdate {
  /** Tập hợp cấu hình */
  settings: SettingUpdate[];

  constructor() {
    this.settings = new Array<SettingUpdate>();
  }
}

export enum ValueType {
  String = 0,
  Number = 1,
  Boolean = 2,
  Date = 3,
  Array = 4,
  Option = 5,
  Object = 10,
}

export class Option {
  name!: string;
  value!: string;
}

export class SettingDetail {
  name!: string;
  displayName!: string;
  description?: string;
  value?: string;
  defaultValue!: string;
  valueType!: ValueType;
  isEncrypted = false;
  slot?: string;
  options = new Array<Option>();
}

export class Setting {
  displayName!: string;
  description?: string;
  details = new Array<SettingDetail>();
}

export class SettingGroup {
  displayName!: string;
  description?: string;
  settings = new Array<Setting>();
}

export interface SettingGroupResult {
  items: SettingGroup[];
}

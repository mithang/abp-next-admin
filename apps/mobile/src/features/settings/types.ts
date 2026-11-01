/**
 * DTO quản lý cài đặt, đối chiếu apps/vben5/packages/@abp/settings/src/types/.
 * Backend: modules/settings/.../SettingV2Controller.cs (api/v2/setting-management/settings)
 * và SettingDefinitionController.cs (api/setting-management/settings/definitions).
 *
 * Lưu ý khác biệt giữa 2 trang lá:
 * - Cài đặt hệ thống: GET v2 trả ListResult<SettingGroup>; PUT v2 chỉ gửi
 *   các cài đặt ĐÃ ĐỔI ({ settings: [{ name, value }] }) — web SettingForm
 *   chỉ push vào settingsUpdateInput khi giá trị đổi, và bỏ qua NoSet.
 * - Định nghĩa cài đặt: CRUD chuẩn; update KHÔNG nhận name/isStatic (key nằm
 *   trong path), nhận concurrencyStamp + extraProperties; modal web ẩn nút
 *   xác nhận với bản ghi tĩnh nên mobile coi tĩnh là chỉ đọc (không Sửa/Xóa),
 *   khác quyền (tĩnh cho sửa, cấm xóa) và giống tính năng.
 */

/** ValueType của web (enum số): String 0, Number 1, Boolean 2, Date 3, Array 4, Option 5, Object 10, NoSet -1. */
export const SettingValueType = {
  NoSet: -1,
  String: 0,
  Number: 1,
  Boolean: 2,
  Date: 3,
  Array: 4,
  Option: 5,
  Object: 10,
} as const;

export interface SettingOption {
  name: string;
  value: string;
}

export interface SettingDetail {
  name: string;
  displayName: string;
  description?: string;
  defaultValue: string;
  value?: string;
  valueType: number;
  isEncrypted: boolean;
  options: SettingOption[];
  slot?: string;
}

export interface Setting {
  displayName: string;
  description?: string;
  details: SettingDetail[];
}

export interface SettingGroup {
  displayName: string;
  description: string;
  settings: Setting[];
}

export interface SettingUpdateInput {
  name: string;
  value: string;
}

export interface SettingsUpdateInput {
  settings: SettingUpdateInput[];
}

export interface SettingDefinitionDto {
  name: string;
  displayName: string;
  description?: string;
  defaultValue?: string;
  isEncrypted: boolean;
  isInherited: boolean;
  isVisibleToClients: boolean;
  isStatic: boolean;
  providers: string[];
  concurrencyStamp?: string;
  extraProperties?: Record<string, unknown>;
}

export interface SettingDefinitionCreateDto {
  name: string;
  displayName: string;
  description?: string;
  defaultValue?: string;
  isEncrypted: boolean;
  isInherited: boolean;
  isVisibleToClients: boolean;
  providers: string[];
  concurrencyStamp?: string;
  extraProperties?: Record<string, unknown>;
}

export type SettingDefinitionUpdateDto = Omit<SettingDefinitionCreateDto, 'name'>;

export interface SettingDefinitionGetListInput {
  filter?: string;
  providerName?: string;
}

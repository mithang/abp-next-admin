/**
 * DTO quản lý tính năng, đối chiếu apps/vben5/packages/@abp/features/src/types/.
 * Backend: modules/feature-management/.../Definitions/*Controller.cs
 * (api/feature-management/definitions và .../definitions/groups).
 * Lưu ý: update KHÔNG nhận name/groupName (key nằm trong path) và nhận
 * concurrencyStamp; với định nghĩa tĩnh, modal web vô hiệu mọi field và ẩn
 * nút xác nhận nên mobile coi tĩnh là chỉ đọc (không Sửa/Xóa).
 */
export interface FeatureGroupDefinitionDto {
  name: string;
  displayName: string;
  isStatic: boolean;
  /** Backend có thể trả concurrencyStamp cho update; web type không liệt kê nhưng UpdateDto yêu cầu. */
  concurrencyStamp?: string;
  extraProperties?: Record<string, unknown>;
}

export interface FeatureGroupDefinitionCreateDto {
  name: string;
  displayName: string;
  extraProperties?: Record<string, unknown>;
}

export interface FeatureGroupDefinitionUpdateDto {
  displayName: string;
  concurrencyStamp?: string;
  extraProperties?: Record<string, unknown>;
}

export interface FeatureGroupDefinitionGetListInput {
  filter?: string;
}

export interface FeatureDefinitionDto {
  name: string;
  groupName: string;
  displayName: string;
  description?: string;
  defaultValue?: string;
  valueType: string;
  isAvailableToHost: boolean;
  isVisibleToClients: boolean;
  isStatic: boolean;
  parentName?: string;
  allowedProviders?: string[];
  concurrencyStamp?: string;
  extraProperties?: Record<string, unknown>;
}

export interface FeatureDefinitionCreateDto {
  name: string;
  groupName: string;
  displayName: string;
  description?: string;
  defaultValue?: string;
  valueType: string;
  isAvailableToHost: boolean;
  isVisibleToClients: boolean;
  parentName?: string;
  allowedProviders?: string[];
  extraProperties?: Record<string, unknown>;
}

export interface FeatureDefinitionUpdateDto {
  displayName: string;
  description?: string;
  defaultValue?: string;
  valueType: string;
  isAvailableToHost: boolean;
  isVisibleToClients: boolean;
  parentName?: string;
  allowedProviders?: string[];
  concurrencyStamp?: string;
  extraProperties?: Record<string, unknown>;
}

export interface FeatureDefinitionGetListInput {
  filter?: string;
  groupName?: string;
}

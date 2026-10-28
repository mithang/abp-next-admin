import type { AuditedEntityDto } from '@abp/core';

enum DataAccessOperation {
  /** Xóa */
  Delete = 2,
  /** Truy vấn */
  Read = 0,
  /** Cập nhật */
  Write = 1,
}

enum DataAccessFilterOperate {
  /** Bao gồm */
  Contains = 9,
  /** Bao gồm bên phải */
  EndsWith = 8,
  /** Bằng */
  Equal = 1,
  /** Lớn hơn */
  Greater = 5,
  /** Lớn hơn hoặc bằng */
  GreaterOrEqual = 6,
  /** Nhỏ hơn */
  Less = 3,
  /** Nhỏ hơn hoặc bằng */
  LessOrEqual = 4,
  /** Không bao gồm */
  NotContains = 10,
  /** Không bằng */
  NotEqual = 2,
  /** Bao gồm bên trái */
  StartsWith = 7,
}

enum DataAccessFilterLogic {
  /** Và */
  And = 0,
  /** Hoặc */
  Or = 1,
}

interface DataAccessFilterRule {
  [key: string]: any;
  field: string;
  isLeft: boolean;
  javaScriptType: string;
  operate: DataAccessFilterOperate;
  typeFullName: string;
  value: string;
}

interface DataAccessFilterGroup {
  groups: DataAccessFilterGroup[];
  logic: DataAccessFilterLogic;
  rules: DataAccessFilterRule[];
}

interface EntityRuleDtoBase extends AuditedEntityDto<string> {
  accessedProperties: string[];
  entityTypeFullName: string;
  entityTypeId: string;
  filterGroup: DataAccessFilterGroup;
  isEnabled: boolean;
  operation: DataAccessOperation;
  tenantId?: string;
}

interface EntityEnumInfoModel {
  key: string;
  value: any;
}

interface EntityPropertyInfoModel {
  displayName: string;
  enums: EntityEnumInfoModel[];
  javaScriptName: string;
  javaScriptType: string;
  name: string;
  operates: DataAccessFilterOperate[];
  typeFullName: string;
}

interface EntityTypeInfoModel {
  displayName: string;
  name: string;
  properties: EntityPropertyInfoModel[];
}

interface EntityTypeInfoGetModel {
  operation: DataAccessOperation;
}

export { DataAccessFilterLogic, DataAccessFilterOperate, DataAccessOperation };

export type {
  DataAccessFilterGroup,
  DataAccessFilterRule,
  EntityRuleDtoBase,
  EntityTypeInfoGetModel,
  EntityTypeInfoModel,
};

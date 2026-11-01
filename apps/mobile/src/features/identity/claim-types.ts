/** DTO khớp backend ABP: xem apps/vben5/packages/@abp/identity/src/types/claim-types.ts
 * và API web apps/vben5/packages/@abp/identity/src/api/useClaimTypesApi.ts.
 * ValueType của backend: String=0, Int=1, Boolean=2, DateTime=3. */
export enum ValueType {
  String = 0,
  Int = 1,
  Boolean = 2,
  DateTime = 3,
}

export interface IdentityClaimTypeDto {
  id: string;
  name: string;
  description?: string;
  regex?: string;
  regexDescription?: string;
  required: boolean;
  isStatic: boolean;
  valueType: ValueType;
}

export interface GetClaimTypePagedListInput {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
  filter?: string;
}

/** Nhãn hiển thị cho ValueType, dùng ở list/detail (i18n ở tầng UI). */
export function valueTypeKey(valueType: ValueType): 'string' | 'int' | 'boolean' | 'datetime' {
  switch (valueType) {
    case ValueType.Int:
      return 'int';
    case ValueType.Boolean:
      return 'boolean';
    case ValueType.DateTime:
      return 'datetime';
    case ValueType.String:
    default:
      return 'string';
  }
}

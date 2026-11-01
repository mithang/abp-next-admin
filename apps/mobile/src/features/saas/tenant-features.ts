/**
 * Giá trị tính năng theo tenant — bản mobile của FeatureModal web
 * (@abp/features, dùng trong TenantTable với providerName 'T',
 * providerKey = tenant id).
 *
 * Nguồn sự thật: GET/PUT/DELETE /api/feature-management/features
 * (ABP FeatureManagement, web useFeaturesApi) với query
 * providerName + providerKey. GET trả { groups: [{ name, displayName,
 * features: [{ name, displayName, description, value, valueType }] }] };
 * PUT nhận { features: [{ name, value }] } với value LUÔN là chuỗi
 * (web getFeatureInput: mọi feature có value !== null, String(value)).
 *
 * Render đúng web FeatureModal: feature có valueType null không render
 * (v-if valueType !== null); BOOLEAN (validator BOOLEAN) → Switch;
 * NUMERIC → số; SelectionStringValueType → chọn trong itemSource.items;
 * còn lại → text. Validation mirror web createRules: NUMERIC kiểm tra
 * MinValue/MaxValue, STRING kiểm tra MinLength/MaxLength khi các
 * properties parse được; riêng quy tắc "AllowNull=true → required" của
 * web không áp dụng ở đây vì nó mâu thuẫn với tên thuộc tính và chưa
 * được xác minh bằng test backend — giá trị rỗng được gửi đi như web
 * gửi (chuỗi rỗng), backend tự validate.
 */

export interface FeatureValueValidator {
  name: string;
  properties?: Record<string, string>;
}

export interface FeatureSelectionItem {
  value: string;
  displayName?: string;
  displayText?: { resourceName?: string; name?: string };
}

export interface FeatureValueType {
  name: string;
  validator: FeatureValueValidator;
  itemSource?: { items: FeatureSelectionItem[] };
}

export interface FeatureValue {
  name: string;
  displayName: string;
  description?: string;
  value?: string | boolean | number | null;
  valueType: FeatureValueType | null;
}

export interface FeatureValueGroup {
  name: string;
  displayName: string;
  features: FeatureValue[];
}

export interface GetFeatureValuesResult {
  groups: FeatureValueGroup[];
}

export interface UpdateFeatureValue {
  name: string;
  value: string;
}

export interface UpdateFeatureValuesInput {
  features: UpdateFeatureValue[];
}

export type FeatureInputKind = 'boolean' | 'numeric' | 'selection' | 'text';

/** Chỉ feature có valueType mới render được như web (v-if valueType !== null). */
export function editableFeatures(group: FeatureValueGroup): FeatureValue[] {
  return group.features.filter((feature) => feature.valueType !== null);
}

/** Kiểu control theo valueType — đúng mapFeatures/render của web. */
export function featureInputKind(feature: FeatureValue): FeatureInputKind {
  const valueType = feature.valueType;
  if (!valueType) return 'text';
  if (valueType.name === 'SelectionStringValueType') return 'selection';
  if (valueType.validator?.name === 'BOOLEAN') return 'boolean';
  if (valueType.validator?.name === 'NUMERIC') return 'numeric';
  return 'text';
}

/**
 * Giá trị ban đầu dạng chuỗi để đưa vào control: web mapFeatures đổi
 * BOOLEAN thành boolean thật ('true' → true) và NUMERIC thành Number;
 * ở đây giữ dạng chuỗi ('true'/'false', số dạng chuỗi) vì control mobile
 * làm việc với chuỗi, và PUT cuối cùng vẫn gửi String(value) như web.
 */
export function initialEditValue(feature: FeatureValue): string {
  if (feature.value === null || feature.value === undefined) return '';
  if (featureInputKind(feature) === 'boolean') {
    return String(feature.value).toLowerCase() === 'true' ? 'true' : 'false';
  }
  if (featureInputKind(feature) === 'numeric') {
    const num = Number(feature.value);
    return Number.isNaN(num) ? String(feature.value) : String(num);
  }
  return String(feature.value);
}

/**
 * Nhãn của một selection item: web mapFeatures gán displayName từ
 * displayText (resource 'Fixed' → name trực tiếp, còn lại → key
 * localization). Mobile không resolve resource backend nên dùng
 * displayName nếu server đã trả, ngược lại dùng displayText.name.
 */
export function selectionItemLabel(item: FeatureSelectionItem): string {
  if (item.displayName) return item.displayName;
  if (item.displayText?.name) return item.displayText.name;
  return item.value;
}

function parseNumber(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const num = Number(raw);
  return Number.isNaN(num) ? null : num;
}

/**
 * Validate một giá trị đã sửa, trả về mã lỗi hoặc null. Các mã này map
 * sang i18n ở màn hình (tenantFeatures.*). Chỉ validate khi properties
 * parse được — giống web: validator thiếu properties thì không chặn.
 */
export function validateFeatureValue(
  feature: FeatureValue,
  value: string,
): 'invalidNumber' | 'outOfRange' | 'tooShort' | 'tooLong' | 'invalidOption' | null {
  const kind = featureInputKind(feature);
  const validator = feature.valueType?.validator;
  if (kind === 'numeric') {
    if (value.trim() !== '' && Number.isNaN(Number(value))) return 'invalidNumber';
    if (value.trim() !== '') {
      const num = Number(value);
      const min = parseNumber(validator?.properties?.MinValue);
      const max = parseNumber(validator?.properties?.MaxValue);
      if ((min !== null && num < min) || (max !== null && num > max)) return 'outOfRange';
    }
    return null;
  }
  if (kind === 'selection') {
    const items = feature.valueType?.itemSource?.items ?? [];
    if (value !== '' && !items.some((item) => item.value === value)) return 'invalidOption';
    return null;
  }
  if (kind === 'text') {
    const min = parseNumber(validator?.properties?.MinLength);
    const max = parseNumber(validator?.properties?.MaxLength);
    if (min !== null && value.length < min) return 'tooShort';
    if (max !== null && value.length > max) return 'tooLong';
    return null;
  }
  return null;
}

/**
 * Build body PUT — đúng web getFeatureInput: mọi feature có giá trị
 * hiệu dụng !== null đều được gửi, value luôn là chuỗi. Feature không
 * sửa giữ nguyên giá trị gốc; feature đã sửa dùng giá trị đã sửa
 * (boolean lưu 'true'/'false', numeric lưu dạng chuỗi số).
 */
export function buildFeatureUpdateInput(
  groups: FeatureValueGroup[],
  edits: Record<string, string>,
): UpdateFeatureValuesInput {
  const features: UpdateFeatureValue[] = [];
  for (const group of groups) {
    for (const feature of group.features) {
      const edited = Object.prototype.hasOwnProperty.call(edits, feature.name);
      const raw = edited ? edits[feature.name] : initialEditValue(feature);
      if (!edited && (feature.value === null || feature.value === undefined)) continue;
      if (edited && raw === '' && (feature.value === null || feature.value === undefined)) continue;
      features.push({ name: feature.name, value: raw });
    }
  }
  return { features };
}

/** true khi có ít nhất một giá trị đã sửa khác giá trị gốc. */
export function hasFeatureEdits(
  groups: FeatureValueGroup[],
  edits: Record<string, string>,
): boolean {
  return groups.some((group) =>
    group.features.some(
      (feature) =>
        Object.prototype.hasOwnProperty.call(edits, feature.name) &&
        edits[feature.name] !== initialEditValue(feature),
    ),
  );
}

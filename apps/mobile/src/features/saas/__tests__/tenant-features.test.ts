import { describe, it, expect } from '@jest/globals';
import {
  buildFeatureUpdateInput,
  editableFeatures,
  featureInputKind,
  hasFeatureEdits,
  initialEditValue,
  selectionItemLabel,
  validateFeatureValue,
  type FeatureValue,
  type FeatureValueGroup,
} from '../tenant-features';

const booleanFeature: FeatureValue = {
  name: 'Feature.Boolean',
  displayName: 'Boolean',
  value: 'True',
  valueType: { name: 'ToggleStringValueType', validator: { name: 'BOOLEAN', properties: {} } },
};

const numericFeature: FeatureValue = {
  name: 'Feature.Number',
  displayName: 'Number',
  value: '5',
  valueType: {
    name: 'FreeTextStringValueType',
    validator: { name: 'NUMERIC', properties: { MinValue: '1', MaxValue: '10' } },
  },
};

const selectionFeature: FeatureValue = {
  name: 'Feature.Mode',
  displayName: 'Mode',
  value: 'fast',
  valueType: {
    name: 'SelectionStringValueType',
    validator: { name: 'STRING', properties: {} },
    itemSource: {
      items: [
        { value: 'fast', displayName: 'Fast' },
        { value: 'slow', displayText: { resourceName: 'Fixed', name: 'Slow' } },
      ],
    },
  },
};

const textFeature: FeatureValue = {
  name: 'Feature.Text',
  displayName: 'Text',
  value: 'abc',
  valueType: {
    name: 'FreeTextStringValueType',
    validator: { name: 'STRING', properties: { MinLength: '2', MaxLength: '5' } },
  },
};

const nullTypeFeature: FeatureValue = {
  name: 'Feature.Hidden',
  displayName: 'Hidden',
  value: 'x',
  valueType: null,
};

const groups: FeatureValueGroup[] = [
  {
    name: 'Group',
    displayName: 'Group',
    features: [booleanFeature, numericFeature, selectionFeature, textFeature, nullTypeFeature],
  },
];

describe('tenant feature values', () => {
  it('kind: BOOLEAN → boolean, NUMERIC → numeric, Selection → selection, còn lại → text', () => {
    expect(featureInputKind(booleanFeature)).toBe('boolean');
    expect(featureInputKind(numericFeature)).toBe('numeric');
    expect(featureInputKind(selectionFeature)).toBe('selection');
    expect(featureInputKind(textFeature)).toBe('text');
    expect(featureInputKind(nullTypeFeature)).toBe('text');
  });

  it('editableFeatures loại feature valueType null như web (v-if)', () => {
    expect(editableFeatures(groups[0]).map((f) => f.name)).not.toContain('Feature.Hidden');
    expect(editableFeatures(groups[0])).toHaveLength(4);
  });

  it('initialEditValue: boolean về chữ thường, numeric chuẩn hóa số, text giữ nguyên', () => {
    expect(initialEditValue(booleanFeature)).toBe('true');
    expect(initialEditValue({ ...numericFeature, value: '05' })).toBe('5');
    expect(initialEditValue(textFeature)).toBe('abc');
    expect(initialEditValue({ ...textFeature, value: null })).toBe('');
  });

  it('selectionItemLabel: displayName thắng, ngược lại dùng displayText.name', () => {
    const items = selectionFeature.valueType?.itemSource?.items ?? [];
    expect(selectionItemLabel(items[0])).toBe('Fast');
    expect(selectionItemLabel(items[1])).toBe('Slow');
    expect(selectionItemLabel({ value: 'x' })).toBe('x');
  });

  it('validate: numeric ngoài khoảng / không phải số, text quá ngắn/dài, selection ngoài items', () => {
    expect(validateFeatureValue(numericFeature, '0')).toBe('outOfRange');
    expect(validateFeatureValue(numericFeature, '11')).toBe('outOfRange');
    expect(validateFeatureValue(numericFeature, '5')).toBeNull();
    expect(validateFeatureValue(numericFeature, 'abc')).toBe('invalidNumber');
    expect(validateFeatureValue(textFeature, 'a')).toBe('tooShort');
    expect(validateFeatureValue(textFeature, 'abcdef')).toBe('tooLong');
    expect(validateFeatureValue(textFeature, 'abc')).toBeNull();
    expect(validateFeatureValue(selectionFeature, 'other')).toBe('invalidOption');
    expect(validateFeatureValue(selectionFeature, 'fast')).toBeNull();
    expect(validateFeatureValue(booleanFeature, 'true')).toBeNull();
  });

  it('buildFeatureUpdateInput: gửi mọi feature có giá trị (đúng web), value luôn chuỗi, chỉ đổi phần đã sửa', () => {
    const input = buildFeatureUpdateInput(groups, { 'Feature.Number': '7' });
    expect(input.features).toEqual([
      { name: 'Feature.Boolean', value: 'true' },
      { name: 'Feature.Number', value: '7' },
      { name: 'Feature.Mode', value: 'fast' },
      { name: 'Feature.Text', value: 'abc' },
      { name: 'Feature.Hidden', value: 'x' },
    ]);
  });

  it('buildFeatureUpdateInput: feature gốc null và không sửa thì không gửi', () => {
    const input = buildFeatureUpdateInput(
      [{ name: 'G', displayName: 'G', features: [{ ...textFeature, value: null }] }],
      {},
    );
    expect(input.features).toEqual([]);
  });

  it('hasFeatureEdits chỉ true khi giá trị sửa khác gốc', () => {
    expect(hasFeatureEdits(groups, {})).toBe(false);
    expect(hasFeatureEdits(groups, { 'Feature.Text': 'abc' })).toBe(false);
    expect(hasFeatureEdits(groups, { 'Feature.Text': 'abd' })).toBe(true);
  });
});

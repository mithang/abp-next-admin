import { describe, it, expect } from '@jest/globals';
import { claimTypeFormSchema, toClaimTypeCreateInput, toClaimTypeUpdateInput, claimTypeFormDefaults } from '../claim-type-form-schema';
import { ValueType } from '../claim-types';

describe('claim type form schema', () => {
  it('chấp nhận form tạo hợp lệ, trim tên', () => {
    const parsed = claimTypeFormSchema.safeParse({
      name: '  phone_number  ',
      valueType: ValueType.String,
      required: false,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.name).toBe('phone_number');
  });

  it('từ chối tên rỗng (sau trim) và valueType ngoài enum', () => {
    expect(
      claimTypeFormSchema.safeParse({ name: '   ', valueType: ValueType.String, required: false }).success,
    ).toBe(false);
    expect(
      claimTypeFormSchema.safeParse({ name: 'x', valueType: 99, required: false }).success,
    ).toBe(false);
  });

  it('từ chối tên quá 256 ký tự', () => {
    expect(
      claimTypeFormSchema.safeParse({ name: 'a'.repeat(257), valueType: ValueType.Int, required: true }).success,
    ).toBe(false);
  });

  it('update chỉ gửi 4 field, không gửi name/valueType', () => {
    const body = toClaimTypeUpdateInput({
      ...claimTypeFormDefaults,
      name: 'phone_number',
      valueType: ValueType.String,
      required: true,
      description: '  Số điện thoại  ',
      regex: '',
      regexDescription: undefined,
    });
    expect(body).toEqual({ description: 'Số điện thoại', regex: undefined, regexDescription: undefined, required: true });
    expect(body).not.toHaveProperty('name');
    expect(body).not.toHaveProperty('valueType');
  });

  it('create gửi đủ field, isStatic mặc định false, chuỗi rỗng thành undefined', () => {
    const body = toClaimTypeCreateInput({
      ...claimTypeFormDefaults,
      name: 'age',
      valueType: ValueType.Int,
      required: false,
      description: '',
    });
    expect(body).toEqual({
      name: 'age',
      valueType: ValueType.Int,
      required: false,
      isStatic: false,
      description: undefined,
      regex: undefined,
      regexDescription: undefined,
    });
  });
});

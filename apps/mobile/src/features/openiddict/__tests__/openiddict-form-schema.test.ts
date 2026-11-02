import { describe, it, expect } from '@jest/globals';
import { applicationFormDefaults, applicationFormSchema } from '../application-form-schema';
import { scopeFormDefaults, scopeFormSchema } from '../scope-form-schema';

describe('applicationFormSchema', () => {
  it('clientId bắt buộc, chuỗi trắng bị trim thành rỗng và lỗi', () => {
    expect(
      applicationFormSchema.safeParse({ ...applicationFormDefaults, clientId: '' }).success,
    ).toBe(false);
    expect(
      applicationFormSchema.safeParse({ ...applicationFormDefaults, clientId: '   ' }).success,
    ).toBe(false);
  });

  it('clientId hợp lệ cho phép các field còn lại trống', () => {
    const result = applicationFormSchema.safeParse({ ...applicationFormDefaults, clientId: 'web' });
    expect(result.success).toBe(true);
  });
});

describe('scopeFormSchema', () => {
  it('name bắt buộc, chuỗi trắng bị trim thành rỗng và lỗi', () => {
    expect(scopeFormSchema.safeParse({ ...scopeFormDefaults, name: '' }).success).toBe(false);
    expect(scopeFormSchema.safeParse({ ...scopeFormDefaults, name: '   ' }).success).toBe(false);
  });

  it('name hợp lệ cho phép các field còn lại trống', () => {
    const result = scopeFormSchema.safeParse({ ...scopeFormDefaults, name: 'openid' });
    expect(result.success).toBe(true);
  });
});

import { describe, it, expect } from '@jest/globals';
import { roleFormSchema } from '../role-form-schema';

describe('role form schema', () => {
  it('chấp nhận form hợp lệ, trim tên', () => {
    const parsed = roleFormSchema.safeParse({
      name: '  Admin  ',
      isDefault: false,
      isPublic: true,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.name).toBe('Admin');
  });

  it('từ chối tên rỗng (sau trim)', () => {
    expect(
      roleFormSchema.safeParse({ name: '   ', isDefault: false, isPublic: false }).success,
    ).toBe(false);
  });

  it('từ chối khi thiếu cờ boolean', () => {
    expect(roleFormSchema.safeParse({ name: 'Admin' }).success).toBe(false);
  });
});

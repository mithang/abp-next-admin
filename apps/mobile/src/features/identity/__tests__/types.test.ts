import { describe, it, expect } from '@jest/globals';
import { displayName } from '../types';

describe('displayName', () => {
  it('ưu tiên họ + tên, fallback userName', () => {
    const base = {
      id: '1', userName: 'admin', name: 'Admin', email: 'a@b.c',
      emailConfirmed: true, phoneNumberConfirmed: false, isActive: true,
      twoFactorEnabled: false, lockoutEnabled: false, roleNames: [],
    };
    expect(displayName({ ...base, surname: 'Nguyen' })).toBe('Admin Nguyen');
    expect(displayName({ ...base, surname: undefined })).toBe('Admin');
    expect(displayName({ ...base, name: '', surname: '' })).toBe('admin');
  });
});

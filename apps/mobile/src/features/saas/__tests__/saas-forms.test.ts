import { describe, it, expect } from '@jest/globals';
import { tenantFormSchema, tenantFormDefaults } from '../tenant-form-schema';
import { editionFormSchema } from '../edition-form-schema';
import {
  connectionStringSetFormSchema,
  connectionStringCheckFormSchema,
} from '../connection-string-form-schema';

const GUID = '123e4567-e89b-12d3-a456-426614174000';

describe('saas forms', () => {
  it('tenant create: thiếu admin email/password bị chặn; DB riêng thiếu defaultConnectionString bị chặn', () => {
    const base = { ...tenantFormDefaults, name: 'acme' };
    const missingAdmin = tenantFormSchema(true).safeParse(base);
    expect(missingAdmin.success).toBe(false);
    if (!missingAdmin.success) {
      const paths = missingAdmin.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('adminEmailAddress');
      expect(paths).toContain('adminPassword');
    }
    const badEmail = tenantFormSchema(true).safeParse({
      ...base,
      adminEmailAddress: 'not-an-email',
      adminPassword: 'secret',
    });
    expect(badEmail.success).toBe(false);
    const customDb = tenantFormSchema(true).safeParse({
      ...base,
      adminEmailAddress: 'admin@acme.test',
      adminPassword: 'secret',
      useSharedDatabase: false,
      defaultConnectionString: '',
    });
    expect(customDb.success).toBe(false);
    const ok = tenantFormSchema(true).safeParse({
      ...base,
      adminEmailAddress: 'admin@acme.test',
      adminPassword: 'secret',
      useSharedDatabase: false,
      defaultConnectionString: 'Host=.;',
      editionId: GUID,
      enableTime: '2026-01-01T00:00:00',
      disableTime: '2027-01-01T00:00:00',
    });
    expect(ok.success).toBe(true);
  });

  it('tenant: editionId sai dạng Guid, ngày giờ sai, enable muộn hơn disable đều bị chặn; sửa không bắt admin fields', () => {
    const base = { ...tenantFormDefaults, name: 'acme' };
    expect(tenantFormSchema(true).safeParse({ ...base, editionId: 'not-a-guid' }).success).toBe(false);
    expect(
      tenantFormSchema(true).safeParse({ ...base, enableTime: 'khong-phai-ngay' }).success,
    ).toBe(false);
    expect(
      tenantFormSchema(true).safeParse({
        ...base,
        enableTime: '2027-01-01T00:00:00',
        disableTime: '2026-01-01T00:00:00',
      }).success,
    ).toBe(false);
    const editOk = tenantFormSchema(false).safeParse(base);
    expect(editOk.success).toBe(true);
  });

  it('edition: displayName bắt buộc; extraProperties JSON sai bị chặn', () => {
    expect(editionFormSchema.safeParse({ displayName: '', extraPropertiesJson: '' }).success).toBe(false);
    expect(
      editionFormSchema.safeParse({ displayName: 'Pro', extraPropertiesJson: '{sai' }).success,
    ).toBe(false);
    expect(
      editionFormSchema.safeParse({ displayName: 'Pro', extraPropertiesJson: '{"a":1}' }).success,
    ).toBe(true);
  });

  it('connection strings: đặt cần name + value; kiểm tra cần provider + connectionString', () => {
    expect(connectionStringSetFormSchema.safeParse({ name: '', value: 'x' }).success).toBe(false);
    expect(connectionStringSetFormSchema.safeParse({ name: 'Default', value: '' }).success).toBe(false);
    expect(connectionStringSetFormSchema.safeParse({ name: 'Default', value: 'Host=.;' }).success).toBe(true);
    expect(
      connectionStringCheckFormSchema.safeParse({ provider: '', connectionString: 'x' }).success,
    ).toBe(false);
    expect(
      connectionStringCheckFormSchema.safeParse({ provider: 'PostgreSql', connectionString: '' }).success,
    ).toBe(false);
    expect(
      connectionStringCheckFormSchema.safeParse({ provider: 'PostgreSql', connectionString: 'Host=.;' })
        .success,
    ).toBe(true);
  });
});

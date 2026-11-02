import { describe, it, expect, afterEach } from '@jest/globals';
import {
  collectChangedSettings,
  getSystemSettings,
  isValidEmail,
  isValidOptionValue,
  sendTestEmail,
  setSystemSettings,
} from '../settings-api';
import {
  createSettingDefinition,
  deleteSettingDefinition,
  getAssignableProviders,
  getSettingDefinition,
  getSettingDefinitions,
  updateSettingDefinition,
} from '../settings-definitions-api';
import { settingDefinitionFormSchema } from '../setting-definition-form-schema';
import { SettingValueType, type SettingGroup } from '../types';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

function bodyOf(calls: unknown[][], index = 0) {
  return JSON.parse((calls[index][1] as { body: string }).body) as Record<string, unknown>;
}

const groups: SettingGroup[] = [
  {
    displayName: 'Email',
    description: '',
    settings: [
      {
        displayName: 'SMTP',
        details: [
          {
            name: 'Abp.Mailing.Smtp.Host',
            displayName: 'Host',
            defaultValue: '',
            value: 'smtp.example.com',
            valueType: SettingValueType.String,
            isEncrypted: false,
            options: [],
          },
          {
            name: 'Abp.Mailing.Smtp.EnableSsl',
            displayName: 'SSL',
            defaultValue: 'false',
            value: 'false',
            valueType: SettingValueType.Boolean,
            isEncrypted: false,
            options: [],
          },
          {
            name: 'Abp.Mailing.Smtp.Port',
            displayName: 'Port',
            defaultValue: '25',
            value: '587',
            valueType: SettingValueType.Number,
            isEncrypted: false,
            options: [],
          },
          {
            name: 'Abp.Mailing.DefaultFromAddress',
            displayName: 'From',
            defaultValue: '',
            value: 'a@b.co',
            valueType: SettingValueType.String,
            isEncrypted: false,
            options: [],
            slot: 'send-test-email',
          },
          {
            name: 'Some.Option',
            displayName: 'Option',
            defaultValue: 'A',
            value: 'A',
            valueType: SettingValueType.Option,
            isEncrypted: false,
            options: [
              { name: 'A', value: 'A' },
              { name: 'B', value: 'B' },
            ],
          },
          {
            name: 'Some.NoSet',
            displayName: 'NoSet',
            defaultValue: '',
            value: 'x',
            valueType: SettingValueType.NoSet,
            isEncrypted: false,
            options: [],
          },
          {
            name: 'Some.Array',
            displayName: 'Array',
            defaultValue: '',
            value: '[]',
            valueType: SettingValueType.Array,
            isEncrypted: false,
            options: [],
          },
        ],
      },
    ],
  },
];

describe('system settings api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getSystemSettings gọi đúng route v2', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [] }));
    await getSystemSettings();
    expect(calls[0][0]).toContain('/api/v2/setting-management/settings');
  });

  it('collectChangedSettings chỉ gửi giá trị đã đổi, bỏ NoSet/Array và giá trị không đổi', () => {
    const result = collectChangedSettings(groups, {
      'Abp.Mailing.Smtp.Host': 'smtp.new.com',
      'Abp.Mailing.Smtp.EnableSsl': 'true',
      'Abp.Mailing.Smtp.Port': '587',
      'Some.NoSet': 'changed',
      'Some.Array': 'changed',
    });
    expect(result).toEqual({
      settings: [
        { name: 'Abp.Mailing.Smtp.Host', value: 'smtp.new.com' },
        { name: 'Abp.Mailing.Smtp.EnableSsl', value: 'true' },
      ],
    });
  });

  it('collectChangedSettings trả danh sách rỗng khi không có gì đổi', () => {
    expect(collectChangedSettings(groups, {})).toEqual({ settings: [] });
  });

  it('setSystemSettings PUT đúng route v2 với body đã thu thập', async () => {
    const { calls } = stubFetch('');
    await setSystemSettings({
      settings: [{ name: 'Abp.Mailing.Smtp.Host', value: 'smtp.new.com' }],
    });
    expect(calls[0][0]).toContain('/api/v2/setting-management/settings');
    expect((calls[0][1] as { method: string }).method).toBe('PUT');
    expect(bodyOf(calls)).toEqual({
      settings: [{ name: 'Abp.Mailing.Smtp.Host', value: 'smtp.new.com' }],
    });
  });

  it('sendTestEmail POST đúng route với emailAddress', async () => {
    const { calls } = stubFetch('');
    await sendTestEmail('test@example.com');
    expect(calls[0][0]).toContain('/api/setting-management/settings/send-test-email');
    expect(bodyOf(calls)).toEqual({ emailAddress: 'test@example.com' });
  });

  it('isValidOptionValue chỉ chấp nhận giá trị trong options', () => {
    expect(isValidOptionValue('B', [{ value: 'A' }, { value: 'B' }])).toBe(true);
    expect(isValidOptionValue('C', [{ value: 'A' }])).toBe(false);
  });

  it('isValidEmail chặn email không hợp lệ trước khi gọi API', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('setting definitions api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getSettingDefinitions gắn filter', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [] }));
    await getSettingDefinitions({ filter: 'Abp' });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/setting-management/settings/definitions?');
    expect(url).toContain('filter=Abp');
  });

  it('getSettingDefinition encode name có dấu chấm', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'Abp.Mailing.Smtp.Host' }));
    await getSettingDefinition('Abp.Mailing.Smtp.Host');
    expect(calls[0][0]).toContain(
      '/api/setting-management/settings/definitions/Abp.Mailing.Smtp.Host',
    );
  });

  it('createSettingDefinition gửi name + displayName', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'X', displayName: 'X' }));
    await createSettingDefinition({
      name: 'X',
      displayName: 'X',
      isEncrypted: false,
      isInherited: false,
      isVisibleToClients: true,
      providers: [],
    });
    expect(bodyOf(calls)).toMatchObject({ name: 'X', displayName: 'X' });
  });

  it('updateSettingDefinition không gửi name/isStatic, giữ concurrencyStamp khi caller truyền', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'X' }));
    await updateSettingDefinition('X', {
      displayName: 'Mới',
      isEncrypted: false,
      isInherited: false,
      isVisibleToClients: true,
      providers: ['T'],
      concurrencyStamp: 'abc',
    });
    const body = bodyOf(calls);
    expect(body).not.toHaveProperty('name');
    expect(body).not.toHaveProperty('isStatic');
    expect(body).toEqual(expect.objectContaining({ displayName: 'Mới', concurrencyStamp: 'abc' }));
  });

  it('deleteSettingDefinition gọi đúng route', async () => {
    const { calls } = stubFetch('');
    await deleteSettingDefinition('X');
    expect(calls[0][0]).toContain('/api/setting-management/settings/definitions/X');
    expect((calls[0][1] as { method: string }).method).toBe('DELETE');
  });

  it('getAssignableProviders gọi đúng route', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [] }));
    await getAssignableProviders();
    expect(calls[0][0]).toContain(
      '/api/setting-management/settings/definitions/assignable-providers',
    );
  });

  it('schema định nghĩa cài đặt bắt buộc name và displayName', () => {
    const base = {
      displayName: 'X',
      description: '',
      defaultValue: '',
      isEncrypted: false,
      isInherited: false,
      isVisibleToClients: true,
      providers: '',
    };
    expect(settingDefinitionFormSchema.safeParse({ ...base, name: '' }).success).toBe(false);
    expect(
      settingDefinitionFormSchema.safeParse({ ...base, name: 'X', displayName: '' }).success,
    ).toBe(false);
    expect(settingDefinitionFormSchema.safeParse({ ...base, name: 'X' }).success).toBe(true);
  });
});

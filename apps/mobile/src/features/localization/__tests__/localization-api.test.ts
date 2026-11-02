import { describe, it, expect, afterEach } from '@jest/globals';
import {
  createLanguage,
  createResource,
  deleteLanguage,
  deleteResource,
  deleteText,
  getLanguage,
  getLanguagesPaged,
  getResourcesPaged,
  getTextByKey,
  getTexts,
  setText,
  updateLanguage,
  updateResource,
} from '../localization-api';
import {
  languageFormSchema,
  resourceFormSchema,
  textEditInitialValues,
  textFormSchema,
} from '../form-schemas';

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

function methodOf(calls: unknown[][], index = 0) {
  return (calls[index][1] as { method: string }).method;
}

describe('localization languages api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getLanguagesPaged gắn filter/skipCount/maxResultCount', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getLanguagesPaged({ filter: 'vi', skipCount: 20, maxResultCount: 20 });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/localization/languages?');
    expect(url).toContain('filter=vi');
    expect(url).toContain('skipCount=20');
    expect(url).toContain('maxResultCount=20');
  });

  it('getLanguage encode cultureName trong path', async () => {
    const { calls } = stubFetch(JSON.stringify({ cultureName: 'pt-BR' }));
    await getLanguage('pt-BR');
    expect(calls[0][0]).toContain('/api/localization/languages/pt-BR');
  });

  it('createLanguage POST đủ cultureName/uiCultureName/displayName', async () => {
    const { calls } = stubFetch(JSON.stringify({ cultureName: 'vi' }));
    await createLanguage({ cultureName: 'vi', uiCultureName: 'vi', displayName: 'Tiếng Việt' });
    expect(methodOf(calls)).toBe('POST');
    expect(bodyOf(calls)).toEqual({
      cultureName: 'vi',
      uiCultureName: 'vi',
      displayName: 'Tiếng Việt',
    });
  });

  it('updateLanguage CHỈ gửi displayName (backend update DTO không có uiCultureName)', async () => {
    const { calls } = stubFetch(JSON.stringify({ cultureName: 'vi' }));
    await updateLanguage('vi', { displayName: 'Tiếng Việt mới' });
    expect(methodOf(calls)).toBe('PUT');
    expect(bodyOf(calls)).toEqual({ displayName: 'Tiếng Việt mới' });
  });

  it('deleteLanguage DELETE đúng path', async () => {
    const { calls } = stubFetch('');
    await deleteLanguage('vi');
    expect(methodOf(calls)).toBe('DELETE');
    expect(calls[0][0]).toContain('/api/localization/languages/vi');
  });

  it('languageFormSchema bắt buộc cultureName và displayName', () => {
    expect(
      languageFormSchema.safeParse({ cultureName: '', uiCultureName: '', displayName: 'X' })
        .success,
    ).toBe(false);
    expect(
      languageFormSchema.safeParse({ cultureName: 'vi', uiCultureName: '', displayName: '' })
        .success,
    ).toBe(false);
    expect(
      languageFormSchema.safeParse({
        cultureName: 'vi',
        uiCultureName: 'vi',
        displayName: 'Tiếng Việt',
      }).success,
    ).toBe(true);
  });
});

describe('localization resources api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getResourcesPaged gắn filter và phân trang', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getResourcesPaged({ filter: 'Abp', skipCount: 0, maxResultCount: 20 });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/localization/resources?');
    expect(url).toContain('filter=Abp');
  });

  it('createResource POST đủ name/displayName/enable', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'Abp' }));
    await createResource({ name: 'MyRes', displayName: 'My', description: 'd', enable: true });
    expect(bodyOf(calls)).toEqual({
      name: 'MyRes',
      displayName: 'My',
      description: 'd',
      enable: true,
    });
  });

  it('updateResource giữ defaultCultureName đã tải trong body', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'MyRes' }));
    await updateResource('MyRes', {
      displayName: 'My2',
      description: 'd2',
      defaultCultureName: 'en',
      enable: false,
    });
    expect(methodOf(calls)).toBe('PUT');
    expect(bodyOf(calls)).toEqual({
      displayName: 'My2',
      description: 'd2',
      defaultCultureName: 'en',
      enable: false,
    });
  });

  it('deleteResource DELETE đúng path', async () => {
    const { calls } = stubFetch('');
    await deleteResource('MyRes');
    expect(methodOf(calls)).toBe('DELETE');
    expect(calls[0][0]).toContain('/api/localization/resources/MyRes');
  });

  it('resourceFormSchema bắt buộc name và displayName', () => {
    expect(
      resourceFormSchema.safeParse({ name: '', displayName: 'X', description: '', enable: true })
        .success,
    ).toBe(false);
    expect(
      resourceFormSchema.safeParse({
        name: 'MyRes',
        displayName: 'My',
        description: '',
        enable: true,
      }).success,
    ).toBe(true);
  });
});

describe('localization texts api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getTexts gắn đủ cultureName/targetCultureName và onlyNull', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [] }));
    await getTexts({
      cultureName: 'en',
      targetCultureName: 'vi',
      resourceName: 'Abp',
      filter: 'Save',
      onlyNull: true,
    });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/localization/texts?');
    expect(url).toContain('cultureName=en');
    expect(url).toContain('targetCultureName=vi');
    expect(url).toContain('resourceName=Abp');
    expect(url).toContain('onlyNull=true');
  });

  it('getTextByKey gọi route by-key với đủ 3 tham số', async () => {
    const { calls } = stubFetch(JSON.stringify({ key: 'Save' }));
    await getTextByKey({ cultureName: 'vi', resourceName: 'Abp', key: 'Save' });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/localization/texts/by-key?');
    expect(url).toContain('cultureName=vi');
    expect(url).toContain('key=Save');
  });

  it('setText PUT đúng body (set-text tạo mới hoặc cập nhật)', async () => {
    const { calls } = stubFetch('');
    await setText({ cultureName: 'vi', resourceName: 'Abp', key: 'Save', value: 'Lưu' });
    expect(methodOf(calls)).toBe('PUT');
    expect(bodyOf(calls)).toEqual({
      cultureName: 'vi',
      resourceName: 'Abp',
      key: 'Save',
      value: 'Lưu',
    });
  });

  it('deleteText DELETE gửi body đúng như bảng web (cultureName nguồn của dòng)', async () => {
    const { calls } = stubFetch('');
    await deleteText({ resourceName: 'Abp', cultureName: 'en', key: 'Save' });
    expect(methodOf(calls)).toBe('DELETE');
    expect(bodyOf(calls)).toEqual({ resourceName: 'Abp', cultureName: 'en', key: 'Save' });
  });

  it('textEditInitialValues sửa bản dịch của culture ĐÍCH, giữ key và targetValue', () => {
    expect(
      textEditInitialValues({
        resourceName: 'Abp',
        key: 'Save',
        targetCultureName: 'vi',
        targetValue: 'Lưu',
      }),
    ).toEqual({ cultureName: 'vi', resourceName: 'Abp', key: 'Save', value: 'Lưu' });
    expect(
      textEditInitialValues({
        resourceName: 'Abp',
        key: 'Save',
        targetCultureName: 'vi',
        targetValue: null,
      }),
    ).toEqual({ cultureName: 'vi', resourceName: 'Abp', key: 'Save', value: '' });
  });

  it('textFormSchema bắt buộc cả 4 trường', () => {
    expect(
      textFormSchema.safeParse({ cultureName: 'vi', resourceName: 'Abp', key: 'Save', value: '' })
        .success,
    ).toBe(false);
    expect(
      textFormSchema.safeParse({
        cultureName: 'vi',
        resourceName: 'Abp',
        key: 'Save',
        value: 'Lưu',
      }).success,
    ).toBe(true);
  });
});

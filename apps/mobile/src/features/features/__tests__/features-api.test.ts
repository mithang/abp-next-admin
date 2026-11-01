import { describe, it, expect, afterEach } from '@jest/globals';
import {
  createFeatureGroup,
  deleteFeatureGroup,
  getFeatureGroup,
  getFeatureGroups,
  updateFeatureGroup,
} from '../feature-groups-api';
import {
  createFeatureDefinition,
  deleteFeatureDefinition,
  getFeatureDefinition,
  getFeatureDefinitions,
  updateFeatureDefinition,
} from '../feature-definitions-api';
import { featureGroupFormSchema } from '../feature-group-form-schema';
import { featureDefinitionFormSchema } from '../feature-definition-form-schema';

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

describe('feature groups api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getFeatureGroups gắn filter và parse ListResult', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [{ name: 'Abp', displayName: 'ABP' }] }));
    const data = await getFeatureGroups({ filter: 'Abp' });
    expect(data.items).toHaveLength(1);
    const url = calls[0][0] as string;
    expect(url).toContain('/api/feature-management/definitions/groups?');
    expect(url).toContain('filter=Abp');
  });

  it('updateFeatureGroup chỉ gửi displayName (+ concurrencyStamp khi có)', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'G' }));
    await updateFeatureGroup('G', { displayName: 'Mới', concurrencyStamp: 'abc' });
    expect(bodyOf(calls)).toEqual({ displayName: 'Mới', concurrencyStamp: 'abc' });
  });

  it('create/delete/get dùng đúng route groups', async () => {
    const created = stubFetch(JSON.stringify({ name: 'G' }));
    await createFeatureGroup({ name: 'G', displayName: 'Nhóm' });
    expect(bodyOf(created.calls)).toEqual({ name: 'G', displayName: 'Nhóm' });
    const got = stubFetch(JSON.stringify({ name: 'G' }));
    await getFeatureGroup('G');
    expect(got.calls[0][0] as string).toContain('/api/feature-management/definitions/groups/G');
    const del = stubFetch('');
    await deleteFeatureGroup('G');
    expect((del.calls[0][1] as { method: string }).method).toBe('DELETE');
  });

  it('schema nhóm tính năng bắt buộc name và displayName', () => {
    expect(featureGroupFormSchema.safeParse({ name: '', displayName: 'X' }).success).toBe(false);
    expect(featureGroupFormSchema.safeParse({ name: 'G', displayName: 'Nhóm' }).success).toBe(true);
  });
});

describe('feature definitions api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getFeatureDefinitions gắn filter và groupName', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [] }));
    await getFeatureDefinitions({ filter: 'Chat', groupName: 'Abp' });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/feature-management/definitions?');
    expect(url).toContain('groupName=Abp');
  });

  it('updateFeatureDefinition không gửi name/groupName', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'F' }));
    await updateFeatureDefinition('F', {
      displayName: 'Mới',
      valueType: 'FreeTextStringValueType',
      isAvailableToHost: true,
      isVisibleToClients: true,
    });
    const body = bodyOf(calls);
    expect(body).not.toHaveProperty('name');
    expect(body).not.toHaveProperty('groupName');
    expect(body.valueType).toBe('FreeTextStringValueType');
  });

  it('createFeatureDefinition gửi đủ field tạo mới', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'F' }));
    await createFeatureDefinition({
      name: 'F',
      groupName: 'G',
      displayName: 'Tính năng',
      valueType: 'ToggleStringValueType',
      isAvailableToHost: true,
      isVisibleToClients: false,
    });
    expect(bodyOf(calls)).toMatchObject({ name: 'F', groupName: 'G', valueType: 'ToggleStringValueType' });
  });

  it('delete/get dùng route definitions/{name}', async () => {
    const got = stubFetch(JSON.stringify({ name: 'F' }));
    await getFeatureDefinition('F');
    expect(got.calls[0][0] as string).toContain('/api/feature-management/definitions/F');
    const del = stubFetch('');
    await deleteFeatureDefinition('F');
    expect((del.calls[0][1] as { method: string }).method).toBe('DELETE');
  });

  it('schema định nghĩa tính năng bắt buộc name, groupName, displayName, valueType', () => {
    const base = {
      name: 'F', groupName: 'G', displayName: 'Tính năng', description: '', defaultValue: '',
      valueType: 'FreeTextStringValueType', isAvailableToHost: true, isVisibleToClients: true,
      parentName: '', allowedProviders: '',
    };
    expect(featureDefinitionFormSchema.safeParse({ ...base, valueType: '' }).success).toBe(false);
    expect(featureDefinitionFormSchema.safeParse(base).success).toBe(true);
  });
});

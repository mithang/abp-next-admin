import { describe, it, expect, afterEach } from '@jest/globals';
import {
  createPermissionGroup,
  deletePermissionGroup,
  getPermissionGroup,
  getPermissionGroups,
  updatePermissionGroup,
} from '../permission-groups-api';
import {
  createPermissionDefinition,
  deletePermissionDefinition,
  getPermissionDefinition,
  getPermissionDefinitions,
  updatePermissionDefinition,
} from '../permission-definitions-api';
import { permissionGroupFormSchema } from '../permission-group-form-schema';
import { permissionDefinitionFormSchema } from '../permission-definition-form-schema';

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

describe('permission groups api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getPermissionGroups gắn filter và parse ListResult', async () => {
    const { calls } = stubFetch(
      JSON.stringify({ items: [{ name: 'AbpIdentity', displayName: 'Identity' }] }),
    );
    const data = await getPermissionGroups({ filter: 'Identity' });
    expect(data.items).toHaveLength(1);
    const url = calls[0][0] as string;
    expect(url).toContain('/api/permission-management/definitions/groups?');
    expect(url).toContain('filter=Identity');
  });

  it('getPermissionGroup encode name có dấu chấm trong URL', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'AbpIdentity', displayName: 'Identity' }));
    await getPermissionGroup('AbpIdentity.Users');
    expect(calls[0][0] as string).toContain(
      '/api/permission-management/definitions/groups/AbpIdentity.Users',
    );
  });

  it('updatePermissionGroup chỉ gửi displayName, không gửi name', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'G', displayName: 'Mới' }));
    await updatePermissionGroup('G', { displayName: 'Mới' });
    const body = bodyOf(calls);
    expect(body).toEqual({ displayName: 'Mới' });
    expect(body).not.toHaveProperty('name');
  });

  it('deletePermissionGroup gọi đúng route', async () => {
    const { calls } = stubFetch('');
    await deletePermissionGroup('G');
    expect(calls[0][0] as string).toContain('/api/permission-management/definitions/groups/G');
    expect((calls[0][1] as { method: string }).method).toBe('DELETE');
  });

  it('createPermissionGroup gửi name + displayName', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'G', displayName: 'Nhóm' }));
    await createPermissionGroup({ name: 'G', displayName: 'Nhóm' });
    expect(bodyOf(calls)).toEqual({ name: 'G', displayName: 'Nhóm' });
  });

  it('schema nhóm quyền bắt buộc name và displayName', () => {
    expect(permissionGroupFormSchema.safeParse({ name: '', displayName: 'X' }).success).toBe(false);
    expect(permissionGroupFormSchema.safeParse({ name: 'G', displayName: '' }).success).toBe(false);
    expect(permissionGroupFormSchema.safeParse({ name: 'G', displayName: 'Nhóm' }).success).toBe(
      true,
    );
  });
});

describe('permission definitions api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getPermissionDefinitions gắn filter và groupName', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [] }));
    await getPermissionDefinitions({ filter: 'Users', groupName: 'AbpIdentity' });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/permission-management/definitions?');
    expect(url).toContain('filter=Users');
    expect(url).toContain('groupName=AbpIdentity');
  });

  it('updatePermissionDefinition không gửi name/groupName', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'P' }));
    await updatePermissionDefinition('P', {
      displayName: 'Mới',
      isEnabled: true,
      providers: ['R'],
      stateCheckers: '',
    });
    const body = bodyOf(calls);
    expect(body).not.toHaveProperty('name');
    expect(body).not.toHaveProperty('groupName');
    expect(body.providers).toEqual(['R']);
  });

  it('createPermissionDefinition gửi đủ field tạo mới', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'P' }));
    await createPermissionDefinition({
      name: 'P',
      groupName: 'G',
      displayName: 'Quyền',
      isEnabled: true,
      providers: [],
      stateCheckers: '',
    });
    expect(bodyOf(calls)).toMatchObject({ name: 'P', groupName: 'G', displayName: 'Quyền' });
  });

  it('delete/get dùng route definitions/{name}', async () => {
    const { calls } = stubFetch(JSON.stringify({ name: 'P' }));
    await getPermissionDefinition('P');
    expect(calls[0][0] as string).toContain('/api/permission-management/definitions/P');
    const del = stubFetch('');
    await deletePermissionDefinition('P');
    expect(del.calls[0][0] as string).toContain('/api/permission-management/definitions/P');
  });

  it('schema định nghĩa quyền bắt buộc name, groupName, displayName', () => {
    const base = {
      name: 'P',
      groupName: 'G',
      displayName: 'Quyền',
      isEnabled: true,
      parentName: '',
      providers: '',
      stateCheckers: '',
    };
    expect(permissionDefinitionFormSchema.safeParse({ ...base, groupName: '' }).success).toBe(
      false,
    );
    expect(permissionDefinitionFormSchema.safeParse(base).success).toBe(true);
  });
});

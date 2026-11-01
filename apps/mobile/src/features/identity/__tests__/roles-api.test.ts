import { describe, it, expect, afterEach } from '@jest/globals';
import { deleteRole, getRole, getRolesPaged } from '../roles-api';
import { roleFlags } from '../roles-types';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

describe('roles api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getRolesPaged gắn query ABP và parse PagedResult', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 1, items: [{ id: 'r1', name: 'Admin' }] }));
    const data = await getRolesPaged({ filter: 'adm', skipCount: 0, maxResultCount: 20 });
    expect(data.totalCount).toBe(1);
    const url = calls[0][0] as string;
    expect(url).toContain('/api/identity/roles?');
    expect(url).toContain('filter=adm');
    expect(url).toContain('maxResultCount=20');
  });

  it('getRole encode id trong URL', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'a/b', name: 'Admin' }));
    await getRole('a/b');
    expect((calls[0][0] as string)).toContain('/api/identity/roles/a%2Fb');
  });

  it('deleteRole trả undefined cho 204', async () => {
    stubFetch('', 204);
    await expect(deleteRole('r1')).resolves.toBeUndefined();
  });
});

describe('roleFlags', () => {
  const base = { id: 'r1', name: 'Admin', isDefault: false, isPublic: false, isStatic: false };
  it('trả đủ cờ theo DTO', () => {
    expect(roleFlags({ ...base, isDefault: true, isStatic: true })).toEqual(['default', 'static']);
    expect(roleFlags(base)).toEqual([]);
  });
});

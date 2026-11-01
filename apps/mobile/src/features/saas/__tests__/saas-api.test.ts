import { describe, it, expect, afterEach } from '@jest/globals';
import {
  checkTenantConnectionString,
  createEdition,
  createTenant,
  deleteEdition,
  deleteTenant,
  deleteTenantConnectionString,
  getEditionsPaged,
  getTenantConnectionStrings,
  getTenantsPaged,
  setTenantConnectionString,
  updateEdition,
  updateTenant,
} from '../saas-api';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

function urlOf(calls: unknown[][], index = 0) {
  return calls[index][0] as string;
}

function methodOf(calls: unknown[][], index = 0) {
  return (calls[index][1] as { method: string }).method;
}

function bodyOf(calls: unknown[][], index = 0) {
  return JSON.parse((calls[index][1] as { body: string }).body) as Record<string, unknown>;
}

describe('saas api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('tenants: list gắn filter + phân trang ABP; create POST kèm admin fields; update PUT kèm concurrencyStamp; delete DELETE', async () => {
    const list = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getTenantsPaged({ filter: 'acme', skipCount: 20, maxResultCount: 20 });
    expect(urlOf(list.calls)).toContain('/api/saas/tenants?');
    expect(urlOf(list.calls)).toContain('filter=acme');
    expect(urlOf(list.calls)).toContain('skipCount=20');

    const create = stubFetch(JSON.stringify({ id: '1' }));
    await createTenant({
      name: 'acme',
      isActive: true,
      adminEmailAddress: 'admin@acme.test',
      adminPassword: 'secret',
      useSharedDatabase: true,
      connectionStrings: [],
    });
    expect(methodOf(create.calls)).toBe('POST');
    expect(urlOf(create.calls)).toContain('/api/saas/tenants');
    expect(bodyOf(create.calls).adminEmailAddress).toBe('admin@acme.test');
    expect(bodyOf(create.calls).useSharedDatabase).toBe(true);

    const update = stubFetch(JSON.stringify({ id: '1' }));
    await updateTenant('abc', { name: 'acme', isActive: false, concurrencyStamp: 'stamp' });
    expect(methodOf(update.calls)).toBe('PUT');
    expect(urlOf(update.calls)).toContain('/api/saas/tenants/abc');
    expect(bodyOf(update.calls).concurrencyStamp).toBe('stamp');
    expect(bodyOf(update.calls).adminEmailAddress).toBeUndefined();

    const del = stubFetch('', 204);
    await deleteTenant('abc');
    expect(methodOf(del.calls)).toBe('DELETE');
  });

  it('tenant connection strings: list/get/set/delete đúng route; check POST đúng route', async () => {
    const list = stubFetch(JSON.stringify({ items: [] }));
    await getTenantConnectionStrings('t1');
    expect(urlOf(list.calls)).toContain('/api/saas/tenants/t1/connection-string');

    const set = stubFetch(JSON.stringify({ name: 'Default', value: 'x' }));
    await setTenantConnectionString('t1', { name: 'Default', value: 'Server=.;' });
    expect(methodOf(set.calls)).toBe('PUT');
    expect(urlOf(set.calls)).toContain('/api/saas/tenants/t1/connection-string');
    expect(bodyOf(set.calls).name).toBe('Default');

    const del = stubFetch('', 204);
    await deleteTenantConnectionString('t1', 'Default');
    expect(methodOf(del.calls)).toBe('DELETE');
    expect(urlOf(del.calls)).toContain('/api/saas/tenants/t1/connection-string/Default');

    const check = stubFetch('', 200);
    await checkTenantConnectionString({ provider: 'PostgreSql', connectionString: 'Host=.;' });
    expect(methodOf(check.calls)).toBe('POST');
    expect(urlOf(check.calls)).toContain('/api/saas/tenants/connection-string/check');
    expect(bodyOf(check.calls).provider).toBe('PostgreSql');
  });

  it('editions: list gắn filter + phân trang; create POST displayName; update PUT kèm concurrencyStamp; delete DELETE', async () => {
    const list = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getEditionsPaged({ filter: 'pro', skipCount: 0, maxResultCount: 20 });
    expect(urlOf(list.calls)).toContain('/api/saas/editions?');
    expect(urlOf(list.calls)).toContain('filter=pro');

    const create = stubFetch(JSON.stringify({ id: '1' }));
    await createEdition({ displayName: 'Pro' });
    expect(methodOf(create.calls)).toBe('POST');
    expect(bodyOf(create.calls).displayName).toBe('Pro');

    const update = stubFetch(JSON.stringify({ id: '1' }));
    await updateEdition('e1', { displayName: 'Pro+', concurrencyStamp: 'stamp' });
    expect(methodOf(update.calls)).toBe('PUT');
    expect(urlOf(update.calls)).toContain('/api/saas/editions/e1');
    expect(bodyOf(update.calls).concurrencyStamp).toBe('stamp');

    const del = stubFetch('', 204);
    await deleteEdition('e1');
    expect(methodOf(del.calls)).toBe('DELETE');
  });
});

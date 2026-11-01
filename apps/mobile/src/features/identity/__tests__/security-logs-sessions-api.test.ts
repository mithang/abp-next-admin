import { describe, it, expect, afterEach } from '@jest/globals';
import { deleteSecurityLog, deleteSecurityLogsBulk, getSecurityLog, getSecurityLogsPaged } from '../security-logs-api';
import { getSessionsPaged, revokeSession } from '../sessions-api';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

describe('security-logs api', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('dùng endpoint /api/auditing/security-log (không phải /api/identity)', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 1, items: [{ id: 's1', userName: 'admin' }] }));
    const data = await getSecurityLogsPaged({ userName: 'admin', skipCount: 0, maxResultCount: 20 });
    expect(data.totalCount).toBe(1);
    const url = calls[0][0] as string;
    expect(url).toContain('/api/auditing/security-log?');
    expect(url).toContain('userName=admin');
  });

  it('get/delete encode id; bulk gửi { ids }', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'a/b', userName: 'admin' }));
    await getSecurityLog('a/b');
    expect(calls[0][0] as string).toContain('/api/auditing/security-log/a%2Fb');
    stubFetch('', 204);
    await deleteSecurityLog('s1');
    stubFetch('', 204);
    const bulk = stubFetch('', 204);
    await deleteSecurityLogsBulk(['s1', 's2']);
    expect(JSON.parse((bulk.calls[0][1] as { body: string }).body)).toEqual({ ids: ['s1', 's2'] });
  });
});

describe('sessions api', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getSessionsPaged lọc theo device', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getSessionsPaged({ device: 'Chrome', skipCount: 0, maxResultCount: 20 });
    expect(calls[0][0] as string).toContain('/api/identity/sessions?');
    expect(calls[0][0] as string).toContain('device=Chrome');
  });

  it('revoke dùng sessionId (không phải id entity) và encode', async () => {
    const { calls } = stubFetch('', 204);
    await revokeSession('sess/a');
    expect(calls[0][0] as string).toContain('/api/identity/sessions/sess%2Fa/revoke');
  });
});

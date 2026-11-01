import { describe, it, expect, afterEach } from '@jest/globals';
import { apiRequest } from '../api-client';

interface FakeResponse {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}

function stubFetch(response: FakeResponse): { calls: unknown[][] } {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return response;
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

describe('apiRequest', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('gắn query ABP và parse PagedResult', async () => {
    const { calls } = stubFetch({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ totalCount: 2, items: [{ id: '1' }] }),
    });
    const data = await apiRequest<{ totalCount: number }>('/api/identity/users', {
      params: { skipCount: 0, maxResultCount: 20, filter: 'a' },
    });
    expect(data.totalCount).toBe(2);
    const url = calls[0][0] as string;
    expect(url).toContain('/api/identity/users?');
    expect(url).toContain('maxResultCount=20');
  });

  it('ném ApiError đã map cho 401 và không retry ở tầng client', async () => {
    const { calls } = stubFetch({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ error: { message: 'Unauthorized' } }),
    });
    await expect(apiRequest('/api/identity/users')).rejects.toMatchObject({ kind: 'unauthorized', status: 401 });
    expect(calls).toHaveLength(1);
  });

  it('trả undefined cho 204', async () => {
    stubFetch({ ok: true, status: 204, text: async () => '' });
    await expect(apiRequest('/api/identity/users/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });
});

import { describe, it, expect, afterEach } from '@jest/globals';
import { apiRequest, setUnauthorizedHandler } from '../api-client';

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

  it('gửi header _AbpDontWrapResult để nhận DTO thô thay vì envelope', async () => {
    const { calls } = stubFetch({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ totalCount: 1, items: [] }),
    });
    await apiRequest('/api/identity/users');
    const init = calls[0][1] as { headers: Record<string, string> };
    expect(init.headers._AbpDontWrapResult).toBe('true');
  });

  it('bóc envelope thành công {code:"0", result} về kèm HTTP 200', async () => {
    stubFetch({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({ code: '0', message: 'OK', result: { totalCount: 2, items: [{ id: '1' }] } }),
    });
    const data = await apiRequest<{ totalCount: number }>('/api/identity/users');
    expect(data.totalCount).toBe(2);
  });

  it('ném ApiError validation từ envelope lỗi HTTP 200 code 400', async () => {
    stubFetch({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ code: '400', message: 'Dữ liệu không hợp lệ.', details: null }),
    });
    await expect(apiRequest('/api/identity/users')).rejects.toMatchObject({
      kind: 'validation',
      status: 400,
      message: 'Dữ liệu không hợp lệ.',
    });
  });

  it('envelope lỗi 401 gọi unauthorized handler', async () => {
    stubFetch({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ code: '401', message: 'Unauthorized' }),
    });
    let called = false;
    setUnauthorizedHandler(() => {
      called = true;
    });
    try {
      await expect(apiRequest('/api/identity/users')).rejects.toMatchObject({ kind: 'unauthorized' });
      expect(called).toBe(true);
    } finally {
      setUnauthorizedHandler(null);
    }
  });

  it('không bóc DTO thật có field code nhưng thừa key ngoài envelope', async () => {
    stubFetch({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({ id: '1', name: 'root', code: 'root', displayName: 'Root', items: [] }),
    });
    const data = await apiRequest<{ code: string }>('/api/platform/data');
    expect(data.code).toBe('root');
  });
});

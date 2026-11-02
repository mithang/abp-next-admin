import { describe, it, expect, afterEach } from '@jest/globals';
import {
  createApplication,
  deleteApplication,
  getApplication,
  getApplicationsPaged,
  updateApplication,
} from '../applications-api';
import { createScope, deleteScope, getScope, getScopesPaged, updateScope } from '../scopes-api';
import {
  deleteAuthorization,
  getAuthorization,
  getAuthorizationsPaged,
} from '../authorizations-api';
import { deleteToken, getToken, getTokensPaged } from '../tokens-api';
import { parseMultiline, toMultiline } from '../multiline';

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

describe('openiddict applications api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getApplicationsPaged gắn query ABP và parse PagedResult', async () => {
    const { calls } = stubFetch(
      JSON.stringify({ totalCount: 1, items: [{ id: 'a1', clientId: 'web' }] }),
    );
    const data = await getApplicationsPaged({ filter: 'web', skipCount: 0, maxResultCount: 20 });
    expect(data.totalCount).toBe(1);
    const url = calls[0][0] as string;
    expect(url).toContain('/api/openiddict/applications?');
    expect(url).toContain('filter=web');
  });

  it('getApplication encode id trong URL', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'a/b', clientId: 'web' }));
    await getApplication('a/b');
    expect(calls[0][0] as string).toContain('/api/openiddict/applications/a%2Fb');
  });

  it('createApplication luôn gửi requirements requirePkce=false và settings tokenLifetime rỗng', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'a1', clientId: 'web' }));
    await createApplication({
      clientId: 'web',
      displayName: 'Web',
      redirectUris: ['https://x/cb'],
      scopes: ['openid'],
    });
    const body = bodyOf(calls);
    expect(body.clientId).toBe('web');
    expect(body.redirectUris).toEqual(['https://x/cb']);
    expect(body.requirements).toEqual({ features: { requirePkce: false } });
    expect(body.settings).toEqual({ tokenLifetime: {} });
    expect(body).not.toHaveProperty('clientSecret');
  });

  it('updateApplication gửi cùng body mặc định requirements/settings', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'a1', clientId: 'web' }));
    await updateApplication('a1', { clientId: 'web', scopes: [] });
    const body = bodyOf(calls);
    expect(body.requirements).toEqual({ features: { requirePkce: false } });
    expect(body.settings).toEqual({ tokenLifetime: {} });
    expect(calls[0][0] as string).toContain('/api/openiddict/applications/a1');
  });

  it('updateApplication giữ nguyên requirements/settings hiện có khi được truyền vào (không reset PKCE/lifetime khi sửa)', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'a1', clientId: 'web' }));
    await updateApplication('a1', {
      clientId: 'web',
      requirements: { features: { requirePkce: true } },
      settings: { tokenLifetime: { accessToken: 3600 } },
    });
    const body = bodyOf(calls);
    expect(body.requirements).toEqual({ features: { requirePkce: true } });
    expect(body.settings).toEqual({ tokenLifetime: { accessToken: 3600 } });
  });

  it('deleteApplication trả undefined cho 204', async () => {
    stubFetch('', 204);
    await expect(deleteApplication('a1')).resolves.toBeUndefined();
  });
});

describe('openiddict scopes api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getScopesPaged gắn filter và parse PagedResult', async () => {
    const { calls } = stubFetch(
      JSON.stringify({ totalCount: 1, items: [{ id: 's1', name: 'openid' }] }),
    );
    const data = await getScopesPaged({ filter: 'open', skipCount: 0, maxResultCount: 20 });
    expect(data.totalCount).toBe(1);
    expect(calls[0][0] as string).toContain('/api/openiddict/scopes?');
    expect(calls[0][0] as string).toContain('filter=open');
  });

  it('createScope gửi name/displayName/description/resources', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 's1', name: 'api' }));
    await createScope({ name: 'api', displayName: 'API', description: 'd', resources: ['res1'] });
    expect(bodyOf(calls)).toEqual({
      name: 'api',
      displayName: 'API',
      description: 'd',
      resources: ['res1'],
    });
  });

  it('updateScope PUT đúng id và body', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 's1', name: 'api' }));
    await updateScope('s1', { name: 'api', resources: [] });
    expect(bodyOf(calls)).toEqual({ name: 'api', resources: [] });
    expect(calls[0][0] as string).toContain('/api/openiddict/scopes/s1');
  });

  it('getScope encode id và deleteScope trả undefined cho 204', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'a/b', name: 'api' }));
    await getScope('a/b');
    expect(calls[0][0] as string).toContain('/api/openiddict/scopes/a%2Fb');
    stubFetch('', 204);
    await expect(deleteScope('s1')).resolves.toBeUndefined();
  });
});

describe('openiddict authorizations api (chỉ đọc + xóa)', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getAuthorizationsPaged gắn filter/subject/status/type', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getAuthorizationsPaged({ filter: 'u1', subject: 'u1', status: 'valid', type: 'ad-hoc' });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/openiddict/authorizations?');
    expect(url).toContain('filter=u1');
    expect(url).toContain('subject=u1');
    expect(url).toContain('status=valid');
    expect(url).toContain('type=ad-hoc');
  });

  it('getAuthorization encode id và deleteAuthorization trả undefined cho 204', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'z1', subject: 'u1' }));
    await getAuthorization('z1');
    expect(calls[0][0] as string).toContain('/api/openiddict/authorizations/z1');
    stubFetch('', 204);
    await expect(deleteAuthorization('z1')).resolves.toBeUndefined();
  });
});

describe('openiddict tokens api (chỉ đọc + xóa)', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getTokensPaged gắn filter/subject/status/type/clientId', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getTokensPaged({
      filter: 'u1',
      subject: 'u1',
      status: 'valid',
      type: 'refresh_token',
      clientId: 'web',
    });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/openiddict/tokens?');
    expect(url).toContain('clientId=web');
    expect(url).toContain('type=refresh_token');
  });

  it('getToken encode id và deleteToken trả undefined cho 204', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 't1', subject: 'u1' }));
    await getToken('t1');
    expect(calls[0][0] as string).toContain('/api/openiddict/tokens/t1');
    stubFetch('', 204);
    await expect(deleteToken('t1')).resolves.toBeUndefined();
  });
});

describe('multiline helper', () => {
  it('parseMultiline bỏ dòng trống, trim khoảng trắng, giữ thứ tự', () => {
    expect(parseMultiline('https://a/cb\n\n  https://b/cb  \nopenid')).toEqual([
      'https://a/cb',
      'https://b/cb',
      'openid',
    ]);
    expect(parseMultiline('')).toEqual([]);
    expect(parseMultiline('  \n ')).toEqual([]);
  });

  it('toMultiline nối bằng newline, mảng rỗng/undefined thành chuỗi rỗng', () => {
    expect(toMultiline(['a', 'b'])).toBe('a\nb');
    expect(toMultiline([])).toBe('');
    expect(toMultiline(undefined)).toBe('');
  });
});

import { describe, it, expect, afterEach } from '@jest/globals';
import {
  getCacheKeys,
  getCacheValue,
  refreshCacheKey,
  removeCacheKey,
  removeCacheKeys,
  setCacheValue,
} from '../caching-api';
import { cacheSetFormSchema, toCacheSetExpirations } from '../cache-set-form-schema';

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

describe('caching api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getCacheKeys gắn filter/marker/prefix, không dùng skipCount (phân trang marker)', async () => {
    const { calls } = stubFetch(JSON.stringify({ keys: ['a'], nextMarker: 'm2' }));
    const result = await getCacheKeys({ filter: 'order', marker: 'm1', prefix: 'p:' });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/caching-management/cache/keys?');
    expect(url).toContain('filter=order');
    expect(url).toContain('marker=m1');
    expect(url).toContain('prefix=p%3A');
    expect(url).not.toContain('skipCount');
    expect(result.nextMarker).toBe('m2');
  });

  it('getCacheValue GET .../value?key, set PUT .../set, refresh PUT .../refresh', async () => {
    const get = stubFetch(JSON.stringify({ type: 'string', size: 3, values: {} }));
    await getCacheValue({ key: 'a b' });
    // Query string dùng URLSearchParams nên khoảng trắng mã hóa thành '+'
    // (chuẩn application/x-www-form-urlencoded, backend parse đúng) — khác
    // với path segment dùng encodeURIComponent (%20) như các API trước.
    expect(get.calls[0][0]).toContain('/api/caching-management/cache/value?key=a+b');
    expect(methodOf(get.calls, 0)).toBe('GET');
    const set = stubFetch('', 204);
    await setCacheValue({ key: 'k', value: 'v', absoluteExpiration: '2026-11-02T00:00:00.000Z' });
    expect(set.calls[0][0]).toContain('/api/caching-management/cache/set');
    expect(methodOf(set.calls, 0)).toBe('PUT');
    expect(bodyOf(set.calls)).toEqual({
      key: 'k',
      value: 'v',
      absoluteExpiration: '2026-11-02T00:00:00.000Z',
    });
    const refresh = stubFetch('', 204);
    await refreshCacheKey({ key: 'k', slidingExpiration: '2026-11-03T00:00:00.000Z' });
    expect(refresh.calls[0][0]).toContain('/api/caching-management/cache/refresh');
    expect(methodOf(refresh.calls, 0)).toBe('PUT');
    expect(bodyOf(refresh.calls)).toEqual({
      key: 'k',
      slidingExpiration: '2026-11-03T00:00:00.000Z',
    });
  });

  it('remove DELETE .../remove?key; bulk remove DELETE .../bulk/remove body { keys }', async () => {
    const del = stubFetch('', 204);
    await removeCacheKey({ key: 'a/b' });
    expect(del.calls[0][0]).toContain('/api/caching-management/cache/remove?key=a%2Fb');
    expect(methodOf(del.calls, 0)).toBe('DELETE');
    const bulk = stubFetch('', 204);
    await removeCacheKeys({ keys: ['k1', 'k2'] });
    expect(bulk.calls[0][0]).toContain('/api/caching-management/cache/bulk/remove');
    expect(methodOf(bulk.calls, 0)).toBe('DELETE');
    expect(bodyOf(bulk.calls)).toEqual({ keys: ['k1', 'k2'] });
  });

  it('cache set form: key bắt buộc, ngày không hợp lệ bị chặn, đổi hạn sang ISO', () => {
    expect(cacheSetFormSchema.safeParse({ key: '', value: '' }).success).toBe(false);
    expect(
      cacheSetFormSchema.safeParse({ key: 'k', absoluteExpiration: 'not-a-date' }).success,
    ).toBe(false);
    const ok = cacheSetFormSchema.safeParse({
      key: 'k',
      value: 'v',
      absoluteExpiration: '2026-11-02T10:00:00',
    });
    expect(ok.success).toBe(true);
    if (ok.success) {
      expect(toCacheSetExpirations(ok.data)).toEqual({
        absoluteExpiration: '2026-11-02T10:00:00.000Z',
        slidingExpiration: undefined,
      });
    }
    expect(
      toCacheSetExpirations({ key: 'k', absoluteExpiration: '', slidingExpiration: '' }),
    ).toEqual({
      absoluteExpiration: undefined,
      slidingExpiration: undefined,
    });
  });
});

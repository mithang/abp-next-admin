import { describe, it, expect, afterEach } from '@jest/globals';
import { deleteClaimType, getClaimType, getClaimTypesPaged, updateClaimType } from '../claim-types-api';
import { ValueType, valueTypeKey } from '../claim-types';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

describe('claim-types api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getClaimTypesPaged gắn query ABP và parse PagedResult', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 1, items: [{ id: 'c1', name: 'email', valueType: 0 }] }));
    const data = await getClaimTypesPaged({ filter: 'em', skipCount: 0, maxResultCount: 20 });
    expect(data.totalCount).toBe(1);
    const url = calls[0][0] as string;
    expect(url).toContain('/api/identity/claim-types?');
    expect(url).toContain('filter=em');
  });

  it('getClaimType encode id trong URL', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'a/b', name: 'email', valueType: 0 }));
    await getClaimType('a/b');
    expect(calls[0][0] as string).toContain('/api/identity/claim-types/a%2Fb');
  });

  it('updateClaimType chỉ gửi field update (không gửi name/valueType)', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'c1', name: 'email', valueType: 0 }));
    await updateClaimType('c1', { required: true, description: 'd' });
    const body = JSON.parse((calls[0][1] as { body: string }).body) as Record<string, unknown>;
    expect(body).toEqual({ required: true, description: 'd' });
  });

  it('deleteClaimType trả undefined cho 204', async () => {
    stubFetch('', 204);
    await expect(deleteClaimType('c1')).resolves.toBeUndefined();
  });
});

describe('valueTypeKey', () => {
  it('map đúng enum backend String=0, Int=1, Boolean=2, DateTime=3', () => {
    expect(valueTypeKey(ValueType.String)).toBe('string');
    expect(valueTypeKey(ValueType.Int)).toBe('int');
    expect(valueTypeKey(ValueType.Boolean)).toBe('boolean');
    expect(valueTypeKey(ValueType.DateTime)).toBe('datetime');
  });
});

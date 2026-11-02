import { describe, it, expect } from '@jest/globals';
import { getTenantAvailability, isTenantAvailable } from '../tenant-availability';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

describe('tenant availability (application-configuration)', () => {
  it('DTO thô: isAvailable true/false đọc đúng', () => {
    expect(
      isTenantAvailable({ currentTenant: { id: 't1', name: 'acme', isAvailable: true } }),
    ).toBe(true);
    expect(isTenantAvailable({ currentTenant: { id: null, name: null, isAvailable: false } })).toBe(
      false,
    );
  });

  it('dạng { result: { currentTenant } } cũng đọc được (phòng envelope chưa unwrap)', () => {
    expect(isTenantAvailable({ result: { currentTenant: { isAvailable: true } } })).toBe(true);
  });

  it('thiếu currentTenant / payload null / cờ thiếu → false (về phạm vi Toàn cục)', () => {
    expect(isTenantAvailable({})).toBe(false);
    expect(isTenantAvailable(null)).toBe(false);
    expect(isTenantAvailable({ currentTenant: {} })).toBe(false);
  });

  it('GET đúng route application-configuration, trả isAvailable từ DTO thô', async () => {
    const stub = stubFetch(
      JSON.stringify({ currentTenant: { id: null, name: null, isAvailable: false } }),
    );
    await expect(getTenantAvailability()).resolves.toBe(false);
    expect(stub.calls[0][0] as string).toContain('/api/abp/application-configuration');
    expect((stub.calls[0][1] as { method: string }).method).toBe('GET');
  });

  it('envelope code 0 đã unwrap qua apiRequest vẫn cho isAvailable true', async () => {
    stubFetch(
      JSON.stringify({
        code: '0',
        result: { currentTenant: { id: 't1', name: 'acme', isAvailable: true } },
      }),
    );
    await expect(getTenantAvailability()).resolves.toBe(true);
  });
});

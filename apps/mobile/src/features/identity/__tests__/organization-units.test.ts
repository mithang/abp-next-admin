import { describe, it, expect, afterEach } from '@jest/globals';
import {
  createOrganizationUnit,
  deleteOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnitsAll,
  updateOrganizationUnit,
} from '../organization-units-api';
import { findOrganizationUnitName, flattenOrganizationUnits } from '../organization-units';
import {
  organizationUnitFormSchema,
  toOrganizationUnitCreateInput,
  toOrganizationUnitUpdateInput,
} from '../organization-unit-form-schema';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

describe('organization-units api', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getOrganizationUnitsAll gọi /all (không phân trang) để dựng cây client', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [] }));
    await getOrganizationUnitsAll();
    expect(calls[0][0]).toEqual(expect.stringContaining('/api/identity/organization-units/all'));
  });

  it('getOrganizationUnit encode id trong URL', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'a/b', code: '1', displayName: 'Root' }));
    await getOrganizationUnit('a/b');
    expect(calls[0][0] as string).toContain('/api/identity/organization-units/a%2Fb');
  });

  it('create gửi displayName + parentId, update chỉ gửi displayName', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'u1', code: '1.1', displayName: 'Child' }));
    await createOrganizationUnit({ displayName: 'Child', parentId: 'p1' });
    expect(JSON.parse((calls[0][1] as { body: string }).body)).toEqual({
      displayName: 'Child',
      parentId: 'p1',
    });
    await updateOrganizationUnit('u1', { displayName: 'Renamed' });
    expect(JSON.parse((calls[1][1] as { body: string }).body)).toEqual({ displayName: 'Renamed' });
  });

  it('delete trả undefined cho 204', async () => {
    stubFetch('', 204);
    await expect(deleteOrganizationUnit('u1')).resolves.toBeUndefined();
  });
});

describe('flattenOrganizationUnits', () => {
  it('trải DFS theo cấp, mồ côi thành gốc, chống vòng lặp', () => {
    const units = [
      { id: 'root', code: '1', displayName: 'Root' },
      { id: 'child', code: '1.1', displayName: 'Child', parentId: 'root' },
      { id: 'grand', code: '1.1.1', displayName: 'Grand', parentId: 'child' },
      { id: 'orphan', code: '9', displayName: 'Orphan', parentId: 'missing' },
      { id: 'loop-a', code: '8.1', displayName: 'LoopA', parentId: 'loop-b' },
      { id: 'loop-b', code: '8.2', displayName: 'LoopB', parentId: 'loop-a' },
    ];
    const flat = flattenOrganizationUnits(units);
    expect(flat.map((f) => f.unit.id)).toEqual([
      'root',
      'child',
      'grand',
      'orphan',
      'loop-a',
      'loop-b',
    ]);
    expect(flat.map((f) => f.depth)).toEqual([0, 1, 2, 0, 0, 0]);
    expect(findOrganizationUnitName(units, 'root')).toBe('Root');
    expect(findOrganizationUnitName(units, undefined)).toBeUndefined();
  });
});

describe('organization-unit form schema', () => {
  it('từ chối tên rỗng sau trim và tên quá dài', () => {
    expect(organizationUnitFormSchema.safeParse({ displayName: '   ' }).success).toBe(false);
    expect(organizationUnitFormSchema.safeParse({ displayName: 'x'.repeat(257) }).success).toBe(
      false,
    );
    expect(organizationUnitFormSchema.safeParse({ displayName: ' Phòng IT ' }).success).toBe(true);
  });

  it('create giữ parentId, update bỏ parentId', () => {
    expect(toOrganizationUnitCreateInput({ displayName: ' A ', parentId: 'p1' })).toEqual({
      displayName: 'A',
      parentId: 'p1',
    });
    expect(toOrganizationUnitUpdateInput({ displayName: ' A ', parentId: 'p1' })).toEqual({
      displayName: 'A',
    });
  });
});

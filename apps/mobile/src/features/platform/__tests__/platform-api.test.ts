import { describe, it, expect, afterEach } from '@jest/globals';
import {
  createData,
  createDataItem,
  createLayout,
  deleteData,
  deleteDataItem,
  deleteLayout,
  getDataByName,
  getDatasAll,
  getDatasPaged,
  getLayoutsPaged,
  moveData,
  updateData,
  updateDataItem,
  updateLayout,
} from '../platform-api';

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

describe('platform api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('datas: paged/all/by-name đúng route; create POST kèm parentId; update PUT KHÔNG gửi parentId; move PUT đúng route', async () => {
    const paged = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getDatasPaged({ filter: 'ui', skipCount: 0, maxResultCount: 20 });
    expect(urlOf(paged.calls)).toContain('/api/platform/datas?');
    expect(urlOf(paged.calls)).toContain('filter=ui');

    const all = stubFetch(JSON.stringify({ items: [] }));
    await getDatasAll();
    expect(urlOf(all.calls)).toContain('/api/platform/datas/all');

    const byName = stubFetch(JSON.stringify({ id: '1', items: [] }));
    await getDataByName('UI Framework');
    expect(urlOf(byName.calls)).toContain('/api/platform/datas/by-name/UI%20Framework');

    const create = stubFetch(JSON.stringify({ id: '1' }));
    await createData({ name: 'ui', displayName: 'UI', parentId: '11111111-1111-1111-1111-111111111111' });
    expect(methodOf(create.calls)).toBe('POST');
    expect(bodyOf(create.calls).parentId).toBe('11111111-1111-1111-1111-111111111111');

    const update = stubFetch(JSON.stringify({ id: '1' }));
    await updateData('abc', { name: 'ui', displayName: 'UI' });
    expect(methodOf(update.calls)).toBe('PUT');
    expect(urlOf(update.calls)).toContain('/api/platform/datas/abc');
    expect(bodyOf(update.calls).parentId).toBeUndefined();

    const move = stubFetch(JSON.stringify({ id: '1' }));
    await moveData('abc', { parentId: null });
    expect(methodOf(move.calls)).toBe('PUT');
    expect(urlOf(move.calls)).toContain('/api/platform/datas/abc/move');
    expect(bodyOf(move.calls).parentId).toBeNull();

    const del = stubFetch('', 204);
    await deleteData('abc');
    expect(methodOf(del.calls)).toBe('DELETE');
  });

  it('data items: create POST /items; update PUT /items/{name} KHÔNG gửi name; delete DELETE /items/{name}', async () => {
    const create = stubFetch('', 204);
    await createDataItem('abc', {
      name: 'theme',
      displayName: 'Theme',
      allowBeNull: true,
      valueType: 0,
    });
    expect(methodOf(create.calls)).toBe('POST');
    expect(urlOf(create.calls)).toContain('/api/platform/datas/abc/items');
    expect(bodyOf(create.calls).name).toBe('theme');

    const update = stubFetch('', 204);
    await updateDataItem('abc', 'theme', {
      displayName: 'Theme 2',
      allowBeNull: false,
      valueType: 0,
      defaultValue: 'dark',
    });
    expect(methodOf(update.calls)).toBe('PUT');
    expect(urlOf(update.calls)).toContain('/api/platform/datas/abc/items/theme');
    expect(bodyOf(update.calls).name).toBeUndefined();
    expect(bodyOf(update.calls).defaultValue).toBe('dark');

    const del = stubFetch('', 204);
    await deleteDataItem('abc', 'theme');
    expect(methodOf(del.calls)).toBe('DELETE');
    expect(urlOf(del.calls)).toContain('/api/platform/datas/abc/items/theme');
  });

  it('layouts: paged gắn filter/framework; create POST kèm dataId/framework; update PUT KHÔNG gửi dataId/framework', async () => {
    const paged = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getLayoutsPaged({ filter: 'main', framework: 'vben', skipCount: 0, maxResultCount: 20 });
    expect(urlOf(paged.calls)).toContain('/api/platform/layouts?');
    expect(urlOf(paged.calls)).toContain('framework=vben');

    const create = stubFetch(JSON.stringify({ id: '1' }));
    await createLayout({
      name: 'main',
      displayName: 'Main',
      path: '/main',
      dataId: '11111111-1111-1111-1111-111111111111',
      framework: 'vben',
    });
    expect(methodOf(create.calls)).toBe('POST');
    expect(bodyOf(create.calls).dataId).toBe('11111111-1111-1111-1111-111111111111');
    expect(bodyOf(create.calls).framework).toBe('vben');

    const update = stubFetch(JSON.stringify({ id: '1' }));
    await updateLayout('abc', { name: 'main', displayName: 'Main', path: '/main' });
    expect(methodOf(update.calls)).toBe('PUT');
    expect(bodyOf(update.calls).dataId).toBeUndefined();
    expect(bodyOf(update.calls).framework).toBeUndefined();

    const del = stubFetch('', 204);
    await deleteLayout('abc');
    expect(methodOf(del.calls)).toBe('DELETE');
  });
});

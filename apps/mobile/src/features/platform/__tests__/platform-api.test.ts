import { describe, it, expect, afterEach } from '@jest/globals';
import {
  createData,
  createDataItem,
  createLayout,
  createMenu,
  createMyFavoriteMenu,
  deleteData,
  deleteDataItem,
  deleteEmailMessage,
  deleteLayout,
  deleteMenu,
  deleteMyFavoriteMenu,
  deleteSmsMessage,
  getDataByName,
  getDatasAll,
  getDatasPaged,
  getEmailMessage,
  getEmailMessagesPaged,
  getLayoutsPaged,
  getMenu,
  getMenusAll,
  getMyFavoriteMenus,
  getRoleMenus,
  getSmsMessagesPaged,
  getUserMenus,
  moveData,
  sendEmailMessage,
  sendSmsMessage,
  setRoleMenus,
  setUserMenus,
  updateData,
  updateMyFavoriteMenu,
  updateDataItem,
  updateLayout,
  updateMenu,
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
    await createData({
      name: 'ui',
      displayName: 'UI',
      parentId: '11111111-1111-1111-1111-111111111111',
    });
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

  it('menus: all gắn filter/layoutId; create POST kèm layoutId; update PUT KHÔNG gửi layoutId; get/delete đúng route', async () => {
    const all = stubFetch(JSON.stringify({ items: [] }));
    await getMenusAll({ filter: 'sys', layoutId: '11111111-1111-1111-1111-111111111111' });
    expect(urlOf(all.calls)).toContain('/api/platform/menus/all?');
    expect(urlOf(all.calls)).toContain('layoutId=11111111-1111-1111-1111-111111111111');

    const get = stubFetch(JSON.stringify({ id: '1' }));
    await getMenu('abc');
    expect(urlOf(get.calls)).toContain('/api/platform/menus/abc');

    const create = stubFetch(JSON.stringify({ id: '1' }));
    await createMenu({
      name: 'sys',
      displayName: 'System',
      path: '/sys',
      component: 'sys',
      isPublic: false,
      meta: {},
      layoutId: '11111111-1111-1111-1111-111111111111',
    });
    expect(methodOf(create.calls)).toBe('POST');
    expect(bodyOf(create.calls).layoutId).toBe('11111111-1111-1111-1111-111111111111');

    const update = stubFetch(JSON.stringify({ id: '1' }));
    await updateMenu('abc', {
      name: 'sys',
      displayName: 'System',
      path: '/sys',
      component: 'sys',
      isPublic: true,
      meta: {},
    });
    expect(methodOf(update.calls)).toBe('PUT');
    expect(bodyOf(update.calls).layoutId).toBeUndefined();

    const del = stubFetch('', 204);
    await deleteMenu('abc');
    expect(methodOf(del.calls)).toBe('DELETE');
  });

  it('menu allotment: get by-user/by-role đúng route path (framework trong path, KHÔNG query); set PUT đúng body', async () => {
    const byUser = stubFetch(JSON.stringify({ items: [] }));
    await getUserMenus('11111111-1111-1111-1111-111111111111', 'Vben');
    expect(urlOf(byUser.calls)).toContain(
      '/api/platform/menus/by-user/11111111-1111-1111-1111-111111111111/Vben',
    );

    const byRole = stubFetch(JSON.stringify({ items: [] }));
    await getRoleMenus('Admin', 'Vben');
    expect(urlOf(byRole.calls)).toContain('/api/platform/menus/by-role/Admin/Vben');

    const setU = stubFetch('', 204);
    await setUserMenus({
      userId: 'u1',
      framework: 'Vben',
      startupMenuId: 'm2',
      menuIds: ['m1', 'm2'],
    });
    expect(methodOf(setU.calls)).toBe('PUT');
    expect(urlOf(setU.calls)).toContain('/api/platform/menus/by-user');
    expect(bodyOf(setU.calls)).toEqual({
      userId: 'u1',
      framework: 'Vben',
      startupMenuId: 'm2',
      menuIds: ['m1', 'm2'],
    });

    const setR = stubFetch('', 204);
    await setRoleMenus({ roleName: 'Admin', framework: 'Vben', menuIds: [] });
    expect(methodOf(setR.calls)).toBe('PUT');
    expect(urlOf(setR.calls)).toContain('/api/platform/menus/by-role');
    expect(bodyOf(setR.calls)).toEqual({ roleName: 'Admin', framework: 'Vben', menuIds: [] });
  });

  it('email/sms messages: paged gắn filter/status; get email; delete + send đúng route; KHÔNG có create/update', async () => {
    const paged = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getEmailMessagesPaged({
      filter: 'x',
      emailAddress: 'a@b.c',
      status: -1,
      skipCount: 0,
      maxResultCount: 20,
    });
    expect(urlOf(paged.calls)).toContain('/api/platform/messages/email?');
    expect(urlOf(paged.calls)).toContain('status=-1');
    expect(urlOf(paged.calls)).toContain('emailAddress=a%40b.c');

    const smsPaged = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getSmsMessagesPaged({
      phoneNumber: '0901',
      status: 10,
      skipCount: 0,
      maxResultCount: 20,
    });
    expect(urlOf(smsPaged.calls)).toContain('/api/platform/messages/sms?');
    expect(urlOf(smsPaged.calls)).toContain('status=10');

    const get = stubFetch(JSON.stringify({ id: '1' }));
    await getEmailMessage('abc');
    expect(urlOf(get.calls)).toContain('/api/platform/messages/email/abc');

    const sendE = stubFetch('', 204);
    await sendEmailMessage('abc');
    expect(methodOf(sendE.calls)).toBe('POST');
    expect(urlOf(sendE.calls)).toContain('/api/platform/messages/email/abc/send');

    const sendS = stubFetch('', 204);
    await sendSmsMessage('abc');
    expect(methodOf(sendS.calls)).toBe('POST');
    expect(urlOf(sendS.calls)).toContain('/api/platform/messages/sms/abc/send');

    const delE = stubFetch('', 204);
    await deleteEmailMessage('abc');
    expect(methodOf(delE.calls)).toBe('DELETE');

    const delS = stubFetch('', 204);
    await deleteSmsMessage('abc');
    expect(methodOf(delS.calls)).toBe('DELETE');
  });

  it('my favorite menus: GET có framework tùy chọn; POST/PUT đúng body; DELETE dùng menuId', async () => {
    const list = stubFetch(JSON.stringify({ items: [] }));
    await getMyFavoriteMenus('Vben');
    expect(methodOf(list.calls)).toBe('GET');
    expect(urlOf(list.calls)).toContain('/api/platform/menus/favorites/my-favorite-menus');
    expect(urlOf(list.calls)).toContain('framework=Vben');

    const listAll = stubFetch(JSON.stringify({ items: [] }));
    await getMyFavoriteMenus();
    expect(urlOf(listAll.calls)).not.toContain('framework=');

    const created = stubFetch(JSON.stringify({ id: 'f1' }));
    await createMyFavoriteMenu({ framework: 'Vben', menuId: 'm1', color: '#000000' });
    expect(methodOf(created.calls)).toBe('POST');
    expect(urlOf(created.calls)).toContain('/api/platform/menus/favorites/my-favorite-menus');
    expect(bodyOf(created.calls)).toEqual({ framework: 'Vben', menuId: 'm1', color: '#000000' });

    const updated = stubFetch(JSON.stringify({ id: 'f1' }));
    await updateMyFavoriteMenu({ menuId: 'm1', concurrencyStamp: 'stamp-1', aliasName: 'Chính' });
    expect(methodOf(updated.calls)).toBe('PUT');
    expect(bodyOf(updated.calls)).toEqual({
      menuId: 'm1',
      concurrencyStamp: 'stamp-1',
      aliasName: 'Chính',
    });

    const deleted = stubFetch('', 204);
    await deleteMyFavoriteMenu('m1');
    expect(methodOf(deleted.calls)).toBe('DELETE');
    expect(urlOf(deleted.calls)).toContain('/api/platform/menus/favorites/my-favorite-menus/m1');
  });
});

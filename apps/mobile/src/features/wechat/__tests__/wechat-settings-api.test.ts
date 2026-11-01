import { describe, it, expect } from '@jest/globals';
import {
  getWechatGlobalSettings,
  getWechatTenantSettings,
  setWechatGlobalSettings,
  setWechatTenantSettings,
} from '../wechat-settings-api';

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

describe('wechat settings api', () => {
  it('get global/tenant + set global/tenant đúng route/method, set chỉ gửi settings đã đổi', async () => {
    const global = stubFetch(JSON.stringify({ items: [] }));
    await getWechatGlobalSettings();
    expect(urlOf(global.calls)).toContain('/api/wechat/setting-management/by-global');
    expect(methodOf(global.calls)).toBe('GET');

    const tenant = stubFetch(JSON.stringify({ items: [] }));
    await getWechatTenantSettings();
    expect(urlOf(tenant.calls)).toContain('/api/wechat/setting-management/by-current-tenant');

    const setGlobal = stubFetch('');
    await setWechatGlobalSettings({ settings: [{ name: 'WeChat.AppId', value: 'wx123' }] });
    expect(urlOf(setGlobal.calls)).toContain('/api/setting-management/settings/change-global');
    expect(methodOf(setGlobal.calls)).toBe('PUT');
    expect(bodyOf(setGlobal.calls).settings).toEqual([{ name: 'WeChat.AppId', value: 'wx123' }]);

    const setTenant = stubFetch('');
    await setWechatTenantSettings({ settings: [{ name: 'WeChat.AppId', value: 'wx123' }] });
    expect(urlOf(setTenant.calls)).toContain('/api/setting-management/settings/change-current-tenant');
    expect(methodOf(setTenant.calls)).toBe('PUT');
  });
});

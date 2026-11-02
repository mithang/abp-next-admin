import { describe, it, expect } from '@jest/globals';
import {
  ImpersonationError,
  buildImpersonationFormBody,
  hasImpersonationTarget,
  impersonate,
  impersonationErrorText,
  parseImpersonationTokenResponse,
  revertImpersonation,
  type TokenVault,
} from '../impersonation';
import type { SavedTokenSet } from '../token-storage';

/** Vault bộ nhớ: thay SecureStore trong test, không cần native module. */
function memoryVault(initial: SavedTokenSet): TokenVault & { saved: SavedTokenSet; original: SavedTokenSet | null } {
  const state = {
    saved: { ...initial },
    original: null as SavedTokenSet | null,
  };
  return {
    get saved() {
      return state.saved;
    },
    get original() {
      return state.original;
    },
    getCurrent: async () => ({ ...state.saved }),
    saveCurrent: async (tokens) => {
      state.saved = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? null,
        idToken: tokens.idToken ?? null,
      };
    },
    getOriginal: async () => (state.original ? { ...state.original } : null),
    saveOriginal: async (tokens) => {
      state.original = { ...tokens };
    },
    clearOriginal: async () => {
      state.original = null;
    },
  };
}

const DEPS = { tokenEndpoint: 'http://localhost:30000/connect/token', clientId: 'abp-mobile-client' };

function stubTokenFetch(responseBody: unknown, status = 200) {
  const calls: { url: string; body: string }[] = [];
  const fetchImpl = (async (url: string, init?: { body?: string }) => {
    calls.push({ url, body: init?.body ?? '' });
    return { ok: status >= 200 && status < 300, status, json: async () => responseBody };
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

describe('impersonation form body', () => {
  it('user target: grant + client + access_token + UserId/TenantId, không client_secret', () => {
    const params = new URLSearchParams(
      buildImpersonationFormBody('abp-mobile-client', 'tok-1', { userId: 'u-1', tenantId: 't-1' }),
    );
    expect(params.get('grant_type')).toBe('impersonation');
    expect(params.get('client_id')).toBe('abp-mobile-client');
    expect(params.get('access_token')).toBe('tok-1');
    expect(params.get('UserId')).toBe('u-1');
    expect(params.get('TenantId')).toBe('t-1');
    expect(params.has('client_secret')).toBe(false);
  });

  it('tenant target: TenantId + TenantUserName; revert: không có tham số đích nào', () => {
    const tenant = new URLSearchParams(
      buildImpersonationFormBody('abp-mobile-client', 'tok-1', { tenantId: 't-1', tenantUserName: 'admin' }),
    );
    expect(tenant.get('TenantId')).toBe('t-1');
    expect(tenant.get('TenantUserName')).toBe('admin');
    expect(tenant.has('UserId')).toBe(false);

    const revert = new URLSearchParams(buildImpersonationFormBody('abp-mobile-client', 'tok-1', undefined));
    expect(revert.has('UserId')).toBe(false);
    expect(revert.has('TenantId')).toBe(false);
    expect(revert.has('TenantUserName')).toBe(false);
    expect(revert.has('UserDelegationId')).toBe(false);
  });

  it('delegation target: chỉ UserDelegationId', () => {
    const params = new URLSearchParams(
      buildImpersonationFormBody('abp-mobile-client', 'tok-1', { userDelegationId: 'd-1' }),
    );
    expect(params.get('UserDelegationId')).toBe('d-1');
    expect(params.has('UserId')).toBe(false);
  });
});

describe('impersonation target validation (mirror backend HasImpersonationTarget)', () => {
  it('TenantUserName đứng một mình không tính là đích', () => {
    expect(hasImpersonationTarget({ tenantUserName: 'admin' })).toBe(false);
    expect(hasImpersonationTarget({})).toBe(false);
    expect(hasImpersonationTarget({ userId: 'u-1' })).toBe(true);
    expect(hasImpersonationTarget({ tenantId: 't-1' })).toBe(true);
    expect(hasImpersonationTarget({ userDelegationId: 'd-1' })).toBe(true);
  });
});

describe('impersonation token response', () => {
  it('parse token thành công, giữ refresh/id/expires', () => {
    const tokens = parseImpersonationTokenResponse({
      access_token: 'a2',
      refresh_token: 'r2',
      id_token: 'i2',
      expires_in: 3600,
      token_type: 'Bearer',
    });
    expect(tokens).toEqual({ accessToken: 'a2', refreshToken: 'r2', idToken: 'i2', expiresIn: 3600 });
  });

  it('error server -> tokenRejected kèm error_description', () => {
    expect(() =>
      parseImpersonationTokenResponse({ error: 'invalid_request', error_description: 'NestedImpersonationNotAllowed' }),
    ).toThrow(ImpersonationError);
    try {
      parseImpersonationTokenResponse({ error: 'invalid_request', error_description: 'NestedImpersonationNotAllowed' });
    } catch (error) {
      expect((error as ImpersonationError).code).toBe('tokenRejected');
      expect((error as ImpersonationError).serverMessage).toBe('NestedImpersonationNotAllowed');
    }
  });

  it('không có access_token -> tokenRejected', () => {
    expect(() => parseImpersonationTokenResponse({})).toThrow(ImpersonationError);
  });
});

describe('impersonation session swap (vault bộ nhớ)', () => {
  it('impersonate: lưu phiên gốc trước khi ghi đè, token mới thành current', async () => {
    const vault = memoryVault({ accessToken: 'orig-a', refreshToken: 'orig-r', idToken: 'orig-i' });
    const { fetchImpl } = stubTokenFetch({ access_token: 'imp-a', refresh_token: 'imp-r', expires_in: 1800 });
    const tokens = await impersonate(vault, { ...DEPS, fetchImpl }, { userId: 'u-1', tenantId: 't-1' });
    expect(tokens.accessToken).toBe('imp-a');
    expect(vault.saved.accessToken).toBe('imp-a');
    expect(vault.original).toEqual({ accessToken: 'orig-a', refreshToken: 'orig-r', idToken: 'orig-i' });
  });

  it('đang mạo danh mà mạo danh tiếp -> alreadyImpersonating, không gọi fetch', async () => {
    const vault = memoryVault({ accessToken: 'imp-a', refreshToken: 'imp-r', idToken: null });
    await vault.saveOriginal({ accessToken: 'orig-a', refreshToken: 'orig-r', idToken: null });
    const { calls, fetchImpl } = stubTokenFetch({ access_token: 'x' });
    await expect(impersonate(vault, { ...DEPS, fetchImpl }, { userId: 'u-2' })).rejects.toMatchObject({
      code: 'alreadyImpersonating',
    });
    expect(calls).toHaveLength(0);
  });

  it('không có đích -> invalidTarget, không gọi fetch', async () => {
    const vault = memoryVault({ accessToken: 'orig-a', refreshToken: null, idToken: null });
    const { calls, fetchImpl } = stubTokenFetch({ access_token: 'x' });
    await expect(impersonate(vault, { ...DEPS, fetchImpl }, { tenantUserName: 'admin' })).rejects.toMatchObject({
      code: 'invalidTarget',
    });
    expect(calls).toHaveLength(0);
  });

  it('request gửi đúng endpoint + form urlencoded', async () => {
    const vault = memoryVault({ accessToken: 'orig-a', refreshToken: null, idToken: null });
    const { calls, fetchImpl } = stubTokenFetch({ access_token: 'imp-a' });
    await impersonate(vault, { ...DEPS, fetchImpl }, { tenantId: 't-1', tenantUserName: 'admin' });
    expect(calls[0].url).toBe('http://localhost:30000/connect/token');
    const body = new URLSearchParams(calls[0].body);
    expect(body.get('grant_type')).toBe('impersonation');
    expect(body.get('TenantId')).toBe('t-1');
  });

  it('revert thành công qua server: token gốc mới, xóa phiên gốc đã lưu', async () => {
    const vault = memoryVault({ accessToken: 'imp-a', refreshToken: 'imp-r', idToken: null });
    await vault.saveOriginal({ accessToken: 'orig-a', refreshToken: 'orig-r', idToken: null });
    const { fetchImpl } = stubTokenFetch({ access_token: 'orig-a2', refresh_token: 'orig-r2' });
    const result = await revertImpersonation(vault, { ...DEPS, fetchImpl });
    expect(result.viaSavedOriginal).toBe(false);
    expect(result.tokens.accessToken).toBe('orig-a2');
    expect(vault.saved.accessToken).toBe('orig-a2');
    expect(vault.original).toBeNull();
  });

  it('revert server thất bại mà còn phiên gốc: khôi phục phiên đã lưu, viaSavedOriginal=true', async () => {
    const vault = memoryVault({ accessToken: 'imp-a', refreshToken: 'imp-r', idToken: null });
    await vault.saveOriginal({ accessToken: 'orig-a', refreshToken: 'orig-r', idToken: null });
    const { fetchImpl } = stubTokenFetch({ error: 'invalid_request', error_description: 'NoImpersonationContext' }, 400);
    const result = await revertImpersonation(vault, { ...DEPS, fetchImpl });
    expect(result.viaSavedOriginal).toBe(true);
    expect(result.tokens.accessToken).toBe('orig-a');
    expect(vault.saved.accessToken).toBe('orig-a');
    expect(vault.original).toBeNull();
  });

  it('revert server thất bại và không còn phiên gốc: ném lỗi server gốc', async () => {
    const vault = memoryVault({ accessToken: 'imp-a', refreshToken: null, idToken: null });
    const { fetchImpl } = stubTokenFetch({ error: 'invalid_grant', error_description: 'bad token' }, 400);
    await expect(revertImpersonation(vault, { ...DEPS, fetchImpl })).rejects.toMatchObject({
      code: 'tokenRejected',
    });
    expect(vault.saved.accessToken).toBe('imp-a');
  });
});

describe('impersonationErrorText', () => {
  const t = (key: string) => `[[${key}]]`;
  it('tokenRejected ưu tiên serverMessage ngắn; mã khác map key i18n', () => {
    expect(
      impersonationErrorText(
        new ImpersonationError('tokenRejected', 'x', 'RequirePermissionToImpersonateUser'),
        t,
      ),
    ).toBe('RequirePermissionToImpersonateUser');
    expect(impersonationErrorText(new ImpersonationError('alreadyImpersonating', 'x'), t)).toBe(
      '[[impersonation.errorAlreadyImpersonating]]',
    );
    expect(impersonationErrorText(new Error('boom'), t)).toBe('[[impersonation.errorGeneric]]');
  });
});

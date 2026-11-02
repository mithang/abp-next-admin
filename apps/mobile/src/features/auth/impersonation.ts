import type { TokenSet } from './oidc';
import {
  clearOriginalTokens,
  getCurrentTokens,
  getOriginalTokens,
  saveOriginalTokens,
  saveTokens,
  type SavedTokenSet,
} from './token-storage';

/**
 * Mạo danh (impersonation) — bản mobile của `impersonationUserLogin` web
 * (store/auth.ts + useOAuthService.signinImpersonation) và backend
 * `LINGYUN.Abp.OpenIddict.Impersonation.ImpersonationTokenExtensionGrant`.
 *
 * Giao thức (đã xác minh từ code web + backend, không suy đoán):
 * - POST /connect/token, form urlencoded: grant_type=impersonation,
 *   client_id (public client abp-mobile-client, KHÔNG client secret),
 *   access_token (token hiện tại) + đúng một nhóm đích:
 *   UserId (mạo danh user, kèm TenantId của user đó) /
 *   TenantId + TenantUserName (mạo danh tenant; TenantUserName vắng thì
 *   backend dùng DefaultTenantAdminUserName) / UserDelegationId.
 * - Backend CẤM mạo danh lồng nhau: đang mạo danh mà gửi thêm đích sẽ bị
 *   forbid (NestedImpersonationNotAllowed); đang mạo danh mà gửi grant
 *   KHÔNG kèm đích thì quay về tài khoản gốc (RevertToOriginalUserAsync).
 * - Mobile KHÔNG giữ token trong store/Zustand: phiên gốc lưu riêng trong
 *   SecureStore (token-storage), marker "đang mạo danh" = còn original
 *   access token. Revert ưu tiên grant server (parity web); nếu server
 *   từ chối/lỗi mạng thì khôi phục phiên gốc đã lưu — người dùng luôn có
 *   đường về tài khoản thật.
 */

export interface ImpersonationTarget {
  userId?: string;
  tenantId?: string;
  tenantUserName?: string;
  userDelegationId?: string;
}

export type ImpersonationErrorCode =
  | 'alreadyImpersonating'
  | 'invalidTarget'
  | 'noAccessToken'
  | 'tokenRejected'
  | 'network';

export class ImpersonationError extends Error {
  readonly code: ImpersonationErrorCode;
  /** Mô tả lỗi server (error_description) nếu có — đã là text nghiệp vụ, không chứa token. */
  readonly serverMessage?: string;

  constructor(code: ImpersonationErrorCode, message: string, serverMessage?: string) {
    super(message);
    this.name = 'ImpersonationError';
    this.code = code;
    this.serverMessage = serverMessage;
  }
}

/**
 * Mirror backend ImpersonationRequest.HasImpersonationTarget: chỉ
 * UserId/TenantId/UserDelegationId mới tính là đích. TenantUserName đứng
 * một mình KHÔNG đủ (backend sẽ trả InvalidImpersonationRequest).
 */
export function hasImpersonationTarget(target: ImpersonationTarget): boolean {
  return Boolean(target.userId ?? target.tenantId ?? target.userDelegationId);
}

/** Body form cho grant impersonation; target undefined = grant revert (không đích). */
export function buildImpersonationFormBody(
  clientId: string,
  accessToken: string,
  target?: ImpersonationTarget,
): string {
  const body = new URLSearchParams({
    grant_type: 'impersonation',
    client_id: clientId,
    access_token: accessToken,
  });
  if (target?.userId) body.set('UserId', target.userId);
  if (target?.userDelegationId) body.set('UserDelegationId', target.userDelegationId);
  if (target?.tenantId) body.set('TenantId', target.tenantId);
  if (target?.tenantUserName) body.set('TenantUserName', target.tenantUserName);
  // Cố tình KHÔNG gửi client_secret: mobile dùng public client PKCE.
  return body.toString();
}

interface TokenEndpointJson {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

/** Parse token response; lỗi server -> ImpersonationError(tokenRejected). */
export function parseImpersonationTokenResponse(json: unknown): TokenSet {
  const body = (json ?? {}) as TokenEndpointJson;
  if (typeof body.error === 'string' && body.error) {
    throw new ImpersonationError(
      'tokenRejected',
      body.error_description ?? body.error,
      body.error_description,
    );
  }
  if (typeof body.access_token !== 'string' || !body.access_token) {
    throw new ImpersonationError('tokenRejected', 'Token endpoint did not return an access token');
  }
  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token ?? undefined,
    idToken: body.id_token ?? undefined,
    expiresIn: body.expires_in,
  };
}

export interface ImpersonationDeps {
  tokenEndpoint: string;
  clientId: string;
  fetchImpl?: typeof fetch;
}

/** Gọi grant impersonation/revert thuần (không chạm SecureStore) — để test. */
export async function requestImpersonationToken(
  deps: ImpersonationDeps,
  accessToken: string,
  target?: ImpersonationTarget,
): Promise<TokenSet> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await fetchImpl(deps.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: buildImpersonationFormBody(deps.clientId, accessToken, target),
    });
  } catch {
    throw new ImpersonationError('network', 'Network error while requesting impersonation token');
  }
  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  return parseImpersonationTokenResponse(json);
}

/**
 * Vault trừu tượng quanh SecureStore để logic swap/revert test được mà
 * không cần native module. Vault mặc định dùng token-storage thật.
 */
export interface TokenVault {
  getCurrent(): Promise<SavedTokenSet>;
  saveCurrent(tokens: TokenSet): Promise<void>;
  getOriginal(): Promise<SavedTokenSet | null>;
  saveOriginal(tokens: SavedTokenSet): Promise<void>;
  clearOriginal(): Promise<void>;
}

export const secureStoreVault: TokenVault = {
  getCurrent: getCurrentTokens,
  saveCurrent: saveTokens,
  getOriginal: getOriginalTokens,
  saveOriginal: saveOriginalTokens,
  clearOriginal: clearOriginalTokens,
};

function toTokenSet(saved: SavedTokenSet): TokenSet {
  return {
    accessToken: saved.accessToken ?? '',
    refreshToken: saved.refreshToken ?? undefined,
    idToken: saved.idToken ?? undefined,
  };
}

/**
 * Bắt đầu mạo danh: chặn lồng nhau ở client (mirror backend), lưu phiên
 * gốc TRƯỚC khi ghi đè token hiện tại, rồi lưu token mạo danh.
 */
export async function impersonate(
  vault: TokenVault,
  deps: ImpersonationDeps,
  target: ImpersonationTarget,
): Promise<TokenSet> {
  if (!hasImpersonationTarget(target)) {
    throw new ImpersonationError('invalidTarget', 'Impersonation target is required');
  }
  if (await vault.getOriginal()) {
    throw new ImpersonationError(
      'alreadyImpersonating',
      'Already impersonating: revert to the original account first',
    );
  }
  const current = await vault.getCurrent();
  if (!current.accessToken) {
    throw new ImpersonationError('noAccessToken', 'No current access token');
  }
  const tokens = await requestImpersonationToken(deps, current.accessToken, target);
  await vault.saveOriginal(current);
  await vault.saveCurrent(tokens);
  return tokens;
}

export interface RevertResult {
  tokens: TokenSet;
  /** true khi grant server thất bại và đã khôi phục phiên gốc đã lưu. */
  viaSavedOriginal: boolean;
}

/**
 * Quay về tài khoản gốc: thử grant revert server trước (parity web);
 * thất bại mà còn phiên gốc đã lưu thì khôi phục phiên đó; không còn gì
 * thì ném lỗi server gốc lên UI.
 */
export async function revertImpersonation(
  vault: TokenVault,
  deps: ImpersonationDeps,
): Promise<RevertResult> {
  const current = await vault.getCurrent();
  if (!current.accessToken) {
    throw new ImpersonationError('noAccessToken', 'No current access token');
  }
  const original = await vault.getOriginal();
  try {
    const tokens = await requestImpersonationToken(deps, current.accessToken, undefined);
    await vault.saveCurrent(tokens);
    await vault.clearOriginal();
    return { tokens, viaSavedOriginal: false };
  } catch (error) {
    if (original) {
      await vault.saveCurrent(toTokenSet(original));
      await vault.clearOriginal();
      return { tokens: toTokenSet(original), viaSavedOriginal: true };
    }
    throw error;
  }
}

/** Đang mạo danh = còn phiên gốc đã lưu. */
export async function isImpersonating(vault: TokenVault): Promise<boolean> {
  return (await vault.getOriginal()) !== null;
}

/**
 * Text lỗi hiển thị trên UI: tokenRejected ưu tiên message nghiệp vụ của
 * server (giống toSafeMessage ở errors.ts: ngắn, không stack trace); các
 * mã còn lại map sang key i18n. `t` là hàm dịch của màn hình gọi.
 */
export function impersonationErrorText(error: unknown, t: (key: string) => string): string {
  if (error instanceof ImpersonationError) {
    if (
      error.code === 'tokenRejected' &&
      error.serverMessage &&
      error.serverMessage.length <= 300 &&
      !/stack trace|at\s+\S+\(/i.test(error.serverMessage)
    ) {
      return error.serverMessage;
    }
    switch (error.code) {
      case 'alreadyImpersonating':
        return t('impersonation.errorAlreadyImpersonating');
      case 'invalidTarget':
        return t('impersonation.errorInvalidTarget');
      case 'noAccessToken':
        return t('impersonation.errorNoAccessToken');
      case 'network':
        return t('impersonation.errorNetwork');
      case 'tokenRejected':
        return t('impersonation.errorTokenRejected');
    }
  }
  return t('impersonation.errorGeneric');
}

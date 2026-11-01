import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { config } from '../../lib/config';
import { clearTokens, getRefreshToken, saveTokens } from './token-storage';

WebBrowser.maybeCompleteAuthSession();

export const redirectUri = AuthSession.makeRedirectUri({ scheme: config.redirectScheme, path: 'auth' });

export interface TokenSet {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
}

/**
 * Discovery + Authorization Code + PKCE, KHÔNG client secret.
 * Backend (vòng 2): OpenIddict application PUBLIC `abp-mobile-client`
 * (Native, redirect `redirectUri` ở trên, grant authorization_code +
 * refresh_token) — xem docs/auth.md. Client web vue-admin-client là
 * confidential nên không dùng cho mobile.
 */
export async function discover() {
  return AuthSession.fetchDiscoveryAsync(config.authority);
}

export function buildAuthRequest(discovery: AuthSession.DiscoveryDocument) {
  return new AuthSession.AuthRequest({
    clientId: config.clientId,
    scopes: config.scopes,
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    usePKCE: true,
    extraParams: {},
  });
}

export async function exchangeCode(
  discovery: AuthSession.DiscoveryDocument,
  request: AuthSession.AuthRequest,
  code: string,
): Promise<TokenSet> {
  const tokenResult = await AuthSession.exchangeCodeAsync(
    { clientId: config.clientId, code, redirectUri, extraParams: { code_verifier: request.codeVerifier ?? '' } },
    discovery,
  );
  const tokens: TokenSet = {
    accessToken: tokenResult.accessToken,
    refreshToken: tokenResult.refreshToken ?? undefined,
    idToken: tokenResult.idToken ?? undefined,
    expiresIn: tokenResult.expiresIn,
  };
  await saveTokens(tokens);
  return tokens;
}

export async function refreshAccessToken(discovery: AuthSession.DiscoveryDocument): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const result = await AuthSession.refreshAsync({ clientId: config.clientId, refreshToken }, discovery);
    await saveTokens({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken ?? undefined,
      idToken: result.idToken ?? undefined,
    });
    return result.accessToken;
  } catch {
    return null;
  }
}

export async function logout(discovery: AuthSession.DiscoveryDocument): Promise<void> {
  // Revoke ở server nếu endpoint có, nhưng luôn xóa local dù revoke thất bại.
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken && discovery.revocationEndpoint) {
      await AuthSession.revokeAsync({ clientId: config.clientId, token: refreshToken }, discovery).catch(() => undefined);
    }
  } finally {
    await clearTokens();
  }
}

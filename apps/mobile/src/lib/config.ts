/**
 * Cấu hình môi trường của app mobile.
 * Không chứa secret: mobile dùng OIDC Authorization Code + PKCE (public client),
 * KHÔNG nhúng client secret (xem src/features/auth).
 * Các biến EXPO_PUBLIC_* được nhúng vào bundle nên chỉ đặt giá trị không nhạy cảm.
 */
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:30000',
  authority: process.env.EXPO_PUBLIC_OIDC_AUTHORITY ?? 'http://localhost:30000',
  // Public client riêng cho mobile (vòng 2): OpenIddict application
  // abp-mobile-client, Native + Public, redirect abpnextadmin://auth, PKCE.
  // Xem appsettings.Development.json + OpenIddictDataSeederContributor.cs
  // của AllInOne và docs/auth.md. Không dùng chung vue-admin-client
  // (confidential, chỉ có RootUrls web) nữa.
  clientId: process.env.EXPO_PUBLIC_OIDC_CLIENT_ID ?? 'abp-mobile-client',
  scopes: ['openid', 'email', 'address', 'phone', 'profile', 'offline_access', 'lingyun-abp-application'],
  redirectScheme: 'abpnextadmin',
};

export function apiUrl(path: string): string {
  const base = config.apiUrl.replace(/\/$/, '');
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}

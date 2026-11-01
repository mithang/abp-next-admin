/**
 * Cấu hình môi trường của app mobile.
 * Không chứa secret: mobile dùng OIDC Authorization Code + PKCE (public client),
 * KHÔNG nhúng client secret (xem src/features/auth).
 * Các biến EXPO_PUBLIC_* được nhúng vào bundle nên chỉ đặt giá trị không nhạy cảm.
 */
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:30000',
  authority: process.env.EXPO_PUBLIC_OIDC_AUTHORITY ?? 'http://localhost:30000',
  // Client OIDC dùng chung với web app-antd cho môi trường dev local.
  // Client này phải được cấu hình public (không secret) + PKCE ở phía OpenIddict
  // trước khi đăng nhập thật trên mobile; xem docs/auth.md.
  clientId: process.env.EXPO_PUBLIC_OIDC_CLIENT_ID ?? 'vue-admin-client',
  scopes: ['openid', 'email', 'address', 'phone', 'profile', 'offline_access', 'lingyun-abp-application'],
  redirectScheme: 'abpnextadmin',
};

export function apiUrl(path: string): string {
  const base = config.apiUrl.replace(/\/$/, '');
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}

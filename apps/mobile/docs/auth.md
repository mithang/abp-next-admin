# Xác thực mobile (OIDC + PKCE)

## Luồng
1. App mở browser hệ thống tới `/.well-known/openid-configuration` của authority
   (`EXPO_PUBLIC_OIDC_AUTHORITY`, mặc định `http://localhost:30000` cho dev local).
2. Authorization Code + PKCE (`expo-auth-session`), redirect về scheme
   `abpnextadmin://auth` (xem `app.json` scheme).
3. Đổi code lấy token, lưu **chỉ** trong `expo-secure-store` (Keychain/Keystore).
   Không lưu token trong Zustand, AsyncStorage hay log.
4. `api-client` gắn `Authorization: Bearer <token>`; 401 → store về
   `unauthenticated`, route guard chuyển về màn hình đăng nhập.
5. Refresh token (khi backend cấp `offline_access`) qua `refreshAsync`; nếu refresh
   thất bại → đăng nhập lại, không tạo vòng lặp refresh.
6. Đăng xuất: revoke refresh token nếu có endpoint, rồi luôn xóa local tokens
   (kể cả khi revoke lỗi) và xóa cache TanStack Query.

## P0 — đã triển khai ở vòng 2, chờ kiểm chứng bằng backend sống
Client web `vue-admin-client` là **confidential** và chỉ có RootUrls web nên
không dùng được cho mobile. Vòng 2 đã thêm public client riêng (không secret):
- Config: `OpenIddict:Applications:Mobile` trong
  `aspnet-core/services/LINGYUN.Abp.MicroService.AllInOne/appsettings.Development.json`
  và `aspnet-core/migrations/LINGYUN.Abp.MicroService.AllInOne.DbMigrator/appsettings.json`
  — `ClientId: abp-mobile-client`, redirect/post-logout `abpnextadmin://auth`.
- Seeder: `OpenIddictDataSeederContributor.cs` (AllInOne.EntityFrameworkCore)
  tạo/cập nhật application Native + Public, consent Implicit, grant
  `authorization_code` + `refresh_token`, scope như client web + scope API.
  Redirect lấy trực tiếp từ `Mobile:RedirectUris` (không dùng pattern RootUrls
  của web để tránh hỏng scheme native).
- Mobile: `src/lib/config.ts` đổi client mặc định sang `abp-mobile-client`
  (vẫn override được bằng `EXPO_PUBLIC_OIDC_CLIENT_ID`).
Chưa kiểm chứng: client chỉ xuất hiện trong DB sau khi DbMigrator/seed chạy
lại và backend sống — login thật vẫn ghi BLOCKED cho tới khi vòng sau boot
backend và thử authorize thật. Không fake login thành công.

## Tài khoản test
Chỉ dùng cho kiểm thử local (admin có TOTP 2FA; tài khoản test không 2FA theo
quy định của chương trình). Không ghi mật khẩu vào tài liệu hay báo cáo.

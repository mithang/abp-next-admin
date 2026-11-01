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

## P0 — đã triển khai ở vòng 2, đã kiểm chứng ở tầng giao thức ở vòng 3
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
**Vòng 3 đã kiểm chứng ở tầng giao thức:** DbMigrator Release build 0 lỗi
và chạy seed thành công (`Seeding application abp-mobile-client`); trước seed
authorize trả `invalid_client`, sau seed trả 302 về trang login; luồng đầy đủ
authorize → login (tài khoản test không 2FA) → authorize trả code đúng state →
đổi code lấy token bằng PKCE verifier (không secret) trả 200 Bearer, đủ
access/id/refresh token, scope đúng yêu cầu, hết hạn 7199s; authorize với đủ
scope của app (openid email address phone profile offline_access
lingyun-abp-application) cũng 302 về login (scope được chấp nhận). Phần còn
lại vẫn BLOCKED: bấm login thật trong app cần thiết bị/emulator (chưa có),
không chạy được Expo Go/dev build trên VM này.

## Tài khoản test
Chỉ dùng cho kiểm thử local (admin có TOTP 2FA; tài khoản test không 2FA theo
quy định của chương trình). Không ghi mật khẩu vào tài liệu hay báo cáo.

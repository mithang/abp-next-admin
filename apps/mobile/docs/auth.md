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

## Blocker P0 (vòng 1, chưa xử lý xong)
Client web `vue-admin-client` trong `appsettings.Development.json` của AllInOne là
client **confidential** (có client secret — giá trị không ghi lại ở đây) và chỉ có
RootUrls cho web (`localhost:5666`, `localhost:30000`). Mobile là public client nên
không thể dùng chung client này, và redirect scheme mobile chưa được đăng ký.
**Hướng xử lý vòng sau (không dùng secret trên mobile):** thêm một OpenIddict
application public mới (ví dụ `abp-mobile-client`) trong seeder/config của
AllInOne: grant `authorization_code` + `refresh_token`, PKCE bắt buộc, redirect
`abpnextadmin://auth`, scope như web. Cho tới lúc đó, màn hình đăng nhập vẫn gọi
đúng luồng PKCE nhưng login thật sẽ bị backend từ chối — ghi rõ BLOCKED trong
báo cáo vòng, không fake login thành công.

## Tài khoản test
Chỉ dùng cho kiểm thử local (admin có TOTP 2FA; tài khoản test không 2FA theo
quy định của chương trình). Không ghi mật khẩu vào tài liệu hay báo cáo.

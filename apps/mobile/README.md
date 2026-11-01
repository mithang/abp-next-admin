# ABP Next Admin — Mobile (Expo)

Ứng dụng mobile của hệ quản trị abp-next-admin, xây bằng Expo + React Native +
TypeScript + Gluestack UI, đối chiếu chức năng web app-antd (xem `docs/inventory-mapping.md`).

## Chạy dev

```bash
cd apps/mobile
npm install
npx expo start
```

Biến môi trường (xem `.env.example`): `EXPO_PUBLIC_API_URL`,
`EXPO_PUBLIC_OIDC_AUTHORITY`, `EXPO_PUBLIC_OIDC_CLIENT_ID`. Mặc định dev local
trỏ `http://localhost:30000` (backend AllInOne).

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm test
npx expo-doctor
```

## Kiến trúc

- `src/app/` — Expo Router: `(auth)/login`, `(tabs)/` (dashboard, users, roles, account),
  `users/[id]`, `roles/[id]`. Route guard trong `_layout.tsx`: chưa đăng nhập → login.
- `src/features/` — theo nghiệp vụ: `auth` (OIDC PKCE, SecureStore),
  `identity` (users + roles API thật), `dashboard` (menus/profile).
- `src/lib/` — `api-client` (fetch + timeout + ABP error mapping), `errors`,
  `config`, `query-client` (TanStack Query).
- `src/components/ui/` — wrapper Gluestack: AppButton, AppInput, AppScreen,
  AppStates (loading/empty/error). Không nút bấm giả, không mock data production.
- `src/i18n/` — vi (mặc định) + en, khớp bản dịch tiếng Việt của repo.
- `src/stores/` — Zustand chỉ cho trạng thái phiên; token chỉ ở SecureStore.

## Xác thực — đọc trước khi login thật

Xem `docs/auth.md`. Vòng 2 đã thêm public client `abp-mobile-client` ở phía
backend (config + seeder AllInOne); vòng 3 đã seed thành công và kiểm chứng
luồng PKCE end-to-end ở tầng giao thức (authorize → login → code → đổi token
200 Bearer, không secret). Bấm login thật trong app vẫn BLOCKED vì chưa có
thiết bị/emulator. Không nhúng client secret vào app.

## Trạng thái vòng 8

Nhóm Bản địa hoá đã xây đủ (22/50 trang lá): Ngôn ngữ đủ CRUD, Tài nguyên
đủ CRUD và Văn bản (so sánh 2 culture + đặt/xóa văn bản) — đều qua tab hub
"Quản trị" (thêm 3 mục, không thêm tab). Điểm khác biệt đã đối chiếu cả
backend: update ngôn ngữ chỉ nhận displayName (uiCultureName là
create-only, form sửa hiển thị dạng chỉ đọc); tài nguyên sửa giữ nguyên
defaultCultureName (modal web không có ô này); văn bản là left-join từ
culture nguồn (targetValue null khi đích chưa dịch), "sửa" là PUT set-text
cho culture đích, xóa dùng đúng input bảng web. Trước đó: nhóm Cài đặt đủ
CRUD (19/50) với cùng quy tắc giữ dữ liệu khi sửa.

## Giới hạn đã biết (vòng 8)

- EAS Build/Submit: BLOCKED (chưa có tài khoản Expo/credentials).
- E2E trên thiết bị/emulator thật: BLOCKED (không có thiết bị).
- Vai trò, Loại claim và Đơn vị tổ chức đã đủ CRUD; Nhật ký bảo mật
  (list/detail/xóa) và Phiên (list/thu hồi) đã xây; P0 OIDC đã kiểm chứng ở
  tầng giao thức. Vòng 4 kiểm chứng thêm: token PKCE thật lấy được, nhưng
  tài khoản test role Users bị 403 ở cả 3 API mới (đúng phân quyền admin) —
  CRUD thật với dữ liệu thật vẫn cần phiên admin, hiện BLOCKED vì admin có
  TOTP 2FA và không có thiết bị.
- Các trang lá còn lại (28/50): chưa xây, xem `docs/inventory-mapping.md`.
  CRUD thật của nhóm Quyền/Tính năng/Cài đặt/Bản địa hoá vẫn cần phiên admin
  (TOTP) như các nhóm trước — endpoint đã chứng minh tồn tại và yêu cầu
  auth (401 vs 404 route giả, backend đã khởi động lại trong vòng này).
  Lưu ý vòng 1: `npm run lint` dùng `eslint .` trực tiếp vì wrapper `expo lint`
  của SDK 58 lỗi với ESLint 9 đã cài (báo cần ≥ 8.57.0 dù đã có 9.39);
  lint trực tiếp cho 0 lỗi, 14 warning trong code Gluestack vendored.

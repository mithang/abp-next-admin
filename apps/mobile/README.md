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
backend (config + seeder AllInOne); login thật vẫn BLOCKED cho tới khi
DbMigrator/seed chạy lại và backend sống để kiểm chứng authorize thật.
Không nhúng client secret vào app.

## Giới hạn đã biết (vòng 2)

- EAS Build/Submit: BLOCKED (chưa có tài khoản Expo/credentials).
- E2E trên thiết bị/emulator thật: BLOCKED (không có thiết bị).
- Vai trò đã đủ CRUD; Loại claim mới có list/detail (UI tạo/sửa/xóa vòng sau).
- Các trang lá còn lại (44/50): chưa xây, xem `docs/inventory-mapping.md`.
  Lưu ý vòng 1: `npm run lint` dùng `eslint .` trực tiếp vì wrapper `expo lint`
  của SDK 58 lỗi với ESLint 9 đã cài (báo cần ≥ 8.57.0 dù đã có 9.39);
  lint trực tiếp cho 0 lỗi, 14 warning trong code Gluestack vendored.

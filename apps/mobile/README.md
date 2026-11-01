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

## Trạng thái vòng 14

Nhóm Nền tảng (phần 1) đã xây (38/50 trang lá): Từ điển dữ liệu (list
cây từ /all, detail kèm mục, tạo/sửa/xóa, tạo con, di chuyển sang cha
khác, thêm/sửa/xóa mục) và Bố cục (list phân trang lọc filter/framework,
detail, tạo/sửa/xóa) — đều qua tab hub "Quản trị" (thêm 2 mục, không
thêm tab). Điểm khác web cần biết: update từ điển không gửi parentId
và update bố cục không gửi dataId/framework (đúng UpdateDto, đổi cha qua
move riêng); loại giá trị mục chỉ nhận 0–5 như modal web (Object=6 có
trong enum backend nhưng web ghi TODO chưa hỗ trợ); lỗi validation của
AllInOne trả HTTP 200 kèm envelope code 400 (xem báo cáo vòng 14) — API
layer đã xác minh route tồn tại qua 401/404 và Swagger, CRUD thật vẫn
cần phiên admin (TOTP) như các vòng trước. Trước đó: Nhóm SaaS (36/50).

## Trạng thái vòng 13

Nhóm SaaS đã xây (36/50 trang lá): Tenant (list phân trang, detail,
tạo/sửa/xóa, quản lý chuỗi kết nối đặt/xóa/kiểm tra) và Phiên bản
(list phân trang, detail, tạo/sửa/xóa) — đều qua tab hub "Quản trị"
(thêm 2 mục, không thêm tab). Điểm khác web cần biết: giá trị connection
string đã lưu không hiển thị (credential, chỉ tên + đặt/xóa/kiểm tra);
tính năng theo tenant và mạo danh (impersonation) của web chưa xây ở vòng
này (xem báo cáo vòng 13). Trước đó: Nhóm AI (34/50).

## Trạng thái vòng 12

Nhóm AI đã xây (34/50 trang lá): Công cụ AI (list phân trang, detail,
tạo/sửa/xóa, provider khả dụng), Không gian làm việc AI (list phân trang,
detail không lộ apiKey, tạo/sửa, đặt lại API key), Phiên hội thoại AI
(list, tạo, đổi tên, xóa, màn chat gửi tin bằng SSE với parser chịu mảnh
cắt đôi + nút Dừng) — đều qua tab hub "Quản trị" (thêm 3 mục, không thêm
tab). Phát hiện vòng này: route PUT đổi tên phiên của web
(/api/ai-management/conversations/{id}) không có trong Swagger và GET trả
404; mobile dùng route /api/ai-management/chats/conversations/{id} đã xác
minh (401 = tồn tại, cần auth). Trước đó: Tài liệu API + Cache (31/50).

## Trạng thái vòng 11

Tài liệu API + Quản lý cache đã xây (31/50 trang lá): Tài liệu API mở
Swagger UI thật của backend trong trình duyệt hệ thống (web nhúng IFrame,
mobile không cài WebView nên dùng expo-web-browser đã có sẵn); Quản lý cache
(list khóa phân trang bằng marker, detail giá trị, form đặt giá trị RHF+Zod,
làm mới, xóa đơn, chọn nhiều + xóa hàng loạt) — đều qua tab hub "Quản trị"
(thêm 2 mục, không thêm tab). Trước đó: nhóm Thông báo xong (29/50).

## Trạng thái vòng 10

Nhóm Thông báo đã xây (29/50 trang lá): Thông báo của tôi (list phân trang
lọc filter + trạng thái đọc, detail rút title/message từ data.extraProperties
như serializer web, đánh dấu đã đọc/chưa đọc, xóa), Nhóm thông báo (đủ CRUD,
tĩnh chỉ đọc), Định nghĩa thông báo (đủ CRUD + form gửi POST
/api/notifications/send, tĩnh chỉ đọc), Lịch sử gửi (list phân trang, xóa,
gửi lại — không có detail vì backend không có GET {id}) — đều qua tab hub
"Quản trị" (thêm 4 mục, không thêm tab). Trước đó: nhóm Kiểm toán + Bảo vệ
dữ liệu xong (25/50).

## Trạng thái vòng 9

Nhóm Kiểm toán + Bảo vệ dữ liệu đã xây (25/50 trang lá): Loại thực thể
(chỉ xem list/detail — backend chỉ có Get/GetList, nút Sửa của bảng web là
no-op), Nhật ký kiểm toán (list lọc userName/URL, detail gồm actions +
entity changes, xóa đơn + API xóa hàng loạt sẵn) và Nhật ký hệ thống
(list lọc requestPath/ứng dụng, detail theo fields.id gồm fields +
exceptions, chỉ đọc vì backend không có xóa) — đều qua tab hub "Quản trị"
(thêm 3 mục, không thêm tab). Trước đó: nhóm Bản địa hoá đủ (22/50).

## Giới hạn đã biết (vòng 10)

- EAS Build/Submit: BLOCKED (chưa có tài khoản Expo/credentials).
- E2E trên thiết bị/emulator thật: BLOCKED (không có thiết bị).
- Vai trò, Loại claim và Đơn vị tổ chức đã đủ CRUD; Nhật ký bảo mật
  (list/detail/xóa) và Phiên (list/thu hồi) đã xây; P0 OIDC đã kiểm chứng ở
  tầng giao thức. Vòng 4 kiểm chứng thêm: token PKCE thật lấy được, nhưng
  tài khoản test role Users bị 403 ở cả 3 API mới (đúng phân quyền admin) —
  CRUD thật với dữ liệu thật vẫn cần phiên admin, hiện BLOCKED vì admin có
  TOTP 2FA và không có thiết bị.
- Các trang lá còn lại (21/50): chưa xây, xem `docs/inventory-mapping.md`.
  CRUD thật của nhóm Quyền/Tính năng/Cài đặt/Bản địa hoá/Kiểm toán/Thông báo vẫn cần phiên admin
  (TOTP) như các nhóm trước — endpoint đã chứng minh tồn tại và yêu cầu
  auth (401 vs 404 route giả, backend đã khởi động lại trong vòng này).
  Lưu ý vòng 1: `npm run lint` dùng `eslint .` trực tiếp vì wrapper `expo lint`
  của SDK 58 lỗi với ESLint 9 đã cài (báo cần ≥ 8.57.0 dù đã có 9.39);
  lint trực tiếp cho 0 lỗi, 14 warning trong code Gluestack vendored.

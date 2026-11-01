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

## Trạng thái vòng 20

Vòng P2 — UI chọn nhiều cho bulk Webhook (đóng nốt P2 bulk tồn đọng
từ vòng 16/17): màn Đăng ký Webhook nay có chế độ "Chọn nhiều" + nút
xóa hàng loạt (Alert xác nhận); màn Bản ghi gửi Webhook có chế độ
"Chọn nhiều" + nút gửi lại hàng loạt (không xác nhận, giống nút đơn)
và xóa hàng loạt (có xác nhận). Cả hai dùng chung helper
`toggleSelection` từ vòng 19, đổi lọc thì xóa lựa chọn, sau bulk
thành công thì xóa lựa chọn + thoát chế độ chọn + invalidate query.
3 route bulk đã có test từ vòng 17 và Swagger của AllInOne đang chạy
xác nhận đủ: DELETE subscriptions/delete-many, DELETE
send-attempts/delete-many, POST send-attempts/resend-many (body
`{ recordIds }`); probe không token trả 401 cho cả 3. Không thêm test
mới trong vòng này: logic chọn đã phủ ở vòng 19, API bulk đã phủ ở
vòng 17 — Jest giữ 209/209, i18n parity 1366/1366. Vẫn còn P2: upload
tệp blob, tenant feature-values/impersonation, menu assignment APIs,
template culture picker, formatter, RNTL component tests.

## Trạng thái vòng 19

Vòng P2 — UI chọn nhiều cho Tác vụ nền (đóng 1 phần P2 bulk tồn đọng
từ vòng 16): màn list tác vụ nền nay có chế độ "Chọn nhiều" theo đúng
mẫu màn Cache (chạm để chọn/bỏ chọn, đổi lọc thì xóa lựa chọn, nút
bulk hiện số lượng đã chọn, xóa bulk có Alert xác nhận, các action
bulk khác không xác nhận — giống nút đơn ở màn detail). 6 thao tác
gọi đúng API bulk đã có sẵn + có test từ vòng 16 (PUT
bulk-pause/resume/trigger/stop/start, DELETE bulk-delete, body
`{ jobIds }`); Swagger của AllInOne đang chạy xác nhận đủ 6 route.
Logic chọn/bỏ chọn tách ra `src/lib/selection.ts` (toggle trả Set mới,
không mutate) kèm 4 unit test. Vẫn còn P2: UI chọn nhiều cho
subscriptions/send-attempts của Webhook (API sẵn, UI chưa có), upload
tệp blob, tenant feature-values/impersonation, menu assignment APIs.

## Trạng thái vòng 18

Vòng P2 toàn app — xử lý envelope đóng gói của AllInOne (lỗi vòng 14,
đã xác minh live, không còn tồn đọng): backend bật AbpWrapper nên mọi
kết quả controller về dạng {code, message, result} kèm HTTP 200 (kể cả
lỗi), trong khi `api-client` cũ chỉ kiểm `response.ok` nên vừa coi lỗi
là thành công, vừa trả nguyên envelope thay vì DTO cho cả 267 call
site. Sửa ở đúng tầng trung tâm: `apiRequest` gửi header
`_AbpDontWrapResult: true` (tính năng có sẵn của backend, proxy
HttpClient nội bộ của backend cũng gửi) để nhận DTO thô + lỗi ABP
chuẩn (HTTP status thật, validationErrors có cấu trúc); nếu envelope
vẫn về (header bị lược) thì bóc `result` khi code "0", ném ApiError đã
map khi code khác "0" (mã số 3 chữ số map như HTTP status, mã nghiệp vụ
không phải số giữ message an toàn, code 401 gọi unauthorized handler).
Phát hiện shape envelope an toàn: chỉ nhận đúng 4 key
code/message/details/result nên không nhầm DTO thật có field `code`
(vd DataDto/MenuDto). Kiểm chứng live bằng code thật (không phải test
stub): fetch thô không header trả HTTP 200 đúng envelope
{code,details,message,result} code "0"; fetch có header trả DTO thô
{description,result}; `apiRequest` biên dịch thật trả DTO thô, không
còn envelope. Giới hạn còn lại: envelope lỗi không mang
validationErrors có cấu trúc nên khi rơi vào nhánh envelope, lỗi
validation chỉ hiện message chung (nhánh chính DontWrap vẫn đủ field
errors); SSE chat không qua `apiRequest` và endpoint stream không phải
ObjectResult nên không bị wrap. Không thêm trang lá mới (vẫn 50/50);
các P2 còn lại: upload tệp blob, UI chọn nhiều cho bulk, tenant
feature-values/impersonation, menu assignment APIs, formatter, RNTL
component tests. Trước đó: Webhook + Mẫu văn bản + WeChat (50/50).

## Trạng thái vòng 17

Webhook + Mẫu văn bản + WeChat đã xong (50/50 trang lá): Nhóm Webhook
(ListResult, detail, tạo/sửa/xóa — tĩnh chỉ đọc), Định nghĩa Webhook
(ListResult lọc filter/groupName, detail, tạo/sửa/xóa — tĩnh chỉ đọc),
Đăng ký Webhook (phân trang ABP, detail, tạo/sửa/xóa + API xóa hàng
loạt sẵn + gợi ý webhook từ GET .../subscriptions/availables, secret
không hiển thị ở màn detail), Bản ghi gửi Webhook (phân trang ABP,
detail đúng drawer web, gửi lại + xóa ngay trên dòng + API bulk sẵn),
Định nghĩa mẫu văn bản (ListResult, detail, tạo/sửa/xóa — tĩnh chỉ
đọc — cộng màn nội dung theo culture: xem/lưu/khôi phục mặc định) và
Cài đặt WeChat (SettingForm trên 2 route by-global/by-current-tenant,
lưu qua change-global/change-current-tenant, chỉ gửi giá trị đã đổi;
phạm vi chọn rõ ràng vì mobile không có tín hiệu tenant) — đều qua
tab hub "Quản trị" (thêm 6 mục, không thêm tab). Điểm khác web cần
biết: UpdateDto nhóm/định nghĩa Webhook có ConcurrencyStamp nhưng DTO
trả về không có và modal web cũng không gửi stamp nên mobile không
bịa stamp; getListApi mẫu văn bản của web nội suy biến `name` không
tồn tại nên mobile dùng đúng route list của backend; UI chọn nhiều
cho bulk webhook/subscription/send-attempt để vòng sau (cùng mẫu
security-logs/audit-logs/jobs). Lỗi validation AllInOne trả HTTP 200
kèm envelope code 400 vẫn chưa xử lý ở api-client (xem báo cáo vòng
14, cần một vòng riêng). Trước đó: Blob + Tác vụ nền (44/50).

## Trạng thái vòng 16

Blob + Tác vụ nền đã xong (44/50 trang lá): Container blob (list phân
trang, detail, tạo chỉ nhập name, xóa — không có sửa vì backend không
có Update cho container) và Tệp blob (duyệt theo container + thư mục
con qua parentId, detail đúng DTO backend, tạo thư mục, xóa, tải/xem
trước qua generate-url mở bằng trình duyệt hệ thống) và Tác vụ nền (đủ
CRUD + 5 action điều khiển + API bulk sẵn + nhật ký chạy xem/xóa) —
đều qua tab hub "Quản trị" (thêm 3 mục, không thêm tab). Điểm khác web
cần biết: BlobDto backend không có path (type web có path nhưng DTO C#
không có); upload tệp chưa có vì cần file picker native + upload
chunked (ghi P2, không tạo nút upload giả); sửa tác vụ không gửi
name/group/type/nodeName/begin/end/source (đúng UpdateDto); UI chọn
nhiều cho bulk tác vụ để vòng sau (cùng mẫu security-logs/audit-logs).
Lỗi validation AllInOne trả HTTP 200 kèm envelope code 400 vẫn chưa
xử lý ở api-client (xem báo cáo vòng 14, cần một vòng riêng). Trước
đó: Nền tảng phần 2 (41/50).

## Trạng thái vòng 15

Nhóm Nền tảng đã xong (41/50 trang lá): Menu (list cây từ /all, detail,
tạo/sửa/xóa, tạo con preset parentId + layoutId của cha) và Email/SMS
(list phân trang lọc filter/status/khoảng thời gian gửi, Email có detail
chỉ đọc + gửi lại + xóa, SMS có gửi lại + xóa ngay trên dòng) — đều qua
tab hub "Quản trị" (thêm 3 mục, không thêm tab). Điểm khác web cần
biết: tạo menu bắt buộc layoutId, sửa menu không gửi layoutId (đúng
UpdateDto); meta menu nhập JSON object vì drawer web xây form meta động
từ từ điển ràng buộc của layout; Email/SMS không có tạo/sửa (backend
cũng không có cho trang này); SMS không có màn detail như bảng web (chỉ
list + gửi lại + xóa); API gán menu cho user/role/favorite/startup
không thuộc bảng MenuTable nên chưa xây. Lỗi validation AllInOne trả
HTTP 200 kèm envelope code 400 vẫn chưa xử lý ở api-client (xem báo cáo
vòng 14, cần một vòng riêng). Trước đó: Nền tảng phần 1 (38/50).

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
- Các trang lá đã đủ 50/50 từ vòng 17 (xem `docs/inventory-mapping.md`); envelope lỗi HTTP 200 đã xử lý xong ở vòng 18. Phần còn lại là các P2: upload tệp blob, UI chọn nhiều cho bulk
đã xong hết ở vòng 20 (tác vụ nền vòng 19, Webhook vòng 20), tenant
feature-values/impersonation, menu assignment APIs, formatter, RNTL
component tests.
  CRUD thật của nhóm Quyền/Tính năng/Cài đặt/Bản địa hoá/Kiểm toán/Thông báo vẫn cần phiên admin
  (TOTP) như các nhóm trước — endpoint đã chứng minh tồn tại và yêu cầu
  auth (401 vs 404 route giả, backend đã khởi động lại trong vòng này).
  Lưu ý vòng 1: `npm run lint` dùng `eslint .` trực tiếp vì wrapper `expo lint`
  của SDK 58 lỗi với ESLint 9 đã cài (báo cần ≥ 8.57.0 dù đã có 9.39);
  lint trực tiếp cho 0 lỗi, 14 warning trong code Gluestack vendored.

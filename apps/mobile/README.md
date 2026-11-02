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

## Trạng thái vòng 34

Vòng P3 chuẩn hóa control — hộp thoại xác nhận dùng chung: rà
soát toàn app thấy 54 chỗ tự viết `Alert.alert` với cùng một khuôn
mẫu (nút Hủy style 'cancel' + nút xác nhận, 52 chỗ destructive,
2 chỗ gửi lại SMS/Email không đặt style). Nay tất cả 54 chỗ ở 49
màn hình dùng chung helper mới `src/lib/confirm.ts`
(`showConfirmDialog`: title/message/confirmText/cancelText truyền
chuỗi đã dịch sẵn, `destructive` mặc định true, false cho 2 nút
gửi) — giữ nguyên hành vi (thứ tự nút, style, onPress từng chỗ,
kể cả onPress dạng khối ở menu-favorites); import `Alert` khỏi
màn hình được gỡ, chỉ còn đúng một import `Alert` ở helper.
Không thêm key i18n. Test mới `confirm.test.ts` (3 test, mock
`Alert.alert`) kiểm chứng nút hủy/nút xác nhận/style
default-vs-destructive và việc bấm nút gọi đúng onConfirm. Kết
quả: Jest 305/305 (51 suite, +3), typecheck/lint/format/expo
config PASS (lint 0 errors, đúng 14 warning vendored), parity
i18n 1451/1451, backend /healthz Healthy + Redis (stack đã chạy
sẵn, không khởi động lại). Không còn P2 mở; P1 impersonation vẫn
BLOCKED ở backend và CRUD thật vẫn cần phiên admin TOTP.

## Trạng thái vòng 33

Vòng P3 chuẩn hóa control — rà soát toàn app tìm picker dạng danh sách
thô còn sót sau các vòng AppSelect (28–29): chỉ còn đúng một chỗ là
màn nội dung mẫu văn bản, nơi culture vẫn render bằng danh sách
`Pressable` từ vòng 21 (không tìm kiếm, không thu gọn, culture nhập
tay ngoài danh sách không có dấu hiệu đang chọn). Các
`options.map` còn lại ở màn cài đặt hệ thống/WeChat chỉ là chuỗi
hiển thị, không phải picker nên giữ nguyên. Màn nội dung nay dùng
`AppSelect` chuẩn (label culture, value = culture đang chọn,
options = `buildCulturePickerOptions` không chuyển dạng, onChange =
`selectCulture` giữ nguyên việc reset nội dung/thông báo/lỗi);
fallback preset của AppSelect khiến culture nhập tay ngoài danh sách
vẫn hiển thị đúng giá trị. Hành vi khi tải danh sách ngôn ngữ lỗi
(picker ẩn, chỉ còn ô nhập tay) và ô "culture khác" giữ nguyên.
Không thêm key i18n (dùng lại key AppSelect sẵn có). Test mới
`culture-picker-select.test.tsx` (3 test) kiểm chứng hợp đồng nối
options → AppSelect. Kết quả: Jest 302/302 (50 suite, +3),
typecheck/lint/format/expo config PASS (lint 0 errors, đúng 14
warning vendored), parity i18n 1451/1451, backend /healthz Healthy +
Redis PONG (stack đã chạy sẵn, không khởi động lại). Không còn P2
mở; P1 impersonation vẫn BLOCKED ở backend và CRUD thật vẫn cần
phiên admin TOTP.

## Trạng thái vòng 31

Vòng P2 — upload tệp blob (đóng P2 lớn cuối cùng về chức năng, trừ
review auth WeChat phía backend): màn danh sách tệp nay có nút "Tải
tệp lên" thật — DocumentPicker (SDK 58, ~58.0.4, theo docs
v58.0.0; module đã gồm trong Expo Go nên không cần dev build chỉ
để chọn file) + POST multipart single-file tới
/api/blob-management/blobs/file (CreateFileAsync, DTO
BlobFileCreateDto: containerId/name/parentId? + file part 'File').
Cố tình KHÔNG dùng chunked /file/chunk của web: server gộp chunk
bằng OrderBy(tên file) dạng chuỗi nên từ 10 chunk trở lên thứ tự
gộp sai ("10.chunk" trước "2.chunk") — chunked chỉ làm lại khi
backend sửa thứ tự gộp. api-client có thêm apiUploadMultipart
(token + _AbpDontWrapResult + envelope, không tự đặt Content-Type
để fetch sinh boundary, timeout 120s). Sau upload invalidate query
danh sách. Kiểm chứng live: POST không auth tới /blobs/file trả
validation "The File field is required. The Name field is required"
— chứng minh route + tên field đúng; upload thật vẫn BLOCKED chờ
phiên admin TOTP. Kết quả: Jest 294/294 (48 suite, +5),
typecheck/lint/format/expo config PASS (lint 0 errors, đúng 14
warning vendored), parity i18n 1450/1450 (+2 key ròng, bỏ
uploadNotAvailable), backend /healthz Healthy (stack đã chạy sẵn,
không khởi động lại). P2 còn lại duy nhất: review auth WeChat phía
backend; P1 impersonation vẫn BLOCKED ở backend.

## Trạng thái vòng 32

Vòng P2 — đóng review auth WeChat (P2 cuối cùng còn mở): đọc thẳng
controller + app service backend thay vì tin ghi chú vòng 17.
Kết luận đã tinh chỉnh: controller WeChatSettingController thật sự
không có [Authorize], NHƯNG các nhóm nhạy cảm (Official, MiniProgram,
Work — AppId/AppSecret/Token/EncodingAESKey/CorpId/Secret) đều bị
chặn bên trong app service bằng PermissionChecker + feature flag,
nên đọc không auth tới by-global chỉ trả đúng 1 cờ boolean
EnabledQuickLogin, không rò rỉ secret (kiểm chứng live, chỉ đếm
shape, không in giá trị). Ghi qua PUT vẫn 401 khi không auth. Lỗi
500 của by-current-tenant khi không auth/không tenant là do
CurrentTenant.GetId().ToString() nổ khi không có tenant, không phải
lỗi auth; web tránh bằng cách chỉ gọi route này khi
currentTenant.isAvailable. Mẫu thiếu [Authorize] này là chung toàn
repo (SettingController chung và mọi controller setting anh em đều
vậy) nên KHÔNG vá riêng WeChat trong vòng mobile — ghi thành backlog
backend: thêm [Authorize] đồng loạt cho các controller setting và
trả 400/rỗng thay cho 500 khi không có tenant. Phần mobile sửa
được thì sửa thật: màn WeChat nay đọc
GET /api/abp/application-configuration, khóa nút "Tenant hiện tại"
và ép đọc/ghi về Toàn cục khi không có tenant (kèm dòng giải
thích), tránh đường gọi chắc chắn 500 cho tài khoản host. Kết quả:
Jest 299/299 (49 suite, +5: tenant-availability), typecheck/lint/
format/expo config PASS (lint 0 errors, đúng 14 warning vendored),
parity i18n 1451/1451 (+1 key scopeTenantUnavailable), backend
/healthz Healthy + Redis PONG (stack đã chạy sẵn, không khởi động
lại). Sau vòng này không còn P2 mở nào; còn lại P1 impersonation
BLOCKED ở backend và CRUD thật BLOCKED chờ phiên admin TOTP.

## Trạng thái vòng 25

Vòng P2 — mạo danh (impersonation, đóng nốt P2 tenant còn lại từ vòng
13 ở phía mobile): luồng đổi phiên OIDC qua extension grant
`impersonation` — POST /connect/token (form urlencoded,
grant_type=impersonation, client_id public abp-mobile-client, KHÔNG
client secret, access_token hiện tại + UserId/TenantId hoặc
TenantId+TenantUserName hoặc UserDelegationId; không đích = quay về
tài khoản gốc, đúng backend ImpersonationTokenExtensionGrant). Phiên
gốc lưu riêng trong SecureStore (marker "đang mạo danh" = còn
original access token); revert ưu tiên grant server, thất bại thì
khôi phục phiên gốc đã lưu; chặn mạo danh lồng nhau ở client (mirror
backend) và xóa phiên gốc khi đăng xuất/đăng nhập mới. Điểm mở: nút
"Mạo danh" trên chi tiết người dùng (xác nhận Alert, đúng
UserTable web), nút "Mạo danh tenant" trên chi tiết tenant mở màn
nhập tài khoản (mặc định admin, bắt buộc — đúng modal web), banner
"đang mạo danh" + nút quay về trên Dashboard và Tài khoản. Helper
`impersonation.ts` (build body, validate đích mirror backend,
parse token response, swap/revert qua TokenVault để test không cần
native module) có 15 test. PHÁT HIỆN BACKEND (không phải lỗi
mobile): AllInOne đang chạy KHÔNG hỗ trợ grant này — discovery
không liệt kê `impersonation`, probe trả unsupported_grant_type
(ID2032) y như grant lạ; nguyên nhân là AllInOneModule không
DependsOn AbpOpenIddictImpersonationModule (trong khi AuthServer
đứng riêng thì có) — cần bật module ở phía backend thì luồng mobile
mới chạy live được; kiểm chứng live vẫn BLOCKED (cần phiên admin
TOTP + grant được bật). Vẫn còn P2: blob upload, formatter, RNTL
component tests, sửa favorites qua PUT, AppSelect/AppTreeSelect.

## Trạng thái vòng 24

Vòng P2 — giá trị tính năng theo tenant (đóng một nửa P2 tenant còn
lại từ vòng 13): màn mới `/saas/tenants/features`, bản mobile của
FeatureModal web trong TenantTable (providerName 'T', providerKey =
tenant id) — xem các nhóm tính năng (GET
/api/feature-management/features), sửa theo valueType (BOOLEAN →
Switch, NUMERIC → bàn phím số + kiểm tra Min/Max, Selection →
nút chọn trong itemSource.items, còn lại → text), nút Lưu chỉ bật
khi có giá trị đổi và không lỗi validate, gửi đúng body PUT web
{ features: [{ name, value }] } với value luôn là chuỗi, và nút
"Đặt lại mặc định" (DELETE của web useFeaturesApi, có xác nhận).
Mở màn từ nút "Tính năng" mới trên chi tiết tenant. Helper
`tenant-features.ts` có 8 test riêng + 1 test API. Mạo danh
(impersonation) vẫn chưa làm: nó đổi toàn bộ phiên OIDC qua
extension grant `impersonation` (POST /connect/token với access
token hiện tại + tenantId/tenantUserName) nên cần thiết kế lại auth
store kèm luồng quay về tài khoản gốc + kiểm chứng live — ghi rõ
lý do, không làm nửa vời trong vòng này. Vẫn còn P2: impersonation,
blob upload, formatter, RNTL component tests.

## Trạng thái vòng 23

Vòng P2 — menu yêu thích của tôi (đóng nốt P2 menu assignment:
by-user/by-role xong ở vòng 22, favorites xong ở vòng này): màn mới
`/platform/menu-favorites` là bản mobile của
WorkbenchQuickNav + modal WorkbenchQuickNavModal web — xem danh sách
menu yêu thích của chính mình (GET my-favorite-menus, lọc framework
tùy chọn), thêm mới (chọn menu từ menus/all của framework, nhập
alias/color/icon, màu mặc định #000000 như modal web, chặn trùng
cùng framework + menuId trước khi gọi API vì backend ném lỗi trùng),
xóa (xác nhận Alert, xóa bằng menuId — route DELETE nhận MenuId là
id menu, không phải id bản ghi). API layer đủ 4 route "của tôi"
(GET/POST/PUT/DELETE my-favorite-menus) đã xác nhận qua Swagger và
probe không token 401 (route giả 2 đoạn trả 404); PUT sửa đã test
route/body nhưng chưa có nút sửa trên UI vì DTO trả về không mang
concurrencyStamp và web cũng không có UI sửa favorites — ghi rõ lý
do, không suy đoán stamp. Bấm vào favorite không điều hướng (path
là route web, không phải route mobile). Mở màn từ nút mới trên màn
Menus. Helper `menu-favorites.ts` có 6 test riêng. Vẫn còn P2:
tenant feature-values + impersonation, blob upload, formatter, RNTL
component tests.

## Trạng thái vòng 22

Vòng P2 — phân bổ menu cho user/role (đóng P2 menu assignment APIs
tồn đọng từ vòng 15, trừ favorites): màn mới
`/platform/menu-allot` là bản mobile của MenuAllotModal web (mở từ
bảng Người dùng/Vai trò) — chọn đối tượng (user qua userId, role qua
roleName) từ danh sách thật có tìm kiếm, hoặc mở thẳng từ chi tiết
Người dùng/Vai trò; nhập framework (gợi ý từ từ điển 'UI
Framework'), tải toàn bộ menu của framework + menu đã gán, tick
menu, chọn 1 startup (bấm startup ở menu chưa tick thì tick luôn menu
đó; bỏ tick menu đang là startup thì startup rơi về null), lưu qua
PUT by-user/by-role. API layer mới: GET by-user/{userId}/{framework},
GET by-role/{role}/{framework}, PUT by-user, PUT by-role — route đã
xác nhận qua Swagger của AllInOne đang chạy, probe không token trả
401 (đúng auth-gate); route giả trùng mẫu GET {id} trả HTTP 200 kèm
envelope lỗi code 400 nên không dùng HTTP status để phân biệt route
ở controller này. Helper `menu-allotment.ts` (flatten cây, trạng thái
khởi tạo, build input, coerce startup) có 8 test riêng. Vẫn còn P2:
menu favorites (my-favorite-menus), tenant feature-values +
impersonation, blob upload, formatter, RNTL component tests.

## Trạng thái vòng 21

Vòng P2 — culture picker thật cho nội dung mẫu văn bản (đóng P2
template culture picker tồn đọng từ vòng 17): màn Nội dung mẫu nay
chọn culture từ danh sách ngôn ngữ thật qua GET
/api/localization/languages (không hardcode culture), kèm lựa chọn
"Mặc định (không culture)" đầu tiên; helper mới
`buildCulturePickerOptions` (khử trùng, trim, sắp xếp theo
cultureName) có 5 test riêng. Ô "Culture tự nhập" giữ lại để vẫn
nhập được culture chưa có trong danh sách; nếu tải danh sách ngôn
ngữ lỗi, picker ẩn đi và chỉ còn ô nhập tay, không chặn xem/sửa nội
dung. Swagger của AllInOne đang chạy xác nhận đủ route: GET
/api/localization/languages và GET content có/không culture; probe
không token: languages 401, route giả 404. Jest 214/214 (36 suites),
i18n parity 1370/1370 (+4 key). Vẫn còn P2: upload tệp blob, tenant
feature-values/impersonation, menu assignment APIs, formatter, RNTL
component tests.

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

## Trạng thái vòng 26

Formatter chính thức có mặt: prettier 3.9.10 (devDependency, npm +
package-lock giữ nguyên), config `.prettierrc.json` (single quote,
trailing comma all, printWidth 100 — chọn 100 thay vì 80 mặc định vì
code hiện có nhiều dòng 100–132 ký tự, 80 sẽ xé nhỏ vô ích), script
`npm run format` / `npm run format:check`. Lần format đầu tiên chạm
223 file (+4728/−1254, chỉ là ngắt dòng/khoảng trắng — typecheck,
lint, Jest 254/254 và parity i18n 1442/1442 đều giữ nguyên sau
format, chứng tỏ format không đổi hành vi). Cố tình KHÔNG format:
`components/ui` (Gluestack vendored), `src/i18n/*.json` (đang là JSON
một dòng theo workflow i18n; format sẽ phình thành ~3000 dòng vô
ích, parity check vẫn là cổng kiểm soát), markdown/docs (prettier
wrap prose sẽ churn changelog). Từ vòng này, bước "chạy formatter"
của prompt không còn BLOCKED. Vẫn còn P2: upload tệp blob, RNTL
component tests, sửa favorites qua PUT, AppSelect/AppTreeSelect,
review auth WeChat phía backend.

## Trạng thái vòng 27

RNTL component tests chính thức chạy được: trước vòng này thư viện
`@testing-library/react-native` v14 đã có sẵn nhưng 0 test component
nào render được — jest-expo không transform `@gluestack-ui` (ESM),
react-aria (được Gluestack kéo vào) crash vì môi trường jest RN có
`window` nhưng không có `window.screen`, và react-aria cần `react-dom`
(web-only, không có trong app RN). Vòng này sửa ở tầng cấu hình test
(không chạm production): `jest.config.js` mở rộng
`transformIgnorePatterns` cho Gluestack + deps aria/styling, alias `@`,
stub jest-only cho `react-dom` (chỉ `flushSync` identity cho hook
animation web mà RN không gọi), `jest.setup.js` gắn `window.screen`
rỗng trước khi import. Kết quả: 3 file test component mới
(AppButton 4 test, AppStates 5 test, ImpersonationBanner 3 test —
render thật, bấm thật, revert mạo danh thật qua store) = 12 test,
tổng Jest 266/266, typecheck/lint/format/expo config đều PASS,
parity i18n 1442/1442 không đổi. Giới hạn còn lại của P2 này:
AppInput chưa render được dưới jest (vendored Gluestack Input qua
react-native-css + mock TextInput của jest-preset crash ở import do
import vòng — lỗi tooling test, không phải lỗi AppInput; sẽ cần
hướng khác, ví dụ mock sâu hơn hoặc test trên device, không ép
bằng mock làm mất ý nghĩa test). Vẫn còn P2: upload tệp blob, sửa
favorites qua PUT, AppSelect/AppTreeSelect, review auth WeChat.

## Trạng thái vòng 28

AppSelect đã có và đã thay nhập Guid/text ở 2 form: component
`src/components/ui/AppSelect.tsx` (mở inline dưới field, tìm kiếm,
thụt lề theo depth cây, fallback hiển thị đúng value khi preset nằm
ngoài trang gợi ý, nút xóa cho field tùy chọn) + helper
`src/lib/tree-options.ts` sắp xếp danh sách phẳng có parentId thành
thứ tự duyệt cây, an toàn với mục mồ côi và chu trình. Form bố cục
dùng AppSelect cho framework (mục từ điển UI Framework) và dataId
(cây từ điển); form menu dùng AppSelect cho layoutId và parentId
(cây menu, loại chính menu đang sửa). Đáng chú ý, vòng này gỡ thêm
1 rào chắn tooling test từ vòng 27: preset `nativewind/babel` viết
lại import react-native dưới Jest làm mock TextInput crash ở
`copyComponentProperties` — `babel.config.js` nay bỏ preset đó chỉ
ở env test (cache theo env, dev/production giữ nguyên), nhờ đó
AppSelect có ô tìm kiếm TextInput thuần mà vẫn test được; toàn bộ
45 suite cũ vẫn PASS nên không phải regression. RNTL v14 cần lưu ý:
state sau `fireEvent.press` không phản ánh đồng bộ — test phải dùng
`findBy*`/`waitFor` (đã sửa trong test AppSelect). Kết quả: Jest
280/280 (+14: AppSelect 10, tree-options 4), typecheck/lint/format/
expo config PASS, parity i18n 1446/1446 (+4 key appSelect), backend
/healthz Healthy (không cần khởi động lại). AppSelect P2 nay đóng
một phần lớn: còn lại là các màn chưa chuyển (editionId ở form
tenant, valueType ở mục từ điển, lọc status email) và AppTreeSelect
riêng — nhưng AppSelect đã hỗ trợ depth nên tree select thực chất
đã có dạng dùng chung qua helper này. Vẫn còn P2: upload tệp blob,
sửa favorites qua PUT, review auth WeChat phía backend.

## Trạng thái vòng 29

Đóng nốt P2 AppSelect: form tenant chọn editionId qua AppSelect
(clearable, để trống = không gán, label "tên — id" từ GET
/api/saas/editions), form mục từ điển chọn valueType qua AppSelect
(chỉ 0–5, loại Object=6 như modal web, schema chuỗi '0'–'5' không
đổi nên payload gửi đi không đổi), màn email chọn status qua
AppSelect (-1 chưa gửi / 0 đã gửi / 10 thất bại, để trống = tất
cả; parseEmailStatusFilter thay regex cũ, chuỗi lạ trả undefined).
Helper dùng chung mới `src/lib/app-select-options.ts` (edition /
valueType / status email + parse) kèm 5 test. Ngoài ra, test
AppInput nay chạy được nhờ sửa babel env test ở vòng 28 (import
GlueStack Input không còn crash): thêm suite `app-input.test.tsx`
3 test (render value/placeholder + onChangeText, secureTextEntry,
hiển thị error) — P2 "AppInput component test" ở vòng 27 chính thức
đóng. Các key i18n hint cũ (editionsHint, valueTypeHint) giữ lại
trong vi/en dù UI không còn dùng, để tránh churn file locale một
dòng; placeholder của 3 field đã đổi sang dạng "Chọn …". Kết quả:
Jest 288/288 (47 suite, +8: app-select-options 5, app-input 3),
typecheck/lint/format/expo config PASS (lint 0 errors, đúng 14
warning vendored như mọi vòng), parity i18n 1446/1446, backend
/healthz Healthy + Redis PONG (không cần khởi động lại stack).
Vẫn còn P2: upload tệp blob, sửa favorites qua PUT, review auth
WeChat phía backend; P1 impersonation vẫn BLOCKED ở backend và
CRUD thật vẫn cần phiên admin TOTP.

## Trạng thái vòng 30

Đóng P2 "sửa favorites qua PUT": màn menu yêu thích nay có nút
Sửa ở mỗi dòng (form sửa alias/color/icon, Lưu qua PUT
/api/platform/menus/favorites/my-favorite-menus, Hủy đóng form,
invalidate query danh sách sau khi lưu). Chìa khóa là kiểm chứng
ở tầng backend thay vì đoán: UserFavoriteMenuAppService.UpdateByInput
chỉ gán color/alias/icon và KHÔNG gọi SetConcurrencyStampIfNotNull
như PackageAppService:167 hay EnterpriseAppService:83, trong khi
DTO trả về không có field stamp — nên stamp gửi lên không bao giờ
được áp vào entity và PUT thành công với concurrencyStamp '' (giá
trị duy nhất client có thể gửi, không phải stamp bịa). Ghi rõ cảnh
báo: nếu backend sau này ép stamp thật thì phải sửa cùng lúc vì
DTO vẫn không trả stamp. Test mới: build update với stamp rỗng
giữ nguyên ''. Kết quả: Jest 289/289 (47 suite, +1), typecheck/
lint/format/expo config PASS (lint 0 errors, đúng 14 warning
vendored), parity i18n 1448/1448 (+2 key edit/updated), backend
/healthz Healthy + Redis PONG (stack đã chạy sẵn, không khởi động
lại). Sửa thật qua UI vẫn BLOCKED chờ phiên admin TOTP; P2 còn
lại: upload tệp blob, review auth WeChat phía backend; P1
impersonation vẫn BLOCKED ở backend.

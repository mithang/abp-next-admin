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

## Trạng thái vòng 66

Vòng P3 gộp họ lặp encode path API: helper mới `apiPath(base,
...segments)` trong `src/lib/api-client.ts` (mỗi segment đi qua
`encodeURIComponent`, base lược `/` cuối, segment tĩnh như
`items`/`revoke`/`resend` qua encode vẫn giữ nguyên) và migrate
129 điểm ở 26 file API module trong `src/features/` — gồm cả
dạng template `/api/…` (105) lẫn dạng `${BASE}/…` (24), kể cả
đa segment (`connection-string`, `items`, `by-user`) và segment
tĩnh đứng trước segment động (`BASE/logs/id`). Kiểm chứng 2
chiều: 129 call `apiPath`, 0 `encodeURIComponent` còn lại ở
features (1 còn lại nằm trong file test, là expectation giữ
nguyên). Cố tình giữ: `bulk-${action}` (nội suy hậu tố, không
phải segment), các template `${BASE}/keys` thuần tĩnh (không có
gì để encode), và toàn bộ `encodeURIComponent` ở href điều
hướng trong `src/app/` (thuộc họ navigation, ứng viên vòng sau
nếu còn). Lỗi typecheck vòng này (reduce suy ra
`string | number`) đã sửa bằng generic `reduce<string>`, không
nới type. Jest 428/428 (+6 test apiPath), i18n parity 1463/1463.

## Trạng thái vòng 65

Vòng P3 gộp họ lặp cuối cùng của nhóm lọc/phân trang: tạo
hook `useDebouncedPagedFilter` (phân trang `usePagination` +
`useDebouncedValue` object tự reset về trang 0 khi settled,
kèm `onSettledExtra` tuỳ chọn như `useListFilter`) và migrate
7 màn hình lọc đa field từng tự lặp đúng bộ đôi này
(audit-logs, sys-logs, send-records, ai/tools, ai/workspaces,
email, sms). Đây là phần mở rộng đa field mà vòng 54 đã ghi
rõ là cố tình chưa gộp vào `useListFilter` (chỉ nhận một chuỗi
filter). Lỗi test vòng này (timer lúc mount vẫn chờ nên
advance 400ms reset page) là sai tiền đề của test, không phải
lỗi hook — đã sửa test flush timer mount trước. Cố tình giữ:
definitions, menus, cache (lọc đa field nhưng không phân
trang), layouts (đã dùng `useListFilter` + debounce riêng cho
framework). Jest 422/422, i18n parity 1463/1463.

## Trạng thái vòng 64

Vòng P3 rà soát các thẻ Card còn lại ngoài AppRowCard/
AppTreeRowCard: tạo wrapper `AppSectionCard` (Card p-4 >
VStack xs, children giữ nguyên verbatim) gộp 21 thẻ nội
dung tĩnh ở 15 màn hình (system 3, features 3, wechat 3,
sessions, conversations, texts, send-records, sms,
connection-strings, background-jobs, subscriptions,
send-attempts, menu-allot, menu-favorites, chi tiết
từ điển giữ key). Lỗi script vòng này (guard import bị
tag đánh lừa) đã sửa trước khi kiểm chứng. Các thẻ Card
còn lại giữ có lý do: 2 thẻ dashboard (children Text),
thẻ blobs (Text trần), thẻ {body} send-attempts, thẻ
VStack sm menu-favorites, thẻ Text menu-allot. Jest
417/417, i18n parity 1463/1463.

## Trạng thái vòng 63

Vòng P3 rà soát toàn bộ 20 Pressable còn lại ngoài
AppRowCard: tạo wrapper `AppTreeRowCard` gộp 4 thẻ cây
(organization-units giữ paddingLeft depth*20, menus/
data-dictionaries/menu-favorites dùng marginLeft depth*16,
children giữ nguyên verbatim) và mở rộng `AppRowCard`
sang 2 dòng onPress trực tiếp (manage.tsx, caches.tsx),
nâng AppRowCard lên 35 điểm. 14 Pressable còn lại được
giữ có lý do (chip claim-types, nút text texts/
connection-strings, 3 picker menu-allot, thẻ blobs
không VStack, nhánh chọn-nhiều jobs/subscriptions/
send-attempts). Jest 413/413, i18n parity 1463/1463.

## Trạng thái vòng 62

Vòng P3 tạo wrapper `AppBadge` (prompt mục 5.3 đã liệt kê
nhưng app chưa có) gộp 13 khối Badge 3 dòng lặp lại ở
8 màn hình (claim-types list/detail, roles list/detail,
users, openiddict applications/authorizations/tokens) thành
`<AppBadge label variant?>` — mọi điểm cũ đều dùng
className "self-start", chỉ khác nhãn + variant (mặc định
"default", riêng users đổi default/destructive theo
isActive). 0 điểm Badge/BadgeText cũ còn lại. Jest
409/409, i18n parity 1463/1463.

## Trạng thái vòng 61

Vòng P3 gộp 43 keyExtractor lặp lại ở 41 màn hình FlatList
vào 3 helper thuần trong `src/lib/list-keys.ts`, đặt tên
theo đúng ngữ nghĩa key để không làm mờ trường làm key:
`keyById` (27 điểm: 25 `item.id` + 2 `String(item.id)` cho
id số), `keyByName` (12 điểm `item.name`), `keyByNestedId`
(4 danh sách cây mà phần tử FlatList là wrapper
`{ item, depth }`). 11 điểm còn lại cố tình giữ nguyên
(unit.id, sessionId, row.key ×3, cultureName,
resourceName:key, key dự phòng timestamp-index, phần tử
chuỗi, item.key ×2) vì mỗi dạng chỉ 1–3 điểm. Jest
405/405, i18n parity 1463/1463.

## Trạng thái vòng 60

Vòng P3 gộp bộ 4 props trạng thái query lặp lại ở cả 48
màn hình danh sách dùng AppList vào helper thuần
`listQueryProps` (`src/lib/list-query-props.ts`):
`isPending`/`isError`/`errorMessage` (qua `toApiError`)/
`onRetry` (refetch) thành một lần spread
`{...listQueryProps(query)}`, chỉ khác tên biến query ở 4
màn hình (listQuery/menusQuery/identityQuery/
containersQuery). 44 file bỏ import `toApiError` thừa
(menu-allot và menu-favorites giữ vì còn dùng ở chỗ
khác); AppErrorState lẻ ngoài AppList và các màn hình
detail dùng queryStateElement cố tình không dùng helper
này. Jest 400/400, i18n parity 1463/1463.

## Trạng thái vòng 59

Vòng P3 gộp 40 guard không-tìm-thấy lặp lại ở 40 màn hình
detail vào helper `notFoundElement`
(`src/lib/not-found.tsx`): `if (!item) return <AppErrorState
message={t('common.empty')} />;` thành `return
notFoundElement(t('common.empty'));`, giữ nguyên vị trí
early-return (không đổi thứ tự hook hay luồng render sau
guard). Helper nhận message đã dịch + onRetry tùy chọn
(chỉ site data-dictionaries items form dùng onRetry
`detail.refetch()`). Migrate 40 điểm (40 file, chỉ khác tên
biến kiểm tra: item/user/role/app/scope/token/authz/detail.data),
kiểm chứng 2 chiều: 40 lần gọi + 40 import, 0 pattern cũ còn
lại; 38 file bỏ import `AppErrorState` thừa (conversations và
background-jobs giữ vì còn dùng AppErrorState ở chỗ khác,
data-dictionaries [id] giữ `AppEmptyState`). Cố tình giữ:
cache [key] dùng `AppEmptyState` (giá trị trống không phải
lỗi), guard login discovery -> `AppLoading`, throw Error
trong form và Text trống của entity-type properties. Lỗi
typecheck thật do vòng này bắt được: `@/` trỏ về gốc project
(vendored Gluestack), không phải `src/`, nên helper import
AppStates bằng đường dẫn tương đối như `query-state.tsx`.

## Trạng thái vòng 58

Vòng P3 gộp 18 dòng lỗi chuỗi-state lặp lại ở 16 màn hình
ngoài form vào helper `stateErrorElement`
(`src/lib/state-error.tsx`): `{xError ? <Text>{xError}</Text> :
null}` thành một lần gọi `{stateErrorElement(xError)}`.
Helper nhận `string | null | undefined`, falsy -> null đúng
ngữ nghĩa ternary cũ, message giữ nguyên verbatim (không qua
`toApiError` như họ mutation). Migrate 18 điểm (16 file, trong
đó connection-strings 2 dòng set + check và menu-favorites 2
dòng form theo đúng thứ tự cũ), kiểm chứng 2 chiều: 18 lần gọi
+ 16 import, 0 pattern cũ còn lại; chỉ form cache bỏ import
`Text` thừa (dòng lỗi là `<Text>` duy nhất của file). Cố tình
giữ: dòng thành công (`saved`, `saveMessage`, `checkResult`,
`formMessage` — họ khác), dòng lỗi trong component
(AppScreen subtitle, ImpersonationBanner, AppSelect label,
AppFormSubmit — API của component, không phải state màn hình);
form cache vẫn không dùng cặp AppFormSubmit (giữ nguyên thứ tự
nút-trước-lỗi như vòng 45), chỉ dòng lỗi đơn lẻ đổi sang helper.

## Trạng thái vòng 57

Vòng P3 gộp 16 dòng lỗi mutation lặp lại ở 13 màn hình ngoài
form vào helper `mutationErrorElement`
(`src/lib/mutation-error.tsx`): `{xMutation.isError ?
<Text>{toApiError(xMutation.error).message}</Text> : null}`
thành một lần gọi `{mutationErrorElement(xMutation)}`.
Helper nhận đúng một mutation (không nhận mảng) để màn hình
nhiều mutation (gửi lại + xóa, xóa + xóa hàng loạt) chỉ cần
gọi hai lần theo đúng thứ tự dòng cũ, không cần key/fragment;
lỗi submit của form vẫn dùng AppFormSubmit, lỗi query vẫn dùng
queryStateElement/AppList. Migrate 16 điểm (14 dòng đơn + 2
khối đa dòng ở cache và data-dictionaries), kiểm chứng 2 chiều:
16 lần gọi + 13 import, 0 pattern cũ còn lại; 4 file bỏ import
`toApiError` thừa (caches/[key], my-notifilers/[id],
messages/email/[id], data-dictionaries/[id]). Lỗi thật do vòng
này bắt được nằm ở test mới, không phải helper: `toApiError`
với `Error` thuần chỉ trả fallback (chỉ object có kind/message
mới được giữ message) nên 3 test đầu viết sai kỳ vọng đã được
sửa theo đúng hành vi của `errors.ts`.

## Trạng thái vòng 56

Vòng P3 gộp bộ ba lọc đơn đã debounce của màn hình KHÔNG
phân trang vào hook `useDebouncedFilter`
(`src/lib/use-debounced-filter.ts`): `useState('')` +
`useDebouncedValue(filter)` thành một lần destructure tuple
`[filter, setFilter, debouncedFilter]`. Trả về tuple thay vì
object để mỗi màn hình giữ đúng tên biến cũ khi destructure
— menu-allot dùng 2 hook trong cùng file (identityFilter và
framework), webhooks/definitions dùng 2 hook (filter và
groupName). Migrate 13 điểm gọi ở 11 file (6 màn hình
filter/debouncedFilter tuyệt đối, text-templating và webhook
groups đổi tên biến `debounced` thành `debouncedFilter`,
webhooks/definitions 2 hook, menu-allot 2 hook, menu-favorites
1 hook framework); kiểm chứng 2 chiều: 13 lần gọi +
13 import, 0 `useDebouncedValue` còn lại ở các file đã migrate.
9/11 file bỏ import `useState` không còn dùng (lint trở lại
đúng 14 warning vendored). Cố tình GIỮ: các màn hình lọc đa
field debounce cả object, các màn hình cần `onSettled` riêng
(layouts) và các màn hình phân trang (đã dùng `useListFilter`
từ vòng 54) — hook này không có reset page, đúng như các màn
hình đã migrate vốn không reset page khi settled (menu-allot
identity giữ nguyên hành vi không reset). 4 test mới cho hook
(khởi tạo, initial khác rỗng, debounce đúng 400 ms mặc định,
destructure tên tùy ý cho hook thứ hai trong cùng màn hình).
Lỗi thật do vòng này bắt được (ở khâu dry-run, chưa apply):
bản dry-run đầu đổi tên `debounced` bằng regex `\bdebounced\b`
sẽ ăn cả từ trong `use-debounced-filter` ở import mới —
đã sửa bằng lookaround `(?<![\w-])debounced(?![\w-])` và
xác nhận đúng 3 điểm đổi tên mỗi file trước khi apply; và
webhooks/definitions có 2 state khai báo liên tiếp rồi mới
đến 2 dòng debounce nên mẫu cặp liền kề không khớp — đã xử
lý bằng thay cả khối 4 dòng. Bài học ghi thêm: dry-run phải
in cả diff mẫu, không chỉ đếm số lượng thay thế.

## Trạng thái vòng 55

Vòng P3 gộp cặp props pull-to-refresh của FlatList vào helper
thuần `listRefreshProps` (`src/lib/list-refresh.ts`):
`refreshing={query.isFetching}` +
`onRefresh={() => void query.refetch()}` thành một lần spread
`{...listRefreshProps(query)}` — một thay đổi quy tắc refresh
(ví dụ đổi isFetching thành isRefetching) từ nay chỉ sửa một
chỗ. Migrate 48 màn hình (45 dùng biến `query`, 2 dùng
`listQuery`, 1 dùng `history` ở chat detail); kiểm chứng 2
chiều: 48 spread + 48 import, chỉ còn đúng 1 `refreshing=`
cũ (cache, giữ có lý do) và 0 lambda onRefresh cũ. Cố tình
GIỮ màn hình cache: onRefresh của nó còn xóa các khóa/marker
đã tải thêm trước khi refetch, nếu không danh sách sẽ trùng
khóa trang đầu. 3 test mới cho helper (passthrough
isFetching, refetch đúng 1 lần mỗi onRefresh, chấp nhận
mọi query-like object). Lỗi thật do vòng này bắt được: script
migrate ghép prefix import `lib/` hai lần
(`lib/lib/list-refresh`) ở cả 48 file — typecheck báo
TS2307, đã sửa bằng sửa đệ quy và chạy lại typecheck sạch
trước khi kết thúc vòng (lưu ý cho vòng sau: kiểm tra
đường dẫn import đã chèn ngay sau migrate, không chỉ đếm
số lượng).

## Trạng thái vòng 54

Vòng P3 gộp bộ ba lọc + phân trang của màn hình list vào hook
`useListFilter` (`src/lib/use-list-filter.ts`): state `filter`,
phân trang `usePagination` và `debouncedFilter` tự reset về
trang 0 khi settled — đúng mẫu 21 màn hình từng tự lặp.
Migrate 21 màn hình single-filter: 17 khớp tuyệt đối
(debouncedFilter), blob/containers (đổi tên biến `debounced`
thành `debouncedFilter`) và 3 màn hình bulk (background-jobs,
webhook subscriptions, send-attempts) qua tham số
`onSettledExtra` để vẫn xoá selection cùng timer với reset
page, giữ nguyên batching một lần render như code cũ. 19/21
file bỏ `setPage` khỏi destructure vì không còn tự reset page
(lint trở lại đúng 14 warning vendored); chỉ my-notifilers và
layouts giữ `setPage` (reset page ở chỗ khác). Cố tình GIỮ:
các màn hình lọc đa field (email/sms messages, ai/tools,
audit-logs, send-records, cache, menus) debounce cả object
`{ filter, ... }` và các màn hình không phân trang
(permissions/features/settings definitions, menu-allot
identity) — ép vào hook single-filter sẽ làm mờ queryKey/
queryFn của từng màn hình. 4 test mới cho hook (khởi tạo,
debounce + reset page cùng tick, onSettledExtra, hasMore/
loadMore).

## Trạng thái vòng 53

Vòng P3 đóng nốt họ AppForm*: 10/11 Controller còn lại trong
`src/app` nay dùng AppFormInput/AppFormSwitch. AppFormInput thêm
prop `onChangeExtra` (chạy sau `field.onChange`) nên các site
từng bị loại vì onChange phụ nay migrate được: texts cultureName
(tải lại culture), ai/tools provider và ai/workspaces textField
(cập nhật hint provider). Các site name động qua map fieldDef
(openiddict TEXT_FIELDS + MULTILINE_FIELDS, `as const` nên vẫn
đúng kiểu FieldPath) và các site error render riêng (blob
containers/blobs, background-jobs TextField) nay dùng
`fieldError` dịch thông điệp (lỗi hiện qua FormControlErrorText
của AppInput thay cho Text trần). data-dictionaries allowBeNull
dùng AppFormSwitch layout="stack" (nhãn trên, switch dưới).
Cố tình GIỮ 1 Controller duy nhất: claim-types valueType là
chip selector Pressable duy nhất trong app, không có site thứ
hai để chia sẻ component. Test onChangeExtra gộp vào test
AppFormInput có sẵn (render riêng gây overlapping act() như
bài học vòng 49–50; assert qua payload submit vì props của
wrapper Gluestack không phản ánh giá trị RHF).

## Trạng thái vòng 52

Vòng P3 chuẩn hóa nút điều hướng: 76 khối AppButton chỉ để
điều hướng (title + onPress `router.push(href)` + variant/
testID tùy chọn) nay gộp thành
`src/components/ui/AppNavButton.tsx` (nhận title/href/
variant/action/testID; bên trong tự `useRouter().push(href)`).
Migration bằng script dry-run trước rồi mới apply, kiểm chứng
2 chiều (76 tag + 76 import; chạy lại script: 0 site còn lại).
Cố tình KHÔNG migrate: nút có loading/disabled (nút hành động,
không phải điều hướng thuần), nút onPress làm thêm việc khác
(set state, mutation, xác nhận), nút dùng Link asChild và nút
back. Bài học thật trong vòng: script migrate từng mắc 3 bug
(chỉ số `(` của `push(` lệch 1 ký tự, kiểm tra phần sau `push`
không cho prop đứng sau onPress, và probe `\brouter\b` khớp
cả chuỗi `'expo-router'` nên không prune được import) — cả 3
đã sửa, cộng thêm bug nhân đôi indent dòng đầu (đã sửa hậu
migrate cho cả 76 tag). Kiểm chứng: format/typecheck/lint
(0 errors, 14 warning vendored) PASS, Jest 372/372, i18n
1463/1463, expo config PASS.

## Trạng thái vòng 51

Vòng P3 chuẩn hóa nút xóa của màn hình chi tiết: 32 khối
`useMutation` + `useInvalidateAndBack` + nút AppButton
negative/outline + `showConfirmDialog` + dòng lỗi nay gộp
thành `src/components/ui/AppDeleteButton.tsx` (nhận
confirmTitle/confirmMessage/onDelete/invalidateKey/testID;
bên trong tự làm mutation, invalidate rồi quay lại, hiện
dòng lỗi ngay dưới nút). Cố tình KHÔNG migrate các khối
xóa khác khuôn: xóa theo dòng ở màn hình list, xóa có
onError riêng (webhook, text-templating), xóa hàng loạt,
và các thao tác không phải xóa (gửi lại, làm mới, thu hồi
phiên). Bài học thật trong vòng: script migrate từng mắc
2 bug — nhân đôi indent dòng đầu (bài học vòng 50, đã sửa
rồi checkout lại toàn bộ `src/app` và migrate lại sạch)
và prune import đếm cả chính dòng import nên không prune
được gì (đã sửa bằng cách kiểm tra token trên bản đã bỏ
dòng import đó, cộng sửa tay 5 import gộp
`useInvalidateAndBack`/`useInvalidateQueries`); test mới
từng fail vì chuỗi fallback `errors.unexpected` đầy đủ dài
hơn chuỗi đoán ban đầu. 3 ngoại lệ vị trí dòng lỗi có chủ
ý: conversations (dòng lỗi từ cuối màn hình về ngay dưới
nút), cache chi tiết (dòng lỗi refresh/xóa đổi chỗ nhau),
các màn hình nút xóa trong fragment điều kiện (dòng lỗi
vào trong fragment, tương đương vì mutation chỉ gọi được
khi fragment đang render).

## Trạng thái vòng 50

Vòng P3 chuẩn hóa switch và select của form: 23 khối
`Controller` + `AppSwitchField` và 6 khối `Controller` +
`AppSelect` nay gộp thành `src/components/ui/AppFormSwitch.tsx`
và `src/components/ui/AppFormSelect.tsx` (generic
`Control<TFieldValues>` + `FieldPath`, giữ nguyên ngữ nghĩa:
switch value `field.value ?? false`, select value
`field.value ?? ''`, error chỉ dịch qua `fieldError` khi
caller truyền hàm). Cố tình KHÔNG migrate 11 Controller còn
lại (9 AppInput giữ từ vòng 49, 2 custom: claim-types
valueType và data-dictionaries allowBeNull) và các
AppSwitchField/AppSelect dùng ngoài form (toggle theo state,
filter list, culture picker). Bài học thật trong vòng:
script migrate từng nhân đôi indent của tag mở (thay từ vị
trí `<` nhưng vẫn cộng thêm indent của dòng) — đã sửa bằng
cách bỏ indent ở dòng đầu của replacement, checkout lại
toàn bộ `src/app` rồi migrate lại sạch; và test mới dùng
`handleSubmit` của RHF để lại act scope treo làm suite chạy
liền sau render timeout — đã bỏ `handleSubmit` khỏi 2 suite
mới, kiểm tra qua UI phản ánh state của form thay vì
submit (đường submit đã có suite AppFormInput chứng minh).

## Trạng thái vòng 49

Vòng P3 chuẩn hóa field text của form: 124 khối
`Controller` + `AppInput` tự lặp 9–13 dòng (control/name/
render + value/onChangeText/placeholder/error/testID) nay
gộp thành `src/components/ui/AppFormInput.tsx` (generic
`Control<TFieldValues>` + `FieldPath`, giữ nguyên ngữ nghĩa:
value `field.value ?? ''`, error chỉ dịch qua `fieldError`
khi caller truyền hàm). Cố tình KHÔNG migrate 9 site
AppInput (2 onChange kèm side effect, 5 name động theo
danh sách field runtime, 2 fragment render error riêng) và
31 Controller còn lại (AppSwitchField/AppSelect/custom).
Bài học thật trong vòng: script migrate từng làm mất đoạn
text trước site bị skip (con trỏ output nhảy mà không
append) — đã sửa bằng cách tách con trỏ tìm kiếm khỏi con
trỏ output; và cache transform của Jest dưới TMPDIR từng
cho fail giả ở test mới dù nội dung đã đúng — chạy
`--no-cache` mới ra kết quả thật.

## Trạng thái vòng 48

Vòng P3 chuẩn hóa callback thành công của mutation: 88 vị trí
`onSuccess` tự lặp `await queryClient.invalidateQueries(...)`
— trong đó 70 vị trí kèm `router.back()` — nay gộp thành
`src/lib/mutation-success.ts` (`useInvalidateQueries(...keys)`
chỉ invalidate, `useInvalidateAndBack(...keys)` invalidate rồi
quay lại; gán trực tiếp cho `onSuccess`). Cố tình KHÔNG
migrate 18 block có thêm logic khác (setState, reset form,
router.replace, invalidate 2 key trong 1 block, gửi chat...).
Bài học thật trong vòng: hook đánh giá key NGAY khi render
(khác closure onSuccess gốc chỉ chạy sau render) nên script
migrate đã đặt hook trước dòng khai báo `dataId` ở form mục từ
điển gây lỗi TDZ — typecheck bắt được, đã dời hook xuống sau
`useLocalSearchParams`; script cũng từng giữ thừa biến
`queryClient` ở 72 file do check "còn dùng" quên trừ chính
dòng khai báo, đã dọn sạch (lint trở lại 14 warning vendored).

## Trạng thái vòng 47

Vòng P3 chuẩn hóa trạng thái query của màn hình detail/form: 74
màn hình tự lặp cặp early return loading/error giống hệt nhau
(`if (query.isPending) return <AppLoading />` + block
`AppErrorState` với `toApiError(...).message` và retry
`refetch()`) — nay gộp thành `src/lib/query-state.tsx`
(`queryStateElement(query | query[])`: đang tải nếu bất kỳ
query nào đang tải, lỗi lấy query lỗi đầu tiên). Form edit giữ
guard `isEdit &&` như block gốc vì query detail bị disable khi
tạo mới vẫn có `isPending = true`; helper là hàm thuần (không
phải hook) nên an toàn ở vị trí early return cũ. Cố tình KHÔNG
migrate: màn chat AI (tập pending gồm cả history nhưng tập lỗi
ở đầu màn hình chỉ có detail, lỗi history render inline bên
dưới) và dashboard (label loading riêng + retry refetch gộp cả
3 query). Typecheck từng bắt 1 lỗi thật ở test mới (cast thiếu
`type`), đã sửa ở test, không sửa production để che lỗi.

## Trạng thái vòng 46

Vòng P3 chuẩn hóa helper dịch lỗi field của form: 32 form tự lặp
định nghĩa cục bộ `(msg?) => msg && msg.startsWith('<prefix>.')
? t(msg) : msg` (mỗi form một prefix i18n riêng) cộng 1 chỗ
inline cùng mẫu ở màn chat AI — nay gộp thành
`src/lib/field-error.ts` (`createFieldError(t, prefix)` +
`resolveFieldError`). Cố tình KHÔNG làm hook `useFieldError`:
hầu hết định nghĩa gốc nằm sau early return
(`if (isEdit && detail.isPending) return <AppLoading />`) nên
hook sẽ vi phạm quy tắc thứ tự hook; factory thuần nhận `t`
sẵn có nên an toàn ở mọi vị trí. Typecheck từng bắt 1 lỗi thật
do helper mới trả `string | undefined` trong khi `setContentError`
ở màn chat cần `string` — đã sửa bằng overload (message `string`
→ `string`, message optional → `string | undefined`), không sửa
kiểu của màn hình để che lỗi. Kết quả: Jest 357/357 (62 suite,
+5 test mới), typecheck/lint/format/expo config PASS (lint 0
errors, đúng 14 warning vendored), parity i18n 1463/1463, backend
/healthz Healthy + Vite 200 (stack sống suốt vòng, không cần
khởi động lại). Không còn P2 mở; P1 impersonation vẫn BLOCKED
ở backend và CRUD thật vẫn cần phiên admin TOTP.

## Trạng thái vòng 45

Vòng P3 chuẩn hóa chân form: cặp lặp lại ở mọi form —
dòng lỗi submit `{submitError ? <Text>{submitError}</Text> :
null}` ngay trước nút submit `<AppButton ... />` — được
gộp thành component dùng chung
`src/components/ui/AppFormSubmit.tsx` (prop error/title/
loading/disabled/onPress/testID, forward nguyên vẹn xuống
AppButton; thứ tự giữ nguyên: lỗi trên, nút dưới). Migrate
35 cặp ở 33 file bằng script dry-run trước rồi apply, kiểm
chứng 2 chiều (35 tag + 33 import, chỉ còn 1 dòng lỗi
submitError ở cache/caches/form.tsx). Cố tình KHÔNG
migrate cache/caches/form.tsx: thứ tự ở đó đảo ngược
(nút trước, lỗi sau) nên gộp sẽ đổi thứ tự hiển thị.
Jest 352/352, i18n parity 1463/1463.

## Trạng thái vòng 44

Vòng P3 chuẩn hóa khung dòng danh sách: 33 bộ ba giống hệt
nhau `<Pressable> > <Card className="p-4"> > <VStack
space="xs">` ở 33 màn hình danh sách, tất cả đều nằm trong
`<Link asChild>` (điều hướng do Link clone onPress vào
Pressable). Vòng này thêm component dùng chung
`src/components/ui/AppRowCard.tsx` (Pressable + Card p-4 +
VStack xs, forward toàn bộ prop Pressable — kể cả onPress do
Link clone vào — nên điều hướng không đổi) và migrate cả 33
bộ ba bằng script dry-run trước rồi apply, kiểm chứng 2
chiều (33 tag + 33 import + 33 thẻ đóng = 99 refs; 0 bộ ba
chính xác còn lại). Cố tình KHÔNG migrate: thẻ cây
menus/organization-units (có View marginLeft/paddingLeft
theo depth giữa Pressable và Card), thẻ container thứ hai
của blobs (Pressable > Card nhưng con là Text trần, không
có VStack), và các Card p-4 còn lại ở dashboard/detail/
form/system/wechat (không phải dòng danh sách Link). Script
gỡ import thừa theo từng file (blobs giữ Pressable/Card,
my-notifilers giữ VStack vì còn dùng ở chỗ khác). Test mới
`app-row-card.test.tsx` (4 test: render con, forward
onPress, press không handler không lỗi, render nhiều con).
Kết quả: Jest 348/348 (60 suite, +4), typecheck/lint/format/
expo config PASS (lint 0 errors, đúng 14 warning vendored),
parity i18n 1463/1463 (không đổi key). P1 impersonation vẫn
BLOCKED ở backend, CRUD thật vẫn cần phiên admin TOTP;
không còn P2 mở.

## Trạng thái vòng 43

Vòng P3 chuẩn hóa ô tìm kiếm/lọc danh sách: 51 khối
`<AppInput>` giống hệt nhau (value + onChangeText +
placeholder tìm kiếm/lọc + `autoCapitalize="none"` + testID,
không nhãn, không lỗi theo field) ở 43 màn hình danh sách —
gồm các placeholder `searchPlaceholder` và biến thể
(searchProvider/Filter/Prefix/Name/Group/App/Url/User,
frameworkPlaceholder của menu-allot/menu-favorites,
groupNamePlaceholder của webhook-definitions). Vòng này thêm
component dùng chung `src/components/ui/AppSearchInput.tsx`
(props `value`/`onChangeText`/`placeholder`/`testID`, cố định
`autoCapitalize="none"` để chuỗi tìm kiếm không bị viết hoa
chữ đầu) và migrate cả 51 khối bằng script dry-run trước
rồi apply, kiểm chứng 2 chiều (51 tag AppSearchInput + 43
import = 94 refs; không còn khối AppInput tìm kiếm nào).
Bài học trong vòng: bản script đầu lấy nhầm độ sâu import
(capture `(\.\./)+` chỉ giữ lại `../` cuối, sinh ra
`../components/ui/AppSearchInput` sai cho cả file
`../../` lẫn `../../../`) — đã sửa bằng cách lấy đúng
prefix từ dòng import AppInput của từng file, đồng thời gỡ
37 import AppInput thừa ở các file chỉ dùng AppInput cho ô
tìm kiếm. Test mới `app-search-input.test.tsx` (4 test:
render value + placeholder + changeText, autoCapitalize
luôn "none", không render nhãn, render được khi thiếu
testID). Kết quả: Jest 344/344 (59 suite, +4),
typecheck/lint/format/expo config PASS (lint 0 errors, đúng 14
warning vendored), parity i18n 1463/1463 (không đổi key). P1
impersonation vẫn BLOCKED ở backend, CRUD thật vẫn cần phiên
admin TOTP; không còn P2 mở.

## Trạng thái vòng 42

Vòng P3 chuẩn hóa công tắc bật/tắt: 28 vị trí `<Switch>` trong
21 file chia thành 2 dạng bố cục — 15 dạng hàng (nhãn trái,
switch phải, `space-between`) và 12 dạng xếp chồng (View trần,
nhãn trên switch dưới) — cộng 1 dạng VStack riêng
(data-dictionaries items, giữ nguyên). Vòng này thêm component
dùng chung `src/components/ui/AppSwitchField.tsx` (props
`label`/`value`/`onValueChange`, `layout="row"` mặc định,
`layout="stack"` giữ đúng dạng View trần cũ, luôn có
`accessibilityRole="switch"`) và migrate 27 vị trí trong 20
file bằng script dry-run trước rồi apply, kiểm chứng 2 chiều
(27 tag AppSwitchField, chỉ còn 1 `<Switch>` là dạng VStack
chưa migrate). Bài học trong vòng: bản script đầu dùng capture
`.*?` với DOTALL đã match xuyên khối ở claim-types/form.tsx
(nhãn valueTypeLabel nuốt tới khối Switch của trường required)
— đã revert toàn bộ, siết capture thành `[^}<]*`/`[^}]*` rồi
migrate lại, diff sau đó chỉ gồm khối Switch + import. Test
mới `app-switch-field.test.tsx` (4 test: render nhãn + giá
trị, valueChange gọi handler, layout stack giữ nguyên, mặc
định row). Kết quả: Jest 340/340 (58 suite, +4),
typecheck/lint/format/expo config PASS (lint 0 errors, đúng 14
warning vendored), parity i18n 1463/1463 (không đổi key). P1
impersonation vẫn BLOCKED ở backend, CRUD thật vẫn cần phiên
admin TOTP; không còn P2 mở.

## Trạng thái vòng 41

Vòng P3 chuẩn hóa dòng chi tiết: 11 màn hình chi tiết
(openiddict applications/scopes/authorizations/tokens,
permissions groups/definitions, features groups/definitions,
settings definitions, localization languages/resources) mỗi màn
tự định nghĩa hàm `Field` giống nhau từng ký tự — hiển thị
"Nhãn: giá trị", trả null khi giá trị rỗng. Vòng này thêm
component dùng chung `src/components/ui/AppDetailField.tsx`
(giữ đúng hành vi cũ, kể cả chuỗi "0" vẫn hiển thị vì là chuỗi
truthy) và migrate cả 67 tag trong 11 file bằng script có
chế độ dry-run trước rồi mới apply, kiểm chứng 2 chiều
(AppDetailField 78 = 67 tag + 11 import, không còn `function
Field` hay `<Field` nào; import Text được giữ ở cả 11 file vì
vẫn dùng cho dòng lỗi mutation). Test mới
`app-detail-field.test.tsx` (5 test: render "Nhãn: giá trị",
null khi undefined/rỗng, "0" vẫn hiện, giá trị join sẵn giữ
nguyên). Kết quả: Jest 336/336 (57 suite, +5),
typecheck/lint/format/expo config PASS (lint 0 errors, đúng 14
warning vendored), parity i18n 1463/1463 (không đổi key). P1
impersonation vẫn BLOCKED ở backend, CRUD thật vẫn cần phiên
admin TOTP; không còn P2 mở.

## Trạng thái vòng 40

Vòng P3 chuẩn hóa khung danh sách: khối ternary trạng thái
`isPending → AppLoading / isError → AppErrorState / rỗng →
AppEmptyState / còn lại → FlatList` lặp lại ở 46 màn hình, cộng
nút "Tải thêm" viết tay sau mỗi danh sách phân trang. Vòng này
thêm component dùng chung `src/components/ui/AppList.tsx`
(nhận trạng thái + thông báo + `items` để xét rỗng, render
FlatList nguyên văn của caller làm children để không trích xuất
lại renderItem, và nút "Tải thêm" với đúng luật cũ: chỉ phụ
thuộc hasMore) và migrate 48 khối ternary trong 46 file bằng
script có kiểm chứng 2 chiều (AppList 48, không còn ternary
danh sách nào; 28 nút tải thêm gộp vào AppList, 3 màn bulk giữ
nút ngoài vì có dòng lỗi mutation xen giữa, các màn không phân
trang giữ nguyên). Cố tình không migrate: khối 2 lỗi của
AllotEditor (menu-allot), danh sách chat (early return), nhật ký
job ở màn detail (empty là Text thường, list render bằng .map),
và các FlatList không có ternary (form/features/system/wechat).
Test mới `app-list.test.tsx` (6 test: tải/lỗi + retry/rỗng/render
list/có-không nút tải thêm). Kết quả: Jest 331/331 (56 suite, +6),
typecheck/lint/format/expo config PASS (lint 0 errors, đúng 14
warning vendored), parity i18n 1463/1463 (không đổi key). P1
impersonation vẫn BLOCKED ở backend, CRUD thật vẫn cần phiên
admin TOTP; không còn P2 mở.

## Trạng thái vòng 39

Vòng P3 chuẩn hóa cuộn màn hình: rà soát thấy `AppScreen` (khung
dùng chung của 132 màn hình) chỉ là VStack flex:1, không có
ScrollView nào ở `src/app` — chỉ 51 màn hình danh sách tự cuộn
được nhờ FlatList, còn 81 màn hình form/detail (32 form, 27
detail `[id]` và các màn hình còn lại) bị cắt nội dung ở điện
thoại màn hình nhỏ và bàn phím che field cuối. Vòng này thêm
prop `scrollable` cho `AppScreen` (ScrollView +
KeyboardAvoidingView iOS padding, `keyboardShouldPersistTaps`,
padding 16 giữ đúng px-4/py-4 cũ) và bật cho đúng 81 màn hình
không có FlatList (83 tag, 2 màn AI form có 2 tag); 51 màn hình
danh sách giữ nguyên để không lồng VirtualizedList (phá
virtualization). Test mới `app-screen.test.tsx` (3 test: mặc
định không ScrollView, scrollable có ScrollView, không
title/subtitle vẫn render). Kết quả: Jest 325/325 (55 suite, +3),
typecheck/lint/format/expo config PASS (lint 0 errors, đúng 14
warning vendored), parity i18n 1463/1463 (không đổi key), stack
khởi động lại cuối vòng: Redis PONG, PostgreSQL ready, backend
/healthz Healthy, Vite 200. P1 impersonation vẫn BLOCKED ở
backend, CRUD thật vẫn cần phiên admin TOTP; không còn P2 mở.

## Trạng thái vòng 38

Vòng P3 chuẩn hóa i18n — không còn chuỗi UI hardcode ngoài hệ thống
i18n: rà soát toàn `src` (trừ test, trừ comment) thấy đúng 16 dòng
tiếng Việt hardcode — 10 message fallback lỗi trong `src/lib/errors.ts`,
2 lần lặp message timeout trong `src/lib/api-client.ts`, label mặc định
`AppLoading` + nút "Thử lại" của `AppErrorState`, và màn hình
`+not-found`. Vòng này thêm 12 key mới (`errors.*` 10 key,
`notFound.title`/`notFound.backHome`) cho cả vi lẫn en (1451 → 1463,
parity sạch); `errors.ts` xuất `fallbackMessage(kind)` phân giải qua
instance i18next tại thời điểm gọi nên đổi ngôn ngữ cũng đổi message
lỗi; `api-client` dùng chung helper thay vì lặp literal; `AppStates`
dùng key `common.loading`/`common.retry` đã có sẵn (không thêm key);
`+not-found` dùng `notFound.*`. Test mới: mọi kind đều có message thật
(không rơi về tên key) + đổi ngôn ngữ vi→en→vi đổi đúng message.
Không còn P2 mở; P1 mạo danh và CRUD thật vẫn BLOCKED như trước.

## Trạng thái vòng 37

Vòng P3 chuẩn hóa control — hook phân trang dùng chung: rà soát
toàn app thấy 29 màn hình danh sách tự lặp cùng mẫu phân trang
"load more": `const PAGE_SIZE = 20;` riêng, state `page` 0-based,
`skipCount: page * PAGE_SIZE`, `maxResultCount: PAGE_SIZE`,
`hasMore = (page + 1) * PAGE_SIZE < total` và nút tải thêm
`setPage((p) => p + 1)`. Nay tất cả dùng chung hook mới
`src/lib/use-pagination.ts` (`usePagination`, mặc định
`DEFAULT_PAGE_SIZE = 20`, trả `page/setPage/resetPage/loadMore/
skipCount/maxResultCount/hasMore(totalCount)/pageSize` đúng công
thức cũ). Hai phân trang phụ cùng mẫu cũng di chuyển: chọn
identity ở menu-allot (dạng alias `identityPage/...`, công thức
`total > (page + 1) * PAGE_SIZE` tương đương `hasMore`) và log
của background job (trước dùng literal 20, nay dùng hook). Sau
vòng này `grep PAGE_SIZE` toàn `src/` chỉ còn trong chính hook;
`setPage(0)` reset của debounce (vòng 36) giữ nguyên, `setPage`
vẫn expose cho các màn hình cần reset. Hai binding setter thừa
đã bỏ để lint sạch (blobs và job-logs chỉ dùng setter cho nút
tải thêm trước đây). Cố tình giữ nguyên: phân trang marker của
cache (dùng nextMarker, không có skipCount/page — giao thức
khác). Không thêm key i18n. Test mới `use-pagination.test.ts`
(5 test): page 0/skipCount 0 ban đầu, `hasMore` đúng biên
(20 → false, 21 → true; page 1: 40 → false, 41 → true),
`resetPage`, `setPage` trực tiếp (đường reset của debounce) và
page size tùy chọn. Kết quả: Jest 320/320 (54 suite, +5),
typecheck/lint/format/expo config PASS (lint 0 errors, đúng 14
warning vendored như trước), parity i18n 1451/1451. Diff tracked
+236/−365 (32 file: 31 màn hình + README) cộng hook và test mới.
Không còn P2 mở;
P1 impersonation vẫn BLOCKED ở backend và CRUD thật vẫn cần
phiên admin TOTP.

## Trạng thái vòng 36

Vòng P3 chuẩn hóa control — hook debounce dùng chung: rà soát
toàn app thấy 43 khối `useEffect` + `setTimeout(..., 400)` ở 42
màn hình tự lặp cùng mẫu debounce filter (state debounced riêng
+ timer + clearTimeout), chỉ khác giá trị debounce và việc có
reset page/selection kèm theo. Nay tất cả 43 khối dùng chung
hook mới `src/lib/use-debounced-value.ts` (`useDebouncedValue`,
mặc định 400ms): 45 lệnh gọi (layouts và webhook-definitions mỗi
màn hình 2 giá trị), trong đó 30 lệnh gọi truyền reset cũ vào
`onSettled` — callback chạy cùng tick timer với `setDebounced`
nên page/selection reset vẫn batch chung một lần render như code
cũ, query không chạy trung gian với (filter mới, page cũ). Với
object debounce (`{ filter, provider }`...), dep của effect là
`JSON.stringify(value)` nên timer chỉ reset khi một field thật sự
đổi, đúng như danh sách dep cũ — không reset khi render do
query/selection. Ngoại lệ cố tình giữ nguyên: timer 500ms ở
`localization/texts/form.tsx` (trigger reload culture có trim +
so sánh, không phải giá trị filter) và 2 timer abort của
`api-client` (timeout request, không phải debounce). Trong vòng
này từng có 2 lần script migration làm lệch offset (sửa khai báo
state trước khi cắt effect) làm hỏng file — đã khôi phục bằng
`git checkout` và chạy lại đúng thứ tự (cắt effect trước, sửa
khai báo bằng regex sau), kiểm chứng bằng grep + typecheck +
lint. Hai lỗi lint phát sinh đã sửa đúng cách: ref chỉ ghi trong
effect (luật react-hooks/refs) và khai báo state `page`/`selected`
được dời lên trước lệnh gọi hook chụp chúng trong `onSettled`
(luật react-hooks/immutability). Không thêm key i18n. Test mới
`use-debounced-value.test.ts` (5 test, RNTL v14 cần
`await renderHook` + `await rerender` + `await act(async ...)`)
kiểm chứng: giá trị ban đầu ngay lập tức, chưa đủ 400ms chưa
đổi, gõ dồn chỉ chốt giá trị cuối, `onSettled` chạy cùng tick
với cập nhật giá trị, object literal tạo lại với field không đổi
không reset timer, delay tùy chọn được tôn trọng. Kết quả: Jest
315/315 (53 suite, +5), typecheck/lint/format/expo config PASS
(lint 0 errors, đúng 14 warning vendored), parity i18n
1451/1451, backend /healthz Healthy + Redis/PostgreSQL (stack đã
chạy sẵn, không khởi động lại). Diff ròng −210 dòng (42 file sửa
+ hook và test mới). Không còn P2 mở; P1 impersonation vẫn
BLOCKED ở backend và CRUD thật vẫn cần phiên admin TOTP.

## Trạng thái vòng 35

Vòng P3 chuẩn hóa control — format ngày giờ dùng chung: rà soát
toàn app thấy 34 chỗ tự viết `new Date(x).toLocaleString()` ở 25
màn hình, không có helper nào. Nay tất cả 34 chỗ dùng chung
helper mới `src/lib/dates.ts` (`formatDateTime`: nhận string/Date/
null/undefined, trả `undefined` cho giá trị rỗng hoặc chuỗi không
hợp lệ, còn giá trị hợp lệ giữ nguyên định dạng `toLocaleString()`
theo locale thiết bị — không hardcode format). Ngoài việc gom mẫu
lặp, helper còn sửa một bug hiển thị thật: các field nullable
(`blob expirationTime?`, task `endTime?`...) khi là `null` thì code
cũ `new Date(null)` ra ngày epoch 1970-01-01, còn chuỗi lỗi ra
chữ "Invalid Date"; nay đều render rỗng. 4 ternary
`x ? ... : undefined` (token, authorization, sys-log) được gọn
thành một lệnh gọi helper. Không thêm key i18n. Test mới
`dates.test.ts` (5 test) kiểm chứng: chuỗi ISO hợp lệ cho đúng kết
quả cũ, null/undefined/rỗng/chuỗi lỗi → undefined, và null không
còn ra epoch. Kết quả: Jest 310/310 (52 suite, +5; lần chạy đầu
có 1 test app-select fail rồi pass khi chạy lại — flaky do chạy
song song, không liên quan thay đổi này), typecheck/lint/format/
expo config PASS (lint 0 errors, đúng 14 warning vendored), parity
i18n 1451/1451, backend /healthz Healthy + Redis (stack đã chạy
sẵn, không khởi động lại). Không còn P2 mở; P1 impersonation vẫn
BLOCKED ở backend và CRUD thật vẫn cần phiên admin TOTP.

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

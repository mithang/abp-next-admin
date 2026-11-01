# Đối chiếu chức năng web → mobile (vòng 1)

Nguồn: `~/workspace/run-logs/feature-inventory.md` (76 mục menu, 50 trang lá).
Trạng thái vòng 5: Dashboard + Users + Vai trò (đủ CRUD) + Loại claim (đủ CRUD) + Đơn vị tổ chức (đủ CRUD) + Nhật ký bảo mật (list/detail/xóa) + Phiên (list/thu hồi) + Tài khoản có màn hình thật + nhóm OpenIddict (Ứng dụng đủ CRUD, Phạm vi đủ CRUD, Ủy quyền list/detail/xóa, Token list/detail/xóa) qua tab hub "Quản trị" (13/50 trang lá);
P0 OIDC đã kiểm chứng end-to-end ở tầng giao thức (authorize → login → code → đổi token PKCE, không secret);
các trang còn lại đã có route kế hoạch trong bảng này, xây dần P0→P3 các vòng sau.
Không màn hình nào dùng mock data trong production: trang chưa xây sẽ không xuất
hiện trong tab bar cho tới khi có API thật.

| # | Trang lá web | Đường dẫn web | Route mobile (kế hoạch) | Trạng thái vòng 1 |
|---|---|---|---|---|
| 1 | Phân tích | /dashboard/analytics | (tabs)/index — Dashboard | Đã xây khung (menu + tổng số users thật) |
| 2 | Bàn làm việc | /dashboard/workspace | (tabs)/index | Đã xây khung |
| 3 | Cài đặt cá nhân | /account/my-settings | (tabs)/account | Đã xây (profile thật) |
| 4 | OpenIddict: Ứng dụng | /manage/openiddict/applications | (tabs)/manage → openiddict/applications + applications/[id] + applications/form | **Đã xây đủ CRUD vòng 5: list thật (search, phân trang, refresh), detail thật, tạo/sửa bằng form RHF+Zod (clientId bắt buộc, mảng nhập nhiều dòng, create/update luôn gửi requirements requirePkce=false + settings tokenLifetime rỗng), xóa có xác nhận — API thật, không mock** |
| 5 | OpenIddict: Ủy quyền | /manage/openiddict/authorizations | (tabs)/manage → openiddict/authorizations + authorizations/[id] | **Đã xây vòng 5: list thật (search, phân trang, refresh), detail thật, xóa có xác nhận — đúng web (chỉ đọc + xóa, không form tạo/sửa)** |
| 6 | OpenIddict: Phạm vi | /manage/openiddict/scopes | (tabs)/manage → openiddict/scopes + scopes/[id] + scopes/form | **Đã xây đủ CRUD vòng 5: list thật, detail thật, tạo/sửa bằng form RHF+Zod (name bắt buộc, resources nhập nhiều dòng), xóa có xác nhận — API thật, không mock** |
| 7 | OpenIddict: Token | /manage/openiddict/tokens | (tabs)/manage → openiddict/tokens + tokens/[id] | **Đã xây vòng 5: list thật, detail thật chỉ metadata (không hiển thị payload token), xóa có xác nhận — đúng web (chỉ đọc + xóa, không form tạo/sửa)** |
| 8 | Identity: Người dùng | /manage/identity/users | (tabs)/users + users/[id] | **Đã xây: list thật (search, phân trang, refresh), detail thật** |
| 9 | Identity: Vai trò | /manage/identity/roles | (tabs)/roles + roles/[id] + roles/form | **Đã xây đủ CRUD vòng 2: list thật (search, phân trang, refresh), detail thật, tạo/sửa bằng form RHF+Zod, xóa có xác nhận — API thật, không mock** |
| 10 | Identity: Loại claim | /manage/identity/claim-types | (tabs)/claim-types + claim-types/[id] + claim-types/form | **Đã xây đủ CRUD vòng 3: list thật, detail thật, tạo/sửa bằng form RHF+Zod (sửa chỉ gửi 4 field update, loại tĩnh ẩn Sửa/Xóa như web), xóa có xác nhận — API thật, không mock** |
| 11 | Identity: Đơn vị tổ chức | /manage/identity/organization-units | (tabs)/organization-units + organization-units/[id] + organization-units/form | **Đã xây đủ CRUD vòng 4: cây từ /all (DFS, chống vòng lặp), detail, tạo gốc/con, sửa chỉ displayName, xóa có xác nhận — chưa có quản lý thành viên/vai trò trong đơn vị, chưa có di chuyển (/move)** |
| 12 | Identity: Nhật ký bảo mật | /manage/identity/security-logs | (tabs)/security-logs + security-logs/[id] | **Đã xây vòng 4: list phân trang (lọc userName), detail, xóa có xác nhận — chưa có xóa hàng loạt (API bulk đã sẵn)** |
| 13 | Identity: Phiên | /manage/identity/sessions | (tabs)/sessions | **Đã xây vòng 4: list phân trang (lọc device), thu hồi theo sessionId có xác nhận — đúng web (chỉ bảng + thu hồi, không có trang detail)** |
| 14 | Quyền: Nhóm | /manage/permissions/groups | manage/permissions/groups | Chưa xây |
| 15 | Quyền: Định nghĩa | /manage/permissions/definitions | manage/permissions/definitions | Chưa xây |
| 16 | Tính năng: Nhóm | /manage/features/groups | manage/features/groups | Chưa xây |
| 17 | Tính năng: Định nghĩa | /manage/features/definitions | manage/features/definitions | Chưa xây |
| 18 | Cài đặt hệ thống | /manage/settings/system | manage/settings/system | Chưa xây |
| 19 | Định nghĩa cài đặt | /manage/settings/definitions | manage/settings/definitions | Chưa xây |
| 20 | Ngôn ngữ | /manage/localization/languages | manage/localization/languages | Chưa xây |
| 21 | Tài nguyên bản địa hoá | /manage/localization/resources | manage/localization/resources | Chưa xây |
| 22 | Văn bản bản địa hoá | /manage/localization/texts | manage/localization/texts | Chưa xây |
| 23 | Loại thực thể (Data Protection) | /manage/data-protection/entity-type-infos | manage/data-protection/entity-type-infos | Chưa xây |
| 24 | Nhật ký kiểm toán | /manage/audit-logs | manage/audit-logs | Chưa xây |
| 25 | Nhật ký hệ thống | /manage/sys-logs | manage/sys-logs | Chưa xây |
| 26 | Thông báo của tôi | /manage/notifications/my-notifilers | (tabs)/notifications | Chưa xây |
| 27 | Nhóm thông báo | /manage/notifications/groups | manage/notifications/groups | Chưa xây |
| 28 | Định nghĩa thông báo | /manage/notifications/definitions | manage/notifications/definitions | Chưa xây |
| 29 | Lịch sử gửi thông báo | /manage/notifications/send-records | manage/notifications/send-records | Chưa xây |
| 30 | Tài liệu API | /manage/openapi | manage/openapi | Chưa xây (WebView/Swagger, vòng sau) |
| 31 | Quản lý cache | /manage/cache | manage/cache | Chưa xây |
| 32 | AI: Công cụ | /artificia-intelligence/tools | ai/tools | Chưa xây |
| 33 | AI: Không gian làm việc | /artificia-intelligence/workspace | ai/workspaces | Chưa xây |
| 34 | AI: Phiên hội thoại | /artificia-intelligence/conversations | ai/conversations | Chưa xây |
| 35 | SaaS: Tenant | /saas/tenants | saas/tenants | Chưa xây |
| 36 | SaaS: Phiên bản | /saas/editions | saas/editions | Chưa xây |
| 37 | Từ điển dữ liệu | /platform/data-dictionaries | platform/data-dictionaries | Chưa xây |
| 38 | Bố cục | /platform/layouts | platform/layouts | Chưa xây |
| 39 | Menu | /platform/menus | platform/menus | Chưa xây (API /api/platform/menus/all đã có client) |
| 40 | Email | /platform/messages/email | platform/messages/email | Chưa xây |
| 41 | SMS | /platform/messages/sms | platform/messages/sms | Chưa xây |
| 42 | Blob container | /blob-management/blob-containers | blob/containers | Chưa xây |
| 43 | Tệp blob | /blob-management/blobs | blob/blobs | Chưa xây |
| 44 | Tác vụ nền | /task-management/background-jobs | tasks/background-jobs | Chưa xây |
| 45 | Webhook: Nhóm | /webhooks/groups | webhooks/groups | Chưa xây |
| 46 | Webhook: Định nghĩa | /webhooks/definitions | webhooks/definitions | Chưa xây |
| 47 | Webhook: Đăng ký | /webhooks/subscriptions | webhooks/subscriptions | Chưa xây |
| 48 | Webhook: Bản ghi gửi | /webhooks/send-attempts | webhooks/send-attempts | Chưa xây |
| 49 | Mẫu văn bản: Định nghĩa | /text-templating/definitions | text-templating/definitions | Chưa xây |
| 50 | WeChat: Cài đặt | /wechat/settings | wechat/settings | Chưa xây |

Nhóm vben-admin (document/github/naive/ele/about): trang giới thiệu/liên kết ngoài,
ưu tiên P3, không tính trong 50 trang lá.

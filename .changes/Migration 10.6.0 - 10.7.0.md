# 10.6.0 - 10.7.0

## Thay đổi module

1. [Định nghĩa động] Thêm mới module định nghĩa động LINGYUN.Abp.Dynamic.Definitions, dùng cơ chế thống nhất để chứa phần mở rộng định nghĩa của chức năng/quyền hạn/cài đặt/thông báo/Webhook/AI.
2. [Quản lý chức năng] Viết lại FeatureDefinitionManager mặc định của ABP, thực hiện ba chiến lược hợp nhất, bỏ qua, ghi đè giữa định nghĩa tích hợp sẵn và định nghĩa động.
3. [Quản lý quyền hạn] Viết lại PermissionDefinitionManager, thực hiện ba chiến lược hợp nhất, bỏ qua, ghi đè.
4. [Quản lý cài đặt] Viết lại SettingDefinitionManager, thực hiện ba chiến lược hợp nhất, bỏ qua, ghi đè.
5. [Quản lý thông báo] Viết lại NotificationDefinitionManager, thực hiện ba chiến lược hợp nhất, bỏ qua, ghi đè.
6. [Quản lý Webhook] Viết lại WebhookDefinitionManager, thực hiện ba chiến lược hợp nhất, bỏ qua, ghi đè.
7. [Quản lý AI] Viết lại WorkspaceDefinitionManager và AIToolDefinitionManager, thực hiện ba chiến lược hợp nhất, bỏ qua, ghi đè.
8. [Quản lý định nghĩa] Sau khi định nghĩa chức năng/quyền hạn/cài đặt thay đổi sẽ kích hoạt sự kiện nội bộ, thuận tiện cho bên đăng ký làm mới bộ nhớ đệm.
9. [Quản lý định nghĩa] Tối ưu giao diện trang quản lý định nghĩa và danh sách quyền hạn.
10. [Module tài khoản] Tăng cường bảo mật người dùng: khi tạo người dùng kiểm tra chính sách xác thực hai yếu tố, khi đăng nhập liên kết trình xác thực hai yếu tố, khi đăng ký kiểm tra xác thực hai yếu tố và xác nhận email, khi đăng nhập kiểm tra xác nhận email.
11. [Module tài khoản] Tích hợp mã xác minh hình ảnh (LazyCaptcha) và mã xác minh Tencent Cloud, bao phủ các giao diện đăng nhập, đăng ký và kiểm tra mã xác minh.
12. [Module tài khoản] Tái cấu trúc trang đăng nhập, thêm tương tác như hiển thị/ẩn mật khẩu, tiêu đề nội dung trang, kiểu nút "Quay lại đăng nhập".
13. [Module tài khoản] Đăng ký người dùng chuyển sang xác nhận qua email; hoàn thiện quy trình kiểm tra mã xác minh và mã khôi phục.
14. [Module danh tính] Thêm ghi nhật ký bảo mật cho thao tác người dùng, bổ sung nhật ký bảo mật liên quan đến mã xác minh.
15. [Module danh tính] Tái cấu trúc module phiên làm việc, tăng cường tính bảo mật khi kiểm tra phiên, sau khi người dùng đổi mật khẩu sẽ làm phiên làm việc hết hiệu lực.
16. [Module danh tính] Vai trò admin bắt buộc bật xác thực hai yếu tố và cấm đặt làm vai trò mặc định.
17. [Module danh tính] Nâng cao giá trị mặc định của các cài đặt liên quan đến bảo mật.
18. [Trung tâm cá nhân] Thêm bộ kiểm tra thông tin liên kết; đồng bộ HttpClientProxy của giao diện Identity.
19. [Nhật ký kiểm toán] Nhật ký kiểm toán không còn ghi chuỗi kết nối của tenant.
20. [Module OpenIddict] Thêm hỗ trợ JsonWebKeySet và tối ưu chức năng quản lý OpenIddict cùng ánh xạ token danh tính.
21. [Module OpenIddict] Ủy quyền WeChat Work tách thành hai luồng ủy quyền: ủy quyền web và mini program (wecom_oauth / wecom_mp), đồng thời thêm triển khai đổi chứng chỉ đăng nhập tạm thời của mini program lấy phiên làm việc.
22. [Module OpenIddict] Đăng nhập bằng mã QR chuyển sang dùng tenant mà chính mã QR mang theo, không còn nhận tham số yêu cầu tenant_id; đồng thời chi tiết hóa hành động nhật ký bảo mật khi đăng nhập bằng mã QR.
23. [Module IdentityServer] Bộ kiểm tra ủy quyền WeChat Work đồng bộ tách thành hai bộ kiểm tra: ủy quyền web và mini program.
24. [Nhật ký hệ thống] Thêm nhà cung cấp truy vấn nhật ký OpenObserve, hỗ trợ dùng OpenObserve thay cho Elasticsearch để truy vấn nhật ký hệ thống.
25. [Nhật ký kiểm toán] Thêm bộ lưu trữ nhật ký kiểm toán dựa trên OpenObserve: nhật ký kiểm toán, nhật ký bảo mật, thay đổi thực thể, thao tác được phân luồng vào các luồng dữ liệu khác nhau và phân luồng theo tenant.
26. [Nhật ký kiểm toán] Thêm điểm mở rộng đóng góp thông tin cho nhật ký kiểm toán và nhật ký bảo mật, cho phép module bổ sung thông tin nhật ký mà không cần thay thế triển khai lưu trữ.
27. [Module nhật ký] Nhà cung cấp nhật ký Elasticsearch và OpenObserve tích hợp sẵn bộ tăng cường Serilog (ApplicationName / UniqueId).
28. [Nhật ký hệ thống] Tên chỉ mục của nhật ký kiểm toán/bảo mật bật chính sách cuộn (rolling).
29. [Module OpenTelemetry] Thêm công cụ đo theo dõi Redis, loại bỏ cấu hình bộ xuất Zipkin đã lỗi thời.
30. [Định vị IP] Tối ưu việc phân giải vị trí địa lý của địa chỉ IP và bản địa hóa tên.
31. [Định vị IP] Quy tắc ghi chú vị trí chuyển thành có thể cấu hình (loại bỏ theo quốc gia/tỉnh), được liên kết bởi một mục cấu hình độc lập.
32. [Định vị IP] Tất cả dịch vụ, gateway và host Aspire đều bật phân giải vị trí IP cho nhật ký kiểm toán.
33. [Định vị IP] Thư viện ngoại tuyến MaxMind GeoIP2 chuyển sang do bên sử dụng tự cung cấp khi triển khai, module không còn phân phối tích hợp sẵn; khi thiếu tệp thư viện sẽ quay về trình đọc rỗng và ghi cảnh báo.
34. [Định vị IP] Nhà cung cấp phân giải vị trí mặc định của các host chuyển từ MaxMind GeoIP2 sang IP2Region (thư viện ngoại tuyến tích hợp sẵn).
35. [Module thông báo] Tin nhắn thẻ mẫu trừu tượng hỗ trợ chuyển đổi JSON hai chiều: thêm hai bộ chuyển đổi Newtonsoft và System.Text.Json, khôi phục loại thẻ cụ thể theo card_type.
36. [Module thông báo] Phần mở rộng dữ liệu thông báo tách thành nhiều tệp từng phần theo loại tin nhắn, đồng thời bổ sung các công tắc như tin nhắn bảo mật, dịch ID, kiểm tra tin nhắn trùng lặp.
37. [Module thông báo] Thêm cơ chế khai báo tải trọng thông báo theo kênh, gói thuộc tính được mang theo không gian tên phân chia theo tiền tố kênh, kênh thêm trường mới không cần thay đổi cấu trúc bảng thông báo.
38. [Module thông báo] Tối ưu việc xây dựng siêu dữ liệu thuộc tính tải trọng kênh, loại bỏ khóa toàn cục và chuyển sang khởi tạo lười biếng.
39. [Module TuiJuhe] Hợp đồng phát hành thông báo thống nhất thành NotificationPublishContext (nhất quán với các kênh khác).
40. [Quản lý Blob] Sửa lỗ hổng vượt qua đường dẫn của nhà cung cấp lưu trữ hệ thống tệp cục bộ, thêm quy tắc kiểm tra tên và đường dẫn đa nền tảng.
41. [Quản lý Blob] Kiểm tra sự tồn tại của tệp chuyển sang lọc theo định danh container, loại bỏ truy vấn liên kết bảng container.
42. [Triển khai] Trong điều phối container, bật phân giải vị trí IP của nhật ký kiểm toán và quy tắc loại bỏ ghi chú cho từng dịch vụ; bổ sung mô tả cổng container và cấu hình chạy.
43. [CLI] Thêm lệnh blob-migration, dùng để di chuyển tệp từ bộ lưu trữ hệ thống tệp cục bộ cũ sang BlobManagement.
44. [CLI] Cải tiến blob-migration: bổ sung gợi ý tham số, khi thư mục chỉ định không tồn tại sẽ cảnh báo và dừng thao tác.
45. [Cấu trúc dự án] Các dự án microservice thống nhất đổi tên thành LINGYUN.Abp.MicroService.*, dự án ứng dụng đơn đổi tên thành LINGYUN.Abp.MicroService.AllInOne.
46. [Cấu trúc dự án] Loại bỏ các dự án host ứng dụng nguyên khối IdentityServer và AIO còn tồn tại từ trước.
47. [Cấu trúc dự án] Thêm dự án microservice AI và dự án di chuyển dữ liệu của nó, đồng thời thêm host tương ứng trong điều phối Aspire.
48. [Cấu trúc dự án] Loại khỏi solution module nền tảng VueVbenAdmin phiên bản v1 (điều hướng/cài đặt/chủ đề), giữ lại điều hướng phiên bản v5.
49. [Triển khai] Tối ưu Dockerfile, Docker Compose và script xây dựng image.
50. [Mẫu] Mẫu microservice nâng cấp lên 10.7.0, đồng bộ cấu hình đóng gói, weaving và nhật ký, đồng thời thêm appsettings.Production.json cho Host mẫu.
51. [Xây dựng] Đầu ra gói và việc có tạo gói hay không chuyển sang điều khiển theo điều kiện; thêm nội dung đóng gói abppkg và tự động nhúng tệp mô tả proxy client; weaving ConfigureAwait chỉ có hiệu lực ở Release, đồng thời loại bỏ các tệp cấu hình FodyWeavers dư thừa của từng dự án.

## Thay đổi dependency

| Tên thư viện                                                  | Phiên bản cũ          | Phiên bản mới        |
| ------------------------------------------------------- | --------------- | ------------- |
| AlibabaCloud.SDK.Captcha20230305                        |                 | 1.1.4         |
| Duende.IdentityModel                                    |                 | 7.1.0         |
| IdentityModel                                           | 7.0.0           | (Đã loại bỏ)        |
| Lazy.Captcha.Core                                       |                 | 2.2.5         |
| MaxMind.GeoIP2                                          |                 | 6.1.0         |
| Microsoft.AspNetCore.*                                  | 10.0.9          | 10.0.11       |
| Microsoft.Bcl.AsyncInterfaces                           | 10.0.9          | 10.0.11       |
| Microsoft.Data.Sqlite.Core                              | 10.0.9          | 10.0.11       |
| Microsoft.EntityFrameworkCore.*                         | 10.0.9          | 10.0.11       |
| Microsoft.Extensions.*                                  | 10.0.9          | 10.0.11       |
| Microsoft.IdentityModel.*                               | 8.19.1          | 8.19.2        |
| Microsoft.SourceLink.GitHub                             |                 | 8.0.0         |
| Microting.EntityFrameworkCore.MySql                     | 10.0.9          | 10.0.11       |
| MySql.EntityFrameworkCore                               | 10.0.1          | 10.0.9        |
| Npgsql                                                  | 10.0.0          | 10.0.3        |
| OpenIddict.Server.DataProtection                        | 7.5.0           | 7.7.0         |
| OpenIddict.Validation.DataProtection                    | 7.5.0           | 7.7.0         |
| OpenTelemetry.Exporter.Console                          | 1.17.0          | 1.19.0        |
| OpenTelemetry.Exporter.OpenTelemetryProtocol            | 1.17.0          | 1.19.0        |
| OpenTelemetry.Exporter.Zipkin                           | 1.17.0          | 1.19.0        |
| OpenTelemetry.Extensions.Hosting                        | 1.17.0          | 1.19.0        |
| OpenTelemetry.Instrumentation.AspNetCore                | 1.17.0          | 1.19.0        |
| OpenTelemetry.Instrumentation.EntityFrameworkCore       | 1.17.0-beta.1   | 1.19.0-beta.1 |
| OpenTelemetry.Instrumentation.Http                      | 1.17.0          | 1.19.0        |
| OpenTelemetry.Instrumentation.Quartz                    | 1.17.0-beta.1   | 1.19.0-beta.1 |
| OpenTelemetry.Instrumentation.Runtime                   | 1.17.0          | 1.19.0        |
| OpenTelemetry.Instrumentation.SqlClient                 | 1.17.0          | 1.19.0        |
| OpenTelemetry.Instrumentation.StackExchangeRedis        |                 | 1.19.0-beta.1 |
| System.IdentityModel.Tokens.Jwt                         | 8.19.1          | 8.19.2        |
| System.Security.Cryptography.Pkcs                       | 10.0.9          | 10.0.11       |
| System.Threading.Channels                               | 10.0.9          | 10.0.11       |
| Volo.Abp.*                                              | 10.6.0          | 10.7.0        |
| Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite            | 5.6.0           | 5.7.0         |
| aliyun-net-sdk-core                                     | 1.6.2           | (Đã loại bỏ)        |

## Di chuyển cơ sở dữ liệu

| Project Name       | Database Provider | Scripts                              | EF Core Version |
| ------------------ | ----------------- | ------------------------------------ | --------------- |
| services/AIService | MySQL             | 20261007004411_Initial-AI-Service    | 10.0.11         |

> Lưu ý: Phiên bản này thêm mới microservice AI, dự án di chuyển dữ liệu của nó là `LINGYUN.Abp.MicroService.AIService.EntityFrameworkCore` / `.DbMigrator`, tên chuỗi kết nối là `AIServiceDbMigrator`.
>
> Các cơ sở dữ liệu còn lại không có script di chuyển mới, chỉ tên dự án di chuyển thay đổi theo việc đổi tên dự án của phiên bản này: dòng `LY.*` thống nhất thành `LINGYUN.Abp.MicroService.*`,`services/Single` đổi tên thành `LINGYUN.Abp.MicroService.AllInOne`, `services/BackendAdmin` cũ đã bị loại bỏ cùng với host cũ. Khi nâng cấp, hãy thực hiện di chuyển theo tên dự án mới, dữ liệu lịch sử không cần thay đổi cấu trúc.

## Chuỗi kết nối cơ sở dữ liệu

| Module Name                   | ConnectionString Name        | Example(MySQL)                                               |
| ----------------------------- | ---------------------------- | ------------------------------------------------------------ |
| Default                       | Default                      | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| abp/Identity                  | AbpIdentity                  | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| abp/IdentityServer            | AbpIdentityServer            | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| abp/OpenIddict                | AbpOpenIddict                | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| abp/TenantManagement          | AbpTenantManagement(AbpSaas) | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| abp/FeatureManagement         | AbpFeatureManagement         | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| abp/SettingManagement         | AbpSettingManagement         | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| abp/PermissionManagement      | AbpPermissionManagement      | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/AIManagement             | AbpAIManagement              | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/BlobManagement           | AbpBlobManagement            | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/DataProtectionManagement | AbpDataProtectionManagement  | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/Gdpr                     | AbpGdpr                      | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/Saas                     | AbpSaas                      | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/LocalizationManagement   | AbpLocalizationManagement    | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/TextTemplating           | AbpTextTemplating            | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/Platform                 | AppPlatform                  | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/MessageService           | MessageService               | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/NotificationService      | Notifications                | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/TaskManagement           | TaskManagement               | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/WebhooksManagement       | WebhooksManagement           | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |
| labp/Elsa                     | Workflow                     | Server=127.0.0.1;Database=abp;User Id=root;Password=123456;SslMode=None |

> Phiên bản này không thêm mới hay đổi tên khóa chuỗi kết nối, cấu trúc cấu hình nhất quán với 10.6.0; bảng trên được gộp theo module, tên dự án hãy đối chiếu theo cách đặt tên dự án của phiên bản này.

## Lưu ý khi nâng cấp

1. **Thay đổi phá vỡ của MaxMind GeoIP2**: module không còn tích hợp sẵn `GeoLite2-City.mmdb`,hằng số công khai `AbpMaxMindGeoIP2Module.DefaultDatabaseFile` đã bị loại bỏ. Nếu cần tiếp tục sử dụng, hãy tự tải thư viện ngoại tuyến GeoLite2 và cấu hình `MaxMindGeoIP2:DatabaseFile`(hoặc biến môi trường `MaxMindGeoIP2__DatabaseFile`); khi chưa cấu hình, phân giải vị trí trả về kết quả rỗng và ghi cảnh báo. Các host mặc định đã chuyển sang IP2Region, thông thường không cần xử lý thêm.

2. **Thay đổi loại ủy quyền WeChat Work**: loại ủy quyền đổi từ `wecom` thành `wecom_oauth`,đồng thời thêm loại ủy quyền mini program `wecom_mp`.Client cũ nếu vẫn gửi `grant_type=wecom` sẽ xác thực thất bại, cần nâng cấp đồng bộ. Đồng thời `WeChatWorkTokenExtensionGrant` / `WeChatWorkGrantValidator` đã đổi thành lớp trừu tượng.

3. **Đăng nhập bằng mã QR không còn nhận `tenant_id`**: thông tin tenant lấy từ chính mã QR, tham số `tenant_id` sẽ bị bỏ qua (không báo lỗi). Bên gọi trước đây dựa vào tham số này để chỉ định tenant cần loại bỏ tham số đó.

4. **Thay đổi cấu hình weaving Fody**:`ConfigureAwait` weaving chỉ có hiệu lực ở cấu hình Release và nội tuyến `WeaverConfiguration` qua tệp thuộc tính chung; các `FodyWeavers.xml` / `.xsd` cũ của từng dự án đã bị loại bỏ. Nếu có cấu hình Fody tùy chỉnh, hãy chuyển sang khai báo tường minh trong dự án.

5. **Thay đổi hành vi đóng gói**:`GeneratePackageOnBuild` chuyển sang điều khiển theo điều kiện (không còn có hiệu lực với mọi assembly `LINGYUN*`), đồng thời thêm đóng gói nội dung `*.abppkg` và tự động nhúng `*generate-proxy.json` vào assembly `HttpApi.Client`. Nếu phụ thuộc vào đường dẫn sản phẩm đóng gói cũ, hãy xác nhận đầu ra `LocalNuget`.

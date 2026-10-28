# 10.4.0 - 10.6.0

## Thay đổi module

1. [Module quản lý chức năng]   Danh sách nhóm/định nghĩa chức năng được truy vấn trực tiếp từ giao diện kho lưu trữ, tránh bị ảnh hưởng bởi bộ nhớ đệm.[PR #1511](https://github.com/colinin/abp-next-admin/pull/1511)   
2. [Module quản lý chức năng]   Tái cấu trúc FeatureDefinitionManager, thực hiện hợp nhất định nghĩa chức năng tích hợp sẵn với định nghĩa chức năng động.[PR #1559](https://github.com/colinin/abp-next-admin/pull/1559)  
3. [Module quản lý quyền hạn]   Danh sách nhóm/định nghĩa quyền hạn được truy vấn trực tiếp từ giao diện kho lưu trữ, tránh bị ảnh hưởng bởi bộ nhớ đệm.[PR #1511](https://github.com/colinin/abp-next-admin/pull/1511)  
4. [Module quản lý quyền hạn]   Tái cấu trúc PermissionDefinitionManager, thực hiện hợp nhất định nghĩa quyền hạn tích hợp sẵn với định nghĩa quyền hạn động.[PR #1559](https://github.com/colinin/abp-next-admin/pull/1559)  
5. [Module quản lý quyền hạn]   Sửa lỗi trùng lặp chỉ mục duy nhất của quyền hạn tài nguyên MySql.[PR #1526](https://github.com/colinin/abp-next-admin/pull/1526)  
6. [Module quản lý thông báo]   Danh sách nhóm/định nghĩa thông báo được truy vấn trực tiếp từ giao diện kho lưu trữ, tránh bị ảnh hưởng bởi bộ nhớ đệm.[PR #1511](https://github.com/colinin/abp-next-admin/pull/1511)  
7. [Module quản lý thông báo]   Tái cấu trúc NotificationDefinitionManager, thêm ba chiến lược hợp nhất, bỏ qua, ghi đè.[PR #1559](https://github.com/colinin/abp-next-admin/pull/1559)    
8. [Module quản lý thông báo]   Sửa lỗi tuần tự hóa nội dung thông báo mini program WeChat không có hiệu lực.[PR #1530](https://github.com/colinin/abp-next-admin/pull/1530)    
9. [Module quản lý cài đặt]   Danh sách định nghĩa cài đặt được truy vấn trực tiếp từ giao diện kho lưu trữ, tránh bị ảnh hưởng bởi bộ nhớ đệm.[PR #1511](https://github.com/colinin/abp-next-admin/pull/1511)  
10. [Module quản lý cài đặt]   Tái cấu trúc SettingDefinitionManager, thực hiện hợp nhất định nghĩa cài đặt tích hợp sẵn với định nghĩa cài đặt động.[PR #1559](https://github.com/colinin/abp-next-admin/pull/1559)  
11. [Module quản lý Webhook]   Danh sách nhóm/định nghĩa Webhook được truy vấn trực tiếp từ giao diện kho lưu trữ, tránh bị ảnh hưởng bởi bộ nhớ đệm.[PR #1511](https://github.com/colinin/abp-next-admin/pull/1511)  
12. [Module quản lý Webhook]   Tái cấu trúc WebhookDefinitionManager, thêm ba chiến lược hợp nhất, bỏ qua, ghi đè.[PR #1559](https://github.com/colinin/abp-next-admin/pull/1559)    
13. [Module quản lý AI]   Tái cấu trúc WorkspaceDefinitionManager, thêm ba chiến lược hợp nhất, bỏ qua, ghi đè.[PR #1516](https://github.com/colinin/abp-next-admin/pull/1516)   
14. [Module quản lý AI]   Tái cấu trúc AIToolDefinitionManager, thêm ba chiến lược hợp nhất, bỏ qua, ghi đè.[PR #1516](https://github.com/colinin/abp-next-admin/pull/1516)   
15. [Module OpenIddict]   Viết lại giao diện xóa dọn hàng loạt Token của kho lưu trữ MySql, sửa lỗi thời gian chạy.[PR #1512](https://github.com/colinin/abp-next-admin/pull/1512)  
16. [Module quản lý bản địa hóa]   Danh sách tài nguyên/ngôn ngữ/văn bản bản địa hóa được truy vấn trực tiếp từ giao diện kho lưu trữ, tránh bị ảnh hưởng bởi bộ nhớ đệm.[PR #1517](https://github.com/colinin/abp-next-admin/pull/1517)  
17. [Module OpenIddict]   Thêm triển khai đăng nhập mô phỏng người dùng.[PR #1525](https://github.com/colinin/abp-next-admin/pull/1525)    
18. [Module OpenIddict]   Thêm triển khai đăng nhập mô phỏng người dùng tenant.[PR #1525](https://github.com/colinin/abp-next-admin/pull/1525)    
19. [Module proxy ngược]   Hồ sơ người dùng ghi đè cấu hình máy chủ proxy ngược/danh sách trắng địa chỉ.[PR #1532](https://github.com/colinin/abp-next-admin/pull/1532)    
20. [Module xác thực danh tính]   Sau khi người dùng đổi mật khẩu sẽ làm phiên làm việc hết hiệu lực (khi tự đổi mật khẩu thì phiên hiện tại không bị ảnh hưởng).[PR #1543](https://github.com/colinin/abp-next-admin/pull/1543)    
21. [Module UI đa tenant]   Tối ưu thành phần cửa sổ bật lên chọn tenant, khi đã định nghĩa quan hệ tenant nền tảng thì lấy danh sách doanh nghiệp nền tảng làm tenant để chọn.[PR #1538](https://github.com/colinin/abp-next-admin/pull/1538)    
22. [Module Elasticsearch]   Thêm chức năng dịch truy vấn ES bằng cây biểu thức.[PR #1552](https://github.com/colinin/abp-next-admin/pull/1552)    
23. [Module nhật ký hệ thống]   Tái cấu trúc truy vấn danh sách nhật ký hệ thống thành truy vấn qua cây biểu thức ES.[PR #1558](https://github.com/colinin/abp-next-admin/pull/1558)    
24. [Module nhật ký kiểm toán]   Tái cấu trúc truy vấn danh sách nhật ký kiểm toán thành truy vấn qua cây biểu thức ES.[PR #1558](https://github.com/colinin/abp-next-admin/pull/1558)    

## Thay đổi dependency  

| Tên thư viện                                       | Phiên bản cũ    | Phiên bản mới |
| -------------------------------------------- | --------- | ------ |
| AlibabaCloud.SDK.Dingtalk					   |    	   | 2.2.50 |
| BouncyCastle.Cryptography					   | 2.6.2     | 2.7.0  |
| IP2Region.Net								   | 3.0.0	   | 3.0.2  |
| Magicodes.IE.Excel    					   | 2.8.2	   | 2.9.0  |
| MailKit			    					   |    	   | 4.17.0 |
| Markdig			    					   | 0.44.0    | 1.3.2  |
| MimeCheck			    					   | 1.0.0     | 2.0.0  |
| MiniExcel			    					   | 1.43.0    | 1.45.0 |
| Microsoft.AspNetCore.*					   | 10.0.7	   | 10.0.9 |
| Microsoft.Bcl.AsyncInterfaces			       | 10.0.7	   | 10.0.9 |
| Microsoft.Data.Sqlite.Core                   | 10.0.7    | 10.0.9 |
| Microsoft.Data.SqlClient	                   | 6.1.1     | 7.0.2  |
| Microsoft.EntityFrameworkCore.*			   | 10.0.7	   | 10.0.9 |
| Microting.EntityFrameworkCore.MySql          | 10.0.7    | 10.0.9 |
| Microsoft.Extensions.*					   | 10.0.7    | 10.0.9 |
| Microsoft.IdentityModel.Tokens			   | 8.14.0    | 8.19.1 |
| MySqlConnector							   | 2.4.0     | 2.6.1  |
| OpenTelemetry.Exporter.Console               | 1.15.3    | 1.17.0 |
| OpenTelemetry.Exporter.OpenTelemetryProtocol | 1.15.3    | 1.17.3 |
| OpenTelemetry.Exporter.Zipkin                | 1.15.3    | 1.17.0 |
| OpenTelemetry.Extensions.Hosting             | 1.15.3    | 1.17.0 |
| OpenTelemetry.Instrumentation.AspNetCore     | 1.15.2    | 1.17.0 |
| OpenTelemetry.Instrumentation.EntityFrameworkCore     | 1.14.0-beta.2    | 1.17.0-beta.1 |
| OpenTelemetry.Instrumentation.Http	       | 1.15.1    | 1.17.0 |
| OpenTelemetry.Instrumentation.Quartz	       | 1.15.1-beta.1    | 1.17.0-beta.1 |
| OpenTelemetry.Instrumentation.Runtime	       | 1.15.1    | 1.17.0 |
| OpenTelemetry.Instrumentation.SqlClient      | 1.15.2    | 1.17.0 |
| Oracle.ManagedDataAccess.Core			       | 23.6.1    | 23.26.300 |
| QRCoder									   | 1.5.1     | 1.8.0  |
| RulesEngine								   | 5.0.5     | 6.0.0  |
| Scriban   								   | 7.0.0     | 7.2.5  |
| Serilog.Settings.Configuration               | 10.0.0    | 10.0.1 |
| Serilog.Sinks.InMemory		               |		   | 2.0.0  |
| Swashbuckle.AspNetCore                       | 10.0.1    | 10.2.3 |
| System.Security.Cryptography.Pkcs            |           | 10.0.9 |
| System.Threading.Channels                    | 10.0.7    | 10.0.9 |
| Volo.Abp.*                                   | 10.4.0    | 10.6.0 |
| Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite | 5.4.0     | 5.6.0  |



## Di chuyển cơ sở dữ liệu

| Project Name             | Database Provider | Scripts                                        | EF Core Version |
| ------------------------ | ----------------- | ---------------------------------------------- | --------------- |
| services/Single          | MySQL             | 20260626034342_Fix-MySql-Index-Key-Too-Lang-For-Resource-Permission-Grant		| 10.0.7          |
| services/BackendAdmin      | MySQL             | 20260626032421_Fix-MySql-Index-Key-Too-Lang-For-Resource-Permission-Grant		| 10.0.7          |


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

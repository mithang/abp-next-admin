# 10.2.0 - 10.4.0

## Thay đổi module

1. [Module danh tính]   Thêm job thông báo/dọn dẹp người dùng không hoạt động, triển khai ba mẫu thông báo (thông báo giữ tài khoản hoạt động, thông báo vô hiệu hóa tài khoản, thông báo xóa tài khoản)
2. [Module danh tính]   Thêm thực thể người dùng không hoạt động `IdentityUserInactive` cần thực hiện di chuyển cơ sở dữ liệu  
3. [Module danh tính]   Thêm định nghĩa cài đặt Url đăng nhập người dùng: `Abp.Identity.Link.UserLoginUri`, dùng để liên kết trang đăng nhập người dùng trong hệ thống bên ngoài    
4. [Module xác thực danh tính]   Thêm định nghĩa Url đăng nhập người dùng: `Abp.Account.UserLogin`    
5. [Module xác thực danh tính]   Thêm chức năng đăng nhập người dùng liên kết, có thể liên kết người dùng xuyên tenant, chuyển đổi đăng nhập người dùng liên kết      
6. [Module quản lý cài đặt]   Thêm các mục cài đặt còn thiếu của module danh tính: bật chống tái sử dụng mật khẩu, số lần chống tái sử dụng mật khẩu 
7. [Module cơ sở cài đặt]   Thêm phần mở rộng cấu trúc thường dùng của định nghĩa cài đặt: nhóm định nghĩa cài đặt, cài đặt thuộc về, mức ưu tiên, quyền hạn phụ thuộc, chức năng phụ thuộc, mục lựa chọn  
8. [Module quản lý cài đặt]   Tái cấu trúc giao diện dịch vụ ứng dụng quản lý cài đặt, tự động tạo cấu trúc Dto qua nhóm định nghĩa cài đặt đặt trước, quan hệ cấp trên/cấp dưới

## Thay đổi dependency  

| Tên thư viện                                       | Phiên bản cũ    | Phiên bản mới |
| -------------------------------------------- | --------- | ------ |
| Microsoft.AspNetCore.*					   | 10.0.2	   | 10.0.7 |
| Microsoft.Bcl.AsyncInterfaces			       | 10.0.2	   | 10.0.7 |
| Microsoft.Data.Sqlite.Core                   | 10.0.0    | 10.0.7 |
| Microsoft.EntityFrameworkCore.*			   | 10.0.2	   | 10.0.7 |
| Microting.EntityFrameworkCore.MySql          | 10.0.3    | 10.0.7 |
| Microsoft.Extensions.*					   | 10.0.2    | 10.0.7 |
| OpenTelemetry.Extensions.Hosting             | 1.14.0    | 1.15.3 |
| OpenTelemetry.Exporter.Console               | 1.14.0    | 1.15.3 |
| OpenTelemetry.Exporter.OpenTelemetryProtocol | 1.14.0    | 1.15.3 |
| OpenTelemetry.Exporter.Zipkin                | 1.14.0    | 1.15.3 |
| OpenTelemetry.Instrumentation.AspNetCore     | 1.14.0    | 1.15.2 |
| OpenTelemetry.Instrumentation.Http	       | 1.14.0    | 1.15.1 |
| OpenTelemetry.Instrumentation.Quartz	       | 1.14.0-beta.2    | 1.15.1-beta.1 |
| OpenTelemetry.Instrumentation.Runtime	       | 1.14.0    | 1.15.1 |
| OpenTelemetry.Instrumentation.SqlClient      | 1.14.0-beta.1    | 1.15.2 |
| OpenIddict.Server.DataProtection             | 7.2.0     | 7.5.0  |
| OpenIddict.Validation.DataProtection         | 7.2.0     | 7.5.0  |
| System.Threading.Channels                    | 10.0.0    | 10.0.7 |
| Volo.Abp.*                                   | 10.2.0    | 10.4.0 |
| Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite | 5.2.0     | 5.4.0  |



## Di chuyển cơ sở dữ liệu

| Project Name             | Database Provider | Scripts                                        | EF Core Version |
| ------------------------ | ----------------- | ---------------------------------------------- | --------------- |
| aspire/AuthServer        | PostgreSQL        | 20260530060327_Add-Identity-User-Inactive		| 10.0.2          |
| services/Single          | MySQL             | 20260529063257_Add-Identity-User-Inactive		| 10.0.3          |
| services/Single          | PostgreSQL        | 20260530055941_Add-Identity-User-Inactive		| 10.0.2          |
| services/Single          | SqlServer         | 20260530060009_Add-Identity-User-Inactive      | 10.0.2          |
| services/AuthServer      | MySQL             | 20260530061141_Add-Identity-User-Inactive		| 10.0.3          |


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

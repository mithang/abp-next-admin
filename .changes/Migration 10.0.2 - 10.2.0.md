# 10.0.2 - 10.2.0

## Thay đổi module

1. [Module quản lý quyền hạn]   ABP chính thức thêm mới [ConfigurationFeatureValueProvider](https://github.com/abpframework/abp/blob/dev/framework/src/Volo.Abp.Features/Volo/Abp/Features/ConfigurationFeatureValueProvider.cs), Nhà cung cấp này dùng tên viết tắt là `C` của nhà cung cấp chức năng, trùng tên với nhà cung cấp chức năng client `ClientFeatureValueProvider` trong dự án này, do đó tên viết tắt của `ClientFeatureValueProvider`sẽ đổi thành `CT`

   > *Cần thực hiện thủ công câu lệnh cơ sở dữ liệu để thích ứng với thay đổi này:*
   ```postgresql
   update "AbpFeatureValues" afv set "ProviderName" = 'CT' where afv."ProviderName" = 'C'
   ```

2. [Module quản lý quyền hạn] Thêm giao diện tùy chỉnh [quyền hạn tài nguyên](https://github.com/abpframework/abp/tree/dev/framework/src/Volo.Abp.Authorization/Volo/Abp/Authorization/Permissions/Resources).

3. [Module quản lý bộ nhớ đệm] Thêm chức năng xóa hàng loạt bộ nhớ đệm.

4. [Module quản lý bộ nhớ đệm]   Sửa lỗi dữ liệu trống khi truy vấn mờ.  

5. [Module quản lý bộ nhớ đệm] Thêm trang quản lý bộ nhớ đệm.  

6. [Module quản lý đa ngôn ngữ] Sửa bản địa hóa động

7. [Module quản lý quyền hạn] Thêm nhà cung cấp quyền hạn tài nguyên tổ chức `OrganizationUnitResourcePermissionValueProvider`

8. [Module lưu trữ đối tượng] Tái cấu trúc tầng domain, thêm tầng persistence, lưu trữ tham chiếu đối tượng, quyền truy cập tệp riêng tư, tầng triển khai truy cập Oss qua tham chiếu đối tượng

9. [Dịch vụ ứng dụng nguyên khối]   Tái cấu trúc dữ liệu seed, giải quyết một số dữ liệu seed xung đột với framework ABP gây lỗi thực thi sự kiện tenant mới

10. [Module khối lượng công việc Elsa] Do Elsa 2.x phụ thuộc Swashbuckle 6.x trong khi ABP phụ thuộc 10.x, tạm thời loại bỏ các giao diện liên quan đến Elsa khỏi cấu hình Swagger

11. [EFCoreMySql]    Do `Pomelo.EntityFrameworkCore.MySql` quá lâu chưa thích ứng .NET 10, dùng `Microting.EntityFrameworkCore.MySql` thay thế, xem chi tiết tại: https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql/issues/2007

12. [Dịch vụ ứng dụng nguyên khối] Thêm script di chuyển cơ sở dữ liệu MySql còn thiếu, do engine MySql InnoDB giới hạn độ dài chỉ mục, chỉ mục quyền hạn tài nguyên của ABP cần giới hạn độ dài, tạm thời loại bỏ tên tài nguyên khỏi chỉ mục

13. [Thay đổi solution] Tệp solution đổi từ định dạng `sln` thành định dạng `slnx`

14. [Module xuất dữ liệu]   Thêm `IExcelExporterProvider`、`IExcelImporterProvider`、`IWordExporterProvider` giao diện, các giao diện `IExporterProvider`、`IImporterProvider` được đánh dấu là không dùng nữa  

15. [Module xuất dữ liệu]   Thêm `AbpExporterMiniSoftwareModule` module, tích hợp `MiniExcel`、`MiniWord` triển khai `IExcelExporterProvider`、`IExcelImporterProvider`、`IWordExporterProvider` giao diện  

16. [Tối ưu solution]   Gộp các solution Task, Webhook, Wechat, Workflow vào All, loại bỏ các tệp solution thừa

## Thay đổi dependency  

| Tên thư viện                                       | Phiên bản cũ    | Phiên bản mới |
| -------------------------------------------- | --------- | ------ |
| Volo.Abp.*                                   | 10.0.2    | 10.2.0 |
| Elsa2                                        | 2.16.0    | 2.16.1 |
| Elsa3                                        | 3.3.5     | 3.6.0  |
| Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite | 5.0.2     | 5.2.0  |
| Microsoft.Bcl.AsyncInterfaces                | 10.0.0    | 10.0.2 |
| MySql.EntityFrameworkCore                    | 10.0.0-rc | 10.0.1 |
| Microting.EntityFrameworkCore.MySql          |           | 10.0.3 |
| Serilog.Extensions.Logging                   | 9.0.1     | 9.0.2  |
| DocumentFormat.OpenXml                       |           | 3.5.1  |
| MiniExcel                                    | 1.42.0    | 1.43.0 |
| MiniWord                                     |           | 0.9.2  |
| Scriban                                      | 6.3.0     | 7.0.0  |
| Swashbuckle.AspNetCore                       | 9.0.4     | 10.0.1 |



## Di chuyển cơ sở dữ liệu

| Project Name             | Database Provider | Scripts                                        | EF Core Version |
| ------------------------ | ----------------- | ---------------------------------------------- | --------------- |
| aspire/AdminService      | PostgreSQL        | 20260403034826_Upgrade-Abp-Framework-To-10-2-0 | 10.0.2          |
| aspire/AuthServer        | PostgreSQL        | 20260402040021_Upgrade-Abp-Framework-To-10-2-0 | 10.0.2          |
| aspire/PlatformService   | PostgreSQL        | 20260411023117_Add-Blob-Management-Module      | 10.0.2          |
| services/Single          | MySQL             | 20260421022905_Upgrade-Abp-Framework-To-10-2-0 | 10.0.3          |
| services/Single          | PostgreSQL        | 20260403035350_Upgrade-Abp-Framework-To-10-2-0 | 10.0.2          |
| services/Single          | PostgreSQL        | 20260421023019_Add-Blob-Management-Module      | 10.0.2          |
| services/Single          | SqlServer         | 20260403035440_Upgrade-Abp-Framework-To-10-2-0 | 10.0.2          |
| services/Single          | SqlServer         | 20260421023044_Add-Blob-Management-Module      | 10.0.2          |
| services/AuthServer      | MySQL             | 20260420064613_Upgrade-Abp-Framework-To-10-0-2 | 10.0.3          |
| services/BackendAdmin    | MySQL             | 20260420064540_Upgrade-Abp-Framework-To-10-0-2 | 10.0.3          |
| services/Platform		   | MySQL             | 20260424033808_Add-Blob-Management-Module      | 10.0.3          |
| services/IdentityServer  | MySQL             | 20260420065028_Upgrade-Abp-Framework-To-10-0-2 | 10.0.3          |
| services/RealtimeMessage | MySQL             | 20260420065252_Upgrade-Abp-Framework-To-10-0-2 | 10.0.3          |
| services/TaskManagement  | MySQL             | 20260420073543_Upgrade-Abp-Framework-To-10-0-2 | 10.0.3          |


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

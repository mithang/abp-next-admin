# LINGYUN.Abp.Account.Templates

Mô-đun định nghĩa mẫu email của mô-đun tài khoản ABP, cung cấp chức năng mẫu email liên quan đến tài khoản.

[English](./README.EN.md)

## Tính năng

* Cung cấp mẫu email tài khoản tiêu chuẩn
* Hỗ trợ bản địa hóa mẫu email
* Tích hợp hệ thống tệp ảo ABP
* Sử dụng hệ thống mẫu văn bản ABP

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpEmailingModule),
    typeof(AbpAccountApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mẫu email

### Định nghĩa mẫu

Mô-đun định nghĩa các mẫu email sau:

* `Abp.Account.MailConfirmLink` - Mẫu xác nhận địa chỉ email
  * Dùng để xác minh địa chỉ email của người dùng
  * Tệp mẫu: `/LINGYUN/Abp/Account/Emailing/Templates/MailConfirm.tpl`
  * Sử dụng bố cục email tiêu chuẩn

* `Abp.Account.MailSecurityVerifyLink` - Mẫu xác minh bảo mật email
  * Dùng để xác minh bảo mật email
  * Tệp mẫu: `/LINGYUN/Abp/Account/Emailing/Templates/MailSecurityVerify.tpl`
  * Sử dụng bố cục email tiêu chuẩn

### Hệ thống mẫu

* Sử dụng hệ thống mẫu văn bản ABP (TextTemplating)
* Hỗ trợ bản địa hóa mẫu
* Nhà cung cấp định nghĩa mẫu: `AccountTemplateDefinitionProvider`

## Bản địa hóa

Mô-đun chứa tài nguyên bản địa hóa:
* Loại tài nguyên: `AccountResource`
* Đường dẫn tài nguyên: `/LINGYUN/Abp/Account/Templates/Localization/Resources`

## Hệ thống tệp ảo

Mô-đun sử dụng hệ thống tệp ảo ABP để quản lý tệp mẫu:
* Tất cả tệp mẫu đều được nhúng qua hệ thống tệp ảo
* Hỗ trợ ghi đè và tùy chỉnh tệp mẫu

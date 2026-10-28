# LINGYUN.Abp.IdentityServer.WeChat.Work

Mô-đun xác thực WeChat Doanh nghiệp của IdentityServer, cung cấp chức năng xác thực danh tính dựa trên WeChat Doanh nghiệp.

## Tính năng

* Xác thực WeChat Doanh nghiệp
  * `WeChatWorkGrantValidator` - Trình xác thực ủy quyền WeChat Doanh nghiệp
    * Hỗ trợ đăng nhập WeChat Doanh nghiệp
    * Hỗ trợ đa tenant
    * Tự động đăng ký người dùng
    * Ghi nhật ký bảo mật
    * Thông báo sự kiện
    * Hỗ trợ bản địa hóa

* Quy trình xác thực
  1. Người dùng gửi yêu cầu đăng nhập qua WeChat Doanh nghiệp
  2. Xác thực tính hợp lệ của AgentId và Code
  3. Lấy thông tin người dùng WeChat Doanh nghiệp
  4. Xác thực trạng thái đăng ký của người dùng
     * Người dùng đã đăng ký đăng nhập trực tiếp
     * Người dùng chưa đăng ký tự động đăng ký theo cấu hình
  5. Tạo mã truy cập
  6. Ghi nhật ký bảo mật và sự kiện

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityServerWeChatWorkModule)
)]
public class YourModule : AbpModule
{
    // ...
}
```

## Mô-đun phụ thuộc

* `AbpIdentityServerDomainModule` - Mô-đun miền ABP IdentityServer
* `AbpWeChatWorkModule` - Mô-đun ABP WeChat Doanh nghiệp

## Cấu hình và sử dụng

### Cấu hình xác thực WeChat Doanh nghiệp

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<IIdentityServerBuilder>(builder =>
    {
        builder.AddExtensionGrantValidator<WeChatWorkGrantValidator>();
    });
}
```

### Tham số yêu cầu xác thực

* `grant_type`: "wechat_work" (bắt buộc)
* `agent_id`: ID ứng dụng WeChat Doanh nghiệp (bắt buộc)
* `code`: Mã ủy quyền WeChat Doanh nghiệp (bắt buộc)
* `scope`: Phạm vi yêu cầu (tùy chọn)

### Phản hồi xác thực

* Xác thực thành công:
```json
{
    "access_token": "Mã truy cập",
    "expires_in": Thời hạn hiệu lực,
    "token_type": "Bearer",
    "refresh_token": "Mã làm mới"
}
```

* Xác thực thất bại:
```json
{
    "error": "invalid_grant",
    "error_description": "Mô tả lỗi"
}
```

### Tùy chọn cấu hình

* Đăng nhập nhanh
```csharp
Configure<AbpSettingOptions>(options =>
{
    // Bật đăng nhập nhanh cho người dùng chưa đăng ký
    options.SetDefault(WeChatWorkSettingNames.EnabledQuickLogin, true);
});
```

### Loại lỗi

* `invalid_grant`: Xác thực ủy quyền thất bại
  * AgentId hoặc Code không hợp lệ
  * Người dùng chưa đăng ký và chưa bật đăng nhập nhanh
  * Lời gọi API WeChat Doanh nghiệp thất bại

Tài liệu liên quan:
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io/)
* [Tài liệu phát triển WeChat Doanh nghiệp](https://work.weixin.qq.com/api/doc)

[Xem tài liệu tiếng Anh](README.EN.md)

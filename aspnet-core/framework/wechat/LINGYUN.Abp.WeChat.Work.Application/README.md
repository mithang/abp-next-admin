# LINGYUN.Abp.WeChat.Work.Application

Mô-đun dịch vụ ứng dụng WeChat Doanh nghiệp, cung cấp triển khai tầng ứng dụng cho việc phát triển ứng dụng WeChat Doanh nghiệp.

## Tính năng

* Dịch vụ quản lý danh bạ
* Dịch vụ quản lý ứng dụng
* Dịch vụ đẩy tin nhắn
* Dịch vụ liên hệ khách hàng
* Dịch vụ xác thực danh tính
* Dịch vụ thanh toán doanh nghiệp
* Dịch vụ hóa đơn điện tử

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatWorkApplicationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Dịch vụ ứng dụng

### Quản lý danh bạ

* `IWeChatWorkContactService`: Dịch vụ quản lý danh bạ
  * Quản lý phòng ban
  * Quản lý thành viên
  * Quản lý thẻ
  * Quản lý doanh nghiệp liên kết

### Quản lý ứng dụng

* `IWeChatWorkAgentService`: Dịch vụ quản lý ứng dụng
  * Tạo ứng dụng
  * Cấu hình ứng dụng
  * Cài đặt phạm vi hiển thị của ứng dụng
  * Cài đặt trang chủ ứng dụng

### Đẩy tin nhắn

* `IWeChatWorkMessageService`: Dịch vụ đẩy tin nhắn
  * Tin nhắn văn bản
  * Tin nhắn hình ảnh
  * Tin nhắn giọng nói
  * Tin nhắn video
  * Tin nhắn tệp
  * Tin nhắn thẻ văn bản
  * Tin nhắn đồ họa
  * Tin nhắn thẻ mẫu

## Tài liệu khác

* [Tài liệu mô-đun dịch vụ ứng dụng WeChat Doanh nghiệp](README.EN.md)

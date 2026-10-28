# LINGYUN.Abp.WeChat.Work.Application.Contracts

Module hợp đồng dịch vụ ứng dụng WeChat Doanh nghiệp, cung cấp định nghĩa giao diện dịch vụ tầng ứng dụng cho việc phát triển ứng dụng WeChat Doanh nghiệp.

## Tính năng

* Giao diện dịch vụ quản lý danh bạ
* Giao diện dịch vụ quản lý ứng dụng
* Giao diện dịch vụ đẩy tin nhắn
* Giao diện dịch vụ liên hệ khách hàng
* Giao diện dịch vụ xác thực danh tính
* Giao diện dịch vụ thanh toán doanh nghiệp
* Giao diện dịch vụ hóa đơn điện tử

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpWeChatWorkApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giao diện dịch vụ

### Quản lý danh bạ

* `IWeChatWorkContactService`
  * `CreateDepartmentAsync`: Tạo phòng ban
  * `UpdateDepartmentAsync`: Cập nhật phòng ban
  * `DeleteDepartmentAsync`: Xóa phòng ban
  * `CreateUserAsync`: Tạo thành viên
  * `UpdateUserAsync`: Cập nhật thành viên
  * `DeleteUserAsync`: Xóa thành viên
  * `CreateTagAsync`: Tạo nhãn
  * `UpdateTagAsync`: Cập nhật nhãn
  * `DeleteTagAsync`: Xóa nhãn

### Quản lý ứng dụng

* `IWeChatWorkAgentService`
  * `GetAgentAsync`: Lấy ứng dụng
  * `SetAgentAsync`: Thiết lập ứng dụng
  * `GetAgentListAsync`: Lấy danh sách ứng dụng
  * `SetWorkbenchTemplateAsync`: Thiết lập mẫu bàn làm việc

### Đẩy tin nhắn

* `IWeChatWorkMessageService`
  * `SendTextAsync`: Gửi tin nhắn văn bản
  * `SendImageAsync`: Gửi tin nhắn hình ảnh
  * `SendVoiceAsync`: Gửi tin nhắn thoại
  * `SendVideoAsync`: Gửi tin nhắn video
  * `SendFileAsync`: Gửi tin nhắn tệp
  * `SendTextCardAsync`: Gửi tin nhắn thẻ văn bản
  * `SendNewsAsync`: Gửi tin nhắn bài viết (hình ảnh + văn bản)
  * `SendTemplateCardAsync`: Gửi tin nhắn thẻ mẫu

## Quyền hạn

* `WeChatWork.Contact`: Quản lý danh bạ
* `WeChatWork.Agent`: Quản lý ứng dụng
* `WeChatWork.Message`: Quản lý tin nhắn
* `WeChatWork.Customer`: Quản lý khách hàng
* `WeChatWork.Payment`: Thanh toán doanh nghiệp
* `WeChatWork.Invoice`: Hóa đơn điện tử

## Tài liệu thêm

* [Tài liệu module hợp đồng dịch vụ ứng dụng WeChat Doanh nghiệp](README.EN.md)

# LINGYUN.Abp.Elsa.Activities.Emailing

Mô-đun tích hợp hoạt động gửi email của quy trình làm việc Elsa

## Tính năng

* Cung cấp hoạt động **SendEmailing** để gửi email
  * Hỗ trợ gửi cho nhiều người nhận
  * Hỗ trợ dùng mẫu để hiển thị nội dung email
  * Hỗ trợ cú pháp JavaScript và Liquid
  * Tích hợp giao diện `IEmailSender` của khung ABP
  * Tích hợp giao diện `ITemplateRenderer` của khung ABP để hiển thị mẫu

## Cấu hình và sử dụng

```csharp
[DependsOn(
    typeof(AbpElsaActivitiesEmailingModule)
    )]
public class YouProjectModule : AbpModule
{
}
```

## appsettings.json

```json
{
    "Elsa": {
        "Emailing": true    // Bật hoạt động gửi email
    }
}
```

## Tham số hoạt động

* **To**: Danh sách địa chỉ email người nhận
* **Subject**: Tiêu đề email
* **Body**: Nội dung email
* **Culture**: Thông tin văn hóa (culture)
* **Template**: Tên mẫu
* **Model**: Tham số mô hình dùng để định dạng nội dung mẫu

[English](./README.EN.md)

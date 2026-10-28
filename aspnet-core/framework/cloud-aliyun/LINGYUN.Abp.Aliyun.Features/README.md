# LINGYUN.Abp.Aliyun.Features

Mô-đun quản lý tính năng dịch vụ Alibaba Cloud.

## Tính năng

* Cung cấp định nghĩa và quản lý tính năng dịch vụ Alibaba Cloud
* Hỗ trợ bật/tắt tính năng dịch vụ Alibaba Cloud
* Tích hợp với hệ thống quản lý tính năng ABP

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAliyunFeaturesModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Các tính năng

* **Features:AlibabaCloud** - Nhóm tính năng dịch vụ Alibaba Cloud
  * **Features:AlibabaCloud:IsEnabled** - Có bật dịch vụ Alibaba Cloud hay không
    * Giá trị mặc định: false
    * Mô tả: Bật để ứng dụng có khả năng sử dụng dịch vụ Alibaba Cloud

## Các mục cấu hình

Mô-đun này chủ yếu dùng để định nghĩa tính năng, không chứa mục cấu hình.

## Lưu ý

* Mô-đun này cần được sử dụng cùng với mô-đun LINGYUN.Abp.Aliyun
* Sau khi bật tính năng dịch vụ Alibaba Cloud, còn cần cấu hình các tham số dịch vụ tương ứng trong mô-đun LINGYUN.Abp.Aliyun

[Nhấn để xem tài liệu tiếng Anh](README.EN.md)

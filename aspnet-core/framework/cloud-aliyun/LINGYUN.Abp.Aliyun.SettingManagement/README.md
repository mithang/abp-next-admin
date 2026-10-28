# LINGYUN.Abp.Aliyun.SettingManagement

Mô-đun quản lý cấu hình Alibaba Cloud, tham chiếu mô-đun này để quản lý các cấu hình liên quan đến Alibaba Cloud, có thể công bố API ra bên ngoài thông qua gateway tổng hợp.

## Tính năng

* Cung cấp API truy vấn cấu hình dịch vụ Alibaba Cloud
* Hỗ trợ lấy thông tin cấu hình Alibaba Cloud qua API
* Tích hợp với hệ thống quản lý thiết lập ABP

## API

* **GET api/setting-management/aliyun** - Lấy thông tin cấu hình Alibaba Cloud

## Tham chiếu mô-đun

Tham chiếu mô-đun theo nhu cầu, nên tham chiếu mô-đun này trong dịch vụ chủ trì quản lý cấu hình.

```csharp
[DependsOn(typeof(AbpAliyunSettingManagementModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Lưu ý

* Vì mô-đun quản trị nền tảng chịu trách nhiệm quản lý mọi cấu hình, mô-đun này chỉ cung cấp API truy vấn
* Cần sử dụng phối hợp với mô-đun LINGYUN.Abp.Aliyun
* Nên tham chiếu mô-đun này trong dịch vụ chủ trì quản lý cấu hình

[Nhấn để xem tài liệu tiếng Anh](README.EN.md)

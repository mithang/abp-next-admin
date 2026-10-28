# LINGYUN.Abp.WeChat.Official.Senparc

Mô-đun tích hợp Senparc SDK cho tài khoản công khai WeChat, cung cấp hỗ trợ tích hợp với Senparc.Weixin SDK.

## Tính năng

* Tích hợp Senparc.Weixin SDK
* Tương thích cơ chế xử lý tin nhắn Senparc
* Tương thích cơ chế xử lý sự kiện Senparc
* Hỗ trợ hệ thống cấu hình Senparc
* Hỗ trợ chính sách bộ nhớ đệm Senparc

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatOfficialSenparcModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "WeChat": {
    "Official": {
      "Senparc": {
        "IsEnabled": true,           // Có bật tích hợp Senparc hay không
        "Cache": {
          "Type": "Local",          // Loại bộ nhớ đệm: Local/Redis/Memcached
          "Configuration": ""        // Chuỗi cấu hình bộ nhớ đệm
        }
      }
    }
  }
}
```

## Khả năng tương thích Senparc

Mô-đun này duy trì tương thích với Senparc.Weixin SDK, có thể:

* Sử dụng bộ xử lý tin nhắn Senparc
* Sử dụng bộ xử lý sự kiện Senparc
* Sử dụng phương thức gọi API Senparc
* Sử dụng cơ chế bộ nhớ đệm Senparc
* Sử dụng chức năng mở rộng Senparc

## Tài liệu khác

* [Tài liệu mô-đun tích hợp Senparc cho tài khoản công khai WeChat](README.EN.md)
* [Tài liệu Senparc.Weixin SDK](https://github.com/JeffreySu/WeiXinMPSDK)

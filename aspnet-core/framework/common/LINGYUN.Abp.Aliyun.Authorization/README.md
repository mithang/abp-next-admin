# LINGYUN.Abp.Aliyun.Authorization

Module xác thực cơ bản của Alibaba Cloud, hiện tại chỉ cần chức năng kiểm soát truy cập, do đó chỉ định nghĩa AppKeyId và AccessKeySecret.

## Cấu hình và sử dụng

Module được tham chiếu theo nhu cầu; các module sử dụng Alibaba Cloud về cơ bản đều cần phụ thuộc vào module này

Định nghĩa trước tệp **appsettings.json**

```json
{
  "Aliyun": {
    "Auth": {
      "AccessKeyId": "Mã định danh truy cập Alibaba Cloud của bạn",
      "AccessKeySecret": "Khóa bí mật truy cập Alibaba Cloud của bạn"
    }
  }
}

```

```csharp
[DependsOn(typeof(AbpAliyunAuthorizationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
# LINGYUN.Abp.Identity.Session

Module cơ sở phiên người dùng, cung cấp các giao diện chung liên quan   


## Tính năng

* Cung cấp giao diện cơ sở quản lý phiên người dùng
* Cung cấp cơ chế đồng bộ bộ nhớ đệm phiên với lưu trữ bền vững
* Hỗ trợ theo dõi thời gian truy cập phiên
* Phụ thuộc module AbpCachingModule

## Cấu hình sử dụng

```csharp
[DependsOn(typeof(AbpIdentitySessionModule))]
public class YouProjectModule : AbpModule
{
	public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<IdentitySessionCheckOptions>(options =>
        {
            // Đặt khoảng làm mới của cơ sở bộ nhớ đệm phiên và lưu trữ bền vững thành 10 phút
            options.KeepAccessTimeSpan = TimeSpan.FromMinutes(10);
        });
    }
}
```

## Cấu hình

### IdentitySessionCheckOptions

```json
{
  "Identity": {
    "Session": {
      "Check": {
        "KeepAccessTimeSpan": "00:01:00",    // Thời lượng giữ truy cập (khoảng làm mới phiên trong bộ nhớ đệm), mặc định: 1 phút
        "SessionSyncTimeSpan": "00:10:00"    // Khoảng đồng bộ phiên (từ bộ nhớ đệm sang lưu trữ bền vững), mặc định: 10 phút
      }
    }
  }
}
```

## Thông tin thêm

* [Tài liệu xác thực danh tính ABP](https://docs.abp.io/en/abp/latest/Identity)

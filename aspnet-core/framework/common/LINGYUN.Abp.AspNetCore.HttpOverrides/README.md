# LINGYUN.Abp.AspNetCore.HttpOverrides

## Mô tả mô-đun

Mô-đun ghi đè một số tiêu đề truyền tải Http  

Hiện tại, triển khai lấy địa chỉ khách hàng thực trong proxy ngược bằng cách phân tích tiêu đề **X-Forwarded-For**, thường lấy giá trị được thiết lập cuối cùng trong tiêu đề  

### Mô-đun cơ sở  

### Mô-đun nâng cao  

### Định nghĩa quyền  

### Định nghĩa tính năng  

### Định nghĩa cấu hình  

### Cách sử dụng


```csharp

    [DependsOn(
        typeof(AbpAspNetCoreHttpOverridesModule))]
    public class YouProjectModule : AbpModule
    {
    }

```

### Nhật ký cập nhật 

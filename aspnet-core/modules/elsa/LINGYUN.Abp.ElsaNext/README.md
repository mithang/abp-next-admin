# LINGYUN.Abp.ElsaNext

[elsa-core](https://github.com/elsa-workflows/elsa-core) tích hợp abp cho workflow (phiên bản 3.x)  

## Tính năng

* Định nghĩa **AbpTenantResolver** tích hợp với đa thuê bao, để elsa hỗ trợ phân giải thuê bao abp    
* Định nghĩa **AbpTenantsProvider** tích hợp với đa thuê bao, để elsa lấy thông tin thuê bao từ abp    
* Định nghĩa **AbpElsaIdGenerator** tạo định danh workflow qua giao diện **IGuidGenerator**  
* Mở rộng JavaScript liên quan đến **abp**  

## Cấu hình và sử dụng

```csharp

    [DependsOn(
        typeof(AbpElsaNextModule)
        )]
    public class YouProjectModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            PreConfigure<IModule>(elsa =>
            {
                // Tùy chỉnh cấu hình liên quan đến elsa
            });
        }
    }
```
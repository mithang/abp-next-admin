# LINGYUN.Abp.Elsa

[elsa-core](https://github.com/elsa-workflows/elsa-core) tích hợp abp cho workflow

## Tính năng

* Cung cấp **AbpActivity** mặc định tích hợp với đa thuê bao
* Định nghĩa **AbpTenantAccessor** tích hợp với đa thuê bao
* Định nghĩa **AbpElsaIdGenerator** tạo định danh workflow qua giao diện **IGuidGenerator**
* Mở rộng JavaScript liên quan đến **abp**

## Cấu hình và sử dụng

```csharp

    [DependsOn(
        typeof(AbpElsaModule)
        )]
    public class YouProjectModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            PreConfigure<ElsaOptionsBuilder>(elsa =>
            {
                // Tùy chỉnh cấu hình liên quan đến elsa
            });
        }
    }
```
# LINGYUN.Abp.Rules.RulesEngine

## Mô tả mô-đun

Triển khai tích hợp công cụ quy tắc của Microsoft  

Mặc định triển khai một nhà cung cấp quy tắc hệ thống tệp cục bộ, truy xuất tệp quy tắc theo đường dẫn **AbpRulesEnginePthsicalFileResolveOptions.PhysicalPath** do người dùng cấu hình  

Tên tệp như sau:

PhysicalPath/CurrentTenant.Id[nếu tồn tại]/tên loại thực thể quy tắc xác thực[typeof(Input).Name].json  

Nhà cung cấp quy tắc tùy chỉnh cần triển khai giao diện **IWorkflowRulesResolveContributor**, có thể không cần triển khai khởi tạo và giải phóng tài nguyên, vì vậy cung cấp một lớp trừu tượng **WorkflowRulesResolveContributorBase**  

Và thêm vào **AbpRulesEngineResolveOptions.WorkflowRulesResolvers**  

### Mô-đun cơ sở  

### Mô-đun nâng cao  

### Định nghĩa quyền  

### Định nghĩa tính năng  

### Định nghĩa cấu hình  

### Cách sử dụng


```csharp

    [DependsOn(
        typeof(AbpRulesEngineModule))]
    public class YouProjectModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpRulesEngineResolveOptions>(options =>
            {
                // Thêm nhà cung cấp phân tích quy tắc tự triển khai
                options.WorkflowRulesResolvers.Add(new FakeWorkflowRulesResolveContributor());
            });

            Configure<AbpRulesEnginePhysicalFileResolveOptions>(options =>
            {
                // Chỉ định đường dẫn tệp cục bộ thực sự tồn tại, nếu không sẽ không truy xuất tệp quy tắc cục bộ
                options.PhysicalPath = Path.Combine(Directory.GetCurrentDirectory(), "Rules");
            });
        }
    }

```

### Nhật ký cập nhật 

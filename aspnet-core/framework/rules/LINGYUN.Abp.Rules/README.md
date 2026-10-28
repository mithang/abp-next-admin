# LINGYUN.Abp.Rules

## Mô tả module

Module cơ sở của công cụ quy tắc (rule engine)

### Module cơ sở  

### Module nâng cao  

### Định nghĩa quyền  

### Định nghĩa chức năng  

### Định nghĩa cấu hình  

### Cách sử dụng


```csharp

    [DependsOn(
        typeof(AbpRulesModule))]
    public class YouProjectModule : AbpModule
    {
    }

    public class YouService 
    {
        private readonly IRuleProvider _ruleProvider;

        public YouService(IRuleProvider ruleProvider)
        {
            _ruleProvider = ruleProvider;
        }

        public async Task DoAsync()
        {
            var input = new YouInput();
            // Kiểm tra quy tắc
            await _ruleProvider.ExecuteAsync(input);

            var inputParams = new object[1]
            {
                new InputParam()
            };
            // Kiểm tra quy tắc có tham số
            await _ruleProvider.ExecuteAsync(input, inputParams);
        }
    }

```

### Nhật ký cập nhật 

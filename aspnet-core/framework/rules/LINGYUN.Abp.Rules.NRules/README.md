# LINGYUN.Abp.Rules.NRules

## Mô tả module

Module triển khai engine quy tắc dựa trên [NRules](https://github.com/NRules/NRules).

### Module cơ sở  

* LINGYUN.Abp.Rules

### Định nghĩa chức năng  

* Cung cấp triển khai engine quy tắc dựa trên NRules
* Hỗ trợ tự động đăng ký quy tắc thông qua dependency injection
* Hỗ trợ tải và thực thi quy tắc động

### Định nghĩa cấu hình  

* AbpNRulesOptions
  * DefinitionRules - Danh sách quy tắc đã định nghĩa, dùng để lưu trữ tất cả các kiểu quy tắc được đăng ký qua dependency injection

### Cách sử dụng

1. Thêm dependency `AbpNRulesModule`

```csharp
[DependsOn(typeof(AbpNRulesModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Tạo class quy tắc

```csharp
public class YourRule : RuleBase
{
    public override void Define()
    {
        // Định nghĩa điều kiện và hành động của quy tắc
        When()
            .Match<YourInput>(x => x.SomeCondition);
        Then()
            .Do(ctx => /* Thực thi hành động của quy tắc */);
    }
}
```

3. Đăng ký và thực thi quy tắc

```csharp
public class YourService 
{
    private readonly IRuleProvider _ruleProvider;

    public YourService(IRuleProvider ruleProvider)
    {
        _ruleProvider = ruleProvider;
    }

    public async Task ProcessAsync()
    {
        var input = new YourInput();
        // Thực thi kiểm tra quy tắc
        await _ruleProvider.ExecuteAsync(input);
    }
}
```

[Quay lại thư mục](../../../README.md)

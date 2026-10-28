[English](./README.en.md) | Tiếng Việt

# LINGYUN.Abp.Features.LimitValidation

Thành phần xác thực giới hạn tính năng  

Kiểm tra số lần gọi tính năng đã định nghĩa, để giới hạn việc gọi ứng dụng của các thực thể cụ thể (tenant, người dùng, client, v.v.)  

Một số chính sách sau đã được thiết lập sẵn  

LimitPolicy.Minute		Tính lưu lượng theo phút  
LimitPolicy.Hours		Tính lưu lượng theo giờ  
LimitPolicy.Days		Tính lưu lượng theo ngày  
LimitPolicy.Weeks		Tính lưu lượng theo tuần  
LimitPolicy.Month		Tính lưu lượng theo tháng  
LimitPolicy.Years		Tính lưu lượng theo năm  

## Cấu hình sử dụng


```csharp
[DependsOn(typeof(AbpFeaturesLimitValidationModule))]
public class YouProjectModule : AbpModule
{
  // other
}

public static class FakeFeatureNames 
{
    public const string GroupName = "FakeFeature.Tests";
    // Tên tính năng giới hạn số lần gọi theo loại
    public const string ClassLimitFeature = GroupName + ".LimitFeature";
    // Tên tính năng giới hạn số lần gọi theo phương thức
    public const string MethodLimitFeature = GroupName + ".MethodLimitFeature";
    // Tên tính năng giới hạn khoảng thời gian gọi
    public const string IntervalFeature = GroupName + ".IntervalFeature";
}

// Giới hạn lưu lượng phụ thuộc vào tính năng tùy chỉnh
public class FakeFeatureDefinitionProvider : FeatureDefinitionProvider
{
    public override void Define(IFeatureDefinitionContext context)
    {
        var featureGroup = context.AddGroup(FakeFeatureNames.GroupName);
        featureGroup.AddFeature(
            name: FakeFeatureNames.ClassLimitFeature,
            defaultValue: 1000.ToString(), // Số lần gọi tối đa cho phép trong chu kỳ là 1000 lần
            valueType: new ToggleStringValueType(new NumericValueValidator(1, 1000)));
        featureGroup.AddFeature(
            name: FakeFeatureNames.MethodLimitFeature,
            defaultValue: 100.ToString(), // Số lần gọi tối đa cho phép trong chu kỳ là 100 lần
            valueType: new ToggleStringValueType(new NumericValueValidator(1, 1000)));
        featureGroup.AddFeature(
            name: FakeFeatureNames.IntervalFeature,
            defaultValue: 1.ToString(),   // Chu kỳ giới hạn
            valueType: new ToggleStringValueType(new NumericValueValidator(1, 1000)));
    }
}

// Theo các tham số đã thiết lập sẵn, loại chỉ được phép gọi 1000 lần trong một ngày
[RequiresLimitFeature(FakeFeatureNames.ClassLimitFeature, FakeFeatureNames.IntervalFeature, LimitPolicy.Days)]
public class FakeLimitClass
{
    // Theo các tham số đã thiết lập sẵn, phương thức chỉ được phép gọi 100 lần trong một phút
    [RequiresLimitFeature(FakeFeatureNames.MethodLimitFeature, FakeFeatureNames.IntervalFeature, LimitPolicy.Minute)]
    public void LimitMethod() 
    {
        // other...
    }
}
```

Nếu cần tự xử lý thời lượng chính sách giới hạn tính năng, hãy ghi đè chính sách mặc định của chính sách tương ứng, đơn vị tick đồng hồ trả về luôn là giây  

```csharp
[DependsOn(typeof(AbpFeaturesLimitValidationModule))]
public class YouProjectModule : AbpModule
{
	public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpFeaturesLimitValidationOptions>(options =>
        {
            options.MapEffectPolicy(LimitPolicy.Minute, (now, tick) => return 60;); // Nghĩa là bất kể bao nhiêu phút (time), cũng chỉ giới hạn 60 giây
         });
    }
}
```

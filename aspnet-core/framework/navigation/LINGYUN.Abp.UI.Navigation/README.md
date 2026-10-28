# LINGYUN.Abp.UI.Navigation

Tiếng Việt | [English](./README.EN.md)

Mô-đun điều hướng menu, cung cấp các mục menu có thể mở rộng và tùy chỉnh  

## Tính năng

* Hỗ trợ định nghĩa và mở rộng mục menu tùy chỉnh
* Hỗ trợ đa tenant
* Hỗ trợ cấu trúc phân cấp của mục menu
* Hỗ trợ sắp xếp mục menu
* Hỗ trợ trạng thái hiển thị và vô hiệu hóa của mục menu
* Hỗ trợ biểu tượng và chuyển hướng của mục menu
* Hỗ trợ khởi tạo dữ liệu hạt giống (seed) của mục menu

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpUINavigationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

### 1. Định nghĩa nhà cung cấp menu

Định nghĩa mục menu bằng cách triển khai giao diện `INavigationDefinitionProvider`:

```csharp
public class FakeNavigationDefinitionProvider : NavigationDefinitionProvider
{
    public override void Define(INavigationDefinitionContext context)
    {
        context.Add(GetNavigationDefinition());
    }

    private static NavigationDefinition GetNavigationDefinition()
    {
        var dashboard = new ApplicationMenu(
            name: "Vben Dashboard",
            displayName: "Bảng điều khiển",
            url: "/dashboard",
            component: "",
            description: "Bảng điều khiển",
            icon: "ion:grid-outline",
            redirect: "/dashboard/analysis");

         dashboard.AddItem(
            new ApplicationMenu(
            name: "Analysis",
            displayName: "Trang phân tích",
            url: "/dashboard/analysis",
            component: "/dashboard/analysis/index",
            description: "Trang phân tích"));

         return new NavigationDefinition(dashboard);
    }
}
```

### 2. Khởi tạo dữ liệu menu

Khởi tạo dữ liệu hạt giống menu bằng cách triển khai giao diện `INavigationSeedContributor`:

```csharp
public class YourNavigationDataSeeder : INavigationSeedContributor
{
    public async Task SeedAsync(NavigationSeedContext context)
    {
        // Khởi tạo dữ liệu menu tại đây
    }
}
```

## Giải thích thuộc tính mục menu

* Name - Tên mục menu (định danh duy nhất)
* DisplayName - Tên hiển thị
* Description - Mô tả
* Url - Đường dẫn
* Component - Đường dẫn thành phần
* Redirect - Đường dẫn chuyển hướng
* Icon - Biểu tượng
* Order - Thứ tự sắp xếp (mặc định 1000)
* IsDisabled - Có bị vô hiệu hóa hay không
* IsVisible - Có hiển thị hay không
* Items - Tập hợp mục menu con
* ExtraProperties - Thuộc tính mở rộng
* MultiTenancySides - Tùy chọn đa tenant

## Thực hành tốt nhất

1. Nên đặt tên mục menu có ý nghĩa để dễ quản lý và bảo trì
2. Sử dụng hợp lý thứ tự sắp xếp của mục menu để giữ giao diện gọn gàng
3. Sử dụng biểu tượng để nâng cao trải nghiệm người dùng
4. Sử dụng hợp lý chức năng chuyển hướng để tối ưu trải nghiệm điều hướng
5. Điều khiển trạng thái hiển thị và vô hiệu hóa của mục menu theo nhu cầu thực tế

## Lưu ý

1. Name của mục menu phải là duy nhất
2. Mục menu con sẽ kế thừa cài đặt đa tenant của mục menu cha
3. Giá trị sắp xếp của mục menu càng nhỏ càng xếp trước
4. Mục menu bị vô hiệu hóa vẫn hiển thị nhưng không thể nhấp
5. Đường dẫn thành phần phải nhất quán với cấu hình định tuyến frontend

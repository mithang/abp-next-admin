# LINGYUN.Abp.UI.Navigation.VueVbenAdmin

Mô-đun khởi tạo menu điều hướng dành cho **abp-vue-vben-admin**. Mô-đun này cung cấp chức năng khởi tạo dữ liệu menu cần thiết để tích hợp với khung frontend VueVbenAdmin.

## Tính năng

* Khởi tạo dữ liệu menu
  * Cấu trúc menu đặt sẵn
  * Tự động đăng ký layout
  * Cấu hình menu động

* Tích hợp VueVbenAdmin
  * Cấu hình thành phần layout
  * Thích ứng giao diện UI
  * Tùy chỉnh mục menu

* Hỗ trợ mở rộng
  * Nhà cung cấp menu tùy chỉnh
  * Ghi đè dữ liệu menu
  * Mở rộng cấu hình layout

## Bắt đầu nhanh

1. Tham chiếu mô-đun
```csharp
[DependsOn(typeof(AbpUINavigationVueVbenAdminModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

2. Cấu hình tùy chọn
```csharp
Configure<AbpUINavigationVueVbenAdminOptions>(options =>
{
    // Cấu hình tên UI
    options.UI = "Vue Vben Admin";
    // Cấu hình tên layout
    options.LayoutName = "Vben Admin Layout";
    // Cấu hình thành phần layout
    options.LayoutPath = "LAYOUT";
});
```

## Giải thích các mục cấu hình

* `AbpUINavigationVueVbenAdminOptions.UI`
  * Giải thích: Tên UI
  * Giá trị mặc định: Vue Vben Admin
  * Lưu ý: Không nên thay đổi, cần giữ nhất quán với frontend

* `AbpUINavigationVueVbenAdminOptions.LayoutName`
  * Giải thích: Tên layout
  * Giá trị mặc định: Vben Admin Layout
  * Lưu ý: Không nên thay đổi, cần giữ nhất quán với frontend

* `AbpUINavigationVueVbenAdminOptions.LayoutPath`
  * Giải thích: Đường dẫn thành phần layout
  * Giá trị mặc định: LAYOUT
  * Lưu ý: Không nên thay đổi, cần giữ nhất quán với frontend

## Hướng dẫn sử dụng

1. Khởi tạo menu
   * Mô-đun sẽ tự động đăng ký dữ liệu menu mặc định
   * Có thể thêm menu tùy chỉnh bằng cách triển khai giao diện `INavigationDataSeedContributor`

2. Cấu hình layout
   * Cấu hình layout cần khớp với cấu hình route của frontend
   * Khi sửa cấu hình layout cần đồng bộ sửa cấu hình liên quan của frontend

3. Phát triển mở rộng
   * Có thể tùy chỉnh logic khởi tạo menu bằng cách kế thừa lớp `VueVbenAdminNavigationDataSeeder`
   * Hỗ trợ ghi đè triển khai mặc định thông qua dependency injection

## Thông tin thêm

* [Tài liệu chính thức VueVbenAdmin](https://doc.vvbin.cn/)
* [Tài liệu chính thức ABP](https://docs.abp.io/)

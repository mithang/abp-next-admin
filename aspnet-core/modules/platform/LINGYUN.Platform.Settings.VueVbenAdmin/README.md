# LINGYUN.Platform.Settings.VueVbenAdmin

Mô-đun cài đặt nền tảng của framework frontend VueVbenAdmin, cung cấp các chức năng cài đặt giao diện, bố cục, menu, v.v.

## Tính năng

* Cài đặt giao diện
  * Chế độ tối
  * Chế độ xám
  * Chế độ mù màu
  * Màu giao diện

* Cài đặt bố cục
  * Chế độ toàn màn hình
  * Chế độ nội dung
  * Trạng thái tải trang
  * Hiển thị chân trang
  * Quay lại đầu trang

* Cài đặt menu
  * Chế độ menu
  * Giao diện menu
  * Chiều rộng menu
  * Thu gọn menu
  * Tách menu
  * Kéo thả menu

* Cài đặt thanh tiêu đề
  * Ghim thanh tiêu đề
  * Giao diện thanh tiêu đề
  * Nút toàn màn hình
  * Nút tài liệu
  * Nút thông báo
  * Nút tìm kiếm

* Cài đặt nhiều tab
  * Bộ nhớ đệm tab
  * Kéo thả tab
  * Làm mới tab
  * Thu gọn tab

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(PlatformSettingsVueVbenAdminModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Tài nguyên bản địa hóa

* Hỗ trợ tiếng Trung giản thể
* Hỗ trợ tiếng Anh

## Mục cấu hình

```json
{
  "Settings": {
    "DarkMode": false,
    "PageLoading": true,
    "PermissionCacheType": 1,
    "ShowSettingButton": true,
    "ShowDarkModeToggle": true,
    "SettingButtonPosition": "auto",
    "PermissionMode": "ROUTE_MAPPING",
    "SessionTimeoutProcessing": 0,
    "GrayMode": false,
    "ColorWeak": false,
    "ThemeColor": "#0960bd",
    "FullContent": false,
    "ContentMode": "full",
    "ShowLogo": true,
    "ShowFooter": true,
    "OpenKeepAlive": true,
    "LockTime": 0,
    "ShowBreadCrumb": true,
    "ShowBreadCrumbIcon": false
  }
}
```

## Thêm

Để biết thêm thông tin, xem [Platform](../README.md)

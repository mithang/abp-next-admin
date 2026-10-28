# LINGYUN.Platform.Theme.VueVbenAdmin

Mô-đun quản lý giao diện (theme) cho framework frontend VueVbenAdmin, cung cấp chức năng quản lý các cấu hình liên quan như giao diện, bố cục, menu.

## Tính năng

* Cài đặt giao diện
  * Chế độ tối
  * Chế độ xám
  * Chế độ mù màu
  * Cấu hình màu chủ đạo

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
  * Cố định phần đầu trang
  * Giao diện phần đầu trang
  * Nút toàn màn hình
  * Nút tài liệu
  * Nút thông báo
  * Nút tìm kiếm

* Cài đặt nhiều tab
  * Bộ nhớ đệm tab
  * Kéo thả tab
  * Làm mới tab
  * Thu gọn tab

## Bắt đầu nhanh

1. Tham chiếu mô-đun
```csharp
[DependsOn(typeof(PlatformThemeVueVbenAdminModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

2. Cấu hình tùy chọn
```json
{
  "Theme": {
    "DarkMode": false,
    "GrayMode": false,
    "ColorWeak": false,
    "ThemeColor": "#0960bd"
  },
  "Layout": {
    "FullContent": false,
    "ContentMode": "full",
    "ShowLogo": true,
    "ShowFooter": true,
    "ShowBreadCrumb": true,
    "ShowBreadCrumbIcon": false
  },
  "Menu": {
    "Mode": "inline",
    "Theme": "dark",
    "Width": 210,
    "Collapsed": false,
    "Split": false,
    "Draggable": true
  },
  "Header": {
    "Fixed": true,
    "Theme": "light",
    "ShowFullScreen": true,
    "ShowDoc": true,
    "ShowNotice": true,
    "ShowSearch": true
  },
  "MultiTab": {
    "Cache": true,
    "Draggable": true,
    "Refresh": true,
    "Fold": true
  }
}
```

## Hướng dẫn sử dụng

1. Cấu hình giao diện
   * Hỗ trợ chuyển đổi nhiều chế độ giao diện
   * Có thể tùy chỉnh màu chủ đạo
   * Cung cấp lưu trữ bền vững cho giao diện

2. Cấu hình bố cục
   * Chế độ bố cục linh hoạt
   * Có thể cấu hình hiển thị các thành phần trang
   * Hỗ trợ bố cục đáp ứng (responsive)

3. Cấu hình menu
   * Nhiều chế độ hiển thị menu
   * Hỗ trợ kéo thả sắp xếp menu
   * Tùy chỉnh giao diện menu

4. Phát triển mở rộng
   * Hỗ trợ nhà cung cấp cấu hình giao diện tùy chỉnh
   * Có thể mở rộng các mục cài đặt giao diện
   * Hỗ trợ bản địa hóa dữ liệu giao diện

## Lưu ý

1. Cấu hình giao diện
   * Cấu hình giao diện sẽ ảnh hưởng đến hiển thị giao diện của tất cả người dùng
   * Nên chọn chế độ giao diện phù hợp theo nhu cầu thực tế

2. Xem xét hiệu năng
   * Cấu hình hợp lý số lượng tab được lưu trong bộ nhớ đệm
   * Sử dụng hiệu ứng tải trang một cách phù hợp

## Thông tin thêm

* [Tài liệu cấu hình giao diện VueVbenAdmin](https://doc.vvbin.cn/guide/design.html)
* [Tài liệu chính thức ABP](https://docs.abp.io/)

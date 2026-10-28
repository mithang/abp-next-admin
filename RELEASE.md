## Tổng quan

# [2021-12-11]

* Nâng cấp abp framework 5.0.0 RC-2

1、Sửa module SettingManagement, chỉ trả về toàn bộ cấu hình của provider chỉ định;

2、Workflow thêm phần mở rộng tầng persistence Elasticsearch;

3、Sửa lỗi IM do giao thức tuần tự hoá SignalR không nhất quán gây ra;

4、Sửa lỗi tham chiếu đường dẫn dependency khi build module;

5、Có thể thêm token vào URL file để giải quyết vấn đề xác thực danh tính;

6、Tenant IsAvailable có thể bị trống do gateway tổng hợp gây ra;

7、Gateway tổng hợp dùng file cấu hình local.

# [2021-12-07]

* Nâng cấp abp framework 5.0.0 RC-1

1、Gỡ module **vueJs**, import **vue-vben-admin** vào [vue-vben-admin](./apps/vue);

2、Gỡ API Identity module: ChangePassword;

3、Gỡ module khoá phân tán, nếu dự án có tham chiếu module này, hãy dùng **Volo.Abp.DistributedLocking**;

4、Gỡ module quản lý gateway, dùng file local làm cấu hình route;

5、Gỡ file script cơ sở dữ liệu gateway động;

6、Chuyển các API liên quan Profile từ Identity module sang Account module;

7、Thêm cấu hình thống nhất ConfigureAwait bằng Fody;

8、Dùng Directory.Build.props để quản lý thống nhất phiên bản import;

# [2021-03-29]
1、Thêm hỗ trợ component bản địa hoá động, dùng để thay thế văn bản bản địa hoá lúc runtime, cần triển khai ILocalizationStore;

2、Thêm dự án quản lý tài liệu bản địa hoá, đã triển khai ILocalizationStore để persistence tài nguyên local vào cơ sở dữ liệu;
  Lưu ý khi dùng: cần định vị trước tới thư mục [LocalizationManagement](./aspnet-core/services/localization/LINGYUN.Abp.LocalizationManagement.HttpApi.Host)
  Thực thi lệnh migration Ef: **dotnet ef database update**

3、Thêm một file cấu hình dotnet-compose [docker-compose.configuration.yml](./docker-compose.configuration.yml);

4、vueJs thêm view component quản lý bản địa hoá: views/localization-management;

5、Lời gọi chờ bất đồng bộ sau khi người dùng vueJs đăng nhập được sửa thành gọi sự kiện khởi tạo module abp thông qua store;

6、vueJs sửa vấn đề params và data mà module HttpProxy truyền bị nhầm lẫn cách dùng;

7、Đồng bộ cấu hình khởi tạo route gateway của component quản lý bản địa hoá.
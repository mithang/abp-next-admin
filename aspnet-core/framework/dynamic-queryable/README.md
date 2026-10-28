# Dynamic.Queryable

Thư viện hỗ trợ truy vấn động, cung cấp hỗ trợ truy vấn động cho các dịch vụ backend  

* Lớp định nghĩa giao diện ứng dụng tham chiếu module **LINGYUN.Abp.Dynamic.Queryable.Application.Contracts**, triển khai giao diện **IDynamicQueryableAppService** là có thể cung cấp hỗ trợ truy vấn động ra bên ngoài  

* Lớp triển khai giao diện ứng dụng tham chiếu module **LINGYUN.Abp.Dynamic.Queryable.Application**, kế thừa từ **DynamicQueryableAppService**, triển khai các phương thức **GetCountAsync** và **GetListAsync** là đủ (cung cấp cho giao diện tầng kho dữ liệu cấu trúc **Expression<Func<TEntity, bool>>** được truyền vào)  

* Lớp controller tham chiếu module **LINGYUN.Abp.Dynamic.Queryable.HttpApi**, kế thừa **DynamicQueryableControllerBase**, tự động công khai giao diện truy vấn động.

## Mô tả giao diện

* **GetAvailableFieldsAsync**(<font color="green">[GET]</font> <font color="blue">/{controller}/available-fields</font>): Cung cấp ra bên ngoài chi tiết thuộc tính có thể chọn, mặc định trả về tất cả các trường (không bao gồm các trường loại trừ đã định nghĩa).

* **GetListAsync**(<font color="orange">[POST]</font> <font color="blue">/{controller}/search</font>):    Trả về danh sách kết quả truy vấn theo điều kiện động do người dùng truyền vào.

## Cấu hình sử dụng

* AbpDynamicQueryableOptions.IgnoreFields:	Định nghĩa danh sách các trường không công khai cho người dùng, mặc định loại trừ trường định danh tenant và trường giao diện bộ lọc xóa mềm.


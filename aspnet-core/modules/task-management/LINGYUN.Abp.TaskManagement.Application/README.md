# LINGYUN.Abp.TaskManagement.Application

Triển khai tầng ứng dụng của mô-đun quản lý tác vụ, cung cấp chức năng cốt lõi quản lý tác vụ nền.

## Triển khai chức năng

### Dịch vụ quản lý tác vụ nền
- Dịch vụ thông tin tác vụ nền (BackgroundJobInfoAppService)
  - Triển khai các thao tác CRUD của tác vụ
  - Cung cấp chức năng điều khiển tác vụ (khởi động, dừng, tạm dừng, khôi phục, v.v.)
  - Hỗ trợ chức năng thao tác hàng loạt
  - Triển khai truy vấn và lọc tác vụ

### Dịch vụ hành vi tác vụ nền (BackgroundJobActionAppService)
- Chức năng quản lý hành vi:
  - Thêm hành vi tác vụ
  - Cập nhật hành vi tác vụ
  - Xóa hành vi tác vụ
  - Lấy danh sách hành vi tác vụ
- Quản lý định nghĩa hành vi:
  - Lấy các định nghĩa hành vi khả dụng
  - Cấu hình tham số hành vi
  - Điều khiển bật/tắt hành vi

### Dịch vụ nhật ký tác vụ nền (BackgroundJobLogAppService)
- Chức năng quản lý nhật ký:
  - Lấy chi tiết nhật ký
  - Lấy danh sách nhật ký
  - Xóa bản ghi nhật ký
- Chức năng truy vấn nhật ký:
  - Hỗ trợ truy vấn kết hợp nhiều điều kiện
  - Truy vấn phân trang
  - Chức năng sắp xếp
  - Lọc nâng cao

### Cấu hình ánh xạ đối tượng
- Tệp cấu hình AutoMapper:
  - Ánh xạ từ BackgroundJobInfo sang BackgroundJobInfoDto
  - Ánh xạ từ BackgroundJobLog sang BackgroundJobLogDto
  - Ánh xạ từ BackgroundJobAction sang BackgroundJobActionDto

### Cấu hình mô-đun
- Các mô-đun phụ thuộc:
  - AbpAutoMapper
  - AbpDynamicQueryable
  - TaskManagementDomain
  - TaskManagementApplication.Contracts
- Cấu hình dịch vụ:
  - Cấu hình ánh xạ đối tượng tự động
  - Cấu hình xác thực

### Chức năng mở rộng
- Mở rộng biểu thức:
  - Biểu thức điều kiện AndIf
  - Biểu thức điều kiện OrIf
- Hỗ trợ truy vấn động
- Tích hợp tài nguyên bản địa hóa

## Cách sử dụng

1. Thêm phụ thuộc mô-đun:
```csharp
[DependsOn(typeof(TaskManagementApplicationModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Tiêm và sử dụng dịch vụ:
```csharp
public class YourService
{
    private readonly IBackgroundJobInfoAppService _jobInfoAppService;
    private readonly IBackgroundJobActionAppService _jobActionAppService;
    private readonly IBackgroundJobLogAppService _jobLogAppService;

    public YourService(
        IBackgroundJobInfoAppService jobInfoAppService,
        IBackgroundJobActionAppService jobActionAppService,
        IBackgroundJobLogAppService jobLogAppService)
    {
        _jobInfoAppService = jobInfoAppService;
        _jobActionAppService = jobActionAppService;
        _jobLogAppService = jobLogAppService;
    }
}
```

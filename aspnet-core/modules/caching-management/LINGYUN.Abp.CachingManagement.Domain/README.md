# LINGYUN.Abp.CachingManagement.Domain

Triển khai tầng miền của mô-đun quản lý bộ nhớ đệm.

## Giao diện cốt lõi

### ICacheManager

Giao diện trình quản lý bộ nhớ đệm, định nghĩa các chức năng cốt lõi của quản lý bộ nhớ đệm:

* `GetKeysAsync`: Lấy danh sách khóa bộ nhớ đệm
* `GetValueAsync`: Lấy giá trị bộ nhớ đệm
* `SetAsync`: Thiết lập giá trị bộ nhớ đệm
* `RefreshAsync`: Làm mới bộ nhớ đệm
* `RemoveAsync`: Xóa bộ nhớ đệm

## Dịch vụ miền

### CacheManager

Lớp cơ sở trừu tượng của trình quản lý bộ nhớ đệm, cung cấp triển khai quản lý bộ nhớ đệm cơ bản. Các nhà cung cấp bộ nhớ đệm cụ thể (như Redis) cần kế thừa lớp này và triển khai các phương thức tương ứng.

## Cài đặt

```bash
abp add-module LINGYUN.Abp.CachingManagement
```

## Phát triển mở rộng

Nếu cần hỗ trợ nhà cung cấp bộ nhớ đệm mới, cần:

1. Tạo dự án mới, kế thừa lớp `CacheManager`
2. Triển khai tất cả các phương thức trừu tượng
3. Đăng ký làm triển khai của `ICacheManager` (sử dụng `[Dependency(ReplaceServices = true)]`)

## Xem thêm

Để biết thêm thông tin, vui lòng tham khảo các tài nguyên sau:

* [Triển khai dịch vụ ứng dụng](../LINGYUN.Abp.CachingManagement.Application/README.md)
* [Hợp đồng dịch vụ ứng dụng](../LINGYUN.Abp.CachingManagement.Application.Contracts/README.md)
* [HTTP API](../LINGYUN.Abp.CachingManagement.HttpApi/README.md)
* [Triển khai Redis](../LINGYUN.Abp.CachingManagement.StackExchangeRedis/README.md)

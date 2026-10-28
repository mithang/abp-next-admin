# LINGYUN.Abp.CachingManagement.HttpApi

Triển khai HTTP API của mô-đun quản lý bộ nhớ đệm.

## Giao diện API

### /api/caching-management/cache

* GET `/api/caching-management/cache/keys`: Lấy danh sách khóa bộ nhớ đệm
  * Tham số:
    * prefix (string, optional): Tiền tố khóa
    * filter (string, optional): Điều kiện lọc
    * marker (string, optional): Dấu phân trang
  * Quyền: AbpCachingManagement.Cache

* GET `/api/caching-management/cache/{key}`: Lấy giá trị bộ nhớ đệm của khóa chỉ định
  * Tham số:
    * key (string, required): Khóa bộ nhớ đệm
  * Quyền: AbpCachingManagement.Cache

* POST `/api/caching-management/cache`: Đặt giá trị bộ nhớ đệm
  * Tham số:
    * key (string, required): Khóa bộ nhớ đệm
    * value (string, required): Giá trị bộ nhớ đệm
    * absoluteExpiration (DateTime, optional): Thời gian hết hạn tuyệt đối
    * slidingExpiration (DateTime, optional): Thời gian hết hạn trượt
  * Quyền: AbpCachingManagement.Cache.ManageValue

* PUT `/api/caching-management/cache/refresh`: Làm mới bộ nhớ đệm
  * Tham số:
    * key (string, required): Khóa bộ nhớ đệm
    * absoluteExpiration (DateTime, optional): Thời gian hết hạn tuyệt đối
    * slidingExpiration (DateTime, optional): Thời gian hết hạn trượt
  * Quyền: AbpCachingManagement.Cache.Refresh

* DELETE `/api/caching-management/cache`: Xóa bộ nhớ đệm
  * Tham số:
    * key (string, required): Khóa bộ nhớ đệm
  * Quyền: AbpCachingManagement.Cache.Delete

## Cài đặt

```bash
abp add-module LINGYUN.Abp.CachingManagement
```

## Thêm

Để biết thêm thông tin, vui lòng tham khảo các tài nguyên sau:

* [Triển khai dịch vụ ứng dụng](../LINGYUN.Abp.CachingManagement.Application/README.md)
* [Hợp đồng dịch vụ ứng dụng](../LINGYUN.Abp.CachingManagement.Application.Contracts/README.md)
* [Tầng miền](../LINGYUN.Abp.CachingManagement.Domain/README.md)

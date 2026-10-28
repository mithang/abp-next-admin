# LINGYUN.Abp.CachingManagement.Application.Contracts

Mô-đun hợp đồng dịch vụ ứng dụng quản lý bộ nhớ đệm.

## Giao diện

### ICacheAppService

Giao diện dịch vụ ứng dụng quản lý bộ nhớ đệm, cung cấp các chức năng sau:

* `GetKeysAsync`: Lấy danh sách khóa bộ nhớ đệm
* `GetValueAsync`: Lấy giá trị bộ nhớ đệm
* `SetAsync`: Đặt giá trị bộ nhớ đệm
* `RefreshAsync`: Làm mới bộ nhớ đệm
* `RemoveAsync`: Xóa bộ nhớ đệm

## Quyền

* AbpCachingManagement.Cache：Quản lý bộ nhớ đệm
  * AbpCachingManagement.Cache.Refresh：Làm mới bộ nhớ đệm
  * AbpCachingManagement.Cache.Delete：Xóa bộ nhớ đệm
  * AbpCachingManagement.Cache.ManageValue：Quản lý giá trị bộ nhớ đệm

## Cài đặt

```bash
abp add-module LINGYUN.Abp.CachingManagement
```

## Thêm

Để biết thêm thông tin, hãy tham khảo các tài nguyên sau:

* [Triển khai dịch vụ ứng dụng](../LINGYUN.Abp.CachingManagement.Application/README.md)
* [HTTP API](../LINGYUN.Abp.CachingManagement.HttpApi/README.md)
* [Tầng miền](../LINGYUN.Abp.CachingManagement.Domain/README.md)

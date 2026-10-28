# LINGYUN.Abp.Saas.Domain.Shared

Mô-đun tầng dùng chung miền SaaS, định nghĩa các nội dung dùng chung như hằng số, enum, sự kiện của tenant và phiên bản。

## Tính năng

* Định nghĩa hằng số
  * EditionConsts：Hằng số liên quan đến phiên bản
  * TenantConsts：Hằng số liên quan đến tenant
  * TenantConnectionStringConsts：Hằng số liên quan đến chuỗi kết nối tenant

* Định nghĩa enum
  * RecycleStrategy：Chính sách thu hồi tài nguyên
    * Reserve：Giữ lại
    * Recycle：Thu hồi

* Định nghĩa sự kiện
  * EditionEto：Đối tượng truyền sự kiện phiên bản
  * TenantEto：Đối tượng truyền sự kiện tenant

* Tài nguyên bản địa hóa
  * Hỗ trợ đa ngôn ngữ (en/zh-Hans)
  * Thông báo lỗi
  * Mô tả quyền
  * Mô tả tính năng

## Thông tin thêm

[English](README.EN.md)

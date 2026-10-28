# LINGYUN.Abp.Saas.Application

Module tầng dịch vụ ứng dụng SaaS, triển khai giao diện dịch vụ ứng dụng quản lý tenant và phiên bản.

## Tính năng

* Dịch vụ quản lý tenant (TenantAppService)
  * Tạo tenant
  * Cập nhật tenant
  * Xoá tenant
  * Lấy danh sách tenant
  * Lấy chi tiết tenant
  * Quản lý chuỗi kết nối tenant
  * Quản lý tính năng tenant

* Dịch vụ quản lý phiên bản (EditionAppService)
  * Tạo phiên bản
  * Cập nhật phiên bản
  * Xoá phiên bản
  * Lấy danh sách phiên bản
  * Lấy chi tiết phiên bản
  * Quản lý tính năng phiên bản

## Xác thực quyền

Tất cả các phương thức dịch vụ ứng dụng đều đã được thêm xác thực quyền tương ứng, đảm bảo chỉ người dùng có quyền tương ứng mới được truy cập.

## Ánh xạ đối tượng

Đã sử dụng AutoMapper để triển khai các ánh xạ đối tượng sau:
* Edition <-> EditionDto
* Tenant <-> TenantDto
* TenantConnectionString <-> TenantConnectionStringDto

## Thêm

[English](README.EN.md)

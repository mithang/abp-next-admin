# LINGYUN.Abp.Saas.Application.Contracts

Mô-đun hợp đồng dịch vụ ứng dụng SaaS, định nghĩa các giao diện dịch vụ ứng dụng, đối tượng DTO và định nghĩa quyền cho quản lý tenant và phiên bản.

## Tính năng

* Giao diện quản lý tenant (ITenantAppService)
  * Định nghĩa tất cả các giao diện dịch vụ quản lý tenant
  * Bao gồm định nghĩa các đối tượng DTO liên quan đến tenant
  * Giao diện quản lý chuỗi kết nối tenant

* Giao diện quản lý phiên bản (IEditionAppService)
  * Định nghĩa tất cả các giao diện dịch vụ quản lý phiên bản
  * Bao gồm định nghĩa các đối tượng DTO liên quan đến phiên bản

* Định nghĩa quyền (AbpSaasPermissions)
  * Quyền quản lý phiên bản
  * Quyền quản lý tenant
  * Quyền quản lý tính năng
  * Quyền quản lý chuỗi kết nối

* Đối tượng DTO
  * EditionCreateDto/EditionUpdateDto
  * TenantCreateDto/TenantUpdateDto
  * TenantConnectionStringCreateDto/TenantConnectionStringUpdateDto

## Thêm

[English](README.EN.md)

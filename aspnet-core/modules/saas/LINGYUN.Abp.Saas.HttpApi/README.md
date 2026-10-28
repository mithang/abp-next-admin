# LINGYUN.Abp.Saas.HttpApi

Mô-đun SaaS HTTP API, triển khai giao diện HTTP API quản lý tenant và phiên bản.

## Tính năng

* Controller quản lý tenant (TenantController)
  * GET /api/saas/tenants: Lấy danh sách tenant
  * GET /api/saas/tenants/{id}: Lấy chi tiết tenant
  * POST /api/saas/tenants: Tạo tenant
  * PUT /api/saas/tenants/{id}: Cập nhật tenant
  * DELETE /api/saas/tenants/{id}: Xóa tenant
  * GET /api/saas/tenants/{id}/connection-strings: Lấy chuỗi kết nối tenant
  * PUT /api/saas/tenants/{id}/connection-strings: Cập nhật chuỗi kết nối tenant
  * DELETE /api/saas/tenants/{id}/connection-strings/{name}: Xóa chuỗi kết nối tenant

* Controller quản lý phiên bản (EditionController)
  * GET /api/saas/editions: Lấy danh sách phiên bản
  * GET /api/saas/editions/{id}: Lấy chi tiết phiên bản
  * POST /api/saas/editions: Tạo phiên bản
  * PUT /api/saas/editions/{id}: Cập nhật phiên bản
  * DELETE /api/saas/editions/{id}: Xóa phiên bản

## Tài liệu API

Tất cả giao diện API đều hỗ trợ tài liệu Swagger, sau khi khởi động ứng dụng có thể xem tài liệu API chi tiết qua Swagger UI.

## Thêm

[English](README.EN.md)

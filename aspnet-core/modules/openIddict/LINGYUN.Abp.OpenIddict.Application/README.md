# LINGYUN.Abp.OpenIddict.Application

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.Application%2FLINGYUN.Abp.OpenIddict.Application.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.Application.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.Application)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.Application` là lớp triển khai dịch vụ ứng dụng dựa trên ABP OpenIddict, cung cấp chức năng quản lý client, ủy quyền, token và phạm vi của OpenIddict.

[English](./README.EN.md)

## Tính năng

* Quản lý ứng dụng client OpenIddict
  * Tạo, cập nhật, xóa ứng dụng client
  * Quản lý thông tin cơ bản của client (ClientId, secret, tên, v.v.)
  * Cấu hình loại ủy quyền, loại phản hồi, phạm vi và URI chuyển hướng
  * Hỗ trợ cấu hình tùy chỉnh thuộc tính và yêu cầu của client

* Quản lý ủy quyền OpenIddict
  * Truy vấn và xóa bản ghi ủy quyền
  * Lọc ủy quyền theo ClientId, thời gian tạo, trạng thái, v.v.

* Quản lý token OpenIddict
  * Truy vấn và xóa token
  * Lọc token theo ClientId, thời gian tạo, thời gian hết hạn, trạng thái, v.v.

* Quản lý phạm vi OpenIddict
  * Tạo, cập nhật, xóa phạm vi
  * Quản lý thông tin cơ bản của phạm vi (tên, mô tả, tên hiển thị, v.v.)
  * Hỗ trợ tên hiển thị và mô tả đa ngôn ngữ
  * Cấu hình tài nguyên liên kết với phạm vi

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.Application
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictApplicationModule))]` vào lớp module của bạn.

2. Cấu hình quyền:

Module đã định nghĩa sẵn các quyền sau:

* OpenIddict.Applications: Quản lý ứng dụng client
  * OpenIddict.Applications.Create: Tạo client
  * OpenIddict.Applications.Update: Cập nhật client
  * OpenIddict.Applications.Delete: Xóa client
* OpenIddict.Authorizations: Quản lý ủy quyền
  * OpenIddict.Authorizations.Delete: Xóa ủy quyền
* OpenIddict.Scopes: Quản lý phạm vi
  * OpenIddict.Scopes.Create: Tạo phạm vi
  * OpenIddict.Scopes.Update: Cập nhật phạm vi
  * OpenIddict.Scopes.Delete: Xóa phạm vi
* OpenIddict.Tokens: Quản lý token
  * OpenIddict.Tokens.Delete: Xóa token

## Lưu ý

* ClientId của ứng dụng client không thể sửa sau khi tạo
* Xóa ứng dụng client sẽ đồng thời xóa các ủy quyền và token liên quan
* Tên phạm vi không thể sửa sau khi tạo

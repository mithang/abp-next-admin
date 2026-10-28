# @vben/turbo-run

`turbo-run` là một công cụ dòng lệnh, cho phép bạn chạy lệnh song song trong nhiều package. Nó cung cấp một giao diện tương tác để bạn chọn package cần chạy lệnh.

## Tính năng

- 🚀 Chọn tương tác package cần chạy
- 📦 Hỗ trợ cấu trúc dự án monorepo
- 🔍 Tự động phát hiện các lệnh khả dụng
- 🎯 Lọc chính xác package đích

## Cài đặt

```bash
pnpm add -D @vben/turbo-run
```

## Cách sử dụng

Cú pháp cơ bản:

```bash
turbo-run [script]
```

Ví dụ, nếu bạn muốn chạy lệnh `dev`:

```bash
turbo-run dev
```

Công cụ sẽ tự động phát hiện package nào có lệnh `dev` và cung cấp một giao diện tương tác để bạn chọn package cần chạy.

## Ví dụ

Giả sử dự án của bạn có các package sau:

- `@vben/app`
- `@vben/admin`
- `@vben/website`

Khi bạn chạy:

```bash
turbo-run dev
```

Công cụ sẽ:

1. Phát hiện package nào có lệnh `dev`
2. Hiển thị giao diện chọn tương tác
3. Để bạn chọn package cần chạy lệnh
4. Dùng `pnpm --filter` để chạy lệnh trong package đã chọn

## Lưu ý

- Đảm bảo dự án của bạn dùng pnpm làm trình quản lý package
- Đảm bảo package đích đã định nghĩa lệnh script tương ứng trong `package.json`
- Công cụ này cần chạy tại thư mục gốc của dự án monorepo

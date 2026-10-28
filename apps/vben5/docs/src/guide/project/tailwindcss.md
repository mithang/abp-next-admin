# Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) là một CSS framework ưu tiên tính tiện ích, dùng để nhanh chóng xây dựng thiết kế tùy chỉnh.

## Cấu hình

Tệp cấu hình của dự án nằm trong `internal/tailwind-config`, bạn có thể sửa cấu hình Tailwind CSS tại đây.

::: tip Giới hạn khi package sử dụng tailwindcss

Hiện tại chỉ khi dưới package tương ứng tồn tại tệp `tailwind.config.mjs` thì quá trình biên dịch tailwindcss mới được bật, ngược lại tailwindcss sẽ không được bật. Nếu bạn là package SDK thuần túy, không cần dùng tailwindcss, thì có thể không cần tạo tệp `tailwind.config.mjs`.

:::

## Lưu ý

Hiện `tailwindcss` đã lên phiên bản v4.x, cách sử dụng khác với `tailwindcss: ^3.4.17`, v4.0 không tương thích với phiên bản v3.x, trước khi phát triển hãy xác nhận phiên bản `tailwindcss` trong `package.json`.

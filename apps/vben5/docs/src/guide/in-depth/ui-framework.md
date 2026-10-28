# Chuyển đổi thư viện component

`Vue Admin` hỗ trợ bạn tự do chọn thư viện component, hiện thư viện component mặc định của trang demo là `Ant Design Vue`, giữ nhất quán với phiên bản cũ. Đồng thời framework còn tích hợp sẵn phiên bản `Element Plus` và phiên bản `Naive UI`, bạn có thể chọn theo sở thích của mình.

## Thêm ứng dụng thư viện component mới

Nếu bạn muốn dùng thư viện component khác, bạn chỉ cần làm theo các bước sau:

1. Tạo một thư mục mới trong `apps`, ví dụ `apps/web-xxx`.
2. Đổi trường `name` của `apps/web-xxx/package.json` thành `web-xxx`.
3. Gỡ bỏ dependency và code của các thư viện component khác, và thay thế logic tương ứng bằng thư viện component của bạn, không có nhiều chỗ cần sửa.
4. Điều chỉnh các file ngôn ngữ trong `locales`.
5. Điều chỉnh các component trong `app.vue`.
6. Tự điều chỉnh theme của thư viện component sao cho phù hợp với `Vben Admin`.
7. Điều chỉnh tên ứng dụng trong `.env`
8. Thêm script `dev:xxx` tại thư mục gốc của monorepo
9. Chạy `pnpm install` để cài đặt dependency

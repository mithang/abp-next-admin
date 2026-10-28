**Khởi động nhanh dự án backend:**
1. Dùng `00.auto-config-docker.cmd` để tự động cấu hình môi trường docker
2. Dùng `01.migrate-db.cmd` để di chuyển cơ sở dữ liệu
3. Dùng `80.start-host.cmd` để khởi động dự án backend

Lưu ý: hãy điều chỉnh tham số `stime` trong tệp `80.start-host.cmd` theo tốc độ chạy của máy tính của bạn.

**Khởi động nhanh dự án frontend:**
1. Dùng `91.install-node-module.cmd` để cài đặt các dependency npm
2. Dùng `99.start-all.cmd` để khởi động dự án

# Xây dựng và triển khai

::: tip Lời nói đầu

Vì đây là dự án demo, nên sau khi đóng gói dung lượng tương đối lớn; nếu trong dự án có plugin nào không dùng đến, có thể xóa file hoặc route tương ứng, không tham chiếu là được — không được tham chiếu thì sẽ không được đóng gói.

:::

## Xây dựng

Sau khi phát triển dự án xong, thực thi lệnh sau để xây dựng:

**Lưu ý:** Vui lòng thực thi các lệnh sau tại thư mục gốc của dự án

```bash
pnpm build
```

Sau khi xây dựng và đóng gói thành công, sẽ tạo thư mục `dist` của ứng dụng tương ứng tại thư mục gốc, bên trong chính là các file đã được xây dựng và đóng gói, ví dụ: `apps/web-antd/dist/`

## Xem trước

Trước khi phát hành có thể xem trước tại máy local, có nhiều cách, ở đây giới thiệu hai cách:

- Sử dụng lệnh xem trước tự định nghĩa của dự án (khuyến nghị)

**Lưu ý:** Vui lòng thực thi các lệnh sau tại thư mục gốc của dự án

```bash
pnpm preview
```

Đợi xây dựng thành công, truy cập `http://localhost:4173` là có thể xem hiệu quả.

- Xem trước bằng máy chủ local

Có thể cài đặt toàn cục trên máy tính dịch vụ `serve`, như `live-server`,

```bash
npm i -g live-server
```

Sau đó thực thi lệnh `live-server` trong thư mục `dist` là có thể xem hiệu quả tại máy local.

```bash
cd apps/web-antd/dist
# Xem trước tại máy local, cổng mặc định 8080
live-server
# Chỉ định cổng
live-server --port=9000
```

## Nén

### Bật nén `gzip`

Cần thay đổi cấu hình `.env.production` khi đóng gói:

```bash
VITE_COMPRESS=gzip
```

### Bật nén `brotli`

Cần thay đổi cấu hình `.env.production` khi đóng gói:

```bash
VITE_COMPRESS=brotli
```

### Đồng thời bật nén `gzip` và `brotli`

Cần thay đổi cấu hình `.env.production` khi đóng gói:

```bash
VITE_COMPRESS=gzip,brotli
```

::: tip Gợi ý

`gzip` và `brotli` đều cần cài đặt module cụ thể mới có thể sử dụng.

:::

::: details Cấu hình gzip và brotli trong nginx

```bash
http {
  # Bật gzip
  gzip on;
  # Bật gzip_static
  # Sau khi bật gzip_static có thể báo lỗi, cần cài đặt module tương ứng, cách cài đặt cụ thể có thể tự tra cứu
  # Chỉ khi bật tùy chọn này, file .gz mà file vue đóng gói ra mới có hiệu quả, nếu không thì không cần bật gzip để đóng gói
  gzip_static on;
  gzip_proxied any;
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  # Nếu trong nginx sử dụng nhiều tầng proxy thì bắt buộc phải thiết lập tùy chọn này mới có thể bật gzip.
  gzip_http_version 1.0;
  gzip_comp_level 2;
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
  gzip_vary off;
  gzip_disable "MSIE [1-6]\.";

  # Bật nén brotli
  # Cần cài đặt module nginx tương ứng, cách cài đặt cụ thể có thể tự tra cứu
  # Có thể cùng tồn tại với gzip mà không xung đột
  brotli on;
  brotli_comp_level 6;
  brotli_buffers 16 8k;
  brotli_min_length 20;
  brotli_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript image/svg+xml;
}
```

:::

## Phân tích xây dựng

Nếu file xây dựng của bạn rất lớn, có thể phân tích dung lượng code bằng plugin [rollup-plugin-analyzer](https://github.com/doesdev/rollup-plugin-analyzer) tích hợp sẵn của dự án, từ đó tối ưu code của bạn. Chỉ cần thực thi lệnh sau tại `thư mục gốc`:

```bash
pnpm run build:analyze
```

Sau khi chạy, trên trang tự động mở có thể thấy phân bố dung lượng cụ thể, để phân tích dependency nào có vấn đề.

![Build analysis report](/guide/report.png)

## Triển khai

Triển khai đơn giản chỉ cần phát hành file tĩnh cuối cùng tạo ra, file tĩnh trong thư mục dist lên cdn hoặc máy chủ tĩnh của bạn là được, cần lưu ý trong đó index.html thường sẽ là trang vào của dịch vụ backend của bạn, sau khi xác định các file tĩnh js và css có thể cần thay đổi đường dẫn tham chiếu của trang.

Ví dụ tải lên máy chủ nginx, có thể tải các file trong thư mục dist lên thư mục `/srv/www/project/index.html` trên máy chủ, sau đó truy cập tên miền đã cấu hình là được.

```bash
# Cấu hình nginx
location / {
  # Không cache html, tránh cache tiếp tục có hiệu lực sau khi chương trình cập nhật
  if ($request_filename ~* .*\.(?:htm|html)$) {
    add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
    access_log on;
  }
  # Đây là đường dẫn lưu trữ các file trong file dist mà vue đóng gói
  root   /srv/www/project/;
  index  index.html index.htm;
}
```

Khi triển khai có thể phát hiện đường dẫn tài nguyên không đúng, chỉ cần sửa file `.env.production` là được.

```bash
# Cấu hình thay đổi theo đường dẫn của riêng bạn
# Lưu ý cần bắt đầu và kết thúc bằng /
VITE_BASE=/
VITE_BASE=/xxx/
```

### Kết hợp route frontend với phía server

Route frontend của dự án sử dụng vue-router, vì vậy bạn có thể chọn hai cách: history và hash.

- `hash` mặc định sẽ nối thêm `#` vào sau url
- `history` thì không, tuy nhiên `history` cần máy chủ phối hợp

Có thể sửa mode trong `.env.production`

```bash
VITE_ROUTER_HISTORY=hash
```

### Cấu hình phía server trong chế độ route history

Bật chế độ `history` cần cấu hình máy chủ, chi tiết cấu hình máy chủ khác có thể xem [history-mode](https://router.vuejs.org/guide/essentials/history-mode.html#html5-mode)

Ở đây lấy cấu hình `nginx` làm ví dụ:

#### Triển khai tới thư mục gốc

```bash {5}
server {
  listen 80;
  location / {
    # Dùng để phối hợp với History
    try_files $uri $uri/ /index.html;
  }
}
```

#### Triển khai tới thư mục không phải gốc

- Trước tiên cần thay đổi cấu hình `.env.production` khi đóng gói:

```bash
VITE_BASE = /sub/
```

- Sau đó cấu hình trong file cấu hình nginx

```bash {8}
server {
    listen       80;
    server_name  localhost;
    location /sub/ {
      # Đây là đường dẫn lưu trữ các file trong file dist mà vue đóng gói
      alias   /srv/www/project/;
      index index.html index.htm;
      try_files $uri $uri/ /sub/index.html;
    }
}
```

## Xử lý cross-domain

Sử dụng nginx để xử lý vấn đề cross-domain sau khi triển khai dự án

1. Cấu hình địa chỉ interface của dự án frontend, cấu hình trong file `.env.production` dưới thư mục dự án:

```bash
VITE_GLOB_API_URL=/api
```

2. Cấu hình chuyển tiếp yêu cầu tới backend trong nginx

```bash {10-11}
server {
  listen       8080;
  server_name  localhost;
  # Proxy interface, dùng để giải quyết vấn đề cross-domain
  location /api {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    # Địa chỉ interface backend
    proxy_pass http://110.110.1.1:8080/api;
    rewrite "^/api/(.*)$" /$1 break;
    proxy_redirect default;
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Headers X-Requested-With;
    add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
  }
}
```

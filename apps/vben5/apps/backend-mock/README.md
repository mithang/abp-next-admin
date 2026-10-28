# @vben/backend-mock

## Description

Dịch vụ mock dữ liệu của Vben Admin, không kết nối với bất kỳ cơ sở dữ liệu nào, mọi dữ liệu đều là mô phỏng, dùng để hỗ trợ dữ liệu trong quá trình phát triển frontend. Môi trường production không còn cung cấp tích hợp mock, có thể tự triển khai dịch vụ hoặc kết nối dữ liệu thật; do các công cụ như `mock.js` có một số hạn chế, ví dụ không tải lên được file, không mô phỏng được logic phức tạp, nên ở đây đã dùng dịch vụ backend thật để triển khai. Điểm bất tiện duy nhất là ở local cần đồng thời khởi động cả dịch vụ backend và dịch vụ frontend, nhưng như vậy có thể mô phỏng môi trường thật tốt hơn. Dịch vụ này không cần khởi động thủ công, đã được tích hợp trong plugin vite và khởi động cùng ứng dụng.

## Running the app

```bash
# development
$ pnpm run start

# production mode
$ pnpm run build
```

## Điều kiện tiên quyết

Vui lòng tham khảo [Aspire Docs](https://aspire.dev/get-started/prerequisites/) để kiểm tra môi trường cần thiết để chạy.  

## Cài đặt CLI

Vui lòng tham khảo [Aspire Docs](https://aspire.dev/get-started/install-cli/) để cài đặt Aspire CLI.  

## Khởi động Aspire

```shell
aspire run
```

## Lưu ý

- Chỉ dùng để học [Aspire](https://aspire.dev/docs/), không dùng cho môi trường production!  
- Dự án mặc định bật [Elasticsearch](https://aspire.dev/integrations/databases/elasticsearch/) làm nơi lưu trữ nhật ký kiểm toán và nhật ký vận hành hệ thống, vui lòng tùy tình hình máy local mà điều chỉnh tham số khởi động cho phù hợp, tránh OOM!  
- Nhiều dự án khởi tạo Quartz khi khởi động, dù đã kiểm tra sức khỏe, trong một số trường hợp vẫn gây tranh chấp khóa cơ sở dữ liệu, chỉ cần khởi động lại service tương ứng trong bảng điều khiển là được.  
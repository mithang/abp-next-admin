# LINGYUN.Abp.BlobStoring.Aliyun

Bản triển khai Alibaba Cloud OSS của nhà cung cấp lưu trữ đối tượng **IBlobProvider** trong khung ABP.

## Tính năng

* Triển khai giao diện IBlobProvider của ABP, sử dụng dịch vụ Alibaba Cloud OSS
* Hỗ trợ lưu trữ Blob đa thuê bao
* Tự động tạo Bucket
* Kiểm soát truy cập Bucket có thể cấu hình
* Hỗ trợ truy cập bằng STS Token
* Chiến lược đặt tên Blob có thể tùy chỉnh

## Tham chiếu mô-đun

Trước tiên, định nghĩa tệp **appsettings.json**:

```json
{
  "Aliyun": {
    "OSS": {
      "BucketName": "BucketName bạn định nghĩa",
      "Endpoint": "http://oss-cn-shanghai.aliyuncs.com",
      "CreateBucketIfNotExists": true
    }
  }
}
```

Sau đó tham chiếu mô-đun trong dự án:

```csharp
[DependsOn(typeof(AbpBlobStoringAliyunModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mô tả cấu hình

### Cấu hình OSS

* **BucketName**
  * Mô tả: Tên không gian lưu trữ OSS
  * Loại: Tùy chọn
  * Giá trị mặc định: Tên vùng chứa

* **Endpoint**
  * Mô tả: Điểm truy cập của dịch vụ OSS
  * Loại: Bắt buộc
  * Ví dụ:http://oss-cn-shanghai.aliyuncs.com

* **CreateBucketIfNotExists**
  * Mô tả: Có tự động tạo Bucket nếu Bucket chưa tồn tại hay không
  * Loại: Tùy chọn
  * Giá trị mặc định:false

* **CreateBucketReferer**
  * Mô tả: Danh sách trắng truy cập Bucket
  * Loại: Tùy chọn

### Quy tắc đặt tên Blob

* Quy tắc tên vùng chứa (Bucket):
  * Độ dài phải từ 3–63 ký tự
  * Chỉ được chứa chữ thường, chữ số và dấu gạch ngang
  * Phải bắt đầu bằng chữ cái hoặc chữ số
  * Không được bắt đầu hoặc kết thúc bằng dấu gạch ngang

* Quy tắc tên Blob:
  * Thuê bao:`tenants/{tenantId}/{blobName}`
  * Máy chủ (host):`host/{blobName}`

## Tối ưu hiệu năng

* Sử dụng bộ nhớ đệm phân tán để lưu trữ STS Token
* Hỗ trợ cấu hình dự phòng dữ liệu
* Kiểm soát truy cập Bucket có thể cấu hình để nâng cao bảo mật

## Mô-đun liên quan

* [LINGYUN.Abp.Aliyun](../../cloud-aliyun/LINGYUN.Abp.Aliyun/README.md) - Cung cấp tích hợp cơ sở Alibaba Cloud

[Click to view English documentation](README.EN.md)
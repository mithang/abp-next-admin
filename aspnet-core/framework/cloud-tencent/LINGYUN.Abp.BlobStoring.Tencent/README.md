# LINGYUN.Abp.BlobStoring.Tencent

Mô-đun lưu trữ đối tượng Tencent Cloud (COS), tích hợp dịch vụ lưu trữ đối tượng Tencent Cloud vào hệ thống ABP BlobStoring.

## Tính năng

* Hỗ trợ dịch vụ lưu trữ đối tượng Tencent Cloud
* Hỗ trợ cấu hình đa tenant
* Hỗ trợ tự động tạo bucket
* Hỗ trợ cấu hình chống hotlink cho bucket
* Hỗ trợ cấu hình đa vùng
* Hỗ trợ giới hạn kích thước tệp
* Hỗ trợ lưu trữ tách biệt theo tenant

## Giải thích các mục cấu hình

### Cấu hình cơ bản

```json
{
  "Settings": {
    "Abp.TencentCloud": {
      "SecretId": "SecretId Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "SecretKey": "SecretKey Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "DurationSecond": "600" // Thời lượng phiên, tính bằng giây
    }
  }
}
```

### Cấu hình lưu trữ đối tượng

```json
{
  "Tencent": {
    "OSS": {
      "AppId": "", // AppId Tencent Cloud
      "Region": "", // Vùng chứa bucket
      "BucketName": "", // Tên bucket
      "CreateBucketIfNotExists": false, // Có tạo bucket khi bucket chưa tồn tại hay không
      "CreateBucketReferer": [] // Cài đặt chống hotlink khi tạo bucket
    }
  }
}
```

### Quy tắc đặt tên bucket

* Chỉ hỗ trợ chữ cái thường và chữ số, tức là [a-z，0-9], dấu gạch ngang "-" và tổ hợp của chúng
* Không được bắt đầu hoặc kết thúc bằng dấu gạch ngang (-)
* Số ký tự tối đa cho phép của tên bucket chịu ảnh hưởng bởi số ký tự của tên viết tắt vùng và APPID, tổng số ký tự của tên miền yêu cầu đầy đủ tạo thành tối đa 60 ký tự
* Xem thêm quy tắc tại[Quy tắc đặt tên bucket Tencent Cloud](https://cloud.tencent.com/document/product/436/13312)

### Quy tắc đặt tên đối tượng

* Không được bắt đầu bằng dấu gạch chéo / hoặc dấu gạch chéo ngược \\
* Khóa đối tượng không hỗ trợ các ký tự điều khiển ASCII gồm ký tự lên (↑), ký tự xuống (↓), ký tự phải (→), ký tự trái (←)
* Xem thêm quy tắc tại[Quy tắc đặt tên đối tượng Tencent Cloud](https://cloud.tencent.com/document/product/436/13324)

## Cách dùng cơ bản

1. Thêm phụ thuộc mô-đun
```csharp
[DependsOn(typeof(AbpBlobStoringTencentCloudModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Cấu hình lưu trữ đối tượng Tencent Cloud
```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.Configure<YourContainer>(container =>
    {
        container.UseTencentCloud(tencent =>
        {
            tencent.AppId = "AppId Tencent Cloud của bạn";
            tencent.Region = "ap-guangzhou";
            tencent.BucketName = "your-bucket-name";
            tencent.CreateBucketIfNotExists = true;
            tencent.CreateBucketReferer = new List<string>
            {
                "*.example.com",
                "example.com"
            };
        });
    });
});
```

3. Sử dụng lưu trữ BLOB
```csharp
public class YourService
{
    private readonly IBlobContainer<YourContainer> _blobContainer;

    public YourService(IBlobContainer<YourContainer> blobContainer)
    {
        _blobContainer = blobContainer;
    }

    public async Task SaveBlobAsync(string name, Stream stream)
    {
        await _blobContainer.SaveAsync(name, stream);
    }

    public async Task<Stream> GetBlobAsync(string name)
    {
        return await _blobContainer.GetAsync(name);
    }
}
```

## Tính năng nâng cao

### Hỗ trợ đa tenant

Mô-đun hỗ trợ lưu trữ tách biệt theo tenant, định dạng đường dẫn lưu trữ như sau:
* Máy chủ (host):`host/{blobName}`
* Tenant:`tenants/{tenantId}/{blobName}`

### Quản lý tính năng

Mô-đun cung cấp các công tắc tính năng sau:

* TencentBlobStoring - Điều khiển bật/tắt dịch vụ lưu trữ đối tượng Tencent Cloud
* TencentBlobStoringMaximumStreamSize - Điều khiển giới hạn kích thước tối đa của tệp tải lên (MB)

## Tài liệu thêm

* [Lưu trữ đối tượng Tencent Cloud](https://cloud.tencent.com/document/product/436)
* [Bảng điều khiển COS Tencent Cloud](https://console.cloud.tencent.com/cos)
* [Hệ thống ABP BlobStoring](https://docs.abp.io/en/abp/latest/Blob-Storing)

[English](./README.EN.md)

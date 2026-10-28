# LINGYUN.Abp.BlobStoring.Nexus

[English](./README.EN.md) | Tiếng Việt

Nhà cung cấp lưu trữ Blob dựa trên Sonatype Nexus.

## Tính năng

* Hỗ trợ lưu trữ tệp vào kho Nexus
* Hỗ trợ các thao tác cơ bản với tệp như tải lên, tải xuống, xóa
* Hỗ trợ chuẩn hóa đường dẫn tệp
* Hỗ trợ kiểm tra tệp trùng lặp và tùy chọn ghi đè
* Hỗ trợ đa thuê bao (multi-tenant)

## Phụ thuộc mô-đun

```csharp
[DependsOn(typeof(AbpBlobStoringNexusModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

### 1. Cấu hình lưu trữ Nexus

Cấu hình tùy chọn lưu trữ Nexus trong `appsettings.json`:

```json
{
  "BlobStoring": {
    "Nexus": {
      "Repository": "your-repository-name"
    }
  }
}
```

### 2. Cấu hình container

```csharp
Configure<AbpBlobStoringOptions>(options =>
{
    options.Containers.ConfigureDefault(container =>
    {
        container.UseNexus(nexus =>
        {
            nexus.Repository = "your-repository-name";
        });
    });
});
```

### 3. Sử dụng bộ lưu trữ BLOB

```csharp
public class MyService
{
    private readonly IBlobContainer _blobContainer;

    public MyService(IBlobContainer blobContainer)
    {
        _blobContainer = blobContainer;
    }

    public async Task SaveBlobAsync(byte[] bytes)
    {
        await _blobContainer.SaveAsync("my-blob-name", bytes);
    }

    public async Task<byte[]> GetBlobAsync()
    {
        return await _blobContainer.GetAllBytesAsync("my-blob-name");
    }
}
```

## Tùy chọn cấu hình

* Repository - tên kho Nexus

## Thực hành tốt nhất

1. Lập kế hoạch hợp lý cho đường dẫn và tên tệp để dễ quản lý và bảo trì
2. Cấu hình tùy chọn ghi đè tệp theo nhu cầu thực tế
3. Sử dụng hợp lý tính năng đa thuê bao để đảm bảo cách ly dữ liệu

## Lưu ý

1. Đảm bảo kho Nexus đã được cấu hình đúng và có thể truy cập
2. Đường dẫn tệp sẽ được tự động chuẩn hóa, thay dấu gạch chéo ngược bằng dấu gạch chéo xuôi
3. Theo mặc định không cho phép ghi đè tệp đã tồn tại, cần đặt tường minh tùy chọn OverrideExisting
4. Thao tác với tệp có thể bị ảnh hưởng bởi tình trạng mạng, nên thêm cơ chế xử lý lỗi phù hợp

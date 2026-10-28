# LINGYUN.Abp.Elsa.Activities.BlobStoring

Module tích hợp activity lưu trữ Blob cho workflow Elsa

## Chức năng

* Cung cấp các activity lưu trữ Blob sau:
  * **BlobExists**: Kiểm tra Blob có tồn tại hay không
  * **WriteBlob**: Ghi dữ liệu Blob
  * **ReadBlob**: Đọc dữ liệu Blob
  * **DeleteBlob**: Xóa dữ liệu Blob

## Cấu hình sử dụng

```csharp
[DependsOn(
    typeof(AbpElsaActivitiesBlobStoringModule)
    )]
public class YouProjectModule : AbpModule
{
}
```

## appsettings.json

```json
{
    "Elsa": {
        "BlobStoring": true    // Bật activity lưu trữ Blob
    }
}
```

[English](./README.EN.md)

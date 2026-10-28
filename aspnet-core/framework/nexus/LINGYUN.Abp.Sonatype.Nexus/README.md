# LINGYUN.Abp.Sonatype.Nexus

[English](./README.EN.md) | Tiếng Việt

Mô-đun tích hợp ABP framework cho Sonatype Nexus REST API.

## Tính năng

* Hỗ trợ quản lý kho Nexus
* Hỗ trợ quản lý thành phần (Component)
* Hỗ trợ quản lý tài nguyên (Asset)
* Hỗ trợ chức năng tìm kiếm
* Hỗ trợ xác thực cơ bản

## Phụ thuộc mô-đun

```csharp
[DependsOn(typeof(AbpSonatypeNexusModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

### 1. Cấu hình kết nối Nexus

Cấu hình tùy chọn kết nối Nexus trong `appsettings.json`:

```json
{
  "SonatypeNexus": {
    "BaseUrl": "http://127.0.0.1:8081",
    "UserName": "sonatype",
    "Password": "sonatype"
  }
}
```

### 2. Sử dụng quản lý kho

```csharp
public class MyService
{
    private readonly INexusRepositoryManager _repositoryManager;

    public MyService(INexusRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<List<NexusRepository>> GetRepositoriesAsync()
    {
        var result = await _repositoryManager.ListAsync();
        return result.Items;
    }
}
```

### 3. Sử dụng quản lý thành phần

```csharp
public class MyService
{
    private readonly INexusComponentManager _componentManager;

    public MyService(INexusComponentManager componentManager)
    {
        _componentManager = componentManager;
    }

    public async Task UploadComponentAsync(string repository, string directory, byte[] fileBytes)
    {
        var asset = new Asset("filename.txt", fileBytes);
        var args = new NexusRawBlobUploadArgs(repository, directory, asset);
        await _componentManager.UploadAsync(args);
    }
}
```

### 4. Sử dụng quản lý tài nguyên

```csharp
public class MyService
{
    private readonly INexusAssetManager _assetManager;

    public MyService(INexusAssetManager assetManager)
    {
        _assetManager = assetManager;
    }

    public async Task<List<NexusAsset>> GetAssetsAsync(string repository)
    {
        var result = await _assetManager.ListAsync(repository);
        return result.Items;
    }
}
```

## Tùy chọn cấu hình

* BaseUrl - Địa chỉ máy chủ Nexus
* UserName - Tên người dùng
* Password - Mật khẩu

## Thực tiễn tốt nhất

1. Bảo quản cẩn thận thông tin xác thực, tránh rò rỉ
2. Quy hoạch hợp lý cấu trúc kho và phân loại thành phần
3. Định kỳ dọn dẹp các thành phần và tài nguyên không cần thiết
4. Sử dụng cơ chế xử lý lỗi phù hợp

## Lưu ý

1. Đảm bảo máy chủ Nexus đã được cấu hình đúng và có thể truy cập
2. Khi tải lên tệp lớn cần chú ý tình trạng mạng và cài đặt thời gian chờ
3. Thao tác xóa không thể khôi phục, vui lòng thao tác cẩn thận
4. Một số thao tác cần quyền quản trị viên

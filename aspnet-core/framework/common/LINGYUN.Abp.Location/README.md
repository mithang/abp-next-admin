# LINGYUN.Abp.Location

## Giới thiệu

`LINGYUN.Abp.Location` là mô-đun cơ sở dịch vụ vị trí, cung cấp các chức năng liên quan đến vị trí địa lý, bao gồm mã hoá địa lý (thuận/nghịch), tính khoảng cách, v.v.

## Tính năng

* Mã hoá địa lý (Geocoding) và mã hoá địa lý nghịch (Reverse Geocoding)
* Phân giải vị trí địa lý theo IP
* Tính khoảng cách vị trí (dựa trên thuật toán Google, sai số < 0,2 mét)
* Tính độ lệch vị trí
* Hỗ trợ POI (điểm quan tâm) và thông tin đường
* Nhà cung cấp phân giải vị trí có thể mở rộng

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Location
```

## Cách sử dụng

1. Thêm phụ thuộc mô-đun:

```csharp
[DependsOn(typeof(AbpLocationModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Inject và sử dụng dịch vụ phân giải vị trí:

```csharp
public class YourLocationService
{
    private readonly ILocationResolveProvider _locationProvider;

    public YourLocationService(ILocationResolveProvider locationProvider)
    {
        _locationProvider = locationProvider;
    }

    // Mã hoá địa lý: chuyển địa chỉ thành tọa độ
    public async Task<GecodeLocation> GeocodeAsync(string address)
    {
        return await _locationProvider.GeocodeAsync(address);
    }

    // Mã hoá địa lý nghịch: chuyển tọa độ thành địa chỉ
    public async Task<ReGeocodeLocation> ReGeocodeAsync(double lat, double lng)
    {
        return await _locationProvider.ReGeocodeAsync(lat, lng);
    }

    // Phân giải vị trí địa lý theo IP
    public async Task<IPGecodeLocation> IPGeocodeAsync(string ipAddress)
    {
        return await _locationProvider.IPGeocodeAsync(ipAddress);
    }
}
```

## Tính toán vị trí

Mô-đun cung cấp chức năng tính toán vị trí mạnh mẽ:

```csharp
// Tạo đối tượng vị trí
var location1 = new Location { Latitude = 39.9042, Longitude = 116.4074 }; // Bắc Kinh
var location2 = new Location { Latitude = 31.2304, Longitude = 121.4737 }; // Thượng Hải

// Tính khoảng cách giữa hai điểm (mét)
double distance = location1.CalcDistance(location2);

// Tính độ lệch của vị trí
var offset = location1.CalcOffset(1000, 45); // Lệch 1000 mét về hướng đông bắc
```

## Nhà cung cấp phân giải vị trí tùy chỉnh

Để triển khai nhà cung cấp phân giải vị trí tùy chỉnh, cần:

1. Triển khai giao diện `ILocationResolveProvider`:

```csharp
public class CustomLocationProvider : ILocationResolveProvider
{
    public async Task<IPGecodeLocation> IPGeocodeAsync(string ipAddress)
    {
        // Triển khai phân giải vị trí địa lý theo IP
    }

    public async Task<GecodeLocation> GeocodeAsync(string address, string city = null)
    {
        // Triển khai mã hoá địa lý
    }

    public async Task<ReGeocodeLocation> ReGeocodeAsync(double lat, double lng, int radius = 50)
    {
        // Triển khai mã hoá địa lý nghịch
    }
}
```

2. Đăng ký triển khai của bạn trong mô-đun:

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddTransient<ILocationResolveProvider, CustomLocationProvider>();
}
```

## Thông tin thêm

* [English Documentation](./README.EN.md)
* [Dịch vụ định vị bản đồ Baidu](./LINGYUN.Abp.Location.Baidu/README.md)
* [Dịch vụ định vị bản đồ Tencent](./LINGYUN.Abp.Location.Tencent/README.md)

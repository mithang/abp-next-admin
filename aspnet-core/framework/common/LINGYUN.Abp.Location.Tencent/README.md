# LINGYUN.Abp.Location.Tencent

## Giới thiệu

`LINGYUN.Abp.Location.Tencent` là mô-đun triển khai dịch vụ vị trí dựa trên API bản đồ Tencent, cung cấp các chức năng mã hóa địa lý, mã hóa địa lý ngược, định vị IP, v.v.

## Tính năng

* Mã hóa địa lý: chuyển đổi địa chỉ có cấu trúc chi tiết thành tọa độ kinh/vĩ độ tương ứng
* Mã hóa địa lý ngược: chuyển đổi tọa độ kinh/vĩ độ thành địa chỉ có cấu trúc tương ứng
* Định vị IP: lấy thông tin vị trí theo địa chỉ IP
* Thông tin POI (điểm quan tâm): lấy thông tin các điểm quan tâm xung quanh như cửa hàng, nhà hàng
* Thông tin phân cấp hành chính: lấy thông tin chi tiết về các cấp hành chính
* Phân tích địa chỉ: phân tích thông minh thông tin địa chỉ, hỗ trợ nhiều định dạng

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Location.Tencent
```

## Cấu hình

1. Thêm phụ thuộc mô-đun:

```csharp
[DependsOn(typeof(AbpTencentLocationModule))]
public class YourModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<TencentLocationOptions>(options =>
        {
            // Đặt khóa API bản đồ Tencent
            options.Key = "your-tencent-map-key";
            // Tùy chọn: đặt khóa bảo mật (xác thực SK)
            options.SecretKey = "your-tencent-map-sk";
        });
    }
}
```

## Cách sử dụng

1. Tiêm và sử dụng dịch vụ phân giải vị trí:

```csharp
public class YourLocationService
{
    private readonly ILocationResolveProvider _locationProvider;

    public YourLocationService(ILocationResolveProvider locationProvider)
    {
        _locationProvider = locationProvider;
    }

    // Mã hóa địa lý: địa chỉ sang tọa độ
    public async Task<GecodeLocation> GeocodeAsync(string address)
    {
        // Tham số city là tùy chọn, dùng để chỉ định thành phố chứa địa chỉ
        return await _locationProvider.GeocodeAsync(address, "Bắc Kinh");
    }

    // Mã hóa địa lý ngược: tọa độ sang địa chỉ
    public async Task<ReGeocodeLocation> ReGeocodeAsync(double lat, double lng)
    {
        // Tham số radius là tùy chọn, chỉ định bán kính tìm kiếm (mét)
        return await _locationProvider.ReGeocodeAsync(lat, lng, 1000);
    }

    // Phân giải vị trí địa lý IP
    public async Task<IPGecodeLocation> IPGeocodeAsync(string ipAddress)
    {
        return await _locationProvider.IPGeocodeAsync(ipAddress);
    }
}
```

## Mô tả dữ liệu trả về

### Dữ liệu trả về của mã hóa địa lý

```json
{
    "location": {
        "lat": 39.915119,    // Giá trị vĩ độ
        "lng": 116.403963    // Giá trị kinh độ
    },
    "title": "Thiên An Môn",       // Tên địa điểm
    "address": "Phố Đông Trường An, quận Đông Thành, Bắc Kinh",  // Địa chỉ
    "category": "Điểm du lịch",   // Loại
    "adcode": "110101",      // Mã hành chính
    "similarity": 0.8,       // Độ tương đồng (0-1)
    "reliability": 7,        // Độ tin cậy (1-10)
    "level": 11             // Loại địa chỉ
}
```

### Dữ liệu trả về của mã hóa địa lý ngược

```json
{
    "location": {
        "lat": 39.915119,    // Giá trị vĩ độ
        "lng": 116.403963    // Giá trị kinh độ
    },
    "address": "Phố Đông Trường An, quận Đông Thành, Bắc Kinh",  // Địa chỉ đầy đủ
    "formatted_addresses": {
        "recommend": "Thiên An Môn, quận Đông Thành",    // Địa chỉ đề xuất
        "rough": "Quận Đông Thành, Bắc Kinh"         // Địa chỉ sơ lược
    },
    "address_component": {
        "nation": "Trung Quốc",              // Quốc gia
        "province": "Bắc Kinh",          // Tỉnh
        "city": "Bắc Kinh",              // Thành phố
        "district": "Quận Đông Thành",          // Quận/huyện
        "street": "Phố Đông Trường An",          // Đường/phố
        "street_number": "Số 1"         // Số nhà
    },
    "pois": [                         // Thông tin POI xung quanh
        {
            "title": "Thiên An Môn",         // Tên POI
            "address": "Phố Đông Trường An, quận Đông Thành, Bắc Kinh", // Địa chỉ POI
            "category": "Điểm du lịch",     // Loại POI
            "distance": 100,          // Khoảng cách (mét)
            "_distance": 100.0,       // Khoảng cách (mét, số thực)
            "tel": "",               // Số điện thoại
            "ad_info": {             // Thông tin hành chính
                "adcode": "110101",  // Mã hành chính
                "name": "Quận Đông Thành",     // Tên hành chính
                "location": {        // Điểm trung tâm hành chính
                    "lat": 39.915119,
                    "lng": 116.403963
                }
            }
        }
    ]
}
```

## Thông tin thêm

* [English Documentation](./README.EN.md)
* [Dịch vụ vị trí Tencent](https://lbs.qq.com/)

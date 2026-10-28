# LINGYUN.Abp.Location.Baidu

## Giới thiệu

`LINGYUN.Abp.Location.Baidu` là mô-đun triển khai dịch vụ vị trí dựa trên API Baidu Maps, cung cấp các chức năng mã hóa địa lý, mã hóa địa lý ngược, định vị IP, v.v.

## Tính năng

* Mã hóa địa lý: chuyển đổi địa chỉ có cấu trúc chi tiết thành tọa độ kinh độ/vĩ độ tương ứng
* Mã hóa địa lý ngược: chuyển đổi tọa độ kinh độ/vĩ độ thành địa chỉ có cấu trúc tương ứng
* Định vị IP: lấy thông tin vị trí theo địa chỉ IP
* Thông tin POI (điểm quan tâm): lấy thông tin điểm quan tâm xung quanh như cửa hàng, nhà hàng
* Thông tin đường: lấy thông tin các tuyến đường gần đó
* Thông tin phân chia hành chính: lấy thông tin chi tiết về cấp phân chia hành chính

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Location.Baidu
```

## Cấu hình

1. Thêm phụ thuộc mô-đun:

```csharp
[DependsOn(typeof(AbpBaiduLocationModule))]
public class YourModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<BaiduLocationOptions>(options =>
        {
            // Đặt khóa API Baidu Maps
            options.AccessKey = "your-baidu-map-ak";
            // Tùy chọn: đặt khóa bảo mật (kiểm tra sn)
            options.SecurityKey = "your-baidu-map-sk";
            // Tùy chọn: đặt loại hệ tọa độ (mặc định là bd09ll)
            options.CoordType = "bd09ll";
            // Tùy chọn: đặt định dạng đầu ra (mặc định là json)
            options.Output = "json";
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

    // Mã hóa địa lý: địa chỉ thành tọa độ
    public async Task<GecodeLocation> GeocodeAsync(string address)
    {
        // Tham số city là tùy chọn, dùng để chỉ định thành phố nơi địa chỉ thuộc về
        return await _locationProvider.GeocodeAsync(address, "Bắc Kinh");
    }

    // Mã hóa địa lý ngược: tọa độ thành địa chỉ
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
    "precise": 1,            // Thông tin bổ sung của vị trí, có phải tìm kiếm chính xác hay không (1 là chính xác, 0 là không chính xác)
    "confidence": 80,        // Độ tin cậy
    "comprehension": 100,    // Mức độ hiểu địa chỉ
    "level": "Địa chỉ số nhà"          // Loại địa chỉ
}
```

### Dữ liệu trả về của mã hóa địa lý ngược

```json
{
    "location": {
        "lat": 39.915119,    // Giá trị vĩ độ
        "lng": 116.403963    // Giá trị kinh độ
    },
    "formatted_address": "Phố Đông Trường An, quận Đông Thành, Bắc Kinh",  // Thông tin địa chỉ có cấu trúc
    "business": "Thiên An Môn",                      // Thông tin khu thương mại
    "addressComponent": {
        "country": "Trung Quốc",                     // Quốc gia
        "province": "Bắc Kinh",                  // Tỉnh
        "city": "Bắc Kinh",                      // Thành phố
        "district": "Quận Đông Thành",                  // Quận/huyện
        "street": "Phố Đông Trường An",                  // Đường phố
        "street_number": "Số 1"                // Số nhà
    },
    "pois": [                                // Thông tin POI xung quanh
        {
            "name": "Thiên An Môn",                  // Tên POI
            "type": "Điểm du lịch",                // Loại POI
            "distance": "100"                 // Khoảng cách (mét)
        }
    ],
    "roads": [                               // Thông tin đường xung quanh
        {
            "name": "Phố Đông Trường An",                // Tên đường
            "distance": "50"                  // Khoảng cách (mét)
        }
    ]
}
```

## Thông tin thêm

* [English Documentation](./README.EN.md)
* [Nền tảng mở Baidu Maps](https://lbsyun.baidu.com/)

# LINGYUN.Abp.MaxMindGeoIP2

## Giới thiệu

`LINGYUN.Abp.MaxMindGeoIP2` là một mô-đun của framework ABP dựa trên [MaxMind.GeoIP2](https://github.com/maxmind/GeoIP2-dotnet),
sử dụng cơ sở dữ liệu ngoại tuyến mmdb (do bên sử dụng cung cấp, xem bên dưới) để phân giải vị trí địa lý của IP, đồng thời đăng ký trình đóng góp phân giải vị trí cho `LINGYUN.Abp.IP.Location`,
có thể dùng thay thế cho `LINGYUN.Abp.IP2Region` (quy tắc ghi chú giữ nhất quán).

## Tính năng

* Phân giải vị trí địa lý của IP (quốc gia/tỉnh/thành phố) qua cơ sở dữ liệu ngoại tuyến mmdb
* **Không tích hợp sẵn cơ sở dữ liệu ngoại tuyến**: GeoLite2 bị ràng buộc bởi giấy phép của MaxMind, không được phân phối kèm gói, cần trỏ tới tệp mmdb do bên sử dụng tự tải xuống thông qua `MaxMindGeoIP2:DatabaseFile`
* Khi tệp cơ sở dữ liệu ngoại tuyến không tồn tại, sử dụng `EmptyGeoIP2DatabaseReader` (phân giải nội dung rỗng, vị trí rỗng và ghi nhật ký cảnh báo), không làm gián đoạn nghiệp vụ
* Hỗ trợ đồng thời IPv4 và IPv6 (tùy thuộc vào cơ sở dữ liệu ngoại tuyến)
* Phân giải tên địa lý theo văn hóa hiện tại (lấy từ `Names`, nếu thiếu thì quay về `Name`)
* Các địa chỉ không có bản ghi như địa chỉ loopback cục bộ, mạng nội bộ, địa chỉ dự trữ không trả về dữ liệu (ghi chú rỗng)
* Hỗ trợ hệ thống tệp ảo ABP

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.MaxMindGeoIP2
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpMaxMindGeoIP2Module))]` vào lớp mô-đun của bạn.

```csharp
[DependsOn(typeof(AbpMaxMindGeoIP2Module))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Tiêm (inject) `IIPLocationResolver` để phân giải vị trí IP:

```csharp
public class YourService
{
    private readonly IIPLocationResolver _ipLocationResolver;

    public YourService(IIPLocationResolver ipLocationResolver)
    {
        _ipLocationResolver = ipLocationResolver;
    }

    public async Task<string?> ResolveAsync(string ip)
    {
        var result = await _ipLocationResolver.ResolveAsync(ip);

        // 223.5.5.5 => Chiết Giang Hàng Châu
        return result.Location?.Remarks;
    }
}
```

## Tùy chọn

```csharp
Configure<AbpMaxMindGeoIP2Options>(options =>
{
    // Đường dẫn tệp cơ sở dữ liệu ngoại tuyến (bắt buộc): cần tự tải xuống từ MaxMind và chấp nhận thỏa thuận cấp phép của họ
    options.DatabaseFile = "/data/GeoLite2-City.mmdb";
    // Chế độ mở tệp, mặc định là ánh xạ bộ nhớ
    options.FileAccessMode = FileAccessMode.MemoryMapped;
});
```

```json
{
  "MaxMindGeoIP2": {
    "DatabaseFile": "/data/GeoLite2-City.mmdb",
    "FileAccessMode": "MemoryMapped"
  }
}
```

### Tên địa lý và văn hóa

Trình truy vấn không chỉ định locales (tức là mở bằng tên mặc định `Name` của cơ sở dữ liệu ngoại tuyến),
tên địa lý được lấy từ từ điển `Names` của MaxMind theo **văn hóa hiện tại** (`CultureInfo.CurrentUICulture`) tại thời điểm phân giải:

* Trước tiên khớp theo tên văn hóa đầy đủ (ví dụ `zh-CN`), nếu không khớp thì khớp theo tên ngôn ngữ (ví dụ `es-MX` → `es`);
* Nếu vẫn không khớp thì quay về `Name` (ngôn ngữ mặc định của cơ sở dữ liệu ngoại tuyến, thường là tiếng Anh);
* Cơ sở dữ liệu ngoại tuyến GeoLite2-City cung cấp các ngôn ngữ `de,en,es,fr,ja,pt-BR,ru,zh-CN`, một số thực thể chỉ cung cấp số ít ngôn ngữ (khi đó quay về theo quy tắc trên).

Do đó, cùng một trình truy vấn đơn lẻ (singleton) có thể phục vụ mọi văn hóa, không cần tạo nhiều trình truy vấn theo ngôn ngữ.

| Văn hóa hiện tại | Ghi chú của `8.8.8.8` | Ghi chú của `223.5.5.5` |
|---|---|---|
| `zh-CN` | Hoa Kỳ | Chiết Giang Hàng Châu |
| `en-US` | United States | China |
| `ja-JP` | アメリカ | Trung Quốc |
| `ko-KR` (cơ sở dữ liệu ngoại tuyến không có ngôn ngữ này, quay về `Name`) | United States | China |

### Quy tắc ghi chú (Remarks)

Quy tắc ghi chú (Remarks) được xử lý thống nhất bởi `LINGYUN.Abp.IP.Location`, dùng chung một cấu hình với `LINGYUN.Abp.IP2Region`:

```csharp
Configure<AbpIPLocationResolveOptions>(options =>
{
    // Tên quốc gia khớp được sẽ bị loại khỏi ghi chú (chỉ IP Trung Quốc không hiển thị quốc gia)
    options.RemoveCountry = new[] { "Trung Quốc" };
    // Tên tỉnh khớp được sẽ bị loại khỏi ghi chú
    // options.RemoveProvince = new[] { "Đặc khu hành chính Hồng Kông" };
});
```

Cũng có thể trực tiếp sử dụng đoạn cấu hình (mô-đun `LINGYUN.Abp.IP.Location` liên kết với đoạn `IPLocation`):

```json
{
  "IPLocation": {
    "RemoveCountry": [ "Trung Quốc" ]
  }
}
```

```yaml
# docker-compose environment
- IPLocation__RemoveCountry__0=Trung Quốc
```

| Kịch bản | Ví dụ `Remarks` |
|---|---|
| Tên quốc gia khớp `RemoveCountry`, và có cả tỉnh lẫn thành phố | `Chiết Giang Hàng Châu` (khi tỉnh và thành phố trùng tên thì chỉ hiển thị thành phố, ví dụ `thành phố Trùng Khánh`) |
| Tên quốc gia khớp `RemoveCountry`, và chỉ có tỉnh | `Đặc khu hành chính Hồng Kông` |
| Tên quốc gia khớp `RemoveCountry`, và chỉ có dữ liệu quốc gia | Rỗng |
| Tên tỉnh khớp `RemoveProvince` | `Hàng Châu` (chỉ dùng thành phố) |
| Đều không khớp | `Hoa Kỳ`, `Nhật Bản`, `Đức` (chỉ tên quốc gia) |
| Loopback cục bộ / mạng nội bộ / địa chỉ dự trữ / cơ sở dữ liệu ngoại tuyến chưa thu thập | Rỗng |

> Việc khớp tên bỏ qua chữ hoa/chữ thường và khoảng trắng ở đầu/cuối, áp dụng cho việc phân giải địa chỉ IP của mọi quốc gia.

## Chuẩn hiệu năng

Đo được bằng [BenchmarkDotNet](https://github.com/dotnet/BenchmarkDotNet) (`MemoryDiagnoser` + `InProcessEmitToolchain`):

```ini
BenchmarkDotNet v0.15.8, Windows 10.0.26100
Intel Core i7-14700K (20C/28T), .NET 10.0.12 (SDK 10.0.401), X64 RyuJIT x86-64-v3
GC=Concurrent Workstation, Toolchain=InProcessEmitToolchain (IterationCount=15)
```

| Phương thức | Mean | Error | StdDev | Ratio | Gen0 | Gen1 | Allocated |
|---|---:|---:|---:|---:|---:|---:|---:|
| `DatabaseReader_TryCity_IPv4` (cơ sở) | 3.428 μs | 0.0415 μs | 0.0388 μs | 1.00 | 0.4807 | 0.0038 | 8.15 KB |
| `DatabaseReader_TryCity_IPv6` | 3.496 μs | 0.0273 μs | 0.0228 μs | 1.02 | 0.4807 | 0.0038 | 8.15 KB |
| `DatabaseReader_TryCity_String_IPv4` | 3.428 μs | 0.0611 μs | 0.0542 μs | 1.00 | 0.4845 | 0.0038 | 8.19 KB |
| `ResolveAsync_IPv4` (toàn bộ chuỗi của mô-đun) | 3.753 μs | 0.0426 μs | 0.0399 μs | 1.09 | 0.5112 | 0.0076 | 8.73 KB |
| `ResolveAsync_IPv6` (toàn bộ chuỗi của mô-đun) | 3.812 μs | 0.0364 μs | 0.0323 μs | 1.11 | 0.5188 | 0.0076 | 8.78 KB |

* **Một lần truy vấn khoảng 3.4 μs** (thông lượng lý thuyết đơn luồng khoảng 290 nghìn lần/giây), IPv6 và IPv4 về cơ bản giống nhau (`Ratio` 1.02);
* `TryCity(IPAddress)` và `TryCity(string)` không có khác biệt, chi phí phân giải chuỗi có thể bỏ qua;
* **Toàn bộ chuỗi** qua `IIPLocationResolver` (DI Scope + trình đóng góp + phân giải tên theo văn hóa hiện tại) chỉ tăng khoảng **9%~11%**;
* Mỗi lần truy vấn cấp phát khoảng **8.15 KB** (đồ thị đối tượng mô hình `CityResponse`), toàn bộ chuỗi khoảng 8.73 KB —— trong kịch bản đồng thời cao nên chú ý GC (ví dụ bộ nhớ đệm kết quả cho các IP nóng);
* Kịch bản đo: `TryCity` sử dụng **tệp mmdb vật lý + ánh xạ bộ nhớ** (`FileAccessMode.MemoryMapped`, cách triển khai được khuyến nghị); `ResolveAsync` sử dụng cấu hình mặc định của mô-đun (cơ sở dữ liệu ngoại tuyến đã cấu hình + `IIPLocationResolver`);
* Chuẩn sử dụng chuỗi công cụ in-process (môi trường hiện tại không thể tạo tiến trình chuẩn độc lập), giá trị sẽ hơi tốt hơn so với chế độ tiến trình độc lập, chỉ dùng để so sánh ngang.

## Giải thích về cơ sở dữ liệu ngoại tuyến mmdb

* **Mô-đun này không tích hợp sẵn cơ sở dữ liệu ngoại tuyến**: Cơ sở dữ liệu GeoLite2 chịu ràng buộc bởi [Thỏa thuận cấp phép người dùng cuối (EULA) của MaxMind](https://www.maxmind.com/en/geolite2/eula),
  không được phân phối kèm gói, do đó bên sử dụng cần tự tải xuống và chỉ định đường dẫn tệp thông qua `MaxMindGeoIP2:DatabaseFile`;
* Khi chưa cấu hình (hoặc tệp không tồn tại), mô-đun đăng ký `EmptyGeoIP2DatabaseReader` —— tương đương với việc phân giải một nội dung rỗng:
  `TryCity`/`TryCountry` v.v. trả về `false`, `City`/`Country` v.v. ném ra `AddressNotFoundException`
  (nhất quán với khi trình đọc thực không khớp), kết quả phân giải vị trí rỗng và ghi một nhật ký cảnh báo, không ảnh hưởng đến quy trình nghiệp vụ;
* GeoLite2 cần [tài khoản MaxMind](https://www.maxmind.com/en/geolite2/signup) và License Key mới tải xuống và cập nhật định kỳ được,
  môi trường production nên trỏ tới tệp vật lý thông qua `DatabaseFile` và thay thế định kỳ;
* Tệp mmdb ngoại tuyến cũng có thể tải xuống từ kho [wp-statistics/GeoLite2-City](https://github.com/wp-statistics/GeoLite2-City):
  kho cung cấp gói nén `GeoLite2-City.mmdb.gz`, sau khi giải nén sẽ được `GeoLite2-City.mmdb`,
  rồi trỏ tới tệp đó thông qua `MaxMindGeoIP2:DatabaseFile`;
  Địa chỉ tải xuống trực tiếp: <https://raw.githubusercontent.com/wp-statistics/GeoLite2-City/master/GeoLite2-City.mmdb.gz>
* GeoLite2-City hỗ trợ đồng thời IPv4 và IPv6, đồng thời cung cấp
  các ngôn ngữ `de,en,es,fr,ja,pt-BR,ru,zh-CN`;
* Địa chỉ không hợp lệ, loopback cục bộ và địa chỉ chưa chỉ định được `IIPLocationResolver` xử lý thống nhất (trả về kết quả rỗng, không đi vào mô-đun phân giải vị trí);
* Địa chỉ mà cơ sở dữ liệu ngoại tuyến không có bản ghi (mạng nội bộ, địa chỉ dự trữ, chưa thu thập) trả về `IPLocation` rỗng (quốc gia/tỉnh/thành phố và ghi chú đều rỗng);
* Ngoại lệ truy vấn (ví dụ tệp cơ sở dữ liệu ngoại tuyến bị hỏng) sẽ không làm gián đoạn quy trình nghiệp vụ: ghi nhật ký cảnh báo và xử lý như không có dữ liệu (trả về vị trí rỗng).

## Liên kết

* [English document](./README.EN.md)
* [MaxMind GeoIP2 .NET](https://github.com/maxmind/GeoIP2-dotnet)
* [Cơ sở dữ liệu ngoại tuyến GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data)
* [Tải xuống mmdb ngoại tuyến (wp-statistics/GeoLite2-City)](https://github.com/wp-statistics/GeoLite2-City)

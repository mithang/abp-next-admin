# LINGYUN.Abp.IP2Region

## Giới thiệu

`LINGYUN.Abp.IP2Region` là một mô-đun khung ABP dựa trên IP2Region, cung cấp chức năng tra cứu địa chỉ IP. Mô-đun này tích hợp thư viện IP2Region.Net, cung cấp dịch vụ tra cứu địa chỉ IP thuận tiện.

## Tính năng

* Cung cấp dịch vụ tra cứu địa chỉ IP
* Đồng thời hỗ trợ cơ sở dữ liệu ngoại tuyến IPv4 và IPv6, tự động chọn tệp dữ liệu theo họ địa chỉ
* Hỗ trợ nhiều chính sách bộ nhớ đệm
* Tích hợp sẵn tệp cơ sở dữ liệu IPv4 và IPv6
* Hỗ trợ hệ thống tệp ảo ABP

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.IP2Region
```

## Cách dùng

1. Thêm `[DependsOn(typeof(AbpIP2RegionModule))]` vào lớp mô-đun của bạn.

```csharp
[DependsOn(typeof(AbpIP2RegionModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Tiêm và sử dụng dịch vụ tra cứu IP:

```csharp
public class YourService
{
    private readonly ISearcher _searcher;

    public YourService(ISearcher searcher)
    {
        _searcher = searcher;
    }

    public string? SearchIpInfo(string ip)
    {
        // Tự động chọn cơ sở dữ liệu ngoại tuyến IPv4 / IPv6 theo họ địa chỉ
        return _searcher.Search(ip);
    }
}
```

## Hỗ trợ IPv4 / IPv6

Mô-đun tích hợp sẵn hai tệp cơ sở dữ liệu ngoại tuyến (tải qua hệ thống tệp ảo ABP):

| Cơ sở dữ liệu ngoại tuyến | Đường dẫn |
|---|---|
| IPv4 | `/LINGYUN/Abp/IP2Region/Resources/ip2region_v4.xdb` |
| IPv6 | `/LINGYUN/Abp/IP2Region/Resources/ip2region_v6.xdb` |

`ISearcher` đăng ký là `AbpSearcher`, đồng thời tải hai cơ sở dữ liệu ngoại tuyến và **tự động định tuyến theo họ địa chỉ**:

* Địa chỉ IPv4 tra cứu cơ sở dữ liệu ngoại tuyến IPv4, địa chỉ IPv6 tra cứu cơ sở dữ liệu ngoại tuyến IPv6;
* Địa chỉ IPv6 ánh xạ IPv4 (ví dụ `::ffff:1.2.3.4`) sẽ được chuẩn hóa về tra cứu IPv4;
* Khi tài nguyên cơ sở dữ liệu ngoại tuyến IPv6 không tồn tại (ví dụ bị loại trừ khi đóng gói), tra cứu IPv6 trả về `null`, không dùng cơ sở dữ liệu ngoại tuyến IPv4 để phân tích ra kết quả sai.

Cũng có thể trực tiếp sử dụng `AbpSearcher`:

```csharp
// Chế độ một tệp: chỉ tải một cơ sở dữ liệu ngoại tuyến, bên gọi đảm bảo địa chỉ tra cứu khớp với phiên bản cơ sở dữ liệu ngoại tuyến
using var v6Searcher = new AbpSearcher(CachePolicy.File, ipv6XdbStream);

// Chế độ hai tệp: đồng thời tải cơ sở dữ liệu ngoại tuyến IPv4 và IPv6, tự động định tuyến theo họ địa chỉ
using var searcher = new AbpSearcher(CachePolicy.File, ipv4XdbStream, ipv6XdbStream);

var region = searcher.Search("2400:3200::1"); // Trung Quốc|Chiết Giang|Hàng Châu|Alibaba|CN
```

> Cơ sở dữ liệu ngoại tuyến IPv6 (khoảng 35MB) được cung cấp kèm gói, có thể loại trừ khi đóng gói bằng `-p:IncludeIPv6Database=false` để giảm dung lượng.

## Tùy chọn

```csharp
Configure<AbpIP2RegionOptions>(options =>
{
    // Tệp cơ sở dữ liệu ngoại tuyến: tệp vật lý được ưu tiên, sau đó là đường dẫn hệ thống tệp ảo (tài nguyên tích hợp sẵn)
    options.IPv4DatabaseFile = "/data/ip2region_v4.xdb";
    options.IPv6DatabaseFile = "/data/ip2region_v6.xdb";
    // Giá trị mặc định: CachePolicy.Content (an toàn khi dùng đồng thời)
    options.CachePolicy = CachePolicy.Content;
});
```

```json
{
  "IP2Region": {
    "IPv4DatabaseFile": "/data/ip2region_v4.xdb",
    "IPv6DatabaseFile": "/data/ip2region_v6.xdb",
    "CachePolicy": "Content"
  }
}
```

> Cơ sở dữ liệu ngoại tuyến IPv4 / IPv6 mặc định dùng tài nguyên tích hợp sẵn; khi cấu hình đường dẫn tệp vật lý thì **ưu tiên tải tệp vật lý**, thuận tiện thay thế/cập nhật cơ sở dữ liệu ngoại tuyến
> (cơ sở dữ liệu ngoại tuyến có thể tải từ [ip2region](https://github.com/lionsoul2014/ip2region) hoặc dùng maker để tạo);
> Cơ sở dữ liệu ngoại tuyến IPv6 là tùy chọn, khi tệp không tồn tại, tra cứu IPv6 trả về `null`.

### Chính sách bộ nhớ đệm

| Chính sách bộ nhớ đệm | Mô tả | An toàn khi dùng đồng thời |
|---|---|---|
| `Content`(mặc định) | Toàn bộ cơ sở dữ liệu ngoại tuyến được tải vào bộ nhớ, trình tra cứu đơn thể có thể dùng đồng thời | Có |
| `VectorIndex` | Chỉ bộ nhớ đệm chỉ mục vector (512KB), phần còn lại đọc luồng dữ liệu | Không |
| `File` | Tra cứu hoàn toàn dựa trên luồng tệp, mức sử dụng bộ nhớ nhỏ nhất | Không |

> `ISearcher` được đăng ký dạng đơn thể, còn `VectorIndex`/`File` là cách triển khai "luồng dữ liệu dùng chung + Seek", tra cứu đồng thời đa luồng sẽ làm gián đoạn vị trí luồng dữ liệu lẫn nhau,
> chỉ dùng khi có thể đảm bảo tra cứu tuần tự; tham khảo mức sử dụng bộ nhớ: cơ sở dữ liệu IPv4 khoảng 10MB, IPv6 khoảng 35MB.

## Quy tắc Ghi chú (Remarks)

Quy tắc Ghi chú (Remarks) do `LINGYUN.Abp.IP.Location` xử lý thống nhất (các mô-đun phân tích vị trí khác, ví dụ MaxMind, dùng chung cùng một cấu hình):

```csharp
Configure<AbpIPLocationResolveOptions>(options =>
{
    // Tên quốc gia khớp được sẽ bị loại khỏi ghi chú (chỉ IP Trung Quốc không hiển thị quốc gia)
    options.RemoveCountry = new[] { "Trung Quốc" };
    // Tên tỉnh khớp được sẽ bị loại khỏi ghi chú
    // options.RemoveProvince = new[] { "Đặc khu hành chính Hồng Kông" };
});
```

Cũng có thể trực tiếp dùng mục cấu hình (mô-đun `LINGYUN.Abp.IP.Location` liên kết mục `IPLocation`):

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

* Khi tên quốc gia khớp với `RemoveCountry`, ghi chú dùng tỉnh và thành phố (ví dụ `Chiết Giang Hàng Châu`; khi tỉnh và thành phố trùng tên thì chỉ hiển thị thành phố, ví dụ `Trùng Khánh`; khi chỉ có tỉnh thì là `Đặc khu hành chính Hồng Kông`);
* Khi tên tỉnh khớp với `RemoveProvince`, ghi chú chỉ dùng thành phố (ví dụ `Hàng Châu`);
* Khi đều không khớp, ghi chú chỉ hiển thị tên quốc gia (ví dụ `Trung Quốc`, `Japan`); khi tên khớp bị loại mà không còn cấp nào để hiển thị thì ghi chú rỗng;
* Việc khớp tên bỏ qua chữ hoa/thường và khoảng trắng đầu/cuối, áp dụng cho việc phân tích địa chỉ IP của mọi quốc gia.

## Xử lý địa chỉ đặc biệt

* **Địa chỉ không hợp lệ, loopback nội bộ và địa chỉ chưa chỉ định** (ví dụ `not-an-ip`, `127.0.0.1`, `::1`, `0.0.0.0`, `::`) do `IIPLocationResolver`
  xử lý thống nhất, trực tiếp trả về kết quả phân tích rỗng (`Location` là `null`), không đi vào mô-đun phân tích vị trí;
* **Địa chỉ mạng nội bộ, link-local, multicast, địa chỉ dự trữ, v.v.** trong cơ sở dữ liệu ngoại tuyến ip2region trả về tiếng Anh `Reserved`,
  mô-đun trả về một `IPLocation` có `Country`/`Province`/`City`/`Remarks` **đều rỗng**:

| Phân loại địa chỉ | Ví dụ |
|---|---|
| Mạng nội bộ | `10.0.0.1`、`172.16.0.1`、`192.168.1.1`、`fd00::1` |
| Link-local | `169.254.1.1`、`fe80::1` |
| NAT cấp nhà mạng | `100.64.0.1` |
| Ví dụ trong tài liệu / kiểm thử benchmark | `192.0.2.1`、`2001:db8::1`、`198.18.0.1` |
| Multicast / Broadcast | `224.0.0.1`、`ff02::1`、`255.255.255.255` |
| Dự trữ (các đoạn địa chỉ khác được cơ sở dữ liệu ngoại tuyến đánh dấu `Reserved`) | `64:ff9b::1` |

## Mô tả thư viện IP2Region.Net

### Installation

Install the package with [NuGet](https://www.nuget.org/packages/IP2Region.Net)

```bash
Install-Package IP2Region.Net
```

### Usage

```csharp
using IP2Region.Net.Abstractions;
using IP2Region.Net.XDB;

ISearcher searcher = new Searcher(CachePolicy , "your xdb file path");
```

### Cache Policy Description
| Cache Policy            | Description                                                                                                | Thread Safe |
|-------------------------|------------------------------------------------------------------------------------------------------------|-------------|
| CachePolicy.Content     | Cache the entire `xdb` data.                                                                               | Yes         |
| CachePolicy.VectorIndex | Cache `vecotorIndex` to speed up queries and reduce system io pressure by reducing one fixed IO operation. | Yes         |
| CachePolicy.File        | Completely file-based queries                                                                              | Yes         |
### XDB File Description
Generate using [maker](https://github.com/lionsoul2014/ip2region/tree/master/maker/csharp), or [download](https://github.com/lionsoul2014/ip2region/blob/master/data/ip2region.xdb) pre-generated xdb files

## ASP.NET Core Usage

```csharp
services.AddSingleton<ISearcher>(new Searcher(CachePolicy , "your xdb file path"));
```

## Performance

``` ini

BenchmarkDotNet=v0.13.2, OS=macOS 13.4.1 (c) (22F770820d) [Darwin 22.5.0]
Apple M1, 1 CPU, 8 logical and 8 physical cores
.NET SDK=7.0.306
  [Host]     : .NET 6.0.20 (6.0.2023.32017), Arm64 RyuJIT AdvSIMD
  DefaultJob : .NET 6.0.20 (6.0.2023.32017), Arm64 RyuJIT AdvSIMD


```
| Method                  |       Mean |    Error |   StdDev |
|-------------------------|-----------:|---------:|---------:|
| CachePolicy_Content     |   155.7 ns |  0.46 ns |  0.39 ns |
| CachePolicy_File        | 2,186.8 ns | 34.27 ns | 32.06 ns |
| CachePolicy_VectorIndex | 1,570.3 ns | 27.53 ns | 22.99 ns |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[Apache License 2.0](https://github.com/lionsoul2014/ip2region/blob/master/LICENSE.md)

## Liên kết

* [English document](./README.EN.md)
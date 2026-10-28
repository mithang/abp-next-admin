using LINGYUN.Abp.IP.Location;
using MaxMind.Db;
using MaxMind.GeoIP2;
using Microsoft.Extensions.Options;
using Shouldly;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace LINGYUN.Abp.MaxMindGeoIP2;
public class IPLocationResolverTest : AbpMaxMindGeoIP2TestBase
{
    /// <summary>
    /// Tùy chọn mặc định: tệp cơ sở dữ liệu do bên sử dụng cung cấp (không còn tích hợp thư viện ngoại tuyến), chế độ ánh xạ bộ nhớ
    /// </summary>
    [Fact]
    public void TestDefaultOptions()
    {
        var defaultOptions = new AbpMaxMindGeoIP2Options();
        defaultOptions.DatabaseFile.ShouldBeNullOrEmpty();
        defaultOptions.DatabaseFileExists().ShouldBeFalse();
        defaultOptions.FileAccessMode.ShouldBe(FileAccessMode.MemoryMapped);

        // Máy chủ kiểm thử: đường dẫn thư viện ngoại tuyến do cấu hình cung cấp (khi chưa cấu hình sẽ quay lại tệp thư viện ngoại tuyến cục bộ)
        var options = GetRequiredService<IOptions<AbpMaxMindGeoIP2Options>>().Value;
        options.FileAccessMode.ShouldBe(FileAccessMode.MemoryMapped);
    }

    /// <summary>
    /// Thư viện ngoại tuyến phải tải đúng (GeoLite2-City), Name của GeoIP2 là tên mặc định của thư viện ngoại tuyến, tên bản địa hóa nằm trong Names
    /// </summary>
    [Fact]
    public void TestDatabaseReader()
    {
        var reader = GetRequiredService<IGeoIP2DatabaseReader>();

        reader.Metadata.DatabaseType.ShouldBe("GeoLite2-City");

        reader.TryCity(IPAddress.Parse("223.5.5.5"), out var response).ShouldBeTrue();
        response!.Country.Name.ShouldBe("China");
        response.Country.Names["zh-CN"].ShouldBe("Trung Quốc");
        response.MostSpecificSubdivision.Name.ShouldBe("Zhejiang");
        response.MostSpecificSubdivision.Names["zh-CN"].ShouldBe("Chiết Giang");
        response.City.Name.ShouldBe("Hangzhou");
        response.City.Names["zh-CN"].ShouldBe("Hàng Châu");

        reader.TryCity(IPAddress.Parse("2400:3200::1"), out var ipv6Response).ShouldBeTrue();
        ipv6Response!.Country.IsoCode.ShouldBe("CN");
    }

    /// <summary>
    /// Phân tích vị trí qua IIPLocationResolver (ghi chú khi văn hóa hiện tại là tiếng Trung giản thể, quy tắc giống mô-đun IP2Region)
    /// </summary>
    [Theory]
    [InlineData("8.8.8.8", "Mỹ")]
    [InlineData("2001:4860:4860::8888", "Mỹ")]
    [InlineData("223.5.5.5", "Chiết GiangHàng Châu")]
    [InlineData("2400:3200::1", "Chiết GiangHàng Châu")]
    [InlineData("103.151.173.211", "Nhật Bản")]
    [InlineData("2a00:1450:4001:81b::200e", "Đức")]
    [InlineData("220.246.0.1", "Hồng Kông")]
    public async Task TestSearchLocation(string ip, string shouldBeRemarks)
    {
        UseCulture("zh-CN");

        var resolver = GetRequiredService<IIPLocationResolver>();

        var result = await resolver.ResolveAsync(ip);

        result.Location.ShouldNotBeNull();
        result.Location.Remarks.ShouldBe(shouldBeRemarks);
        result.AppliedResolvers.ShouldContain(MaxMindGeoIP2IPLocationResolveContributor.ContributorName);
    }

    /// <summary>
    /// Khi tên quốc gia khớp với danh sách loại bỏ (RemoveCountry) thì bị loại khỏi ghi chú, chỉ có dữ liệu quốc gia thì ghi chú trống
    /// </summary>
    [Theory]
    [InlineData("114.114.114.114")]
    [InlineData("180.76.76.76")]
    public async Task TestSearchRemovedCountryOnly(string ip)
    {
        UseCulture("zh-CN");

        var resolver = GetRequiredService<IIPLocationResolver>();

        var result = await resolver.ResolveAsync(ip);

        result.Location.ShouldNotBeNull();
        result.Location.Country.ShouldBe("Trung Quốc");
        result.Location.Remarks.ShouldBeNullOrEmpty();
    }

    /// <summary>
    /// Tên địa lý lấy từ Names theo văn hóa hiện tại, khi không có văn hóa đầy đủ thì lấy theo ngôn ngữ, khi đều không có thì quay lại Name
    /// </summary>
    [Theory]
    // Tên văn hóa đầy đủ (zh-CN / en / ja, v.v.)
    [InlineData("zh-CN", "223.5.5.5", "Chiết GiangHàng Châu")]
    [InlineData("en-US", "223.5.5.5", "China")]
    [InlineData("ja-JP", "2a00:1450:4001:81b::200e", "Cộng hòa Liên bang Đức")]
    // Văn hóa đầy đủ không tồn tại (es-MX), lấy theo tên ngôn ngữ (es)
    [InlineData("es-MX", "8.8.8.8", "Estados Unidos")]
    // Thư viện ngoại tuyến không có ngôn ngữ đó (ko), quay lại Name (ngôn ngữ mặc định của thư viện ngoại tuyến)
    [InlineData("ko-KR", "8.8.8.8", "United States")]
    [InlineData("ko-KR", "223.5.5.5", "China")]
    public async Task TestSearchLocationByCulture(string culture, string ip, string shouldBeRemarks)
    {
        UseCulture(culture);

        var resolver = GetRequiredService<IIPLocationResolver>();

        var result = await resolver.ResolveAsync(ip);

        result.Location.ShouldNotBeNull();
        result.Location.Remarks.ShouldBe(shouldBeRemarks);
    }

    /// <summary>
    /// Địa chỉ mạng nội bộ, loopback, địa chỉ dự trữ và địa chỉ thư viện ngoại tuyến chưa thu thập: quốc gia/tỉnh/thành phố/ghi chú đều trống
    /// </summary>
    [Theory]
    [InlineData("10.0.0.1")]
    [InlineData("172.16.0.1")]
    [InlineData("192.168.1.1")]
    [InlineData("169.254.1.1")]
    [InlineData("224.0.0.1")]
    [InlineData("fe80::1")]
    [InlineData("1.1.1.1")]
    public async Task TestSearchSpecialLocation(string ip)
    {
        var resolver = GetRequiredService<IIPLocationResolver>();

        var result = await resolver.ResolveAsync(ip);

        result.Location.ShouldNotBeNull();
        result.Location.Remarks.ShouldBeNullOrEmpty();
        result.Location.Country.ShouldBeNull();
        result.Location.Province.ShouldBeNull();
        result.Location.City.ShouldBeNull();
    }

    /// <summary>
    /// Địa chỉ không hợp lệ, loopback cục bộ và địa chỉ chưa chỉ định do IIPLocationResolver xử lý thống nhất, không trả về vị trí
    /// </summary>
    [Theory]
    [InlineData("not-an-ip")]
    [InlineData("999.999.999.999")]
    [InlineData("127.0.0.1")]
    [InlineData("::1")]
    [InlineData("0.0.0.0")]
    [InlineData("::")]
    public async Task TestSearchInvalidLocation(string ip)
    {
        var resolver = GetRequiredService<IIPLocationResolver>();

        var result = await resolver.ResolveAsync(ip);

        result.Location.ShouldBeNull();
    }

    /// <summary>
    /// Trình truy vấn là singleton và an toàn luồng, truy vấn đồng thời phải trả về kết quả đúng
    /// </summary>
    [Fact]
    public async Task TestSearchConcurrently()
    {
        UseCulture("zh-CN");

        var resolver = GetRequiredService<IIPLocationResolver>();

        var expected = new (string Ip, string Remarks)[]
        {
            ("8.8.8.8", "Mỹ"),
            ("223.5.5.5", "Chiết GiangHàng Châu"),
            ("220.246.0.1", "Hồng Kông"),
            ("2001:4860:4860::8888", "Mỹ"),
            ("2400:3200::1", "Chiết GiangHàng Châu"),
        };

        var tasks = Enumerable.Range(0, System.Environment.ProcessorCount * 4)
            .Select(_ => Task.Run(async () =>
            {
                for (var i = 0; i < 20; i++)
                {
                    foreach (var (ip, remarks) in expected)
                    {
                        var result = await resolver.ResolveAsync(ip);
                        result.Location.Remarks.ShouldBe(remarks);
                    }
                }
            }));

        await Task.WhenAll(tasks);
    }

    private static void UseCulture(string cultureName)
    {
        var culture = new CultureInfo(cultureName);
        CultureInfo.CurrentCulture = culture;
        CultureInfo.CurrentUICulture = culture;
    }
}

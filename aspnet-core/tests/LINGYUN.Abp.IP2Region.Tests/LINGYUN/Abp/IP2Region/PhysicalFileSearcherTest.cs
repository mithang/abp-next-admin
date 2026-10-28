using IP2Region.Net.Abstractions;
using LINGYUN.Abp.IP.Location;
using Microsoft.Extensions.Options;
using Shouldly;
using System.IO;
using System.Threading.Tasks;
using Xunit;

namespace LINGYUN.Abp.IP2Region;
public class PhysicalFileSearcherTest : AbpIP2RegionPhysicalFileTestBase
{
    /// <summary>
    /// Thư viện ngoại tuyến được cấu hình dạng file vật lý (ưu tiên hơn tài nguyên tích hợp sẵn)
    /// </summary>
    [Fact]
    public void TestOptionsUsePhysicalFiles()
    {
        var options = GetRequiredService<IOptions<AbpIP2RegionOptions>>().Value;

        options.IPv4DatabaseFile.ShouldNotBe(AbpIP2RegionModule.DefaultIPv4DatabaseFile);
        options.IPv6DatabaseFile.ShouldNotBe(AbpIP2RegionModule.DefaultIPv6DatabaseFile);
        File.Exists(options.IPv4DatabaseFile).ShouldBeTrue();
        File.Exists(options.IPv6DatabaseFile).ShouldBeTrue();
    }

    /// <summary>
    /// Thư viện ngoại tuyến IPv4 / IPv6 tải từ file vật lý đều có thể truy vấn bình thường
    /// </summary>
    [Theory]
    [InlineData("114.114.114.114", "Trung Quốc|Giang Tô|Nam Kinh|0|CN")]
    [InlineData("8.8.8.8", "United States|California|0|Google LLC|US")]
    [InlineData("2001:4860:4860::8888", "United States|Florida|Miami|Google LLC|US")]
    [InlineData("2400:3200::1", "Trung Quốc|Chiết Giang|Hàng Châu|Alibaba|CN")]
    public void TestSearchFromPhysicalFile(string ip, string shouldBeRegion)
    {
        var searcher = GetRequiredService<ISearcher>();

        searcher.Search(ip).ShouldBe(shouldBeRegion);
    }

    /// <summary>
    /// Phân tích vị trí dùng quy tắc ghi chú mặc định (khi chưa cấu hình danh sách loại bỏ thì chỉ hiển thị tên quốc gia)
    /// </summary>
    [Fact]
    public async Task TestResolveLocationFromPhysicalFile()
    {
        var resolver = GetRequiredService<IIPLocationResolver>();

        var result = await resolver.ResolveAsync("223.5.5.5");

        result.Location.ShouldNotBeNull();
        result.Location.Country.ShouldBe("Trung Quốc");
        result.Location.Province.ShouldBe("Chiết Giang");
        result.Location.City.ShouldBe("Hàng Châu");
        result.Location.Remarks.ShouldBe("Trung Quốc");
    }
}

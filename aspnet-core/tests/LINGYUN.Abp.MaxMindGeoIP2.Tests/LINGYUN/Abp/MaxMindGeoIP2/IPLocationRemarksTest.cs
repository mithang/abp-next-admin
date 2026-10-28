using LINGYUN.Abp.IP.Location;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using System.Net;
using Xunit;

namespace LINGYUN.Abp.MaxMindGeoIP2;

/// <summary>
/// Kiểm tra quy tắc kết hợp Remarks (ghi chú)
/// </summary>
/// <remarks>
/// Quy tắc do LINGYUN.Abp.IP.Location xử lý thống nhất, các mô-đun phân giải vị trí (IP2Region, MaxMind) dùng chung:
/// * Tên tỉnh khớp RemoveProvince -> ghi chú chỉ dùng thành phố;
/// * Tên quốc gia khớp RemoveCountry -> ghi chú dùng kết hợp tỉnh và thành phố (tỉnh và thành phố cùng tên thì chỉ dùng thành phố);
/// * Không khớp cái nào -> ghi chú chỉ dùng tên quốc gia.
/// Khớp tên bỏ qua chữ hoa/thường và khoảng trắng đầu/cuối, áp dụng cho phân giải địa chỉ IP của mọi quốc gia.
/// </remarks>
public class IPLocationRemarksTest
{
    [Theory]
    // Chưa cấu hình gì: chỉ dùng tên quốc gia
    [InlineData("223.5.5.5", new string[0], new string[0], "Trung Quốc", "tỉnh Chiết Giang", "thành phố Hàng Châu", "Trung Quốc")]
    // Khớp tên quốc gia (Trung Quốc): kết hợp tỉnh và thành phố
    [InlineData("2400:3200::1", new[] { "Trung Quốc" }, new string[0], "Trung Quốc", "tỉnh Chiết Giang", "thành phố Hàng Châu", "tỉnh Chiết Giangthành phố Hàng Châu")]
    [InlineData("36.133.108.1", new[] { "Trung Quốc" }, new string[0], "Trung Quốc", "Trùng Khánh", "thành phố Trùng Khánh", "thành phố Trùng Khánh")]
    [InlineData("220.246.0.1", new[] { "Trung Quốc" }, new string[0], "Trung Quốc", "Đặc khu hành chính Hồng Kông", null, "Đặc khu hành chính Hồng Kông")]
    [InlineData("114.114.114.114", new[] { "Trung Quốc" }, new string[0], "Trung Quốc", null, null, null)]
    // Không khớp tên quốc gia: không bị ảnh hưởng
    [InlineData("103.151.173.211", new[] { "Trung Quốc" }, new string[0], "Nhật Bản", "Tokyo", "Tokyo", "Nhật Bản")]
    [InlineData("2a00:1450:4001:81b::200e", new[] { "Trung Quốc" }, new string[0], "Đức", "bang Hessen", "Frankfurt", "Đức")]
    // Khớp tên tỉnh: chỉ dùng thành phố (cũng áp dụng cho IP của các quốc gia khác)
    [InlineData("111.26.31.1", new string[0], new[] { "tỉnh Cát Lâm" }, "Trung Quốc", "tỉnh Cát Lâm", "thành phố Cát Lâm", "thành phố Cát Lâm")]
    [InlineData("180.76.76.76", new string[0], new[] { "thành phố Bắc Kinh" }, "Trung Quốc", "thành phố Bắc Kinh", null, null)]
    [InlineData("2001:200::1", new string[0], new[] { "Tokyo" }, "Nhật Bản", "Tokyo", "quận Shinjuku", "quận Shinjuku")]
    // Tỉnh được ưu tiên hơn quốc gia
    [InlineData("8.8.8.8", new[] { "Trung Quốc" }, new[] { "tỉnh Chiết Giang" }, "Trung Quốc", "tỉnh Chiết Giang", "thành phố Hàng Châu", "thành phố Hàng Châu")]
    public void TestRemarks(
        string ip,
        string[] removeCountry,
        string[] removeProvince,
        string country,
        string? province,
        string? city,
        string? expectedRemarks)
    {
        var services = new ServiceCollection();
        services.Configure<AbpIPLocationResolveOptions>(options =>
        {
            options.RemoveCountry = removeCountry;
            options.RemoveProvince = removeProvince;
        });

        var context = new IPLocationResolveContext(IPAddress.Parse(ip), services.BuildServiceProvider());

        var location = new TestIPLocationResolveContributor()
            .Create(context, country, province, city);

        context.IpAddress.ShouldBe(IPAddress.Parse(ip));

        location.Country.ShouldBe(country);
        location.Province.ShouldBe(province);
        location.City.ShouldBe(city);

        if (expectedRemarks == null)
        {
            location.Remarks.ShouldBeNullOrEmpty();
        }
        else
        {
            location.Remarks.ShouldBe(expectedRemarks);
        }
    }

    private sealed class TestIPLocationResolveContributor : MaxMindGeoIP2IPLocationResolveContributor
    {
        public IPLocation Create(
            IIPLocationResolveContext context,
            string? country,
            string? province,
            string? city)
        {
            return CreateIPLocation(context, country, province, city);
        }
    }
}

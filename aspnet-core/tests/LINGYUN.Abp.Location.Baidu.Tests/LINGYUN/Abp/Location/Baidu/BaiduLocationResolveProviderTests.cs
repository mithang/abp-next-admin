using Shouldly;
using System;
using System.Threading.Tasks;
using Xunit;

namespace LINGYUN.Abp.Location.Baidu
{
    public class BaiduLocationResolveProviderTests : AbpLocationBaiduTestBase
    {
        private readonly ILocationResolveProvider _provider;

        public BaiduLocationResolveProviderTests()
        {
            _provider = GetRequiredService<ILocationResolveProvider>();
            _provider.ShouldBeOfType<BaiduLocationResolveProvider>();
        }

        [Theory]
        [InlineData(39.906049, 116.398773, 1000)]
        public async Task ReGeocode_Test(double lat, double lng, int radius = 50)
        {
            var location = await _provider.ReGeocodeAsync(lat, lng, radius);

            location.ShouldNotBeNull();
            location.Address.ShouldBe("Khoảng 50 mét về phía tây bắc từ giao lộ đường Môi Thị và đường Tiền Môn Tây Hậu Hà Duyên, quận Tây Thành, Bắc Kinh");
            location.FormattedAddress.ShouldBe("Chợ Chính Dương, quận Tây Thành");

            // TODO
        }

        [Theory]
        [InlineData("Đường phía đông Quảng trường, quận Đông Thành, Bắc Kinh", "Bắc Kinh", 39.9102810304917, 116.40588509187855, "Đường bộ")]
        [InlineData("Thiên An Môn - Quầy soát vé thành lầu (lối vào)", "Bắc Kinh", 39.91573869262374, 116.40366250438577, "NoClass")]
        [InlineData("Thư viện Quốc gia (Quán cổ tịch)", "Bắc Kinh", 39.92968852456012, 116.39170686652291, "Giáo dục")]
        public async Task Geocode_Test(string address, string city, double lat, double lng, string level)
        {
            var location = await _provider.GeocodeAsync(address, city);

            location.ShouldNotBeNull();
            location.Latitude.ShouldBe(lat);
            location.Longitude.ShouldBe(lng);
            location.Level.ShouldBe(level);
            location.Pomprehension.ShouldBe(0);

            // TODO
        }

        [Theory]
        [InlineData("111.206.145.41")]
        public async Task IPGeocode_Test(string ipAddress)
        {
            var location = await _provider.IPGeocodeAsync(ipAddress);

            location.ShouldNotBeNull();
            location.Location.Latitude.ShouldBe(39.91092300415039);
            location.Location.Longitude.ShouldBe(116.41338348388672);

            // TODO
        }
    }
}

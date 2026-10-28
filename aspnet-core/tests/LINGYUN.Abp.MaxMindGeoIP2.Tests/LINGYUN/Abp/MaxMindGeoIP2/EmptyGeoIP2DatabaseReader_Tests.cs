using MaxMind.Db;
using MaxMind.GeoIP2;
using MaxMind.GeoIP2.Exceptions;
using Shouldly;
using System.Net;
using Xunit;

namespace LINGYUN.Abp.MaxMindGeoIP2;

/// <summary>
/// Trình đọc GeoIP2 rỗng
/// </summary>
/// <remarks>
/// Dùng khi không cung cấp file thư viện ngoại tuyến, tương đương với việc đọc một nội dung rỗng: mọi truy vấn đều trả về "không có dữ liệu"
/// </remarks>
public class EmptyGeoIP2DatabaseReader_Tests
{
    private readonly IGeoIP2DatabaseReader _reader = new EmptyGeoIP2DatabaseReader();

    [Fact]
    public void Should_Not_Find_Any_City()
    {
        _reader.TryCity(IPAddress.Parse("223.5.5.5"), out var response).ShouldBeFalse();
        response.ShouldBeNull();

        _reader.TryCity("223.5.5.5", out var stringResponse).ShouldBeFalse();
        stringResponse.ShouldBeNull();
    }

    [Fact]
    public void Should_Not_Find_Any_Data()
    {
        _reader.TryCountry(IPAddress.Parse("223.5.5.5"), out var country).ShouldBeFalse();
        country.ShouldBeNull();

        _reader.TryAnonymousIP(IPAddress.Parse("223.5.5.5"), out var anonymousIp).ShouldBeFalse();
        anonymousIp.ShouldBeNull();

        _reader.TryAnonymousPlus(IPAddress.Parse("223.5.5.5"), out var anonymousPlus).ShouldBeFalse();
        anonymousPlus.ShouldBeNull();

        _reader.TryAsn(IPAddress.Parse("223.5.5.5"), out var asn).ShouldBeFalse();
        asn.ShouldBeNull();

        _reader.TryConnectionType(IPAddress.Parse("223.5.5.5"), out var connectionType).ShouldBeFalse();
        connectionType.ShouldBeNull();

        _reader.TryDomain(IPAddress.Parse("223.5.5.5"), out var domain).ShouldBeFalse();
        domain.ShouldBeNull();

        _reader.TryEnterprise(IPAddress.Parse("223.5.5.5"), out var enterprise).ShouldBeFalse();
        enterprise.ShouldBeNull();

        _reader.TryIsp(IPAddress.Parse("223.5.5.5"), out var isp).ShouldBeFalse();
        isp.ShouldBeNull();
    }

    /// <summary>
    /// Các phương thức không phải Try có hành vi giống khi trình đọc thật không tìm thấy: ném AddressNotFoundException
    /// </summary>
    [Fact]
    public void Should_Throw_Address_Not_Found()
    {
        Should.Throw<AddressNotFoundException>(() => _reader.City(IPAddress.Parse("223.5.5.5")));
        Should.Throw<AddressNotFoundException>(() => _reader.City("223.5.5.5"));
        Should.Throw<AddressNotFoundException>(() => _reader.Country(IPAddress.Parse("223.5.5.5")));
        Should.Throw<AddressNotFoundException>(() => _reader.Country("223.5.5.5"));
        Should.Throw<AddressNotFoundException>(() => _reader.Asn(IPAddress.Parse("223.5.5.5")));
        Should.Throw<AddressNotFoundException>(() => _reader.Isp("223.5.5.5"));
        Should.Throw<AddressNotFoundException>(() => _reader.Enterprise(IPAddress.Parse("223.5.5.5")));
        Should.Throw<AddressNotFoundException>(() => _reader.AnonymousIP("223.5.5.5"));
        Should.Throw<AddressNotFoundException>(() => _reader.AnonymousPlus("223.5.5.5"));
        Should.Throw<AddressNotFoundException>(() => _reader.ConnectionType("223.5.5.5"));
        Should.Throw<AddressNotFoundException>(() => _reader.Domain("223.5.5.5"));
    }

    /// <summary>
    /// Trình đọc rỗng không cung cấp siêu dữ liệu cơ sở dữ liệu
    /// </summary>
    [Fact]
    public void Should_Not_Provide_Metadata()
    {
        _reader.Metadata.ShouldBeNull();
    }

    /// <summary>
    /// Tùy chọn: khi chưa chỉ định file cơ sở dữ liệu thì được xác định là không tồn tại
    /// </summary>
    [Fact]
    public void Should_Check_Database_File()
    {
        var options = new AbpMaxMindGeoIP2Options();
        options.DatabaseFileExists().ShouldBeFalse();

        options.DatabaseFile = "not-exists.mmdb";
        options.DatabaseFileExists().ShouldBeFalse();
    }
}

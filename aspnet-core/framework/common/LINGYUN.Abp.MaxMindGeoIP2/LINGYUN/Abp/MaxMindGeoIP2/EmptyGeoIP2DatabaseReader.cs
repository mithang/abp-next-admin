using MaxMind.Db;
using MaxMind.GeoIP2;
using MaxMind.GeoIP2.Exceptions;
using MaxMind.GeoIP2.Responses;
using System.Net;

namespace LINGYUN.Abp.MaxMindGeoIP2;

/// <summary>
/// Trình đọc cơ sở dữ liệu GeoIP2 rỗng
/// </summary>
/// <remarks>
/// Dùng khi không cung cấp (hoặc không tìm thấy) tệp thư viện ngoại tuyến: tương đương với việc đọc một nội dung rỗng,
/// Mọi truy vấn đều trả về "không có dữ liệu" — <c>TryXxx</c> trả về <c>false</c>, <c>Xxx</c> ném
/// <see cref="AddressNotFoundException"/>, giống hành vi khi trình đọc thật không tìm thấy kết quả, không ảnh hưởng đến luồng nghiệp vụ
/// </remarks>
public class EmptyGeoIP2DatabaseReader : IGeoIP2DatabaseReader
{
    /// <summary>
    /// Trình đọc rỗng không cung cấp siêu dữ liệu của cơ sở dữ liệu
    /// </summary>
    public virtual Metadata Metadata => null!;

    public virtual CityResponse City(IPAddress ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual CityResponse City(string ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual CountryResponse Country(IPAddress ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual CountryResponse Country(string ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual AnonymousIPResponse AnonymousIP(IPAddress ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual AnonymousIPResponse AnonymousIP(string ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual AnonymousPlusResponse AnonymousPlus(IPAddress ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual AnonymousPlusResponse AnonymousPlus(string ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual AsnResponse Asn(IPAddress ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual AsnResponse Asn(string ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual ConnectionTypeResponse ConnectionType(IPAddress ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual ConnectionTypeResponse ConnectionType(string ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual DomainResponse Domain(IPAddress ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual DomainResponse Domain(string ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual EnterpriseResponse Enterprise(IPAddress ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual EnterpriseResponse Enterprise(string ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual IspResponse Isp(IPAddress ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual IspResponse Isp(string ipAddress) => throw CreateNotFoundException(ipAddress);

    public virtual bool TryCity(IPAddress ipAddress, out CityResponse response) => TryGet(out response);

    public virtual bool TryCity(string ipAddress, out CityResponse response) => TryGet(out response);

    public virtual bool TryCountry(IPAddress ipAddress, out CountryResponse response) => TryGet(out response);

    public virtual bool TryCountry(string ipAddress, out CountryResponse response) => TryGet(out response);

    public virtual bool TryAnonymousIP(IPAddress ipAddress, out AnonymousIPResponse response) => TryGet(out response);

    public virtual bool TryAnonymousIP(string ipAddress, out AnonymousIPResponse response) => TryGet(out response);

    public virtual bool TryAnonymousPlus(IPAddress ipAddress, out AnonymousPlusResponse response) => TryGet(out response);

    public virtual bool TryAnonymousPlus(string ipAddress, out AnonymousPlusResponse response) => TryGet(out response);

    public virtual bool TryAsn(IPAddress ipAddress, out AsnResponse response) => TryGet(out response);

    public virtual bool TryAsn(string ipAddress, out AsnResponse response) => TryGet(out response);

    public virtual bool TryConnectionType(IPAddress ipAddress, out ConnectionTypeResponse response) => TryGet(out response);

    public virtual bool TryConnectionType(string ipAddress, out ConnectionTypeResponse response) => TryGet(out response);

    public virtual bool TryDomain(IPAddress ipAddress, out DomainResponse response) => TryGet(out response);

    public virtual bool TryDomain(string ipAddress, out DomainResponse response) => TryGet(out response);

    public virtual bool TryEnterprise(IPAddress ipAddress, out EnterpriseResponse response) => TryGet(out response);

    public virtual bool TryEnterprise(string ipAddress, out EnterpriseResponse response) => TryGet(out response);

    public virtual bool TryIsp(IPAddress ipAddress, out IspResponse response) => TryGet(out response);

    public virtual bool TryIsp(string ipAddress, out IspResponse response) => TryGet(out response);

    /// <summary>
    /// Mọi truy vấn đều không có dữ liệu
    /// </summary>
    protected virtual bool TryGet<TResponse>(out TResponse response)
        where TResponse : class
    {
        response = null!;

        return false;
    }

    protected virtual AddressNotFoundException CreateNotFoundException(object? ipAddress)
    {
        return new AddressNotFoundException($"The MaxMind GeoIP2 database is empty, no data for {ipAddress}.");
    }
}

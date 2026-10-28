using LINGYUN.Abp.IP.Location;
using MaxMind.GeoIP2;
using MaxMind.GeoIP2.Model;
using MaxMind.GeoIP2.Responses;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Globalization;
using System.Threading.Tasks;

namespace LINGYUN.Abp.MaxMindGeoIP2;

/// <summary>
/// Trình đóng góp phân giải vị trí MaxMind GeoIP2
/// </summary>
/// <remarks>
public class MaxMindGeoIP2IPLocationResolveContributor : IPLocationResolveContributorBase
{
    public const string ContributorName = "MaxMindGeoIP2";
    public override string Name => ContributorName;

    public override Task ResolveAsync(IIPLocationResolveContext context)
    {
        var reader = context.ServiceProvider.GetRequiredService<IGeoIP2DatabaseReader>();

        CityResponse? response;
        try
        {
            if (!reader.TryCity(context.IpAddress, out response) || response == null)
            {
                // Các địa chỉ mạng nội bộ, địa chỉ dự trữ và địa chỉ chưa được thu thập không có bản ghi trong cơ sở dữ liệu ngoại tuyến
                context.Location = new IPLocation();

                return Task.CompletedTask;
            }
        }
        catch (Exception exception)
        {
            // Lỗi đọc cơ sở dữ liệu ngoại tuyến (ví dụ tệp bị hỏng) không chặn nghiệp vụ; sau khi ghi nhật ký sẽ trả về dạng không có dữ liệu
            context.ServiceProvider
                .GetService<ILogger<MaxMindGeoIP2IPLocationResolveContributor>>()
                ?.LogWarning(exception, "Failed to query the MaxMind GeoIP2 database for {IpAddress}.", context.IpAddress);

            context.Location = new IPLocation();

            return Task.CompletedTask;
        }

        context.Location = CreateIPLocation(
            context,
            GetName(response.Country),
            GetName(response.MostSpecificSubdivision),
            GetName(response.City));

        return Task.CompletedTask;
    }

    /// <summary>
    /// Lấy tên của culture hiện tại; khi không có culture tương ứng thì quay về <see cref="NamedEntity.Name"/>
    /// </summary>
    protected virtual string? GetName(NamedEntity? entity)
    {
        if (entity == null)
        {
            return null;
        }

        var culture = CultureInfo.CurrentUICulture;

        // Trước tiên khớp theo tên culture đầy đủ (ví dụ zh-CN), sau đó khớp theo tên ngôn ngữ (ví dụ zh), cuối cùng quay về tên mặc định của cơ sở dữ liệu ngoại tuyến
        var name = GetNameByCulture(entity, culture.Name)
            ?? GetNameByCulture(entity, culture.TwoLetterISOLanguageName)
            ?? entity.Name;

        return Normalize(name);
    }

    /// <summary>
    /// Từ <see cref="NamedEntity.Names"/> lấy tên của culture được chỉ định (khóa không phân biệt chữ hoa/thường)
    /// </summary>
    protected virtual string? GetNameByCulture(NamedEntity entity, string? culture)
    {
        if (culture.IsNullOrWhiteSpace() || entity.Names == null)
        {
            return null;
        }

        if (entity.Names.TryGetValue(culture!, out var name))
        {
            return name;
        }

        foreach (var item in entity.Names)
        {
            if (item.Key.Contains(culture, StringComparison.OrdinalIgnoreCase))
            {
                return item.Value;
            }
        }

        return null;
    }

    private static string? Normalize(string? value)
    {
        return value.IsNullOrWhiteSpace() || string.Equals(value, "0", StringComparison.Ordinal)
            ? null
            : value;
    }
}

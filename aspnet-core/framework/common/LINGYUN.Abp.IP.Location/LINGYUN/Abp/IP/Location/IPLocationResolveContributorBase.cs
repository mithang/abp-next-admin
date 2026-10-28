using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace LINGYUN.Abp.IP.Location;
public abstract class IPLocationResolveContributorBase : IIPLocationResolveContributor
{
    public abstract string Name { get; }

    public abstract Task ResolveAsync(IIPLocationResolveContext context);

    /// <summary>
    /// Được tạo từ quốc gia/tỉnh/thành phố <see cref="IPLocation"/>, và tạo ghi chú (Remarks) theo <see cref="AbpIPLocationResolveOptions"/>
    /// </summary>
    /// <remarks>
    /// Quy tắc ghi chú dùng chung cho các contributor phân giải vị trí IP (so khớp tên không phân biệt chữ hoa/thường và khoảng trắng đầu/cuối, áp dụng cho việc phân giải địa chỉ IP của mọi quốc gia):
    /// * Khi tên tỉnh khớp với <see cref="AbpIPLocationResolveOptions.RemoveProvince"/> thì tỉnh sẽ bị loại khỏi ghi chú, ghi chú dùng thành phố (ví dụ: thành phố Hàng Châu);
    /// * Khi tên quốc gia khớp với <see cref="AbpIPLocationResolveOptions.RemoveCountry"/> thì quốc gia sẽ bị loại khỏi ghi chú,
    ///   ghi chú dùng tổ hợp tỉnh và thành phố (khi tỉnh và thành phố cùng tên thì chỉ dùng thành phố, ví dụ: thành phố Trùng Khánh; khi chỉ có tỉnh thì dùng tỉnh, ví dụ: Đặc khu hành chính Hồng Kông);
    /// * Khi đều không khớp, ghi chú dùng tên quốc gia (ví dụ: Trung Quốc, Nhật Bản, Mỹ);
    /// * Khi tên đã khớp bị loại bỏ mà không còn cấp nào để hiển thị, ghi chú sẽ trống.
    /// </remarks>
    protected virtual IPLocation CreateIPLocation(
        IIPLocationResolveContext context,
        string? country = null,
        string? province = null,
        string? city = null)
    {
        var options = context.ServiceProvider.GetRequiredService<IOptions<AbpIPLocationResolveOptions>>().Value;

        var ipLocation = new IPLocation(country, province, city);

        // Khi khớp với tên đã cấu hình, cấp tương ứng sẽ bị loại khỏi ghi chú
        var useCountry = !IsExcluded(options.RemoveCountry, country);
        var useProvince = !IsExcluded(options.RemoveProvince, province);

        // 220.246.0.0|220.246.255.255|Trung Quốc|Hồng Kông|0|PCCW
        if (!useProvince)
        {
            // Tên tỉnh khớp với danh sách loại bỏ: ghi chú dùng thành phố (ví dụ: thành phố Hàng Châu)
            ipLocation.Remarks = string.IsNullOrWhiteSpace(city) ? null : city;
        }
        // 36.133.232.0|36.133.239.255|Trung Quốc|Trùng Khánh|thành phố Trùng Khánh|China Mobile
        else if (!useCountry)
        {
            // Tên quốc gia khớp với danh sách loại bỏ: ghi chú dùng tổ hợp tỉnh và thành phố
            if (!string.IsNullOrWhiteSpace(province) &&
                !string.IsNullOrWhiteSpace(city))
            {
                if (province!.Length <= city!.Length &&
                    city.StartsWith(province, StringComparison.InvariantCultureIgnoreCase))
                {
                    // thành phố Trùng Khánh
                    ipLocation.Remarks = city;
                }
                // 111.26.31.0|111.26.31.127|Trung Quốc|tỉnh Cát Lâm|thành phố Cát Lâm|China Mobile
                else
                {
                    // tỉnh Cát Lâm thành phố Cát Lâm
                    ipLocation.Remarks = $"{province}{city}";
                }
            }
            // 220.246.0.0|220.246.255.255|Trung Quốc|Đặc khu hành chính Hồng Kông|0
            else if (!string.IsNullOrWhiteSpace(province))
            {
                // Đặc khu hành chính Hồng Kông
                ipLocation.Remarks = province;
            }
            else if (!string.IsNullOrWhiteSpace(city))
            {
                ipLocation.Remarks = city;
            }
            else
            {
                // Tên đã khớp đã bị loại khỏi ghi chú (ví dụ: khi chỉ có "Trung Quốc" thì ghi chú trống)
                ipLocation.Remarks = null;
            }
        }
        // 103.151.173.0|103.151.173.255|Nhật Bản|Tokyo|Tokyo|mạng IKUUU
        else
        {
            // Nhật Bản / Mỹ / Đức (khi không khớp danh sách loại bỏ thì chỉ dùng tên quốc gia)
            ipLocation.Remarks = country;
        }

        return ipLocation;
    }

    /// <summary>
    /// Tên có khớp với danh sách loại bỏ hay không (không phân biệt chữ hoa/thường và khoảng trắng đầu/cuối)
    /// </summary>
    protected virtual bool IsExcluded(string[] names, string? name)
    {
        if (names == null || names.Length == 0 || string.IsNullOrWhiteSpace(name))
        {
            return false;
        }

        foreach (var item in names)
        {
            if (!string.IsNullOrWhiteSpace(item) &&
                string.Equals(item.Trim(), name!.Trim(), StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }
}

using IP2Region.Net.XDB;

namespace LINGYUN.Abp.IP2Region;

/// <summary>
/// Tùy chọn IP2Region
/// </summary>
public class AbpIP2RegionOptions
{
    /// <summary>
    /// Tệp cơ sở dữ liệu IPv4
    /// </summary>
    /// <remarks>
    /// Hỗ trợ đường dẫn tệp vật lý và đường dẫn hệ thống tệp ảo (mặc định dùng tài nguyên tích hợp sẵn ip2region_v4.xdb):
    /// * Khi truyền đường dẫn tệp vật lý, ưu tiên tải theo tệp vật lý để tiện thay thế/cập nhật thư viện ngoại tuyến;
    /// * Ngược lại, đọc tài nguyên tích hợp sẵn từ hệ thống tệp ảo.
    /// </remarks>
    public string IPv4DatabaseFile { get; set; } = AbpIP2RegionModule.DefaultIPv4DatabaseFile;

    /// <summary>
    /// Tệp cơ sở dữ liệu IPv6
    /// </summary>
    /// <remarks>
    /// Giống <see cref="IPv4DatabaseFile"/> (ưu tiên tệp vật lý);
    /// Thư viện ngoại tuyến IPv6 là tùy chọn, khi tệp không tồn tại truy vấn IPv6 trả về null.
    /// </remarks>
    public string IPv6DatabaseFile { get; set; } = AbpIP2RegionModule.DefaultIPv6DatabaseFile;

    /// <summary>
    /// Chính sách bộ nhớ đệm
    /// </summary>
    /// <remarks>
    /// Mặc định <see cref="CachePolicy.Content"/>: tải toàn bộ thư viện ngoại tuyến vào bộ nhớ rồi mới truy vấn, là chính sách **an toàn đồng thời**
    /// (thư viện IPv4 khoảng 10MB, thư viện IPv6 khoảng 35MB).
    /// 
    /// <see cref="CachePolicy.File"/> và <see cref="CachePolicy.VectorIndex"/> được triển khai dựa trên "luồng dữ liệu dùng chung + Seek",
    /// trong khi <c>ISearcher</c> được đăng ký dạng singleton, truy vấn đồng thời đa luồng sẽ làm gián đoạn lẫn nhau vị trí luồng dữ liệu,
    /// chỉ dùng khi có thể đảm bảo truy vấn tuần tự (hoặc tự đảm bảo an toàn luồng).
    /// </remarks>
    public CachePolicy CachePolicy { get; set; } = CachePolicy.Content;
}

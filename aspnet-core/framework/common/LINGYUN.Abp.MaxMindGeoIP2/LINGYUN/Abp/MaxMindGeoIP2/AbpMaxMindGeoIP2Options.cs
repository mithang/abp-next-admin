using MaxMind.Db;
using System;
using System.IO;

namespace LINGYUN.Abp.MaxMindGeoIP2;

/// <summary>
/// Tùy chọn MaxMind GeoIP2
/// </summary>
public class AbpMaxMindGeoIP2Options
{
    /// <summary>
    /// Đường dẫn vật lý của tệp cơ sở dữ liệu GeoIP2 (mmdb)
    /// </summary>
    /// <remarks>
    /// Cần do bên sử dụng cung cấp:
    /// * Mô-đun này **không còn tích hợp sẵn** thư viện ngoại tuyến GeoLite2 (GeoLite2 chịu ràng buộc giấy phép của MaxMind, không được phân phối kèm gói),
    ///   vui lòng tự tải xuống từ MaxMind và chấp nhận thỏa thuận giấy phép của họ (https://www.maxmind.com/en/geolite2/eula);
    /// * Trỏ tới <c>GeoLite2-City.mmdb</c> đã giải nén thông qua mục cấu hình <c>MaxMindGeoIP2:DatabaseFile</c> (hoặc tại đây);
    /// * Khi tệp không tồn tại sẽ dùng <see cref="EmptyGeoIP2DatabaseReader"/>, kết quả phân tích rỗng và ghi nhật ký cảnh báo.
    /// </remarks>
    public string DatabaseFile { get; set; } = string.Empty;

    /// <summary>
    /// Chế độ truy cập tệp cơ sở dữ liệu vật lý
    /// </summary>
    /// <remarks>
    /// Mặc định là <see cref="FileAccessMode.MemoryMapped"/> (ánh xạ bộ nhớ), trình truy vấn là singleton và an toàn luồng
    /// </remarks>
    public FileAccessMode FileAccessMode { get; set; } = FileAccessMode.MemoryMapped;

    /// <summary>
    /// Tệp cơ sở dữ liệu có tồn tại hay không
    /// </summary>
    public virtual bool DatabaseFileExists()
    {
        return !DatabaseFile.IsNullOrWhiteSpace() && File.Exists(DatabaseFile);
    }
}

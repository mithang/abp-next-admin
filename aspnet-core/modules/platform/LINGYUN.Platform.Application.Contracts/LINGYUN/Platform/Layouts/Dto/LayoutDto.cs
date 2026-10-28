using LINGYUN.Platform.Routes;
using System;

namespace LINGYUN.Platform.Layouts;

public class LayoutDto : RouteDto
{
    /// <summary>
    /// Khung làm việc
    /// </summary>
    public string Framework { get; set; } = default!;
    /// <summary>
    /// Meta theo quy ước dùng loại từ điển dữ liệu nào, chủ yếu để ràng buộc tính nhất quán của các trường bắt buộc trong định tuyến
    /// </summary>
    public Guid DataId { get; set; }
}

using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Platform.Routes;

public class RouteDto : EntityDto<Guid>
{
    /// <summary>
    /// Đường dẫn
    /// </summary>
    public string Path { get; set; } = default!;
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    public string DisplayName { get; set; } = default!;
    /// <summary>
    /// Mô tả
    /// </summary>
    public string? Description { get; set; }
    /// <summary>
    /// Đường dẫn chuyển hướng
    /// </summary>
    public string? Redirect { get; set; }
    /// <summary>
    /// Một số phần tử phụ trợ của route, phụ thuộc vào thiết kế của từ điển dữ liệu
    /// </summary>
    public Dictionary<string, object> Meta { get; set; } = new Dictionary<string, object>();
}

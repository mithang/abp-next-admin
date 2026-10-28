using LINGYUN.Platform.Routes;
using System.Collections.Generic;

namespace LINGYUN.Platform.Menus;

public class MenuItemDto : RouteDto
{
    /// <summary>
    /// Số hiệu menu
    /// </summary>
    public string Code { get; set; } = default!;
    /// <summary>
    /// Thành phần menu
    /// </summary>
    public string Component { get; set; } = default!;
    /// <summary>
    /// Danh sách menu con
    /// </summary>
    public List<MenuItemDto> Children { get; set; } = new List<MenuItemDto>();
}

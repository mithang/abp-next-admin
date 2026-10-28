using LINGYUN.Platform.Routes;
using System;
using System.Collections.Generic;

namespace LINGYUN.Platform.Menus;

public class MenuDto : RouteDto
{
    /// <summary>
    /// Mã menu
    /// </summary>
    public string Code { get; set; } = default!;
    /// <summary>
    /// Trang bố cục menu
    /// </summary>
    public string Component { get; set; } = default!;
    /// <summary>
    /// Framework
    /// </summary>
    public string Framework { get; set; } = default!;
    /// <summary>
    /// Nút cha
    /// </summary>
    public Guid? ParentId { get; set; }
    /// <summary>
    /// Định danh bố cục trực thuộc
    /// </summary>
    public Guid LayoutId { get; set; }

    public bool IsPublic { get; set; }
    public bool Startup { get; set; }
}

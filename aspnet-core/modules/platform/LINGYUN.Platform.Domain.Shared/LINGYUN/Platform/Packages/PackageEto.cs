using System;
using Volo.Abp.EventBus;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Platform.Packages;

[EventName("platform.packages")]
public class PackageEto
{
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Phiên bản
    /// </summary>
    public string Version { get; set; } = default!;
    /// <summary>
    /// Cập nhật bắt buộc
    /// </summary>
    public bool ForceUpdate { get; set; }
    public PackageLevel Level { get; set; }
}

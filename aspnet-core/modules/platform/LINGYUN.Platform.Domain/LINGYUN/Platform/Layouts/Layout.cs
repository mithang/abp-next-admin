using JetBrains.Annotations;
using LINGYUN.Platform.Routes;
using System;

namespace LINGYUN.Platform.Layouts;

/// <summary>
/// Thực thể khung nhìn bố cục
/// </summary>
public class Layout : Route
{
    /// <summary>
    /// Khung
    /// </summary>
    public virtual string Framework { get; protected set; } = default!;
    /// <summary>
    /// Meta đã thỏa thuận dùng loại từ điển dữ liệu nào, chủ yếu để ràng buộc tính nhất quán của các trường bắt buộc của route
    /// </summary>
    public virtual Guid DataId { get; protected set; }

    protected Layout() { }

    public Layout(
        [NotNull] Guid id, 
        [NotNull] string path, 
        [NotNull] string name,
        [NotNull] string displayName,
        [NotNull] Guid dataId,
        [NotNull] string framework,
        [CanBeNull] string? redirect = null,
        [CanBeNull] string? description = null,
        [CanBeNull] Guid? tenantId = null) 
        : base(id, path, name, displayName, redirect, description, tenantId)
    {
        DataId = dataId;
        Framework = framework;
    }
}

using JetBrains.Annotations;
using LINGYUN.Platform.Routes;
using System;
using Volo.Abp;

namespace LINGYUN.Platform.Menus;

/// <summary>
/// Menu
/// </summary>
public class Menu : Route
{
    /// <summary>
    /// Framework
    /// </summary>
    public virtual string Framework { get; set; } = default!;
    /// <summary>
    /// Mã menu
    /// </summary>
    public virtual string Code { get; set; } = default!;
    /// <summary>
    /// Trang bố cục của menu, đường dẫn của Layout
    /// </summary>
    public virtual string Component { get; set; } = default!;
    /// <summary>
    /// Menu cha mà nó thuộc về
    /// </summary>
    public virtual Guid? ParentId { get; set; }
    /// <summary>
    /// Định danh bố cục mà nó thuộc về
    /// </summary>
    public virtual Guid LayoutId { get; set; }
    /// <summary>
    /// Menu công khai
    /// </summary>
    public virtual bool IsPublic { get; set; }
    protected Menu() 
    {
    }

    public Menu(
        [NotNull] Guid id,
        [NotNull] Guid layoutId,
        [NotNull] string path, 
        [NotNull] string name,
        [NotNull] string code,
        [NotNull] string component,
        [NotNull] string displayName,
        [NotNull] string framework,
        string? redirect = null,
        string? description = null,
        Guid? parentId = null,
        Guid? tenantId = null) 
        : base(id, path, name, displayName, redirect, description, tenantId)
    {
        Check.NotNullOrWhiteSpace(code, nameof(code));

        LayoutId = layoutId;
        Code = code;
        Component = component;// Component của menu cấp một trực thuộc phải là trang bố cục, ví dụ component: Layout trong vue-admin, các framework frontend khác tương tự, tại đây cần truyền đường dẫn của trang bố cục để frontend import
        Framework = framework;
        ParentId = parentId;

        IsPublic = false;
    }
}

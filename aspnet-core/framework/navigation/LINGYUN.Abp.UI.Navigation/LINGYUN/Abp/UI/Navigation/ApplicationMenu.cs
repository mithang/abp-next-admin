using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.UI.Navigation;

public class ApplicationMenu : IHasMenuItems, IHasExtraProperties
{
    public const int DefaultOrder = 1000;
    /// <summary>
    /// Tên
    /// </summary>
    [NotNull] 
    public string Name { get; }
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    [NotNull] 
    public string DisplayName { get; }
    /// <summary>
    /// Mô tả
    /// </summary>
    [CanBeNull]
    public string? Description { get; }
    /// <summary>
    /// Đường dẫn
    /// </summary>
    [NotNull]
    public string Url { get; }
    /// <summary>
    /// Thành phần
    /// </summary>
    [CanBeNull]
    public string? Component { get;  }
    /// <summary>
    /// Chuyển hướng
    /// </summary>
    [CanBeNull]
    public string? Redirect { get; }
    /// <summary>
    /// Biểu tượng
    /// </summary>
    [CanBeNull] 
    public string? Icon { get; set; }
    /// <summary>
    /// Thứ tự sắp xếp
    /// </summary>
    public int Order { get; set; }
    /// <summary>
    /// Có bị vô hiệu hóa hay không
    /// </summary>
    public bool IsDisabled { get; set; }
    /// <summary>
    /// Có hiển thị hay không
    /// </summary>
    public bool IsVisible { get; set; }

    [NotNull]
    public ApplicationMenuList Items { get; }

    public bool IsLeaf => Items.IsNullOrEmpty();

    [NotNull]
    public ExtraPropertyDictionary ExtraProperties { get; }

    public MultiTenancySides MultiTenancySides { get; }

    public ApplicationMenu(
        [NotNull] string name,
        [NotNull] string displayName,
        [NotNull] string url,
        [CanBeNull] string component,
        string? description = null,
        string? icon = null,
        string? redirect = null,
        int order = DefaultOrder,
        MultiTenancySides multiTenancySides = MultiTenancySides.Both)
    {
        Check.NotNullOrWhiteSpace(name, nameof(name));
        Check.NotNullOrWhiteSpace(displayName, nameof(displayName));

        Check.NotNullOrWhiteSpace(url, nameof(url));

        Name = name;
        DisplayName = displayName;
        Url = url;
        Component = component;
        Description = description;
        Icon = icon;
        Redirect = redirect ?? "";
        Order = order;
        MultiTenancySides = multiTenancySides;

        Items = new ApplicationMenuList();
        ExtraProperties = new ExtraPropertyDictionary();
        this.SetDefaultsForExtraProperties();
    }

    public ApplicationMenu AddItem([NotNull] ApplicationMenu menuItem)
    {
        Items.Add(menuItem);
        return menuItem;
    }

    public ApplicationMenu WithRoles(string[] roles)
    {
        this.SetProperty("roles", roles.JoinAsString(";"));
        return this;
    }

    public string[] GetRoles()
    {
        var roles = this.GetProperty<string>("roles") ?? "";

        return roles.Split(";");
    }

    public override string ToString()
    {
        return $"[ApplicationMenu] Name = {Name}";
    }
}

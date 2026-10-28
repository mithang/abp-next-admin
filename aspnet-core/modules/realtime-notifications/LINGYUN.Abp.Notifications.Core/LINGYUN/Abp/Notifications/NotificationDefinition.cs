using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Localization;
using Volo.Abp.TextTemplating;

/*
 * 2020-10-29 Tái cấu trúc thông báo
 * INotificationSender chỉ định người nhận, chỉ khi không chỉ định mới truy vấn tất cả người dùng đã đăng ký, nếu đã chỉ định nhà phát hành thì phát hành trực tiếp (kiểm tra đã đăng ký hay chưa)
 */

namespace LINGYUN.Abp.Notifications;

public class NotificationDefinition
{
    /// <summary>
    /// Tên thông báo
    /// </summary>
    [NotNull]
    public string Name { get; set; }
    /// <summary>
    /// Tên hiển thị của thông báo
    /// </summary>
    [NotNull]
    public ILocalizableString DisplayName
    {
        get => _displayName;
        set => _displayName = Check.NotNull(value, nameof(value));
    }
    private ILocalizableString _displayName = default!;
    /// <summary>
    /// Mô tả thông báo
    /// </summary>
    [CanBeNull]
    public ILocalizableString? Description { get; set; }
    /// <summary>
    /// Cho phép client hiển thị đăng ký
    /// </summary>
    public bool AllowSubscriptionToClients { get; set; }
    /// <summary>
    /// Loại vòng đời
    /// </summary>
    public NotificationLifetime NotificationLifetime { get; set; }
    /// <summary>
    /// Loại thông báo
    /// </summary>
    public NotificationType NotificationType { get; set; }
    /// <summary>
    /// Loại nội dung thông báo
    /// </summary>
    public NotificationContentType ContentType { get; set; }
    /// <summary>
    /// Nhà cung cấp thông báo
    /// </summary>
    public List<string> Providers { get; }
    /// <summary>
    /// Mẫu thông báo
    /// </summary>
    public TemplateDefinition? Template { get; private set; }
    /// <summary>
    /// Thuộc tính bổ sung
    /// </summary>
    [NotNull]
    public Dictionary<string, object?> Properties { get; }

    public object? this[string name] {
        get => Properties.GetOrDefault(name);
        set => Properties[name] = value;
    }

    public NotificationDefinition(
       string name,
       ILocalizableString? displayName = null,
       ILocalizableString? description = null,
       NotificationType notificationType = NotificationType.Application,
       NotificationLifetime lifetime = NotificationLifetime.Persistent,
       NotificationContentType contentType = NotificationContentType.Text,
       bool allowSubscriptionToClients = false)
    {
        Name = name;
        DisplayName = displayName ?? new FixedLocalizableString(name);
        Description = description;
        NotificationLifetime = lifetime;
        NotificationType = notificationType;
        ContentType = contentType;
        AllowSubscriptionToClients = allowSubscriptionToClients;

        Providers = new List<string>();
        Properties = new Dictionary<string, object?>();
    }

    public virtual NotificationDefinition WithProviders(params string[] providers)
    {
        if (!providers.IsNullOrEmpty())
        {
            Providers.AddIfNotContains(providers);
        }

        return this;
    }

    public virtual NotificationDefinition WithTemplate(
        Type localizationResource, 
        bool isLayout = false, 
        string? layout = null, 
        string? defaultCultureName = null)
    {
        Template = new TemplateDefinition(
            Name,
            localizationResource,
            DisplayName,
            isLayout,
            layout,
            defaultCultureName);

        return this;
    }

    public virtual NotificationDefinition WithTemplate(Action<TemplateDefinition> setup)
    {
        if (Template != null)
        {
            setup(Template);
        }
        else
        {
            var template = new TemplateDefinition(Name);
            setup(template);

            Template = template;
        }

        return this;
    }

    public virtual NotificationDefinition WithTemplate(TemplateDefinition? template)
    {
        Template = template;

        return this;
    }

    public virtual NotificationDefinition WithProperty(string key, object value)
    {
        Properties[key] = value;
        return this;
    }

    public override string ToString()
    {
        return $"[{nameof(NotificationDefinition)} {Name}]";
    }
}

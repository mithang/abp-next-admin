using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;

namespace LINGYUN.Abp.Notifications;

public class NotificationDefinitionRecord : BasicAggregateRoot<Guid>, IHasExtraProperties
{
    /// <summary>
    /// Tên
    /// </summary>
    public virtual string Name { get; set; } = default!;
    /// <summary>
    /// Tên nhóm
    /// </summary>
    public virtual string GroupName { get; set; } = default!;
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    /// <remarks>
    /// Nếu để trống, sẽ dùng Name thay thế
    /// </remarks>
    public virtual string? DisplayName { get; set; }
    /// <summary>
    /// Mô tả
    /// </summary>
    /// <remarks>
    /// Nếu để trống, sẽ dùng Name thay thế
    /// </remarks>
    public virtual string? Description { get; set; }
    /// <summary>
    /// Mẫu thông báo
    /// </summary>
    public virtual string? Template { get; set; }
    /// <summary>
    /// Vòng đời thông báo
    /// </summary>
    public virtual NotificationLifetime NotificationLifetime { get; set; }
    /// <summary>
    /// Loại thông báo
    /// </summary>
    public virtual NotificationType NotificationType { get; set; }
    /// <summary>
    /// Loại nội dung thông báo
    /// </summary>
    public virtual NotificationContentType ContentType { get; set; }
    /// <summary>
    /// Nhà cung cấp thông báo
    /// </summary>
    /// <remarks>
    /// Nhiều giá trị phân tách bằng ;
    /// </remarks>
    public virtual string? Providers { get; set; }
    /// <summary>
    /// Cho phép client đăng ký
    /// </summary>
    public virtual bool AllowSubscriptionToClients { get; set; }
    public ExtraPropertyDictionary ExtraProperties { get; protected set; }

    public NotificationDefinitionRecord()
    {
        ExtraProperties = new ExtraPropertyDictionary();
        this.SetDefaultsForExtraProperties();
    }

    public NotificationDefinitionRecord(
        Guid id,
        string name,
        string groupName,
        string? displayName = null,
        string? description = null,
        string? template = null,
        NotificationLifetime lifetime = NotificationLifetime.Persistent,
        NotificationType notificationType = NotificationType.Application,
        NotificationContentType contentType = NotificationContentType.Text)
        : base(id)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), NotificationDefinitionRecordConsts.MaxNameLength);
        GroupName = Check.NotNullOrWhiteSpace(groupName, nameof(groupName), NotificationDefinitionGroupRecordConsts.MaxNameLength);
        DisplayName = Check.Length(displayName, nameof(displayName), NotificationDefinitionRecordConsts.MaxDisplayNameLength);
        Description = Check.Length(description, nameof(description), NotificationDefinitionRecordConsts.MaxDescriptionLength);
        Template = Check.Length(template, nameof(template), NotificationDefinitionRecordConsts.MaxTemplateLength);
        NotificationLifetime = lifetime;
        NotificationType = notificationType;
        ContentType = contentType;

        ExtraProperties = new ExtraPropertyDictionary();
        this.SetDefaultsForExtraProperties();

        AllowSubscriptionToClients = true;
    }

    public bool HasSameData(NotificationDefinitionRecord otherRecord)
    {
        if (Name != otherRecord.Name)
        {
            return false;
        }

        if (GroupName != otherRecord.GroupName)
        {
            return false;
        }

        if (DisplayName != otherRecord.DisplayName)
        {
            return false;
        }

        if (Description != otherRecord.Description)
        {
            return false;
        }

        if (Providers != otherRecord.Providers)
        {
            return false;
        }

        if (Template != otherRecord.Template)
        {
            return false;
        }

        if (ContentType != otherRecord.ContentType)
        {
            return false;
        }

        if (NotificationLifetime != otherRecord.NotificationLifetime)
        {
            return false;
        }

        if (NotificationType != otherRecord.NotificationType)
        {
            return false;
        }

        if (AllowSubscriptionToClients != otherRecord.AllowSubscriptionToClients)
        {
            return false;
        }

        if (!this.HasSameExtraProperties(otherRecord))
        {
            return false;
        }

        return true;
    }

    public void Patch(NotificationDefinitionRecord otherRecord)
    {
        if (Name != otherRecord.Name)
        {
            Name = otherRecord.Name;
        }

        if (GroupName != otherRecord.GroupName)
        {
            GroupName = otherRecord.GroupName;
        }

        if (DisplayName != otherRecord.DisplayName)
        {
            DisplayName = otherRecord.DisplayName;
        }

        if (Description != otherRecord.Description)
        {
            Description = otherRecord.Description;
        }

        if (Providers != otherRecord.Providers)
        {
            Providers = otherRecord.Providers;
        }

        if (Template != otherRecord.Template)
        {
            Template = otherRecord.Template;
        }

        if (ContentType != otherRecord.ContentType)
        {
            ContentType = otherRecord.ContentType;
        }

        if (NotificationLifetime != otherRecord.NotificationLifetime)
        {
            NotificationLifetime = otherRecord.NotificationLifetime;
        }

        if (NotificationType != otherRecord.NotificationType)
        {
            NotificationType = otherRecord.NotificationType;
        }

        if (AllowSubscriptionToClients != otherRecord.AllowSubscriptionToClients)
        {
            AllowSubscriptionToClients = otherRecord.AllowSubscriptionToClients;
        }

        if (!this.HasSameExtraProperties(otherRecord))
        {
            ExtraProperties.Clear();

            foreach (var property in otherRecord.ExtraProperties)
            {
                ExtraProperties.Add(property.Key, property.Value);
            }
        }
    }
}

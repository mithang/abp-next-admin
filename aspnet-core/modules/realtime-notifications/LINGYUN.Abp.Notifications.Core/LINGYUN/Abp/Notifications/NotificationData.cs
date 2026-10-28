using LINGYUN.Abp.RealTime.Localization;
using System;
using System.Globalization;
using Volo.Abp.Data;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.Notifications;

/// <summary>
/// Dữ liệu thông báo
/// </summary>
/// <remarks>
/// TODO: 2020-10-29 Đối với người dùng dùng ngôn ngữ khác nhau, việc bản địa hoá ngôn ngữ ngay tại thời điểm phát hành là thiết kế sai
/// Thiết kế tiêu đề và nội dung thông báo thành <see cref="LocalizableStringInfo"/> để phía client tự bản địa hoá
/// </remarks>
[Serializable]
[EventName("notifications")]
public class NotificationData : IHasExtraProperties
{
    /// <summary>
    /// Dùng để xác định thông tin có cần bản địa hoá hay không
    /// </summary>
    public const string LocalizerKey = "L";
    /// <summary>
    /// Dùng cho culture bản địa hoá
    /// </summary>
    public const string CultureKey = "C";

    public virtual string Type => GetType().FullName!;

    public object? this[string key]
    {
        get
        {
            return this.GetProperty(key);
        }
        set
        {
            this.SetProperty(key, value);
        }
    }

    public ExtraPropertyDictionary ExtraProperties { get; set; } = default!;

    public NotificationData()
    {
        ExtraProperties = new ExtraPropertyDictionary();
        this.SetDefaultsForExtraProperties();

        TrySetData(LocalizerKey, false);
    }
    /// <summary>
    /// Ghi dữ liệu thông báo đã bản địa hoá
    /// </summary>
    /// <param name="title"></param>
    /// <param name="message"></param>
    /// <param name="createTime"></param>
    /// <param name="formUser"></param>
    /// <param name="description"></param>
    /// <returns></returns>
    public NotificationData WriteLocalizedData(
        LocalizableStringInfo title,
        LocalizableStringInfo message,
        DateTime createTime,
        string formUser,
        LocalizableStringInfo? description = null,
        string? culture = null)
    {
        TrySetData("title", title);
        TrySetData("message", message);
        TrySetData("formUser", formUser);
        TrySetData("createTime", createTime);
        TrySetData(LocalizerKey, true);
        TrySetData(CultureKey, culture ?? CultureInfo.CurrentCulture.Name);
        if (description != null)
        {
            TrySetData("description", description);
        }
        return this;
    }
    /// <summary>
    /// Ghi dữ liệu chuẩn
    /// </summary>
    /// <param name="title">Tiêu đề</param>
    /// <param name="message">Nội dung</param>
    /// <param name="createTime">Thời gian tạo</param>
    /// <param name="formUser">Người dùng nguồn</param>
    /// <param name="description">Mô tả bổ sung</param>
    /// <returns></returns>
    public NotificationData WriteStandardData(string title, string message, DateTime createTime, string formUser, string description = "")
    {
        TrySetData("title", title);
        TrySetData("message", message);
        TrySetData("description", description);
        TrySetData("formUser", formUser);
        TrySetData("createTime", createTime);
        TrySetData(LocalizerKey, false);
        return this;
    }
    /// <summary>
    /// Ghi dữ liệu chuẩn
    /// </summary>
    /// <param name="prefix">Tiền tố dữ liệu</param>
    /// <param name="key">Định danh</param>
    /// <param name="value">Nội dung dữ liệu</param>
    /// <returns></returns>
    public NotificationData WriteStandardData(string prefix, string key, object value)
    {
        TrySetData(string.Concat(prefix, key), value);
        TrySetData(LocalizerKey, false);
        return this;
    }
    /// <summary>
    /// Chuyển đổi thành dữ liệu chuẩn
    /// </summary>
    /// <param name="sourceData">Dữ liệu gốc</param>
    /// <returns></returns>
    public static NotificationData ToStandardData(NotificationData sourceData)
    {
        var data = new NotificationData();
        data.TrySetData("title", sourceData.TryGetData("title"));
        data.TrySetData("message", sourceData.TryGetData("message"));
        data.TrySetData("description", sourceData.TryGetData("description"));
        data.TrySetData("formUser", sourceData.TryGetData("formUser"));
        data.TrySetData("createTime", sourceData.TryGetData("createTime"));
        data.TrySetData(LocalizerKey, sourceData.TryGetData(LocalizerKey));
        return data;
    }
    /// <summary>
    /// Chuyển đổi thành dữ liệu chuẩn
    /// </summary>
    /// <param name="prefix">Tiền tố dữ liệu</param>
    /// <param name="sourceData">Dữ liệu gốc</param>
    /// <returns></returns>
    public static NotificationData ToStandardData(string prefix, NotificationData sourceData)
    {
        var data = ToStandardData(sourceData);

        foreach (var property in sourceData.ExtraProperties)
        {
            if (property.Key.StartsWith(prefix))
            {
                var key = property.Key.Replace(prefix, "");
                data.TrySetData(key, property.Value);
            }
        }
        return data;
    }

    public object? TryGetData(string key)
    {
        return this.GetProperty(key);
    }
    public void TrySetData(string key, object? value)
    {
        this.SetProperty(key, value);
    }
    /// <summary>
    /// Cần bản địa hoá
    /// </summary>
    /// <returns></returns>
    public bool NeedLocalizer()
    {
        var localizer = TryGetData(LocalizerKey);
        if (localizer != null && 
            bool.TryParse(localizer.ToString(), out var isLocalizer))
        {
            return isLocalizer;
        }
        return false;
    }
}

using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Attachments.Models;
/// <summary>
/// Loại tệp phương tiện
/// </summary>
[Description("Loại tệp phương tiện")]
public enum MediaType
{
    /// <summary>
    /// Hình ảnh
    /// </summary>
    [Description("Hình ảnh")]
    Image = 1,
    /// <summary>
    /// Video
    /// </summary>
    [Description("Video")]
    Video = 2,
    /// <summary>
    /// Tệp thông thường
    /// </summary>
    [Description("Tệp thông thường")]
    File = 3,
}

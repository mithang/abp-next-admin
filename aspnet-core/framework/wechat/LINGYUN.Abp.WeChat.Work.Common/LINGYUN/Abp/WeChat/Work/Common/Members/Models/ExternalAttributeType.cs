using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.Common.Members.Models;
/// <summary>
/// Loại thuộc tính
/// </summary>
[Description("Loại thuộc tính")]
public enum ExternalAttributeType
{
    /// <summary>
    /// Văn bản
    /// </summary>
    [Description("Văn bản")]
    Text = 0,
    /// <summary>
    /// Trang web
    /// </summary>
    [Description("Trang web")]
    Web = 1,
    /// <summary>
    /// Ứng dụng nhỏ
    /// </summary>
    [Description("Ứng dụng nhỏ")]
    MiniProgram = 2
}

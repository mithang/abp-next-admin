using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Models;
/// <summary>
/// Loại thuộc tính
/// </summary>
[Description("Loại thuộc tính")]
public enum AttributeType
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
    Web = 1
}

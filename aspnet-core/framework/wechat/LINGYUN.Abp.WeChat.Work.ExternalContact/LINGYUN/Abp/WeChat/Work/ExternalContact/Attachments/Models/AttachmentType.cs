using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Attachments.Models;
/// <summary>
/// Loại tệp đính kèm
/// </summary>
[Description("Loại tệp đính kèm")]
public enum AttachmentType
{
    /// <summary>
    /// Moments (bảng tin bạn bè)
    /// </summary>
    [Description("Moments (bảng tin bạn bè)")]
    Moments = 1,
    /// <summary>
    /// Album hình ảnh sản phẩm
    /// </summary>
    [Description("Album hình ảnh sản phẩm")]
    ProductCatalogue = 2,
}

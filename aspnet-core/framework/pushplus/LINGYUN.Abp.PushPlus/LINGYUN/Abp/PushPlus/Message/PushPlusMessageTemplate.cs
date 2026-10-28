namespace LINGYUN.Abp.PushPlus.Message;
/// <summary>
/// Enum mẫu (template). Mặc định sử dụng mẫu html
/// </summary>
public enum PushPlusMessageTemplate
{
    /// <summary>
    /// Mẫu mặc định, hỗ trợ văn bản html
    /// </summary>
    Html = 0,
    /// <summary>
    /// Hiển thị dạng văn bản thuần, không escape html
    /// </summary>
    Text = 1,
    /// <summary>
    /// Nội dung hiển thị theo định dạng json
    /// </summary>
    Json = 2,
    /// <summary>
    /// Nội dung hiển thị theo định dạng markdown
    /// </summary>
    Markdown = 3,
    /// <summary>
    /// Mẫu tùy chỉnh cảnh báo giám sát Alibaba Cloud
    /// </summary>
    CloudMonitor = 4,
    /// <summary>
    /// Mẫu tùy chỉnh plugin jenkins
    /// </summary>
    Jenkins = 5,
    /// <summary>
    /// Mẫu tùy chỉnh plugin router
    /// </summary>
    Route = 6
}

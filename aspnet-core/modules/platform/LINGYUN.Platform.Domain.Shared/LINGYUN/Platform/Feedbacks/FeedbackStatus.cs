using System.ComponentModel;

namespace LINGYUN.Platform.Feedbacks;
public enum FeedbackStatus
{
    /// <summary>
    /// Mới tạo
    /// </summary>
    [Description("FeedbackStatus:Created")]
    Created = 1,
    /// <summary>
    /// Đang xử lý
    /// </summary>
    [Description("FeedbackStatus:InProgress")]
    InProgress = 2,
    /// <summary>
    /// Đã đóng
    /// </summary>
    [Description("FeedbackStatus:Closed")]
    Closed = 3,
    /// <summary>
    /// Đã giải quyết
    /// </summary>
    [Description("FeedbackStatus:Resolved")]
    Resolved = 4
}

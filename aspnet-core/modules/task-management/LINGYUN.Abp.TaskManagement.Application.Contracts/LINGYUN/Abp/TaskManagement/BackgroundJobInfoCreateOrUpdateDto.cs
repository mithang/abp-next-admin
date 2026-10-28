using LINGYUN.Abp.BackgroundTasks;
using Volo.Abp.Data;
using Volo.Abp.Validation;

namespace LINGYUN.Abp.TaskManagement;

public abstract class BackgroundJobInfoCreateOrUpdateDto
{
    /// <summary>
    /// Có bật hay không
    /// </summary>
    public bool IsEnabled { get; set; } = true;
    /// <summary>
    /// Tham số tác vụ
    /// </summary>
    public ExtraPropertyDictionary Args { get; set; } = new ExtraPropertyDictionary();
    /// <summary>
    /// Mô tả
    /// </summary>
    [DynamicStringLength(typeof(BackgroundJobInfoConsts), nameof(BackgroundJobInfoConsts.MaxDescriptionLength))]
    public string? Description { get; set; }
    /// <summary>
    /// Loại tác vụ
    /// </summary>
    public JobType JobType { get; set; }
    /// <summary>
    /// Biểu thức Cron, cần chỉ định nếu là tác vụ liên tục
    /// </summary>
    [DynamicStringLength(typeof(BackgroundJobInfoConsts), nameof(BackgroundJobInfoConsts.MaxCronLength))]
    public string? Cron { get; set; }
    /// <summary>
    /// Giới hạn thử lại khi thất bại
    /// Mặc định: 50
    /// </summary>
    public int MaxTryCount { get; set; }
    /// <summary>
    /// Số lần thực thi tối đa
    /// Mặc định: 0, không giới hạn
    /// </summary>
    public int MaxCount { get; set; }
    /// <summary>
    /// Khoảng thời gian, đơn vị giây, xung đột với biểu thức Cron
    /// Mặc định: 300
    /// </summary>
    public int Interval { get; set; } = 300;
    /// <summary>
    /// Độ ưu tiên tác vụ
    /// </summary>
    public JobPriority Priority { get; set; }
    /// <summary>
    /// Thời lượng hết hạn độc quyền của tác vụ (giây)
    /// 0 hoặc nhỏ hơn thì không có hiệu lực
    /// </summary>
    public int LockTimeOut { get; set; }
}

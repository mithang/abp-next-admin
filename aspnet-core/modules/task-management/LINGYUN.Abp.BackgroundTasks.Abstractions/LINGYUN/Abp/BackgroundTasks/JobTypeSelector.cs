using System;
using Volo.Abp;

namespace LINGYUN.Abp.BackgroundTasks;
public class JobTypeSelector : NamedTypeSelector
{
    public JobTypeSelector(
        string name,
        Func<Type, bool> predicate,
        int? lockTimeOut = null, 
        string? nodeName = null, 
        string? cron = null,
        JobPriority? priority = null, 
        int? interval = null,
        int? maxCount = null, 
        int? maxTryCount = null)
        : base(name, predicate)
    {
        LockTimeOut = lockTimeOut;
        NodeName = nodeName;
        Cron = cron;
        Priority = priority;
        Interval = interval;
        MaxCount = maxCount;
        MaxTryCount = maxTryCount;
    }

    /// <summary>
    /// Thời gian chờ độc quyền của tác vụ (giây)
    /// 0 hoặc nhỏ hơn không có hiệu lực
    /// </summary>
    public int? LockTimeOut { get; set; }
    /// <summary>
    /// Chỉ định nút chạy
    /// </summary>
    public string? NodeName { get; set; }
    /// <summary>
    /// Mức độ ưu tiên của tác vụ
    /// </summary>
    public JobPriority? Priority { get; set; }
    /// <summary>
    /// Biểu thức Cron, cần chỉ định nếu là tác vụ định kỳ
    /// </summary>
    public string? Cron { get; set; }
    /// <summary>
    /// Khoảng thời gian, đơn vị giây, xung đột với biểu thức Cron
    /// </summary>
    public int? Interval { get; set; }
    /// <summary>
    /// Số lần kích hoạt tối đa
    /// </summary>
    public int? MaxCount { get; set; }
    /// <summary>
    /// Giới hạn thử lại khi thất bại
    /// Mặc định: 50
    /// </summary>
    public int? MaxTryCount { get; set; }
}

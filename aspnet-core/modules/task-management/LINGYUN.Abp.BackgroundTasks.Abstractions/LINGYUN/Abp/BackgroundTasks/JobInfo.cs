using System;
using System.Collections.Generic;

namespace LINGYUN.Abp.BackgroundTasks;

public class JobInfo
{
    /// <summary>
    /// Định danh tác vụ
    /// </summary>
    public string Id { get; set; } = default!;
    /// <summary>
    /// Định danh thuê bao
    /// </summary>
    public Guid? TenantId { get; set; }
    /// <summary>
    /// Tên tác vụ
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Nhóm tác vụ
    /// </summary>
    public string Group { get; set; } = default!;
    /// <summary>
    /// Loại tác vụ
    /// </summary>
    public string Type { get; set; } = default!;
    /// <summary>
    /// Tham số trả về
    /// </summary>
    public string? Result { get; set; }
    /// <summary>
    /// Nguồn công việc
    /// </summary>
    public JobSource Source { get; set; } = JobSource.None;
    /// <summary>
    /// Tham số tác vụ
    /// </summary>
    public IDictionary<string, object> Args { get; set; } = new Dictionary<string, object>();
    /// <summary>
    /// Trạng thái tác vụ
    /// </summary>
    public JobStatus Status { get; set; } = JobStatus.None;
    /// <summary>
    /// Mô tả
    /// </summary>
    public string? Description { get; set; }
    /// <summary>
    /// Thời gian tạo
    /// </summary>
    public DateTime CreationTime { get; set; }
    /// <summary>
    /// Thời gian bắt đầu
    /// </summary>
    public DateTime BeginTime { get; set; }
    /// <summary>
    /// Thời gian kết thúc
    /// </summary>
    public DateTime? EndTime { get; set; }
    /// <summary>
    /// Thời gian chạy lần trước
    /// </summary>
    public DateTime? LastRunTime { get; set; }
    /// <summary>
    /// Thời gian thực thi lần tới
    /// </summary>
    public DateTime? NextRunTime { get; set; }
    /// <summary>
    /// Loại tác vụ
    /// </summary>
    public JobType JobType { get; set; } = JobType.Once;
    /// <summary>
    /// Biểu thức Cron, cần chỉ định nếu là tác vụ định kỳ
    /// </summary>
    public string? Cron { get; set; }
    /// <summary>
    /// Số lần kích hoạt
    /// </summary>
    public int TriggerCount { get; set; }
    /// <summary>
    /// Số lần thử lại khi thất bại
    /// </summary>
    public int TryCount { get; set; }
    /// <summary>
    /// Giới hạn thử lại khi thất bại
    /// Mặc định: 50
    /// </summary>
    public int MaxTryCount { get; set; } = 50;
    /// <summary>
    /// Số lần thực thi tối đa
    /// Mặc định: 0, không giới hạn
    /// </summary>
    public int MaxCount { get; set; }
    /// <summary>
    /// Thất bại liên tiếp và sẽ không thực thi lại
    /// </summary>
    public bool IsAbandoned { get; set; }
    /// <summary>
    /// Khoảng thời gian, đơn vị giây, xung đột với biểu thức Cron
    /// Mặc định: 300
    /// </summary>
    public int Interval { get; set; } = 300;
    /// <summary>
    /// Mức độ ưu tiên của tác vụ
    /// </summary>
    public JobPriority Priority { get; set; } = JobPriority.Normal;
    /// <summary>
    /// Thời gian chờ độc quyền của tác vụ (giây)
    /// 0 hoặc nhỏ hơn thì không có hiệu lực
    /// </summary>
    public int LockTimeOut { get; set; }
    /// <summary>
    /// Chỉ định nút chạy
    /// </summary>
    public string? NodeName { get; set; }
    /// <summary>
    /// Tính số lần công việc có thể được kích hoạt
    /// </summary>
    /// <returns></returns>
    public int CalcCanBeTriggered()
    {
        // Không giới hạn số lần
        var maxCount = -1;

        // Số lần còn lại
        if (MaxCount > 0)
        {
            maxCount = MaxCount - TriggerCount;
            if (maxCount < 0)
            {
                maxCount = 0;
            }
        }

        // Một lần
        if (JobType == JobType.Once)
        {
            maxCount = 1;
        }

        // Thử lại
        // TODO: Không thể dùng cơ chế thử lại tích hợp sẵn của Quartz
        //if (Status == JobStatus.FailedRetry && MaxTryCount > 0)
        //{
        //    maxCount = MaxTryCount - TryCount;

        //    if (maxCount < 0)
        //    {
        //        maxCount = 0;
        //    }

        //    if (maxCount > 0)
        //    {
        //        // Khi kích hoạt thử lại, điều chỉnh khoảng thời gian thất bại
        //        Interval = 60;
        //    }
        //}

        return maxCount;
    }
}

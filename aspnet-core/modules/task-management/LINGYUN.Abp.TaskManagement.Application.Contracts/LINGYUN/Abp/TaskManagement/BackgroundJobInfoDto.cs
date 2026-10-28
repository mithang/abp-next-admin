using LINGYUN.Abp.BackgroundTasks;
using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;

namespace LINGYUN.Abp.TaskManagement;

public class BackgroundJobInfoDto : ExtensibleAuditedEntityDto<string>, IHasConcurrencyStamp
{
    public string ConcurrencyStamp { get; set; } = default!;
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
    /// Tham số tác vụ
    /// </summary>
    public ExtraPropertyDictionary Args { get; set; } = new ExtraPropertyDictionary();
    /// <summary>
    /// Trạng thái tác vụ
    /// </summary>
    public JobStatus Status { get; set; }
    /// <summary>
    /// Mô tả
    /// </summary>
    public string? Description { get; set; }
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
    /// Danh mục tác vụ
    /// </summary>
    public JobType JobType { get; set; }
    /// <summary>
    /// Biểu thức Cron, cần chỉ định nếu là tác vụ liên tục
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
    public int MaxTryCount { get; set; }
    /// <summary>
    /// Số lần thực thi tối đa
    /// Mặc định: 0, không giới hạn
    /// </summary>
    public int MaxCount { get; set; }
    /// <summary>
    /// Thất bại liên tục và sẽ không thực thi lại
    /// </summary>
    public bool IsAbandoned { get; set; }
    /// <summary>
    /// Có bật hay không
    /// </summary>
    public bool IsEnabled { get; set; }
    /// <summary>
    /// Thời gian khoảng cách, đơn vị giây, xung đột với biểu thức Cron
    /// Mặc định: 300
    /// </summary>
    public int Interval { get; set; } = 300;
    /// <summary>
    /// Mức độ ưu tiên của tác vụ
    /// </summary>
    public JobPriority Priority { get; set; }
    /// <summary>
    /// Nguồn gốc của job
    /// </summary>
    public JobSource Source { get; set; }
    /// <summary>
    /// Thời gian chờ độc quyền của tác vụ (giây)
    /// 0 hoặc nhỏ hơn sẽ không có hiệu lực
    /// </summary>
    public int LockTimeOut { get; set; }
    /// <summary>
    /// Chỉ định nút chạy job
    /// </summary>
    public string? NodeName { get; set; }
}

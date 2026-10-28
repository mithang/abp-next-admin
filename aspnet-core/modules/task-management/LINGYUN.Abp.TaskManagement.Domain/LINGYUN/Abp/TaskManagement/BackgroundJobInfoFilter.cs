using LINGYUN.Abp.BackgroundTasks;
using System;

namespace LINGYUN.Abp.TaskManagement;

/// <summary>
/// Bộ lọc tác vụ nền
/// </summary>
public class BackgroundJobInfoFilter
{
    /// <summary>
    /// Điều kiện lọc khác
    /// </summary>
    public string? Filter { get; set; }
    /// <summary>
    /// Tên tác vụ
    /// </summary>
    public string? Name { get; set; }
    /// <summary>
    /// Nhóm tác vụ
    /// </summary>
    public string? Group { get; set; }
    /// <summary>
    /// Loại tác vụ
    /// </summary>
    public string? Type { get; set; }
    /// <summary>
    /// Tên nút
    /// </summary>
    public string? NodeName { get; set; }
    /// <summary>
    /// Trạng thái tác vụ
    /// </summary>
    public JobStatus? Status { get; set; }
    /// <summary>
    /// Thời gian bắt đầu
    /// </summary>
    public DateTime? BeginTime { get; set; }
    /// <summary>
    /// Thời gian kết thúc
    /// </summary>
    public DateTime? EndTime { get; set; }
    /// <summary>
    /// Thời gian kích hoạt bắt đầu lần trước
    /// </summary>
    public DateTime? BeginLastRunTime { get; set; }
    /// <summary>
    /// Thời gian kích hoạt kết thúc lần trước
    /// </summary>
    public DateTime? EndLastRunTime { get; set; }
    /// <summary>
    /// Thời gian tạo bắt đầu
    /// </summary>
    public DateTime? BeginCreationTime { get; set; }
    /// <summary>
    /// Thời gian tạo kết thúc
    /// </summary>
    public DateTime? EndCreationTime { get; set; }
    /// <summary>
    /// Tác vụ đã bị bỏ hay chưa
    /// </summary>
    public bool? IsAbandoned { get; set; }
    /// <summary>
    /// Có phải tác vụ bền vững hay không
    /// </summary>
    public JobType? JobType { get; set; }
    /// <summary>
    /// Mức ưu tiên
    /// </summary>
    public JobPriority? Priority { get; set; }
    /// <summary>
    /// Nguồn công việc
    /// </summary>
    public JobSource? Source { get; set; }
}

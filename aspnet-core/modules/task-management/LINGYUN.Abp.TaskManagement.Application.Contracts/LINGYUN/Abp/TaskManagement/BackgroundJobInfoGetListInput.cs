using LINGYUN.Abp.BackgroundTasks;
using System;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.TaskManagement;

public class BackgroundJobInfoGetListInput: PagedAndSortedResultRequestDto
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
    /// Thời gian kích hoạt lần trước (bắt đầu)
    /// </summary>
    public DateTime? BeginLastRunTime { get; set; }
    /// <summary>
    /// Thời gian kích hoạt lần trước (kết thúc)
    /// </summary>
    public DateTime? EndLastRunTime { get; set; }
    /// <summary>
    /// Thời gian tạo (bắt đầu)
    /// </summary>
    public DateTime? BeginCreationTime { get; set; }
    /// <summary>
    /// Thời gian tạo (kết thúc)
    /// </summary>
    public DateTime? EndCreationTime { get; set; }
    /// <summary>
    /// Tác vụ đã bị hủy hay chưa
    /// </summary>
    public bool? IsAbandoned { get; set; }
    /// <summary>
    /// Loại tác vụ
    /// </summary>
    public JobType? JobType { get; set; }
    /// <summary>
    /// Mức độ ưu tiên
    /// </summary>
    public JobPriority? Priority { get; set; }
    /// <summary>
    /// Nguồn tác vụ
    /// </summary>
    public JobSource? Source { get; set; }
}

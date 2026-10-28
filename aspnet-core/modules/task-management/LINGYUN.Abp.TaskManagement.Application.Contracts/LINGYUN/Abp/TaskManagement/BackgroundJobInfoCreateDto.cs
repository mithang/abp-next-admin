using LINGYUN.Abp.BackgroundTasks;
using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Validation;

namespace LINGYUN.Abp.TaskManagement;

public class BackgroundJobInfoCreateDto : BackgroundJobInfoCreateOrUpdateDto
{
    /// <summary>
    /// Tên công việc
    /// </summary>
    [Required]
    [DynamicStringLength(typeof(BackgroundJobInfoConsts), nameof(BackgroundJobInfoConsts.MaxNameLength))] 
    public string Name { get; set; } = default!;
    /// <summary>
    /// Nhóm công việc
    /// </summary>
    [Required]
    [DynamicStringLength(typeof(BackgroundJobInfoConsts), nameof(BackgroundJobInfoConsts.MaxGroupLength))] 
    public string Group { get; set; } = default!;
    /// <summary>
    /// Kiểu công việc
    /// </summary>
    [Required]
    [DynamicStringLength(typeof(BackgroundJobInfoConsts), nameof(BackgroundJobInfoConsts.MaxTypeLength))] 
    public string Type { get; set; } = default!;

    [DynamicStringLength(typeof(BackgroundJobInfoConsts), nameof(BackgroundJobInfoConsts.MaxNodeNameLength))]
    public string? NodeName { get; set; }
    /// <summary>
    /// Thời gian bắt đầu
    /// </summary>
    [Required]
    public DateTime BeginTime { get; set; }
    /// <summary>
    /// Thời gian kết thúc
    /// </summary>
    public DateTime? EndTime { get; set; }
    /// <summary>
    /// Nguồn công việc
    /// </summary>
    public JobSource Source { get; set; } = JobSource.User;
}

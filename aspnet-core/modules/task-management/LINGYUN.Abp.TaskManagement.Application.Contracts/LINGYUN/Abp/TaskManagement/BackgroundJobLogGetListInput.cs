using System;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.TaskManagement;

public class BackgroundJobLogGetListInput : PagedAndSortedResultRequestDto
{
    public string? JobId { get; set; }
    /// <summary>
    /// Điều kiện lọc khác
    /// </summary>
    public string? Filter { get; set; }
    /// <summary>
    /// Có ngoại lệ
    /// </summary>
    public bool? HasExceptions { get; set; }
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
    /// Thời gian kích hoạt bắt đầu
    /// </summary>
    public DateTime? BeginRunTime { get; set; }
    /// <summary>
    /// Thời gian kích hoạt kết thúc
    /// </summary>
    public DateTime? EndRunTime { get; set; }
}

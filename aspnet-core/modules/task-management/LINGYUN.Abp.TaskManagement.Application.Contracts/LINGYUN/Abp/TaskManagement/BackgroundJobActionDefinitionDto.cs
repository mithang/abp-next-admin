using LINGYUN.Abp.BackgroundTasks;
using System.Collections.Generic;

namespace LINGYUN.Abp.TaskManagement;

public class BackgroundJobActionDefinitionDto
{
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Loại
    /// </summary>
    public JobActionType Type { get; set; }
    /// <summary>
    /// Tên hiển thị
    /// </summary>
    public string? DisplayName { get; set; }
    /// <summary>
    /// Mô tả
    /// </summary>
    public string? Description { get; set; }
    /// <summary>
    /// Danh sách tham số
    /// </summary>
    public IList<BackgroundJobActionParamterDto> Paramters { get; set; } = new List<BackgroundJobActionParamterDto>();
}

using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;

namespace LINGYUN.Abp.TaskManagement;

public class BackgroundJobActionDto : EntityDto<Guid>
{
    /// <summary>
    /// Định danh job
    /// </summary>
    public string JobId { get; set; } = default!;
    /// <summary>
    /// Tên
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Có bật hay không
    /// </summary>
    public bool IsEnabled { get; set; }
    /// <summary>
    /// Tham số
    /// </summary>
    public ExtraPropertyDictionary Paramters { get; set; } = new ExtraPropertyDictionary();
}

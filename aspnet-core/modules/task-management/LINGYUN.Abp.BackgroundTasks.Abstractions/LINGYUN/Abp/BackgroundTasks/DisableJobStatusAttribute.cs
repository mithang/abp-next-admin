using System;

namespace LINGYUN.Abp.BackgroundTasks;
/// <summary>
/// Vô hiệu hóa trạng thái lập lịch công việc
/// </summary>
[AttributeUsage(AttributeTargets.Class)]
public class DisableJobStatusAttribute : Attribute
{
}

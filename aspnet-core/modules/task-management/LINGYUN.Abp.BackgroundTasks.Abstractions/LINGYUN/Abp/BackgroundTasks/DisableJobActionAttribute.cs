using System;

namespace LINGYUN.Abp.BackgroundTasks;
/// <summary>
/// Vô hiệu hóa hành vi lập lịch công việc
/// </summary>
[AttributeUsage(AttributeTargets.Class)]
public class DisableJobActionAttribute : Attribute
{
}

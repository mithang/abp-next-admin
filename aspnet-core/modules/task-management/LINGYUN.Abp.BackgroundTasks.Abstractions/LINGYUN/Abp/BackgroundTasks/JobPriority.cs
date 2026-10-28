namespace LINGYUN.Abp.BackgroundTasks;
/// <summary>
/// Mức độ ưu tiên của tác vụ
/// </summary>
/// <remarks>
/// Giữ nhất quán với framework
/// </remarks>
public enum JobPriority
{
    Low = 5,
    BelowNormal = 10,
    Normal = 0xF,
    AboveNormal = 20,
    High = 25
}

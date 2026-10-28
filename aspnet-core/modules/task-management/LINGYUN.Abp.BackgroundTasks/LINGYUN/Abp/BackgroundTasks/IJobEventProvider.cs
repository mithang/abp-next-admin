using System.Collections.Generic;

namespace LINGYUN.Abp.BackgroundTasks;

/// <summary>
/// Nhà cung cấp sự kiện tác vụ
/// </summary>
public interface IJobEventProvider
{
    /// <summary>
    /// Trả về tất cả giao diện đăng ký sự kiện tác vụ
    /// </summary>
    /// <returns></returns>
    IReadOnlyCollection<IJobEvent> GetAll();
}

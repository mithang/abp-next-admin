namespace LINGYUN.Abp.BackgroundTasks.Notifications;

public static class BackgroundTasksNotificationNames
{
    public const string GroupName = "Abp.Notifications.BackgroundTasks";
    /// <summary>
    /// Công việc thực thi thành công
    /// </summary>
    public const string JobExecuteSucceeded = GroupName + ".ExecuteSucceeded";
    /// <summary>
    /// Công việc thực thi thất bại
    /// </summary>
    public const string JobExecuteFailed = GroupName + ".ExecuteFailed";
    /// <summary>
    /// Công việc thực thi hoàn tất
    /// </summary>
    public const string JobExecuteCompleted = GroupName + ".ExecuteCompleted";
}

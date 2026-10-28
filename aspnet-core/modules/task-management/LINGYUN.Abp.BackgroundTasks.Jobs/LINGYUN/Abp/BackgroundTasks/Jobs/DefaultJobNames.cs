namespace LINGYUN.Abp.BackgroundTasks.Jobs;

public static class DefaultJobNames
{
    /// <summary>
    /// Gửi email
    /// </summary>
    public const string SendEmailJob = "SendEmail";
    /// <summary>
    /// Gửi SMS
    /// </summary>
    public const string SendSmsJob = "SendSms";
    /// <summary>
    /// Xuất ra console
    /// </summary>
    public const string ConsoleJob = "Console";
    /// <summary>
    /// Tạm dừng
    /// </summary>
    public const string SleepJob = "Sleep";
    /// <summary>
    /// Gọi giữa các dịch vụ
    /// </summary>
    public const string ServiceInvocationJob = "ServiceInvocation";
    /// <summary>
    /// Yêu cầu Http
    /// </summary>
    public const string HttpRequestJob = "HttpRequest";
}

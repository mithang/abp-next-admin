using System;
using System.Collections.Generic;
using Volo.Abp.Collections;

namespace LINGYUN.Abp.BackgroundTasks;

public class AbpBackgroundTasksOptions
{
    /// <summary>
    /// Chuyển đổi loại ngoại lệ của tác vụ
    /// </summary>
    public IDictionary<string, JobExceptionType> ErrorCodeToExceptionTypeMappings { get; }
    /// <summary>
    /// Danh sách loại lắng nghe tác vụ
    /// </summary>
    /// <remarks>
    /// Người dùng có thể triển khai bộ lắng nghe sự kiện để thực hiện logic tùy chỉnh
    /// </remarks>
    public ITypeList<IJobEvent> JobMonitors { get; }
    /// <summary>
    /// Danh sách nhà cung cấp tác vụ
    /// </summary>
    /// <remarks>
    /// Các tác vụ do người dùng triển khai có thể được thêm vào tập hợp
    /// </remarks>
    public ITypeList<IJobDefinitionProvider> DefinitionProviders { get; }
    /// <summary>
    /// Cấu hình trước khi phát hành tác vụ
    /// </summary>
    /// <remarks>
    /// Tips: <br />
    /// Chỉ áp dụng cho cấu hình trước của tác vụ dùng cho giao diện bộ điều hợp IBackgroundJobManager và IBackgroundWorker
    /// <br />
    /// Các tham số tác vụ triển khai chuẩn <see cref="IJobRunnable"/> vui lòng quản lý trực tiếp qua giao diện
    /// </remarks>
    public IJobDispatcherSelectorList JobDispatcherSelectors { get; }
    /// <summary>
    /// Bật dọn dẹp tác vụ
    /// </summary>
    /// <remarks>
    /// Bật trên nút chính
    /// </remarks>
    public bool JobCleanEnabled { get; set; }
    /// <summary>
    /// Thời gian hết hạn của tác vụ
    /// Mặc định: 15 days
    /// </summary>
    /// <remarks>
    /// Thời gian hết hạn của tác vụ, dọn dẹp khi vượt quá khoảng thời gian
    /// </remarks>
    public TimeSpan JobExpiratime { get; set; }
    /// <summary>
    /// Kích thước lô mỗi lần dọn dẹp tác vụ
    /// Mặc định: 1000
    /// </summary>
    public int MaxJobCleanCount { get; set; }
    /// <summary>
    /// Biểu thức Cron của lô dọn dẹp tác vụ hết hạn
    /// Mặc định: 600 giây（0 0/10 * * * ? * ）
    /// </summary>
    /// <remarks>
    /// Biểu thức Cron
    /// </remarks>
    public string JobCleanCronExpression { get; set; }
    /// <summary>
    /// Bật thăm dò tác vụ
    /// </summary>
    /// <remarks>
    /// Bật trên nút chính
    /// </remarks>
    public bool JobFetchEnabled { get; set; }
    /// <summary>
    /// Kích thước lô mỗi lần thăm dò tác vụ
    /// Mặc định: 1000
    /// </summary>
    public int MaxJobFetchCount { get; set; }
    /// <summary>
    /// Biểu thức Cron của lô thăm dò tác vụ
    /// Mặc định: 30 giây（0/30 * * * * ? ）
    /// </summary>
    /// <remarks>
    /// Biểu thức Cron
    /// </remarks>
    public string JobFetchCronExpression { get; set; }
    /// <summary>
    /// Thời gian chờ khóa tác vụ khi thăm dò lô tác vụ (giây)
    /// Mặc định: 120
    /// </summary>
    /// <remarks>
    /// Tác vụ thăm dò cũng là một tác vụ nền, cần khóa mỗi lần thăm dò để tránh tác vụ trùng lặp được đưa vào kho
    /// </remarks>
    public int JobFetchLockTimeOut { get; set; }

    /// <summary>
    /// Bật kiểm tra tác vụ
    /// </summary>
    /// <remarks>
    /// Bật trên nút chính
    /// </remarks>
    public bool JobCheckEnabled { get; set; }
    /// <summary>
    /// Kích thước lô mỗi lần kiểm tra tác vụ
    /// Mặc định: 100
    /// </summary>
    public int MaxJobCheckCount { get; set; }
    /// <summary>
    /// Biểu thức Cron của lô kiểm tra tác vụ
    /// Mặc định: thực thi 2 giờ một lần（0 0 0/2 * * ? ）
    /// </summary>
    /// <remarks>
    /// Biểu thức Cron
    /// </remarks>
    public string JobCheckCronExpression { get; set; }
    /// <summary>
    /// Thời gian chờ khóa tác vụ khi kiểm tra lô tác vụ (giây)
    /// Mặc định: 120
    /// </summary>
    public int JobCheckLockTimeOut { get; set; }
    /// <summary>
    /// Chỉ định nút chạy
    /// </summary>
    public string? NodeName { get; set; }
    public AbpBackgroundTasksOptions()
    {
        JobFetchEnabled = false;
        MaxJobFetchCount = 1000;
        JobFetchLockTimeOut = 120;
        JobFetchCronExpression = "0/30 * * * * ? ";

        JobCheckEnabled = false;
        MaxJobCheckCount = 100;
        JobCheckLockTimeOut = 120;
        JobCheckCronExpression = "0 0 0/2 * * ? ";

        JobCleanEnabled = false;
        MaxJobCleanCount = 1000;
        JobExpiratime = TimeSpan.FromDays(15d);
        JobCleanCronExpression = "0 0/10 * * * ? *";

        JobMonitors = new TypeList<IJobEvent>();
        DefinitionProviders = new TypeList<IJobDefinitionProvider>();
        JobDispatcherSelectors = new JobDispatcherSelectorList();
        ErrorCodeToExceptionTypeMappings = new Dictionary<string, JobExceptionType>();
    }
    public void Map(string errorCode, JobExceptionType exceptionType)
    {
        ErrorCodeToExceptionTypeMappings[errorCode] = exceptionType;
    }
}

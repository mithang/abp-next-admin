using LINGYUN.Abp.BackgroundTasks;
using LINGYUN.Abp.Identity.Session;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LINGYUN.Abp.Identity.Jobs;
/// <summary>
/// Công việc dọn dẹp phiên người dùng
/// </summary>
/// <remarks>
/// Khi công việc này được bật, nên tắt <see cref="IdentitySessionCleanupOptions.IsCleanupEnabled"/>
/// </remarks>
public class InactiveIdentitySessionCleanupJob : IJobRunnable
{
    public const string Name = "InactiveIdentitySessionCleanupJob";

    #region Definition Paramters

    public readonly static IReadOnlyList<JobDefinitionParamter> Paramters =
        new List<JobDefinitionParamter>
        {
            new JobDefinitionParamter(
                PropertySessionInactiveDays, 
                LocalizableStatic.Create("DisplayName:SessionInactiveDays"),
                LocalizableStatic.Create("Description:SessionInactiveDays"))
        };

    #endregion
    /// <summary>
    /// Thời gian giữ phiên không hoạt động, tính bằng ngày
    /// </summary>
    public const string PropertySessionInactiveDays = "SessionInactiveDays";

    public async virtual Task ExecuteAsync(JobRunnableContext context)
    {
        var logger = context.GetRequiredService<ILogger<InactiveIdentitySessionCleanupJob>>();
        var sessionStore = context.GetRequiredService<IIdentitySessionStore>();

        var inactiveDays = context.GetOrDefaultJobData(PropertySessionInactiveDays, 30);

        logger.LogInformation("Prepare to clean up sessions that have been inactive for more than {inactiveDays} days.", inactiveDays);

        await sessionStore.RevokeAllAsync(TimeSpan.FromDays(inactiveDays));

        logger.LogInformation($"Cleaned inactive user session.");
    }
}
